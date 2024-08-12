interface DBConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

const dbConfig: DBConfig = {
  user: 'invalid_user',
  host: 'localhost',
  database: 'test_db',
  password: 'invalid_password',
  port: 5432,
};

export default dbConfig;
