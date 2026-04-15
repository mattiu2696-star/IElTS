module.exports = {
  development: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST     || 'localhost',
      port:     process.env.DB_PORT     || 5432,
      database: process.env.DB_NAME     || 'ielts_hub',
      user:     process.env.DB_USER     || 'ielts_user',
      password: process.env.DB_PASSWORD || 'ielts_pass',
    },
    migrations: { directory: './migrations', tableName: 'knex_migrations' },
    seeds:      { directory: './seeds' },
  },
  production: {
    client: 'pg',
    connection: {
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT     || 5432,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: { directory: './migrations', tableName: 'knex_migrations' },
    seeds:      { directory: './seeds' },
    pool: { min: 2, max: 10 },
  },
}
