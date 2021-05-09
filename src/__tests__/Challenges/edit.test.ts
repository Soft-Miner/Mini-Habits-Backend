import app from '../../app';
import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import path from 'path';
import fs from 'fs';
import { Connection, createConnection } from 'typeorm';
import SuperUser from '../../models/SuperUser';

let server: Server;
let agent: SuperAgentTest;
let svgIconPath: string;
let accessToken: string;
let challengId: string;

const createIconSvg = () => {
  const testFilesFolder = path.resolve(__dirname, '../../../tmp/tests');
  fs.mkdirSync(testFilesFolder, { recursive: true });
  const filename = 'icon.svg';
  const filePath = path.resolve(testFilesFolder, filename);
  svgIconPath = filePath;
  fs.writeFileSync(filePath, '');

  const nonSvgfilename = 'icon.pdf';
  const nonSvgfilePath = path.resolve(testFilesFolder, nonSvgfilename);
  fs.writeFileSync(nonSvgfilePath, '');
};

const createSuperUSer = async (connection: Connection) => {
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
  challengId = response.body.habit.challenges[0].id;
};

const getToken = async () => {
  const response = await agent.post('/api/super_users/authenticate').send({
    email: 'vitor.f.silveira@hotmail.com',
    password: '123',
  });

  accessToken = response.body.access_token;
};

describe('Create habits', () => {
  beforeAll(async (done) => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await createSuperUSer(connection);

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

  it('should be possible to update the challenge', async () => {
    const response = await agent
      .put(`/api/challenges/${challengId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('description', 'Leia o livro inteiro em 2 segundos');

    expect(response.body.message).toBe('Challenge updated.');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('challenge');
  });

  it('should return error if the challenge does not exist', async () => {
    const response = await agent
      .put('/api/challenges/shadhs')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('description', 'Leia o livro inteiro em 2 segundos');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Challenge not found.');
  });

  it('should be possible to update only the description', async () => {
    const response = await agent
      .put(`/api/challenges/${challengId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .field('description', 'Leia o livro inteiro em 3 segundos');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Challenge updated.');
    expect(response.body).toHaveProperty('challenge');
  });

  it('should be possible to update only the icon', async () => {
    const response = await agent
      .put(`/api/challenges/${challengId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Challenge updated.');
    expect(response.body).toHaveProperty('challenge');
  });

  it('should not be possible to update the challenge with invalid token', async () => {
    const response = await agent
      .put(`/api/challenges/${challengId}`)
      .set('authorization', 'Bearer 544')
      .attach('icon', svgIconPath)
      .field('description', 'Leia o livro inteiro em 2 segundos');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token.');
  });
});
