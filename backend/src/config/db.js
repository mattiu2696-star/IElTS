const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 5432,
    database: process.env.DB_NAME     || 'ielts_hub',
    user:     process.env.DB_USER     || 'ielts_user',
    password: process.env.DB_PASSWORD || 'ielts_pass',
  },
  pool: { min: 2, max: 10 },
  acquireConnectionTimeout: 10000,
})

module.exports = db
