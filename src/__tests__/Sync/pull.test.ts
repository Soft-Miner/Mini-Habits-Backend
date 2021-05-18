import app from '../../app';
import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import User from '../../models/User';
import Habit from '../../models/Habit';
import HabitUser from '../../models/HabitUser';

let server: Server, agent: SuperAgentTest;
let token: string;
let userId: string;
let anotherUserId: string;

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

  const anotherUser = usersRepository.create({
    email: 'rodrigo_gonn2@hotmail.com',
    password: '$2b$10$7TOQbrdLq0tUuKgJQjQLd.mn4njjf808A1ojy5uupUABgnZPcW1TG',
    name: 'Rodrigo',
    lastname: 'Gonçalves',
  });

  await usersRepository.save(anotherUser);

  const response = await agent.post('/api/authenticate').send({
    email: 'rodrigo_gonn@hotmail.com',
    password: '123',
  });

  token = response.body.token;
  userId = user.id;
  anotherUserId = anotherUser.id;
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

  const habitsUsersRepository = connection.getRepository(HabitUser);

  const habitUser = habitsUsersRepository.create({
    user_id: userId,
    habit_id: habit.id,
    habit_challenge_id: habit.challenges[0].id,
    time_sunday: 340,
    time_monday: 360,
    time_tuesday: 360,
    time_wednesday: 360,
    time_thursday: 360,
    time_friday: 360,
    time_saturday: 360,
    deleted: false,
    last_modified: '2021-05-18T22:00:24.101Z',
    created_at: '2021-05-18T22:00:24.101Z',
  });

  const anotherHabitUser = habitsUsersRepository.create({
    user_id: anotherUserId,
    habit_id: habit.id,
    habit_challenge_id: habit.challenges[0].id,
    time_sunday: 340,
    time_monday: 360,
    time_tuesday: 360,
    time_wednesday: 360,
    time_thursday: 360,
    time_friday: 360,
    time_saturday: 360,
    deleted: false,
    last_modified: '2021-05-18T22:00:24.101Z',
    created_at: '2021-05-18T22:00:24.101Z',
  });

  await habitsUsersRepository.save(habitUser);
  await habitsUsersRepository.save(anotherHabitUser);
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

  it('deveria retornar nada se já estiver atualizado', async () => {
    const response = await agent
      .post('/api/pull')
      .set('authorization', `Bearer ${token}`)
      .send({
        lastPulletAt: 1621378824101,
      });

    expect(response.body).toHaveProperty('currentTime');
    expect(response.body).toHaveProperty('changes');
    expect(response.body.changes.habits).toHaveLength(0);
    expect(response.body.changes.habits_challenges).toHaveLength(0);
    expect(response.body.changes.habits_users).toHaveLength(0);
    expect(response.body.changes.habits_users_days).toHaveLength(0);
    expect(response.status).toBe(200);
  });

  it('Deve retornar somente as alterações do usuário e mais recentes que lastPulledAt', async () => {
    const response = await agent
      .post('/api/pull')
      .set('authorization', `Bearer ${token}`)
      .send({
        lastPulletAt: 1621371624101,
      });

    expect(response.body).toHaveProperty('currentTime');
    expect(response.body).toHaveProperty('changes');
    expect(response.body.changes.habits).toHaveLength(1);
    expect(response.body.changes.habits_challenges).toHaveLength(1);
    expect(response.body.changes.habits_users).toHaveLength(1);
    expect(response.body.changes.habits_users_days).toHaveLength(0);
    expect(response.status).toBe(200);
  });

  it('Deve retornar tudo se o lastPulledAt não for informado', async () => {
    const response = await agent
      .post('/api/pull')
      .set('authorization', `Bearer ${token}`);

    expect(response.body).toHaveProperty('currentTime');
    expect(response.body).toHaveProperty('changes');
    expect(response.body.changes.habits).toHaveLength(1);
    expect(response.body.changes.habits_challenges).toHaveLength(1);
    expect(response.body.changes.habits_users).toHaveLength(1);
    expect(response.body.changes.habits_users_days).toHaveLength(0);
    expect(response.status).toBe(200);
  });
});
