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

const messageInvalidToken = encodeURIComponent(
  'OOPS.. Alguma coisa deu errado. 😥'
);
const messageUserNotFound = encodeURIComponent('Usúario não encontrado.');
const messageEmailAlredyVerified = encodeURIComponent(
  'Essa email já foi verificado.'
);

describe('Verify Email', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await populateDatabase(connection);
  });

  it('should return error if an invalid token is sent', async () => {
    const response = await request(app).get(`/api/verify-email/oi`);

    expect(response.header.location).toBe(
      `https://mini-habitos.soft-miner.com/erro?message=${messageInvalidToken}`
    );
  });

  it('should return an error if the user does not exist', async () => {
    const response = await request(app).get(
      `/api/verify-email/${tokenWithUserIdNonExistent}`
    );
    expect(response.header.location).toBe(
      `https://mini-habitos.soft-miner.com/erro?message=${messageUserNotFound}`
    );
  });

  it('should be possible to verify the email', async () => {
    const response = await request(app).get(`/api/verify-email/${token}`);

    expect(response.header.location).toBe(
      'https://mini-habitos.soft-miner.com/email-verificado'
    );
  });

  it('should return an error if the email has already been verified', async () => {
    const response = await request(app).get(`/api/verify-email/${token}`);

    expect(response.header.location).toBe(
      `https://mini-habitos.soft-miner.com/erro?message=${messageEmailAlredyVerified}`
    );
  });
});
