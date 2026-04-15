require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const authRoutes    = require('./routes/auth')
const userRoutes    = require('./routes/user')
const writingRoutes = require('./routes/writing')
const vocabRoutes   = require('./routes/vocab')
const adminRoutes   = require('./routes/admin')
const db            = require('./config/db')

const app = express()

// ── Security middleware ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}))

// ── Rate limiting ────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}))

// Stricter limit for auth endpoints
app.use('/auth/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many auth attempts, please try again later.' },
}))

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await db.raw('SELECT 1')
    res.json({ status: 'ok', db: 'connected', time: new Date().toISOString() })
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected' })
  }
})

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/auth',    authRoutes)
app.use('/api/user',    userRoutes)
app.use('/api/writing', writingRoutes)
app.use('/api/vocab',   vocabRoutes)
app.use('/admin',       adminRoutes)

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  const status  = err.status  || 500
  const message = err.message || 'Internal Server Error'
  res.status(status).json({ error: message })
})

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ IELTS HUB API running on port ${PORT}`)
  console.log(`   ENV: ${process.env.NODE_ENV}`)
})

module.exports = app
