import app from '../../app';
import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import path from 'path';
import fs from 'fs';
import { Connection, createConnection } from 'typeorm';
import SuperUser from '../../models/SuperUser';

let server: Server, agent: SuperAgentTest;
let svgIconPath: string;
let nonSvgFilePath: string;
let accessToken: string;
let refreshToken: string;

const createIconSvg = () => {
  const testFilesFolder = path.resolve(__dirname, '../../../tmp/tests');
  fs.mkdirSync(testFilesFolder, { recursive: true });
  const filename = 'icon.svg';
  const filePath = path.resolve(testFilesFolder, filename);
  svgIconPath = filePath;
  fs.writeFileSync(filePath, '');

  const nonSvgfilename = 'icon.pdf';
  const nonSvgfilePath = path.resolve(testFilesFolder, nonSvgfilename);
  nonSvgFilePath = nonSvgfilePath;
  fs.writeFileSync(nonSvgfilePath, '');
};

const populateDatabase = async (connection: Connection) => {
  const usersRepository = connection.getRepository(SuperUser);

  const user = usersRepository.create({
    email: 'vitor.f.silveira@hotmail.com',
    password: '$2b$10$7TOQbrdLq0tUuKgJQjQLd.mn4njjf808A1ojy5uupUABgnZPcW1TG',
    refresh_token: '',
  });

  await usersRepository.save(user);
};

const getToken = async () => {
  const response = await agent.post('/api/super_users/authenticate').send({
    email: 'vitor.f.silveira@hotmail.com',
    password: '123',
  });

  accessToken = response.body.access_token;
  refreshToken = response.body.refresh_token;
};

describe('Create habits', () => {
  beforeAll(async (done) => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await populateDatabase(connection);

    createIconSvg();

    server = app.listen(0, async () => {
      agent = request.agent(server);

      await getToken();

      done();
    });
  });

  afterAll((done) => {
    return server && server.close(done);
  });

  it('should be possible to create a mini-habit', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: 'Descrição',
            xp_reward: 10,
          },
          {
            level: 10,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Habit successfully created.');
    expect(response.body).toHaveProperty('habit');
  });

  it('should not be possible to create a mini-habit with an existing name', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: 'Descrição',
            xp_reward: 10,
          },
          {
            level: 10,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'A habit already exists with this name.'
    );
  });

  it('should not be possible to create a mini-habit without any challenge for level 0', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 10,
            description: 'Descrição',
            xp_reward: 10,
          },
          {
            level: 20,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'At least one challenge must be level 0.'
    );
  });

  it('should not be possible to create a mini-habit if challengesIcons and challenges are not of the same length', async () => {
    const responseWithMoreIcons = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: 'Descrição',
            xp_reward: 10,
          },
          {
            level: 20,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );
    const responseWithLessIcons = await agent
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
          {
            level: 20,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(responseWithLessIcons.status).toBe(400);
    expect(responseWithLessIcons.body.message).toBe(
      'ChallengesIcon and challenges must have the same length.'
    );
    expect(responseWithMoreIcons.status).toBe(400);
    expect(responseWithMoreIcons.body.message).toBe(
      'ChallengesIcon and challenges must have the same length.'
    );
  });

  it('should not be possible to create a mini-habit if does not have an icon', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: 'Descrição',
            xp_reward: 10,
          },
          {
            level: 20,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('icon is required.');
  });

  it('should not be possible to create a mini-habit if does not have challenge icons', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
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

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('challengesIcon is required.');
  });

  it('should not be possible to create a mini-habit if any field of the mini-habit is missing', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', '')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field('description', 'Leitura é bom para a memória.')
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: 'Descrição',
            xp_reward: 10,
          },
          {
            level: 20,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Something wrong with the request.');
  });

  it('should not be possible to create a mini-habit if a challenge field is missing', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field('description', 'Leitura é bom para a memória.')
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: '',
            xp_reward: 10,
          },
          {
            level: 20,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Some field is missing in challenges.');
  });

  it('should not be possible to create a mini-habit if the icon is not svg', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', nonSvgFilePath)
      .field('name', 'Ler livro')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field('description', 'Leitura é bom para a memória.')
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: 'Descrição 1',
            xp_reward: 10,
          },
          {
            level: 20,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid file type.');
  });

  it('should not be possible to create a mini-habit if no challenge is sent', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .field('challenges', JSON.stringify([]));

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('challengesIcon is required.');
  });

  it('should not be possible to create a mini-habit without a valid access token', async () => {
    const responseWithoutToken = await agent
      .post('/api/habits')
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: 'Descrição',
            xp_reward: 10,
          },
          {
            level: 10,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );
    const responseWithRefreshToken = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${refreshToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field(
        'challenges',
        JSON.stringify([
          {
            level: 0,
            description: 'Descrição',
            xp_reward: 10,
          },
          {
            level: 10,
            description: 'Descrição 2',
            xp_reward: 20,
          },
        ])
      );

    expect(responseWithoutToken.status).toBe(401);
    expect(responseWithoutToken.body.message).toBe('Invalid token.');
    expect(responseWithRefreshToken.status).toBe(401);
    expect(responseWithRefreshToken.body.message).toBe('Invalid token.');
  });

  it('should not be possible to create a mini-habit if the challenges is not a valid json', async () => {
    const response = await agent
      .post('/api/habits')
      .set('authorization', `Bearer ${accessToken}`)
      .attach('icon', svgIconPath)
      .field('name', 'Ler livro')
      .field('description', 'Leitura é bom para a memória.')
      .attach('challengesIcons', svgIconPath)
      .attach('challengesIcons', svgIconPath)
      .field('challenges', '"oi{');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid challenge JSON string.');
  });
});
