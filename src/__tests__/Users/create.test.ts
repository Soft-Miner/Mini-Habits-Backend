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

describe('Create new users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await populateDatabase(connection);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be possible to create a new user.', async () => {
    const response = await request(app).post('/api/register').send({
      name: 'Vitor',
      lastname: 'Fernandes',
      email: 'email@example.com',
      password: '123',
    });

    expect(mockSendEmail).toBeCalled();
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User successfully created.');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('created_at');
    expect(response.body.user.email_to_verify).toBe('email@example.com');
    expect(response.body.user.lastname).toBe('Fernandes');
    expect(response.body.user.name).toBe('Vitor');
  });

  it('should return error if params is incorret', async () => {
    const response = await request(app).post('/api/register').send({
      name: 'Vitor',
      lastname: '',
      email: 'email@example.com',
      password: '',
    });

    const responseEmailInvalid = await request(app).post('/api/register').send({
      name: 'Vitor',
      lastname: 'Fernandes',
      email: 'lolpellolDotcom',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Something wrong with the request.');
    expect(responseEmailInvalid.status).toBe(400);
    expect(responseEmailInvalid.body.message).toBe(
      'Something wrong with the request.'
    );
    expect(mockSendEmail).not.toBeCalled();
  });

  it('should return error if user already exists', async () => {
    const response = await request(app).post('/api/register').send({
      name: 'Vitor',
      lastname: 'Silveira',
      email: 'vitor@gmail.com',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'A user already exists with this email.'
    );
    expect(mockSendEmail).not.toBeCalled();
  });
});
