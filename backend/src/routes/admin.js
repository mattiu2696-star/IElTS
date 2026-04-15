const express = require('express')
const db       = require('../config/db')
const { authenticate, requireAdmin } = require('../middleware/auth')

const router = express.Router()
router.use(authenticate, requireAdmin)

// ── GET /admin/users ──────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    let query = db('users').select('id', 'email', 'name', 'level', 'is_admin', 'email_verified', 'created_at')

    if (search) {
      query = query.where(function () {
        this.where('name', 'ilike', `%${search}%`).orWhere('email', 'ilike', `%${search}%`)
      })
    }

    const [{ count }] = await db('users').count('id as count')
      .modify(q => { if (search) q.where('name', 'ilike', `%${search}%`) })

    const users = await query
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset((parseInt(page) - 1) * parseInt(limit))

    res.json({ users, total: parseInt(count), page: parseInt(page) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get users' })
  }
})

// ── GET /admin/analytics ──────────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const [userCount]       = await db('users').count('id as count')
    const [submissionCount] = await db('writing_submissions').count('id as count')
    const [avgBand]         = await db('writing_submissions').avg('band_score as avg')

    const dailySignups = await db('users')
      .where('created_at', '>=', db.raw("NOW() - INTERVAL '30 days'"))
      .groupByRaw('DATE(created_at)')
      .select(db.raw("DATE(created_at) as date, COUNT(*) as count"))
      .orderBy('date')

    const topLessons = await db('user_progress as up')
      .join('lessons as l', 'up.lesson_id', 'l.id')
      .groupBy('l.id', 'l.title')
      .select('l.title', db.raw('COUNT(*) as attempts, AVG(up.score) as avg_score'))
      .orderBy('attempts', 'desc')
      .limit(5)

    res.json({
      totalUsers:       parseInt(userCount.count),
      totalSubmissions: parseInt(submissionCount.count),
      avgBandScore:     parseFloat(avgBand.avg) || 0,
      dailySignups,
      topLessons,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get analytics' })
  }
})

// ── POST /admin/lessons ───────────────────────────────────────────────────────
router.post('/lessons', async (req, res) => {
  const { type, title, difficulty, content, model_answer, topic, min_words, time_limit } = req.body
  try {
    const [lesson] = await db('lessons')
      .insert({ type, title, difficulty, content, model_answer, topic, min_words, time_limit })
      .returning('*')
    res.status(201).json(lesson)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create lesson' })
  }
})

// ── PUT /admin/lessons/:id ────────────────────────────────────────────────────
router.put('/lessons/:id', async (req, res) => {
  try {
    const [lesson] = await db('lessons')
      .where({ id: req.params.id })
      .update({ ...req.body, updated_at: new Date() })
      .returning('*')
    res.json(lesson)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lesson' })
  }
})

// ── DELETE /admin/lessons/:id ─────────────────────────────────────────────────
router.delete('/lessons/:id', async (req, res) => {
  try {
    await db('lessons').where({ id: req.params.id }).update({ is_active: false })
    res.json({ message: 'Lesson deactivated' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lesson' })
  }
})

module.exports = router
