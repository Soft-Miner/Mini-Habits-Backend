import app from '../../app';
import request from 'supertest';
import { Connection, createConnection, getRepository } from 'typeorm';
import SuperUser from '../../models/SuperUser';

jest.mock('bcrypt', () => ({
  hash: (data: string) => data,
  compare: (data: string, encrypted: string) => data === encrypted,
}));

let refresh_token: string;
let id: string;

const populateDatabase = async (connection: Connection) => {
  const usersRepository = connection.getRepository(SuperUser);

  const user = usersRepository.create({
    email: 'vitor.f.silveira@hotmail.com',
    password: '123',
    refresh_token: '',
  });

  id = user.id;

  await usersRepository.save(user);
};

const getRefreshToken = async () => {
  const response = await request(app)
    .post('/api/super_users/authenticate')
    .send({
      email: 'vitor.f.silveira@hotmail.com',
      password: '123',
    });

  refresh_token = response.body.refresh_token;
};

describe('SuperUser refreshToken', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await populateDatabase(connection);
    await getRefreshToken();
  });

  it('should be possible to get a new access_token with a valid refresh_token', async () => {
    const response = await request(app)
      .post('/api/super_users/refresh_token')
      .send({
        refresh_token,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('should not be possible to use a refresh_token twice', async () => {
    const response = await request(app)
      .post('/api/super_users/refresh_token')
      .send({
        refresh_token,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid refresh_token.');
  });

  it('should return error if sent token is invalid', async () => {
    const responseEmptyToken = await request(app)
      .post('/api/super_users/refresh_token')
      .send({
        refresh_token: '',
      });
    const responseInvalidToken = await request(app)
      .post('/api/super_users/refresh_token')
      .send({
        refresh_token: '123',
      });

    expect(responseEmptyToken.status).toBe(400);
    expect(responseEmptyToken.body.message).toBe('Invalid refresh_token.');
    expect(responseInvalidToken.status).toBe(400);
    expect(responseInvalidToken.body.message).toBe('Invalid refresh_token.');
  });

  it('should return error if superUser does not exists', async () => {
    const superUsersRepository = getRepository(SuperUser);
    await superUsersRepository.delete(id);

    const response = await request(app)
      .post('/api/super_users/refresh_token')
      .send({
        refresh_token,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid refresh_token.');
  });
});
