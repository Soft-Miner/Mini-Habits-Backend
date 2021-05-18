import app from '../../app';
import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import path from 'path';
import fs from 'fs';
import { Connection, createConnection } from 'typeorm';
import SuperUser from '../../models/SuperUser';

let server: Server, agent: SuperAgentTest;
let svgIconPath: string;
let accessToken: string;
let habitId: string;

const createIconSvg = () => {
  const testFilesFolder = path.resolve(__dirname, '../../../tmp/tests');
  fs.mkdirSync(testFilesFolder, { recursive: true });
  const filename = 'icon.svg';
  const filePath = path.resolve(testFilesFolder, filename);
  svgIconPath = filePath;
  fs.writeFileSync(filePath, '');
};

const createSuperUser = async (connection: Connection) => {
  const usersRepository = connection.getRepository(SuperUser);

  const user = usersRepository.create({
    email: 'vitor.f.silveira@hotmail.com',
    password: '$2b$10$7TOQbrdLq0tUuKgJQjQLd.mn4njjf808A1ojy5uupUABgnZPcW1TG',
    refresh_token: '',
  });

  await usersRepository.save(user);
};

const createHabit = async () => {
  const response = await agent
    .post('/api/habits')
    .set('authorization', `Bearer ${accessToken}`)
    .attach('icon', svgIconPath)
    .field('name', 'Ler livro')
    .field('description', 'Leitura é bom para a memória.')
    .attach('challengesIcons', svgIconPath)
    .field(
      'challenges',
      JSON.stringify([
        {
          level: 0,
          description: 'Descrição',
          xp_reward: 10,
        },
      ])
    );

  habitId = response.body.habit.id;
};

const getToken = async () => {
  const response = await agent.post('/api/super_users/authenticate').send({
    email: 'vitor.f.silveira@hotmail.com',
    password: '123',
  });

  accessToken = response.body.access_token;
};

describe('Add Challenge', () => {
  beforeAll(async (done) => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await createSuperUser(connection);

    createIconSvg();

    server = app.listen(0, async () => {
      agent = request.agent(server);

      await getToken();
      await createHabit();

      done();
    });
  });

  afterAll((done) => {
    return server && server.close(done);
  });

  it('should be possible to add a new challenge', async () => {
    const response = await agent
      .post(`/api/habits/${habitId}/challenges`)
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('description', 'Descrição')
      .field('level', '10')
      .field('xp_reward', '20');

    expect(response.body.message).toBe('Challenge successfully created.');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('challenge');
  });

  it('should return error if any field is missing', async () => {
    const responseWithoutDescription = await agent
      .post(`/api/habits/${habitId}/challenges`)
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('level', '10')
      .field('xp_reward', '20');

    const responseWithoutIcon = await agent
      .post(`/api/habits/${habitId}/challenges`)
      .set('authorization', `Bearer ${accessToken}`)
      .field('description', 'Descrição')
      .field('level', '10')
      .field('xp_reward', '20');

    expect(responseWithoutDescription.body.message).toBe(
      'Some field is missing.'
    );
    expect(responseWithoutDescription.status).toBe(400);
    expect(responseWithoutDescription.body.message).toBe(
      'Some field is missing.'
    );
    expect(responseWithoutIcon.status).toBe(400);
    expect(responseWithoutIcon.body.message).toBe('Some field is missing.');
  });

  it('should return error if the habit does not exists', async () => {
    const response = await agent
      .post(`/api/habits/non-existent-id/challenges`)
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('description', 'Descrição')
      .field('level', '10')
      .field('xp_reward', '20');

    expect(response.body.message).toBe('Habit not found.');
    expect(response.status).toBe(404);
  });

  it('should return error if a valid authentication token is not sent', async () => {
    const response = await agent
      .post(`/api/habits/${habitId}/challenges`)
      .attach('icon', svgIconPath)
      .field('description', 'Descrição')
      .field('level', '10')
      .field('xp_reward', '20');

    expect(response.body.message).toBe('Invalid token.');
    expect(response.status).toBe(401);
  });
});
