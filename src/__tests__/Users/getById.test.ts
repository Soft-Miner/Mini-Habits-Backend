import app from '../../app';
import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

let server: Server, agent: SuperAgentTest;
let token: string;
let tokenOfNonExistentUser: string;

const getToken = async (connection: Connection) => {
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

  tokenOfNonExistentUser = jwt.sign(
    {
      id: 'some-id',
      typ: 'access',
    },
    process.env.JWT_SECRET as string
  );
};

describe('Get user by id', () => {
  beforeAll(async (done) => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();

    server = app.listen(0, async () => {
      agent = request.agent(server);

      await getToken(connection);

      done();
    });
  });

  afterAll((done) => {
    return server && server.close(done);
  });

  it('should be possible to get a user', async () => {
    const response = await agent
      .get('/api/users/personal-data')
      .set('authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should return error if the token is invalid', async () => {
    const response = await agent
      .get('/api/users/personal-data')
      .set('authorization', `Bearer 123`);

    expect(response.body.message).toBe('Invalid token.');
    expect(response.status).toBe(401);
  });

  it('should return an error if the user does not exists', async () => {
    const response = await agent
      .get('/api/users/personal-data')
      .set('authorization', `Bearer ${tokenOfNonExistentUser}`);

    expect(response.body.message).toBe('User not found.');
    expect(response.status).toBe(404);
  });
});
