import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Client } from 'pg';

describe('Postgres DB Connection', () => {
  it('should connect to the database successfully', async () => {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'postgres',
      port: 5432,
    });

    try {
      await client.connect();
      expect(client).to.have.property('_connected', true);
    } catch (err: any) {
      if (err instanceof Error) {
        throw new Error('Connection failed: ' + err.message);
      } else {
        throw new Error('Connection failed with an unknown error');
      }
    } finally {
      await client.end();
    }
  });
});
