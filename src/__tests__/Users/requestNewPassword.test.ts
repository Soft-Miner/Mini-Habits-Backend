import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import app from '../../app';
import User from '../../models/User';

const mockSendEmail = jest.fn();

jest.mock('../../services/SendMailService.ts', () => ({
  execute: () => mockSendEmail(),
}));

const populateDatabase = async (connection: Connection) => {
  const usersRepository = connection.getRepository(User);
  const user = usersRepository.create({
    email: 'vitor@gmail.com',
    name: 'Vitor',
    lastname: 'Silveira',
    password: '123',
    email_to_verify: '',
  });
  await usersRepository.save(user);
};

describe('Request new password', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await populateDatabase(connection);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if email is invalid', async () => {
    const response = await request(app).post('/api/request-password').send({
      email: 'vitordom.com',
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email.');
    expect(mockSendEmail).not.toBeCalled();
  });

  it('should return error if user do not exists', async () => {
    const response = await request(app).post('/api/request-password').send({
      email: 'vitor@do.com',
    });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found.');
    expect(mockSendEmail).not.toBeCalled();
  });

  it('should be possible to request a new password', async () => {
    const response = await request(app).post('/api/request-password').send({
      email: 'vitor@gmail.com',
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Password recovery email sent to vitor@gmail.com.'
    );
    expect(mockSendEmail).toBeCalled();
  });
});
