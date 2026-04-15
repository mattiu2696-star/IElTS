const express    = require('express')
const { body }   = require('express-validator')
const Anthropic  = require('@anthropic-ai/sdk')
const db         = require('../config/db')
const { authenticate } = require('../middleware/auth')
const { validate }     = require('../middleware/validate')

const router = express.Router()
const claude = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

// ── Claude grading function ───────────────────────────────────────────────────
async function gradeEssayWithClaude(essayText, essayType, prompt) {
  const systemPrompt = `You are an expert IELTS examiner with 20+ years of experience.
Grade the essay strictly according to official IELTS band descriptors (0-9 scale, 0.5 increments).
You MUST respond with valid JSON only, no other text.`

  const userPrompt = `Grade this IELTS ${essayType} essay.

Essay Prompt: ${prompt}

Student Essay:
"""
${essayText}
"""

Respond with this exact JSON structure:
{
  "bandScore": <number 0-9, 0.5 increments>,
  "taskAchievement": <number 0-9>,
  "coherence": <number 0-9>,
  "lexical": <number 0-9>,
  "grammar": <number 0-9>,
  "feedback": "<2-3 paragraph detailed feedback>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "errorHighlights": [
    {"text": "<error phrase>", "correction": "<corrected phrase>", "reason": "<brief explanation>"}
  ]
}`

  const message = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const raw = message.content[0].text.trim()
  // Strip markdown code fences if present
  const jsonStr = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(jsonStr)
}

// ── GET /api/writing/lessons ──────────────────────────────────────────────────
router.get('/lessons', async (req, res) => {
  try {
    const { type, difficulty, topic } = req.query
    let query = db('lessons').where({ type: 'Writing', is_active: true })
    if (type)       query = query.where({ type })
    if (difficulty) query = query.where({ difficulty })
    if (topic)      query = query.where({ topic })

    const lessons = await query
      .select('id', 'title', 'difficulty', 'topic', 'min_words', 'time_limit', 'created_at')
      .orderBy('created_at', 'desc')

    res.json(lessons)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get lessons' })
  }
})

// ── GET /api/writing/lessons/:id ─────────────────────────────────────────────
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await db('lessons')
      .where({ id: req.params.id, is_active: true })
      .first()

    if (!lesson) return res.status(404).json({ error: 'Lesson not found' })
    res.json(lesson)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get lesson' })
  }
})

// ── POST /api/writing/submit ──────────────────────────────────────────────────
router.post('/submit', authenticate, [
  body('essay_text').isLength({ min: 50 }).withMessage('Essay too short'),
  body('lesson_id').optional().isInt(),
  body('time_spent').optional().isInt({ min: 0 }),
  validate,
], async (req, res) => {
  const { essay_text, lesson_id, time_spent = 0 } = req.body

  try {
    // Get lesson info for context
    let lessonContent = 'General IELTS Writing Task 2'
    let essayType     = 'Task 2'
    let minWords      = 250

    if (lesson_id) {
      const lesson = await db('lessons').where({ id: lesson_id }).first()
      if (lesson) {
        lessonContent = lesson.content
        essayType     = lesson.title.includes('Task 1') ? 'Task 1' : 'Task 2'
        minWords      = lesson.min_words
      }
    }

    const wordCount = essay_text.trim().split(/\s+/).length
    if (wordCount < minWords) {
      return res.status(400).json({
        error: `Minimum ${minWords} words required. Your essay has ${wordCount} words.`
      })
    }

    // Grade with Claude AI
    let gradingResult
    if (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== 'your-claude-api-key-here') {
      gradingResult = await gradeEssayWithClaude(essay_text, essayType, lessonContent)
    } else {
      // Mock grading when no API key
      const base = Math.min(5.5 + wordCount / 500, 7.5)
      gradingResult = {
        bandScore:       parseFloat(Math.round(base * 2) / 2),
        taskAchievement: parseFloat(Math.round((base + 0.5) * 2) / 2),
        coherence:       parseFloat(Math.round((base - 0.5) * 2) / 2),
        lexical:         parseFloat(Math.round(base * 2) / 2),
        grammar:         parseFloat(Math.round(base * 2) / 2),
        feedback: 'Your essay demonstrates a clear understanding of the topic. The structure is logical and the main points are supported with relevant examples. To improve, focus on using a wider range of vocabulary and more complex grammatical structures.',
        strengths: ['Clear thesis statement', 'Logical paragraph structure', 'Relevant examples used'],
        improvements: ['Wider range of vocabulary needed', 'More complex sentence structures', 'Stronger conclusion'],
        errorHighlights: [
          { text: 'alot', correction: 'a lot', reason: 'Spelling: "alot" is not a standard English word' },
        ],
      }
    }

    // Save to DB
    const [submission] = await db('writing_submissions').insert({
      user_id:          req.user.id,
      lesson_id:        lesson_id || null,
      essay_text,
      word_count:       wordCount,
      band_score:       gradingResult.bandScore,
      task_achievement: gradingResult.taskAchievement,
      coherence:        gradingResult.coherence,
      lexical:          gradingResult.lexical,
      grammar:          gradingResult.grammar,
      feedback_json:    JSON.stringify(gradingResult),
      time_spent,
    }).returning('*')

    // Update user progress if lesson
    if (lesson_id) {
      await db('user_progress')
        .insert({
          user_id:      req.user.id,
          lesson_id,
          score:        gradingResult.bandScore,
          completed:    true,
          time_spent,
          completed_at: new Date(),
        })
        .onConflict(['user_id', 'lesson_id'])
        .merge({ score: gradingResult.bandScore, completed: true, time_spent, completed_at: new Date() })
    }

    // Save overall score
    await db('scores').insert({
      user_id:    req.user.id,
      skill:      'Writing',
      band_score: gradingResult.bandScore,
      breakdown_ta: gradingResult.taskAchievement,
      breakdown_cc: gradingResult.coherence,
      breakdown_lr: gradingResult.lexical,
      breakdown_gr: gradingResult.grammar,
    })

    res.json({ submission, grading: gradingResult })
  } catch (err) {
    console.error(err)
    if (err.name === 'SyntaxError') {
      return res.status(502).json({ error: 'AI grading failed — please try again' })
    }
    res.status(500).json({ error: 'Submission failed' })
  }
})

// ── GET /api/writing/submissions/:id ─────────────────────────────────────────
router.get('/submissions/:id', authenticate, async (req, res) => {
  try {
    const submission = await db('writing_submissions')
      .where({ id: req.params.id, user_id: req.user.id })
      .first()

    if (!submission) return res.status(404).json({ error: 'Submission not found' })

    submission.feedback_json = typeof submission.feedback_json === 'string'
      ? JSON.parse(submission.feedback_json)
      : submission.feedback_json

    res.json(submission)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get submission' })
  }
})

// ── GET /api/writing/submissions (history) ────────────────────────────────────
router.get('/submissions', authenticate, async (req, res) => {
  try {
    const submissions = await db('writing_submissions')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(20)
      .select('id', 'lesson_id', 'word_count', 'band_score', 'time_spent', 'created_at')

    res.json(submissions)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to get submissions' })
  }
})

module.exports = router
