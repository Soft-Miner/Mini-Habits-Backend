import request from 'supertest';
import { createConnection } from 'typeorm';
import app from '../../app';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSendEmail = jest.fn((args) => ({
  messageId: '',
}));

jest.mock('../../services/SendMailService.ts', () => ({
  execute: (args: Record<string, unknown>) => mockSendEmail(args),
}));

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
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
});
