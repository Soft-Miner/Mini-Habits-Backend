import app from '../../app';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import SuperUser from '../../models/SuperUser';

const populateDatabase = async (connection: Connection) => {
  const usersRepository = connection.getRepository(SuperUser);

  const user = usersRepository.create({
    email: 'vitor.f.silveira@hotmail.com',
    password: '$2b$10$7TOQbrdLq0tUuKgJQjQLd.mn4njjf808A1ojy5uupUABgnZPcW1TG',
    refresh_token: '',
  });

  await usersRepository.save(user);
};

describe('SuperUser authenticate', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await populateDatabase(connection);
  });

  it('should return error if email or password are incorrect', async () => {
    const responseWithWrongEmail = await request(app)
      .post('/api/super_users/authenticate')
      .send({
        email: 'non-existent-@email.com',
        password: '123',
      });

    const responseWithWrongPassword = await request(app)
      .post('/api/super_users/authenticate')
      .send({
        email: 'vitor.f.silveira@hotmail.com',
        password: 'wrong-password',
      });

    expect(responseWithWrongEmail.status).toBe(401);
    expect(responseWithWrongEmail.body.message).toBe(
      'Email or password is incorrect.'
    );
    expect(responseWithWrongPassword.status).toBe(401);
    expect(responseWithWrongPassword.body.message).toBe(
      'Email or password is incorrect.'
    );
  });

  it('should return error if data sent is wrong', async () => {
    const responseWithNonExistentEmail = await request(app)
      .post('/api/super_users/authenticate')
      .send({
        email: 'non-existent-email',
        password: '123',
      });

    const responseWithNullEmail = await request(app)
      .post('/api/super_users/authenticate')
      .send({
        email: '',
        password: '123',
      });

    const responseWithNullPassword = await request(app)
      .post('/api/super_users/authenticate')
      .send({
        email: 'vitor.f.silveira@hotmail.com',
        password: '',
      });

    expect(responseWithNonExistentEmail.status).toBe(401);
    expect(responseWithNonExistentEmail.body.message).toBe(
      'Email or password is incorrect.'
    );

    expect(responseWithNullEmail.status).toBe(401);
    expect(responseWithNullEmail.body.message).toBe(
      'Email or password is incorrect.'
    );

    expect(responseWithNullPassword.status).toBe(401);
    expect(responseWithNullPassword.body.message).toBe(
      'Email or password is incorrect.'
    );
  });

  it('should be possible to get tokens', async () => {
    const response = await request(app)
      .post('/api/super_users/authenticate')
      .send({
        email: 'vitor.f.silveira@hotmail.com',
        password: '123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
  });
});
