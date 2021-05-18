import app from '../../app';
import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

let server: Server, agent: SuperAgentTest;
let token: string;
let tokenOfNonExistentUser: string;

const mockSendEmail = jest.fn();

jest.mock('../../services/SendMailService.ts', () => ({
  execute: () => mockSendEmail(),
}));

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

describe('Update email', () => {
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

  it('should be possible to update the email', async () => {
    const response = await agent
      .put('/api/users/change-email')
      .set('authorization', `Bearer ${token}`)
      .send({
        new_email: 'rodrigogonn@hotmail.com',
        password: '123',
      });

    expect(response.body.message).toBe('Please verify the new email.');
    expect(response.status).toBe(200);
    expect(mockSendEmail).toBeCalled();
    expect(response.body).toHaveProperty('user');
  });

  it('should return an error if the token is invalid', async () => {
    const response = await agent
      .put('/api/users/change-email')
      .set('authorization', `Bearer 123`)
      .send({
        new_email: 'rodrigogonn@hotmail.com',
        password: '123',
      });

    expect(response.body.message).toBe('Invalid token.');
    expect(response.status).toBe(401);
  });

  it('should return an error if the user does not exists', async () => {
    const response = await agent
      .put('/api/users/change-email')
      .set('authorization', `Bearer ${tokenOfNonExistentUser}`)
      .send({
        new_email: 'rodrigogonn@hotmail.com',
        password: '123',
      });

    expect(response.body.message).toBe('User not found.');
    expect(response.status).toBe(404);
  });

  it('should return an error if some data format is invalid', async () => {
    const response = await agent
      .put('/api/users/change-email')
      .set('authorization', `Bearer ${token}`)
      .send({
        new_email: 'rodrigo_gonnhotmail.com',
        password: '123',
      });

    expect(response.body.message).toBe('Something wrong with the request.');
    expect(response.status).toBe(400);
  });

  it('should return error if the password is incorrect', async () => {
    const response = await agent
      .put('/api/users/change-email')
      .set('authorization', `Bearer ${token}`)
      .send({
        new_email: 'rodrigogon@hotmail.com',
        password: '12',
      });

    expect(response.body.message).toBe('Password is incorrect.');
    expect(response.status).toBe(401);
  });

  it('should not be possible to update a email in use', async () => {
    const response = await agent
      .put('/api/users/change-email')
      .set('authorization', `Bearer ${token}`)
      .send({
        new_email: 'rodrigo_gonn@hotmail.com',
        password: '123',
      });

    expect(response.body.message).toBe(
      'A user already exists with this email.'
    );
    expect(response.status).toBe(400);
  });
});
