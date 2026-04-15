/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // Users
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary()
    t.string('email', 255).notNullable().unique()
    t.string('password_hash', 255).notNullable()
    t.string('name', 100).notNullable()
    t.enu('level', ['Beginner', 'Intermediate', 'Advanced']).defaultTo('Intermediate')
    t.boolean('is_admin').defaultTo(false)
    t.boolean('email_verified').defaultTo(false)
    t.string('email_verify_token', 255)
    t.string('password_reset_token', 255)
    t.timestamp('password_reset_expires')
    t.string('refresh_token', 512)
    t.timestamps(true, true)
  })

  // Lessons
  await knex.schema.createTable('lessons', (t) => {
    t.increments('id').primary()
    t.enu('type', ['Writing', 'Reading', 'Listening', 'Speaking', 'Vocabulary']).notNullable()
    t.string('title', 255).notNullable()
    t.enu('difficulty', ['Easy', 'Medium', 'Hard']).defaultTo('Medium')
    t.text('content').notNullable()
    t.text('model_answer')
    t.string('topic', 100)
    t.integer('min_words').defaultTo(0)
    t.integer('time_limit').defaultTo(40)
    t.boolean('is_active').defaultTo(true)
    t.timestamps(true, true)
  })

  // UserProgress
  await knex.schema.createTable('user_progress', (t) => {
    t.increments('id').primary()
    t.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    t.integer('lesson_id').references('id').inTable('lessons').onDelete('CASCADE')
    t.float('score').defaultTo(0)
    t.boolean('completed').defaultTo(false)
    t.integer('time_spent').defaultTo(0) // seconds
    t.timestamp('completed_at')
    t.timestamps(true, true)
    t.unique(['user_id', 'lesson_id'])
  })

  // WritingSubmissions
  await knex.schema.createTable('writing_submissions', (t) => {
    t.increments('id').primary()
    t.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    t.integer('lesson_id').references('id').inTable('lessons').onDelete('SET NULL').nullable()
    t.text('essay_text').notNullable()
    t.integer('word_count').defaultTo(0)
    t.float('band_score')
    t.float('task_achievement')
    t.float('coherence')
    t.float('lexical')
    t.float('grammar')
    t.jsonb('feedback_json')
    t.integer('time_spent').defaultTo(0)
    t.timestamps(true, true)
  })

  // VocabularyWords
  await knex.schema.createTable('vocabulary_words', (t) => {
    t.increments('id').primary()
    t.string('word', 100).notNullable().unique()
    t.text('definition').notNullable()
    t.text('example_sentence')
    t.enu('level', ['A1','A2','B1','B2','C1','C2']).defaultTo('B2')
    t.string('topic', 100)
    t.string('pronunciation', 200)
    t.timestamps(true, true)
  })

  // UserVocabProgress
  await knex.schema.createTable('user_vocab_progress', (t) => {
    t.increments('id').primary()
    t.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    t.integer('word_id').references('id').inTable('vocabulary_words').onDelete('CASCADE')
    t.integer('correct_count').defaultTo(0)
    t.integer('incorrect_count').defaultTo(0)
    t.boolean('mastered').defaultTo(false)
    t.timestamp('last_reviewed')
    t.timestamp('next_review')
    t.timestamps(true, true)
    t.unique(['user_id', 'word_id'])
  })

  // Scores (test history)
  await knex.schema.createTable('scores', (t) => {
    t.increments('id').primary()
    t.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    t.enu('skill', ['Overall', 'Listening', 'Reading', 'Writing', 'Speaking']).notNullable()
    t.float('band_score').notNullable()
    t.float('breakdown_ta')
    t.float('breakdown_cc')
    t.float('breakdown_lr')
    t.float('breakdown_gr')
    t.date('test_date').defaultTo(knex.fn.now())
    t.timestamps(true, true)
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('scores')
  await knex.schema.dropTableIfExists('user_vocab_progress')
  await knex.schema.dropTableIfExists('vocabulary_words')
  await knex.schema.dropTableIfExists('writing_submissions')
  await knex.schema.dropTableIfExists('user_progress')
  await knex.schema.dropTableIfExists('lessons')
  await knex.schema.dropTableIfExists('users')
}
