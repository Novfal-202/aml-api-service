import { describe, it } from 'mocha';
import { Client } from 'pg';
import { expect } from 'chai';
import { appConfiguration, dbConfig } from '../../config';

const { DB } = appConfiguration;

describe('POSTGRES DATABASE CONNECTION', () => {
  it('Should connect to the database successfully', async () => {
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

  it('Should fail to connect with invalid credentials', async () => {
    const client = new Client({
      user: dbConfig.user,
      host: dbConfig.host,
      database: dbConfig.database,
      password: dbConfig.password,
      port: dbConfig.port,
    });

    try {
      await client.connect();
      throw new Error('Connection should have failed with invalid credentials');
    } catch (err: any) {
      expect(err).to.exist;
      expect(err.message).to.include('password authentication failed');
    } finally {
      await client.end();
    }
  });

  it('Should fail to connect due to timeout or DNS error', async () => {
    const client = new Client({
      user: DB.user,
      host: 'invalid_host',
      database: DB.name,
      password: DB.password,
      port: DB.port,
      connectionTimeoutMillis: 1000, // 1 second timeout
    });

    try {
      await client.connect();
      throw new Error('Connection should have failed due to timeout or DNS error');
    } catch (err: any) {
      expect(err).to.exist;
      expect(err.message).to.include.oneOf(['connect timeout', 'getaddrinfo EAI_AGAIN', 'getaddrinfo ENOTFOUND']);
    } finally {
      await client.end();
    }
  });

  it('Should close the connection after use', async () => {
    const client = new Client({
      user: DB.user,
      host: DB.host,
      database: DB.name,
      password: DB.password,
      port: DB.port,
    });

    try {
      await client.connect();
      await client.end();
      try {
        await client.query('SELECT 1');
        throw new Error('Query should have failed after connection was closed');
      } catch (err: any) {
        expect(err.message).to.include('Client was closed and is not queryable');
      }
    } catch (err: any) {
      throw new Error('Connection or disconnection failed: ' + err.message);
    }
  });

  it('Should handle unexpected connection errors gracefully', async () => {
    const client = new Client({
      user: DB.user,
      host: DB.host,
      database: DB.name,
      password: DB.password,
      port: DB.port,
    });

    client.on('error', (err) => {
      throw new Error('Connection failed: ' + err.message);
    });

    try {
      await client.connect();
    } catch (err) {
      expect(err).to.exist;
    } finally {
      await client.end();
    }
  });
});
