import request from 'supertest';
import { createConnection } from 'typeorm';
import app from '../app';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
  });

  it('Should be possible to create a new user.', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'Zequinha',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
  });
});
