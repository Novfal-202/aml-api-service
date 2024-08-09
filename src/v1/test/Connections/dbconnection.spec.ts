import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Client } from 'pg';
import { appConfiguration } from '../../config';

const { DB } = appConfiguration;

describe('Postgres DB Connection', () => {
  it('should connect to the database successfully', async (): Promise<void> => {
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
