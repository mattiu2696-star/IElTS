const express = require('express')
const { body } = require('express-validator')
const db       = require('../config/db')
const { authenticate } = require('../middleware/auth')
const { validate }     = require('../middleware/validate')

const router = express.Router()

// ── GET /api/vocab/words ──────────────────────────────────────────────────────
router.get('/words', async (req, res) => {
  try {
    const { topic, level, limit = 20, offset = 0 } = req.query
    let query = db('vocabulary_words')
    if (topic) query = query.where({ topic })
    if (level) query = query.where({ level })

    const words = await query
      .orderBy('word')
      .limit(parseInt(limit))
      .offset(parseInt(offset))

    const [{ count }] = await db('vocabulary_words')
      .modify(q => {
        if (topic) q.where({ topic })
        if (level) q.where({ level })
      })
      .count('id as count')

    res.json({ words, total: parseInt(count) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get words' })
  }
})

// ── GET /api/vocab/progress ───────────────────────────────────────────────────
router.get('/progress', authenticate, async (req, res) => {
  try {
    const progress = await db('user_vocab_progress as uvp')
      .join('vocabulary_words as vw', 'uvp.word_id', 'vw.id')
      .where('uvp.user_id', req.user.id)
      .select(
        'vw.id', 'vw.word', 'vw.definition', 'vw.topic', 'vw.level',
        'uvp.correct_count', 'uvp.incorrect_count', 'uvp.mastered', 'uvp.last_reviewed'
      )
      .orderBy('uvp.last_reviewed', 'desc')

    const [stats] = await db('user_vocab_progress')
      .where({ user_id: req.user.id })
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('COUNT(*) FILTER (WHERE mastered = true) as mastered'),
      )

    res.json({ progress, stats })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get vocab progress' })
  }
})

// ── POST /api/vocab/quiz/submit ───────────────────────────────────────────────
router.post('/quiz/submit', authenticate, [
  body('answers').isArray({ min: 1 }).withMessage('Answers array required'),
  body('answers.*.word_id').isInt(),
  body('answers.*.correct').isBoolean(),
  validate,
], async (req, res) => {
  const { answers } = req.body
  const userId = req.user.id

  try {
    for (const { word_id, correct } of answers) {
      const existing = await db('user_vocab_progress')
        .where({ user_id: userId, word_id })
        .first()

      if (existing) {
        const correctCount   = existing.correct_count   + (correct ? 1 : 0)
        const incorrectCount = existing.incorrect_count + (correct ? 0 : 1)
        const mastered       = correctCount >= 3 && incorrectCount === 0

        // Spaced repetition: next review based on performance
        const daysUntilNext = mastered ? 7 : correct ? 2 : 1
        const nextReview    = new Date(Date.now() + daysUntilNext * 86400000)

        await db('user_vocab_progress').where({ id: existing.id }).update({
          correct_count:   correctCount,
          incorrect_count: incorrectCount,
          mastered,
          last_reviewed:   new Date(),
          next_review:     nextReview,
        })
      } else {
        await db('user_vocab_progress').insert({
          user_id:         userId,
          word_id,
          correct_count:   correct ? 1 : 0,
          incorrect_count: correct ? 0 : 1,
          mastered:        false,
          last_reviewed:   new Date(),
          next_review:     new Date(Date.now() + 86400000),
        })
      }
    }

    const correct = answers.filter(a => a.correct).length
    const total   = answers.length
    const score   = Math.round((correct / total) * 100)

    res.json({
      correct, total, score,
      band: score >= 80 ? 7.0 : score >= 60 ? 6.0 : 5.0,
      feedback: score >= 80
        ? 'Excellent! Great vocabulary knowledge.'
        : score >= 60
        ? 'Good effort. Keep reviewing the words you missed.'
        : 'Keep practicing — review these words regularly.',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to submit quiz' })
  }
})

// ── GET /api/vocab/due ────────────────────────────────────────────────────────
// Words due for spaced repetition review
router.get('/due', authenticate, async (req, res) => {
  try {
    const due = await db('user_vocab_progress as uvp')
      .join('vocabulary_words as vw', 'uvp.word_id', 'vw.id')
      .where('uvp.user_id', req.user.id)
      .where('uvp.mastered', false)
      .where('uvp.next_review', '<=', new Date())
      .select('vw.*', 'uvp.correct_count', 'uvp.incorrect_count')
      .limit(10)

    res.json(due)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get due words' })
  }
})

module.exports = router
