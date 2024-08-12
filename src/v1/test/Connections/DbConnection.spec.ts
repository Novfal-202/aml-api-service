import { describe, it } from 'mocha';
import { Client } from 'pg';
import { expect } from 'chai';
import { appConfiguration } from '../../config';

const { DB } = appConfiguration;

describe('Postgres DB Connection', () => {
  it('should connect to the database successfully', async () => {
    const client = new Client({
      user: DB.user,
      host: DB.host,
      database: DB.name,
      password: DB.password,
      port: DB.port,
    });
    try {
      await client.connect();
      expect(client).to.have.property('_connected', true);
    } catch (err) {
      throw new Error('Connection failed: ' + (err as Error).message);
    } finally {
      await client.end();
    }
  });
});
