const express   = require('express')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
const { body }  = require('express-validator')
const db        = require('../config/db')
const { validate } = require('../middleware/validate')

const router = express.Router()

// ── Helpers ──────────────────────────────────────────────────────────────────
const signAccess = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  )

const signRefresh = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  })

// ── POST /auth/signup ─────────────────────────────────────────────────────────
router.post('/signup', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validate,
], async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existing = await db('users').where({ email }).first()
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const password_hash = await bcrypt.hash(password, 12)
    const [user] = await db('users')
      .insert({ name, email, password_hash })
      .returning(['id', 'email', 'name', 'level', 'is_admin'])

    const accessToken  = signAccess(user)
    const refreshToken = signRefresh(user.id)
    await db('users').where({ id: user.id }).update({ refresh_token: refreshToken })

    res.status(201).json({ user, accessToken, refreshToken })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// ── POST /auth/login ──────────────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
], async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await db('users').where({ email }).first()
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

    const accessToken  = signAccess(user)
    const refreshToken = signRefresh(user.id)
    await db('users').where({ id: user.id }).update({ refresh_token: refreshToken })

    const { password_hash, ...safeUser } = user
    res.json({ user: safeUser, accessToken, refreshToken })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// ── POST /auth/refresh-token ──────────────────────────────────────────────────
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' })

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await db('users').where({ id: decoded.id, refresh_token: refreshToken }).first()
    if (!user) return res.status(401).json({ error: 'Invalid refresh token' })

    const newAccessToken  = signAccess(user)
    const newRefreshToken = signRefresh(user.id)
    await db('users').where({ id: user.id }).update({ refresh_token: newRefreshToken })

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' })
  }
})

// ── POST /auth/logout ─────────────────────────────────────────────────────────
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      await db('users').where({ id: decoded.id }).update({ refresh_token: null })
    } catch {}
  }
  res.json({ message: 'Logged out successfully' })
})

// ── POST /auth/forgot-password ────────────────────────────────────────────────
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
  validate,
], async (req, res) => {
  const { email } = req.body
  try {
    const user = await db('users').where({ email }).first()
    // Always return 200 to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' })

    const token   = uuid()
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await db('users').where({ id: user.id }).update({
      password_reset_token:   token,
      password_reset_expires: expires,
    })

    // TODO: send email with reset link
    console.log(`[PASSWORD RESET] Token for ${email}: ${token}`)
    res.json({ message: 'If that email exists, a reset link has been sent.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to process request' })
  }
})

// ── POST /auth/reset-password ─────────────────────────────────────────────────
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
  validate,
], async (req, res) => {
  const { token, password } = req.body
  try {
    const user = await db('users')
      .where({ password_reset_token: token })
      .where('password_reset_expires', '>', new Date())
      .first()

    if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' })

    const password_hash = await bcrypt.hash(password, 12)
    await db('users').where({ id: user.id }).update({
      password_hash,
      password_reset_token:   null,
      password_reset_expires: null,
      refresh_token:          null,
    })

    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

module.exports = router
