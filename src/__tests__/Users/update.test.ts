import app from '../../app';
import { Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import { Connection, createConnection } from 'typeorm';
import User from '../../models/User';
import jwt from 'jsonwebtoken';

let server: Server, agent: SuperAgentTest;
let token: string;
let tokenOfNonExistentUser: string;
let userId: string;

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

  userId = user.id;
  token = response.body.token;

  tokenOfNonExistentUser = jwt.sign(
    {
      id: 'some-id',
      typ: 'access',
    },
    process.env.JWT_SECRET as string
  );
};

describe('Update User', () => {
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

  it('should be possible to update user name and lastname', async () => {
    const response = await agent
      .put(`/api/users/${userId}`)
      .set('authorization', `Bearer ${token}`)
      .send({
        name: 'Rodrigo 2',
        lastname: 'Gonçalves 2',
      });

    expect(response.body.message).toBe('User successfully updated.');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
  });

  it('should be possible to update only name or lastname', async () => {
    const responseOnlyName = await agent
      .put(`/api/users/${userId}`)
      .set('authorization', `Bearer ${token}`)
      .send({
        name: 'Rodrigo 2',
      });
    const responseOnlyLastname = await agent
      .put(`/api/users/${userId}`)
      .set('authorization', `Bearer ${token}`)
      .send({
        lastname: 'Gonçalves 2',
      });

    expect(responseOnlyName.body.message).toBe('User successfully updated.');
    expect(responseOnlyName.status).toBe(200);
    expect(responseOnlyName.body).toHaveProperty('user');
    expect(responseOnlyLastname.body.message).toBe(
      'User successfully updated.'
    );
    expect(responseOnlyLastname.status).toBe(200);
    expect(responseOnlyLastname.body).toHaveProperty('user');
  });

  it('should return error if the token is invalid', async () => {
    const response = await agent
      .put(`/api/users/${userId}`)
      .set('authorization', `Bearer 123`)
      .send({
        name: 'Rodrigo 2',
        lastname: 'Gonçalves 2',
      });

    expect(response.body.message).toBe('Invalid token.');
    expect(response.status).toBe(401);
  });

  it('should not return an error if all fields are empty', async () => {
    const response = await agent
      .put(`/api/users/${userId}`)
      .set('authorization', `Bearer ${token}`)
      .send({});

    expect(response.body.message).toBe('User successfully updated.');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
  });

  it('should return an error if the user does not exists', async () => {
    const response = await agent
      .put(`/api/users/some-id`)
      .set('authorization', `Bearer ${tokenOfNonExistentUser}`)
      .send({
        name: 'Rodrigo 2',
        lastname: 'Gonçalves 2',
      });

    expect(response.body.message).toBe('User not found.');
    expect(response.status).toBe(404);
  });

  it('should return an error if some data format is invalid', async () => {
    const response = await agent
      .put(`/api/users/${userId}`)
      .set('authorization', `Bearer ${token}`)
      .send({
        name: 123,
      });

    expect(response.body.message).toBe('Something wrong with the request.');
    expect(response.status).toBe(400);
  });

  it('should return an error if the user is trying to update another user', async () => {
    const response = await agent
      .put(`/api/users/123`)
      .set('authorization', `Bearer ${tokenOfNonExistentUser}`)
      .send({
        name: 'Rodrigo 2',
        lastname: 'Gonçalves 2',
      });

    expect(response.body.message).toBe('You cannot change this user.');
    expect(response.status).toBe(401);
  });
});
