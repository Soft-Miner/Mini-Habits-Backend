import app from '../../app';
import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import User from '../../models/User';
import Habit from '../../models/Habit';

let server: Server, agent: SuperAgentTest;
let token: string;
let userId: string;
let habitId: string;
let habitChallengeId: string;

const mockSendEmail = jest.fn();

jest.mock('../../services/SendMailService.ts', () => ({
  execute: () => mockSendEmail(),
}));

const getTokens = async (connection: Connection) => {
  const usersRepository = connection.getRepository(User);

  const user = usersRepository.create({
    email: 'rodrigo_gonn@hotmail.com',
    password: '$2b$10$7TOQbrdLq0tUuKgJQjQLd.mn4njjf808A1ojy5uupUABgnZPcW1TG',
    name: 'Rodrigo',
    lastname: 'Gonçalves',
  });

  await usersRepository.save(user);

  const response = await agent.post('/api/authenticate').send({
    email: 'rodrigo_gonn@hotmail.com',
    password: '123',
  });

  token = response.body.token;
  userId = user.id;
};

const createHabit = async (connection: Connection) => {
  const habitsRepository = connection.getRepository(Habit);

  const habit = habitsRepository.create({
    icon: 'path/to/icon.svg',
    name: 'Tomar água',
    description: 'Tomar água é saudável',
    challenges: [
      {
        icon: 'path/to/icon.svg',
        level: 0,
        xp_reward: 10,
        description: "Tomar um copo d'água",
      },
    ],
    last_modified: '2021-05-18T22:00:24.101Z',
    created_at: '2021-05-18T22:00:24.101Z',
  });

  await habitsRepository.save(habit);

  habitId = habit.id;
  habitChallengeId = habit.challenges[0].id;
};

describe('Update email', () => {
  beforeAll(async (done) => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();

    server = app.listen(0, async () => {
      agent = request.agent(server);

      await getTokens(connection);
      await createHabit(connection);

      done();
    });
  });

  afterAll((done) => {
    return server && server.close(done);
  });

  it('Não deve retornar erro se habits_users ou habits_users_days não forem informados', async () => {
    const response = await agent
      .post('/api/push')
      .set('authorization', `Bearer ${token}`)
      .send({
        lastPulletAt: 1621378824101,
        changes: {},
      });

    expect(response.body.message).toBe('Data successfully synced.');
    expect(response.status).toBe(200);
  });

  it('Deve retornar erro se lastPulledAt ou changes não forem enviados', async () => {
    const response = await agent
      .post('/api/push')
      .set('authorization', `Bearer ${token}`)
      .send({
        changes: {},
      });

    expect(response.body.message).toBe('Something wrong with the request.');
    expect(response.status).toBe(400);
  });

  it('Deve retornar erro se habits_users ou habits_users_days estiverem com formado inválido', async () => {
    const responseWithHabitsUsersDaysIncorrect = await agent
      .post('/api/push')
      .set('authorization', `Bearer ${token}`)
      .send({
        lastPulletAt: 1621378824101,
        changes: {
          habits_users_days: [
            {
              id: ['123'],
              habit_user_id: '1',
              habit_challenge_id: '76808464-7825-4e3a-b67f-ffb84a253f70',
              completed_day: '2021-05-18 21:42:00',
            },
          ],
        },
      });

    const responseWithHabitsUsersIncorrect = await agent
      .post('/api/push')
      .set('authorization', `Bearer ${token}`)
      .send({
        lastPulletAt: 1621378824101,
        changes: {
          habits_users: [
            {
              id: 123,
              user_id: ['27caeed8-78b8-4729-b99e-efd4796597f4'],
              habit_id: '156c3858-a044-4ddc-a65e-4b9cf6f1224c',
              habit_challenge_id: '76808464-7825-4e3a-b67f-ffb84a253f70',
              time_sunday: 340,
              time_monday: 360,
              time_tuesday: 360,
              time_wednesday: 360,
              time_thursday: 360,
              time_friday: 360,
              time_saturday: 360,
              deleted: false,
            },
          ],
        },
      });

    expect(responseWithHabitsUsersDaysIncorrect.body.message).toBe(
      "habits_users_days's format is incorrect."
    );
    expect(responseWithHabitsUsersDaysIncorrect.status).toBe(400);
    expect(responseWithHabitsUsersIncorrect.body.message).toBe(
      "habits_users's format is incorrect."
    );
    expect(responseWithHabitsUsersIncorrect.status).toBe(400);
  });

  it('Deve ser possível sincronizar as alterações', async () => {
    const response = await agent
      .post('/api/push')
      .set('authorization', `Bearer ${token}`)
      .send({
        lastPulletAt: 1621378824101,
        changes: {
          habits_users: [
            {
              id: '123',
              user_id: userId,
              habit_id: habitId,
              habit_challenge_id: habitChallengeId,
              time_sunday: 340,
              time_monday: 360,
              time_tuesday: 360,
              time_wednesday: 360,
              time_thursday: 360,
              time_friday: 360,
              time_saturday: 360,
              deleted: false,
            },
          ],
          habits_users_days: [
            {
              id: '123',
              habit_user_id: '123',
              habit_challenge_id: habitChallengeId,
              completed_day: '2021-05-18 21:42:00',
            },
          ],
        },
      });

    expect(response.body.message).toBe('Data successfully synced.');
    expect(response.status).toBe(200);
  });

  it('Deve retornar erro se o lastPulledAt não estiver atualizado', async () => {
    const response = await agent
      .post('/api/push')
      .set('authorization', `Bearer ${token}`)
      .send({
        lastPulletAt: 1621371624101,
        changes: {
          habits_users: [
            {
              id: 123,
              user_id: userId,
              habit_id: habitId,
              habit_challenge_id: habitChallengeId,
              time_sunday: 400,
              time_monday: 360,
              time_tuesday: 360,
              time_wednesday: 360,
              time_thursday: 360,
              time_friday: 360,
              time_saturday: 360,
              deleted: false,
            },
          ],
        },
      });

    expect(response.body.message).toBe('You need to pull first.');
    expect(response.status).toBe(409);
  });

  it('não deve ser possível alterar dados de outro usuário', async () => {
    const response = await agent
      .post('/api/push')
      .set('authorization', `Bearer ${token}`)
      .send({
        lastPulletAt: 1621378824101,
        changes: {
          habits_users: [
            {
              id: 123,
              user_id: '123',
              habit_id: habitId,
              habit_challenge_id: habitChallengeId,
              time_sunday: 400,
              time_monday: 360,
              time_tuesday: 360,
              time_wednesday: 360,
              time_thursday: 360,
              time_friday: 360,
              time_saturday: 360,
              deleted: false,
            },
          ],
        },
      });

    expect(response.body.message).toBe('You cannot change this.');
    expect(response.status).toBe(401);
  });
});
