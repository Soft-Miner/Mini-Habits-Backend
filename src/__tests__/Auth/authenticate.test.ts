import app from '../../app';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import User from '../../models/User';

const populateDatabase = async (connection: Connection) => {
  const usersRepository = connection.getRepository(User);

  const user = usersRepository.create({
    password: '$2b$10$7TOQbrdLq0tUuKgJQjQLd.mn4njjf808A1ojy5uupUABgnZPcW1TG',
    email: 'vitor.f.silveira@hotmail.com',
    name: 'Vitor',
    lastname: 'Fernandes',
  });

  await usersRepository.save(user);
};

describe('Auth', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
    await populateDatabase(connection);
  });

  it('should be possible to get a token', async () => {
    const response = await request(app).post('/api/authenticate').send({
      email: 'vitor.f.silveira@hotmail.com',
      password: '123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return error if email or password are incorrect', async () => {
    const responseWithWrongEmail = await request(app)
      .post('/api/authenticate')
      .send({
        email: 'non-existent-email@example.com',
        password: '123',
      });
    const responseWithWrongPassword = await request(app)
      .post('/api/authenticate')
      .send({
        email: 'vitor.f.silveira@hotmail.com',
        password: 'wrong-password',
      });

    expect(responseWithWrongEmail.status).toBe(400);
    expect(responseWithWrongEmail.body.message).toBe(
      'Email or password is incorrect.'
    );
    expect(responseWithWrongPassword.status).toBe(400);
    expect(responseWithWrongPassword.body.message).toBe(
      'Email or password is incorrect.'
    );
  });

  it('should return error if data sent is wrong', async () => {
    const responseWithWrongEmail = await request(app)
      .post('/api/authenticate')
      .send({
        email: 'non-existent-email',
        password: '123',
      });
    const responseWithWrongPassword = await request(app)
      .post('/api/authenticate')
      .send({
        email: 'vitor.f.silveira@hotmail.com',
        password: '',
      });

    expect(responseWithWrongEmail.status).toBe(400);
    expect(responseWithWrongEmail.body.message).toBe(
      'Email or password is incorrect.'
    );
    expect(responseWithWrongPassword.status).toBe(400);
    expect(responseWithWrongPassword.body.message).toBe(
      'Email or password is incorrect.'
    );
  });
});
