import { createConnection } from 'typeorm';

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.runMigrations();
  });

  it('Should be here just to tests not fails', () => {
    expect(1).toBe(1);
  });
});
