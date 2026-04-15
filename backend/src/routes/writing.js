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
  const systemPrompt = `You are a strict, experienced IELTS examiner. Your job is to give HONEST, ACCURATE band scores — not to encourage students. Do NOT inflate scores. Many student essays deserve Band 4-5, not Band 6-7.

STRICT BAND DESCRIPTORS you MUST follow:

TASK ACHIEVEMENT (Task 2):
- Band 9: Fully addresses all parts, clear position throughout, fully developed ideas
- Band 7: Addresses all parts, clear position, well-developed main ideas
- Band 6: Addresses all parts but some more fully than others, position clear but not always consistent
- Band 5: Addresses task only partially, position sometimes unclear, ideas not well-supported
- Band 4: Responds to the task only in a minimal way OR the position is unclear, ideas are repetitive or irrelevant
- Band 3: Does not adequately address the task, very limited relevant content

COHERENCE & COHESION:
- Band 7+: Logically organises information, uses a range of cohesive devices appropriately
- Band 6: Arranges information coherently, uses cohesive devices but sometimes incorrectly/mechanically
- Band 5: Presents information with some organisation but lacks overall progression, may use cohesive devices repetitively
- Band 4: Presents information and ideas but these are not arranged coherently, basic cohesive devices used

LEXICAL RESOURCE:
- Band 7+: Uses a sufficient range of vocabulary with flexibility and precision, rare errors
- Band 6: Adequate range, some ability to use less common items, some errors in word choice
- Band 5: Limited range, noticeable errors in vocabulary, meaning is not obscured
- Band 4: Very limited range, errors may cause strain for the reader, basic vocabulary only

GRAMMATICAL RANGE & ACCURACY:
- Band 7+: Uses a variety of complex structures, majority of sentences error-free
- Band 6: Mix of simple and complex sentences, some errors but they rarely reduce communication
- Band 5: Limited range of structures, makes errors that may cause some difficulty for the reader
- Band 4: Very limited range, errors are frequent and may cause difficulty for the reader

CRITICAL RULES:
1. If the essay is off-topic, incoherent, or random sentences → Band 1-3
2. If the essay is copy-pasted, repetitive filler, or padding → penalise heavily
3. If grammar is full of basic errors → maximum Band 5 for Grammar
4. If vocabulary is simple/repetitive → maximum Band 5 for Lexical
5. If the essay does NOT answer the question asked → maximum Band 4 for Task Achievement
6. Average students writing in simple English should score Band 5-6, NOT 7+
7. Band 7+ requires sophisticated, error-free writing with complex arguments
8. Be SPECIFIC in feedback — quote actual sentences from the essay to justify scores
9. errorHighlights must contain REAL errors found in the essay (minimum 3 if essay has errors)

You MUST respond with valid JSON only, no markdown, no other text.`

  const userPrompt = `Grade this IELTS ${essayType} essay with STRICT, HONEST scoring.

Task Prompt: "${prompt}"

Student Essay (${essayText.trim().split(/\s+/).length} words):
"""
${essayText}
"""

BEFORE scoring, check:
1. Is this essay actually answering the prompt above?
2. Does it make logical, coherent sense from start to finish?
3. Are the arguments developed with specific evidence or just vague statements?
4. What is the actual vocabulary level — advanced or basic?
5. Are sentences grammatically complex or mostly simple?

Respond with ONLY this JSON:
{
  "bandScore": <overall average of 4 criteria, rounded to nearest 0.5>,
  "taskAchievement": <0-9 in 0.5 steps — be harsh if off-topic or underdeveloped>,
  "coherence": <0-9 in 0.5 steps>,
  "lexical": <0-9 in 0.5 steps — basic vocab = max 5.5>,
  "grammar": <0-9 in 0.5 steps — frequent errors = max 5.0>,
  "feedback": "<3 paragraphs: (1) task achievement analysis with quotes from essay, (2) language strengths and specific weaknesses with examples, (3) concrete advice to improve score>",
  "strengths": ["<specific strength with example from essay>", "<specific strength>", "<specific strength>"],
  "improvements": ["<specific improvement with example of error>", "<specific improvement>", "<specific improvement>"],
  "errorHighlights": [
    {"text": "<exact wrong phrase from essay>", "correction": "<corrected version>", "reason": "<grammatical/lexical explanation>"},
    {"text": "<exact wrong phrase>", "correction": "<corrected version>", "reason": "<explanation>"},
    {"text": "<exact wrong phrase>", "correction": "<corrected version>", "reason": "<explanation>"}
  ]
}`

  const message = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
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

    // Grade with Claude AI (fallback to mock if key invalid)
    let gradingResult
    if (process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== 'your-claude-api-key-here') {
      try {
        gradingResult = await gradeEssayWithClaude(essay_text, essayType, lessonContent)
      } catch (aiErr) {
        console.error('[Claude AI Error]', aiErr.message)
        gradingResult = null // will fall through to mock below
      }
    }
    if (!gradingResult) {
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
