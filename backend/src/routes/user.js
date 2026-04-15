const express = require('express')
const { body } = require('express-validator')
const db       = require('../config/db')
const { authenticate } = require('../middleware/auth')
const { validate }     = require('../middleware/validate')

const router = express.Router()

// All user routes require auth
router.use(authenticate)

// ── GET /api/user/profile ─────────────────────────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'email', 'name', 'level', 'is_admin', 'email_verified', 'created_at')
      .first()

    if (!user) return res.status(404).json({ error: 'User not found' })

    // Compute stats
    const [submissionStats] = await db('writing_submissions')
      .where({ user_id: req.user.id })
      .avg('band_score as avg_band')
      .count('id as total_essays')

    const [vocabStats] = await db('user_vocab_progress')
      .where({ user_id: req.user.id, mastered: true })
      .count('id as mastered_words')

    const latestScore = await db('scores')
      .where({ user_id: req.user.id, skill: 'Overall' })
      .orderBy('test_date', 'desc')
      .first()

    res.json({
      ...user,
      stats: {
        totalEssays:   parseInt(submissionStats.total_essays) || 0,
        avgBandScore:  parseFloat(submissionStats.avg_band)   || 0,
        masteredWords: parseInt(vocabStats.mastered_words)    || 0,
        currentBand:   latestScore?.band_score                || null,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// ── PUT /api/user/profile ─────────────────────────────────────────────────────
router.put('/profile', [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
  validate,
], async (req, res) => {
  const { name, level } = req.body
  const updates = {}
  if (name)  updates.name  = name
  if (level) updates.level = level

  try {
    const [user] = await db('users')
      .where({ id: req.user.id })
      .update({ ...updates, updated_at: new Date() })
      .returning(['id', 'email', 'name', 'level'])

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// ── GET /api/user/progress ────────────────────────────────────────────────────
router.get('/progress', async (req, res) => {
  try {
    const submissions = await db('writing_submissions')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(20)
      .select('id', 'band_score', 'word_count', 'created_at', 'lesson_id')

    const vocabProgress = await db('user_vocab_progress as uvp')
      .join('vocabulary_words as vw', 'uvp.word_id', 'vw.id')
      .where('uvp.user_id', req.user.id)
      .select('vw.word', 'vw.topic', 'uvp.correct_count', 'uvp.incorrect_count', 'uvp.mastered')

    const weeklyActivity = await db('writing_submissions')
      .where('user_id', req.user.id)
      .where('created_at', '>=', db.raw("NOW() - INTERVAL '7 days'"))
      .groupByRaw("DATE(created_at)")
      .select(db.raw("DATE(created_at) as date, COUNT(*) as count, SUM(time_spent) as total_time"))

    res.json({ submissions, vocabProgress, weeklyActivity })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get progress' })
  }
})

// ── GET /api/user/scores ──────────────────────────────────────────────────────
router.get('/scores', async (req, res) => {
  try {
    const scores = await db('scores')
      .where({ user_id: req.user.id })
      .orderBy('test_date', 'desc')
      .limit(50)

    const latestBySkill = await db('scores')
      .where({ user_id: req.user.id })
      .whereIn('skill', ['Listening', 'Reading', 'Writing', 'Speaking'])
      .orderBy('test_date', 'desc')
      .select(db.raw('DISTINCT ON (skill) skill, band_score, test_date'))

    res.json({ scores, latestBySkill })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get scores' })
  }
})

module.exports = router
