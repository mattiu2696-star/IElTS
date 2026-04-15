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
    seeds:      { directory: './migrations' },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './migrations', tableName: 'knex_migrations' },
    pool: { min: 2, max: 10 },
  },
}
