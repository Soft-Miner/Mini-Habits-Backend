import app from '../../app';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

let token = '';
let tokenWithUserIdNonExistent = '';

const populateDatabase = async (connection: Connection) => {
  const usersRepository = connection.getRepository(User);

  const user = usersRepository.create({
    password: '$2b$10$7TOQbrdLq0tUuKgJQjQLd.mn4njjf808A1ojy5uupUABgnZPcW1TG',
    email_to_verify: 'vitor.f.silveira@hotmail.com',
    name: 'Vitor',
    lastname: 'Fernandes',
  });

  await usersRepository.save(user);

  token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET as string
  );

  tokenWithUserIdNonExistent = jwt.sign(
    {
      id: '123',
    },
    process.env.JWT_SECRET as string
  );
};

describe('Verify Email', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await populateDatabase(connection);
  });

  it('should return error if an invalid token is sent', async () => {
    const emptyTokenResponse = await request(app)
      .post('/api/verify-email')
      .send({
        token: '',
      });
    const invalidTokenResponse = await request(app)
      .post('/api/verify-email')
      .send({
        token: '123123123123',
      });

    expect(emptyTokenResponse.status).toBe(401);
    expect(emptyTokenResponse.body.message).toBe('Invalid token.');
    expect(invalidTokenResponse.status).toBe(401);
    expect(invalidTokenResponse.body.message).toBe('Invalid token.');
  });

  it('should return an error if the user does not exist', async () => {
    const response = await request(app).post('/api/verify-email').send({
      token: tokenWithUserIdNonExistent,
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found.');
  });

  it('should be possible to verify the email', async () => {
    const response = await request(app).post('/api/verify-email').send({
      token,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email successfully verified.');
  });

  it('should return an error if the email has already been verified', async () => {
    const response = await request(app).post('/api/verify-email').send({
      token,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('This email was already verified.');
  });
});
