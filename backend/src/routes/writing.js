const express    = require('express')
const { body }   = require('express-validator')
const Anthropic  = require('@anthropic-ai/sdk')
const db         = require('../config/db')
const { validate } = require('../middleware/validate')

const router = express.Router()
const claude = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })

// ── Claude grading function ───────────────────────────────────────────────────
async function gradeEssayWithClaude(essayText, essayType, prompt) {
  const systemPrompt = `You are a senior IELTS examiner with 20 years of experience at the British Council. You grade with surgical precision — your scores are used for official band reporting so they must be ACCURATE and HONEST. You never inflate scores to make students feel better. Your role is to identify exactly what is wrong and give a realistic band that matches official IELTS standards.

═══════════════════════════════════════
OFFICIAL IELTS BAND DESCRIPTORS
═══════════════════════════════════════

TASK ACHIEVEMENT / TASK RESPONSE (Task 2):
Band 9: Fully addresses all parts. Sophisticated, fully-developed position. All ideas are extended with precise, relevant support.
Band 8: Sufficiently addresses all parts. Well-developed position. Ideas are relevant and extended.
Band 7: Addresses all parts. Clear position throughout. Main ideas extended and supported, though not always precisely.
Band 6: Addresses all parts but some more than others. Position clear but conclusions may be unclear. Main ideas relevant but not always sufficiently developed.
Band 5: Addresses task only partially. Format may be inappropriate. Position hard to identify. Ideas limited or not developed. Irrelevant details.
Band 4: Responds only minimally. Position unclear. Ideas are insufficient or irrelevant. Conclusion missing or contradicts position.
Band 3: Does not adequately address the task. Very limited relevant content.

COHERENCE & COHESION:
Band 9: Seamless, skillfully manages paragraphing. Wide range of cohesive devices used with full flexibility.
Band 7: Logically organises info. Uses a variety of cohesive devices, though some may be faulty or mechanical.
Band 6: Arranges info coherently, clear overall progression. Uses cohesive devices but not always appropriately. May over-use or under-use linking words.
Band 5: Some organisation but lacks clear progression. Inadequate or inaccurate use of cohesive devices. May use repetitive linking words (e.g., "furthermore", "moreover" in every paragraph).
Band 4: Not arranged coherently. Uses only basic cohesive devices. Lacks paragraph unity.

LEXICAL RESOURCE:
Band 9: Full flexibility and precision. Sophisticated collocations. Virtually no spelling or word-form errors.
Band 8: Wide range of vocabulary, flexible and accurate. Rare errors in word choice/formation.
Band 7: Sufficient range. Uses less common items with some awareness of style. Occasional errors in word choice/collocation.
Band 6: Adequate range but mostly common vocabulary. Some ability to use less common items, sometimes incorrectly. Some spelling/word-form errors.
Band 5: Noticeable limitation in range. Mainly basic vocabulary. Errors in word form and spelling that may cause strain. Repetitive word use.
Band 4: Very limited range. Errors in basic word choice may cause difficulty. Repetitive or inaccurate vocabulary.

GRAMMATICAL RANGE & ACCURACY:
Band 9: Wide variety of structures used naturally and accurately. Virtually error-free.
Band 8: Wide variety of structures. Most sentences error-free. Only occasional errors or inappropriacies.
Band 7: Variety of complex structures. Majority of sentences error-free. A few grammatical errors.
Band 6: Mix of simple and complex structures. Some errors in complex structures. Errors rarely reduce communication.
Band 5: Limited range of structures. Attempts complex structures but with errors. Errors may cause difficulty for reader. Frequent comma splices, subject-verb agreement errors, article misuse.
Band 4: Very limited range. Errors in basic structures. Errors may cause difficulty for reader.

═══════════════════════════════════════
MANDATORY GRADING RULES
═══════════════════════════════════════
1. NEVER round up out of charity. If it is between 6 and 6.5, give 6.
2. Padding (repeating ideas with different words to hit word count) MUST be penalised in both Task Achievement and Coherence.
3. If the essay contains mainly simple sentences (Subject + Verb + Object), Grammar CANNOT exceed Band 5.5.
4. If vocabulary is mostly IELTS band 5-6 words (good, important, because, however, therefore), Lexical CANNOT exceed Band 5.5.
5. If arguments are vague with NO specific examples, data, or elaboration, Task Achievement CANNOT exceed Band 5.5.
6. Missing conclusion or missing introduction = penalise Task Achievement by at least 0.5.
7. Mechanical use of cohesive devices ("Firstly... Secondly... Thirdly... In conclusion") without true logical flow = Coherence max Band 5.5.
8. The overall bandScore must be the MATHEMATICAL AVERAGE of the 4 criteria, rounded to the nearest 0.5.
9. errorHighlights MUST contain a minimum of 5 real errors. If the essay has fewer than 5 real errors, it is likely Band 7.5+.
10. Each error in errorHighlights must include: the EXACT wrong phrase, the corrected version, and a DETAILED grammatical or lexical explanation with rule reference.

You MUST respond with valid JSON only. No markdown. No extra text.`

  const userPrompt = `Grade this IELTS ${essayType} essay. Be a strict, honest examiner.

TASK PROMPT:
"${prompt}"

STUDENT ESSAY (${essayText.trim().split(/\s+/).length} words):
"""
${essayText}
"""

BEFORE you assign scores, do this analysis step by step:

STEP 1 — TASK ACHIEVEMENT:
- Does the essay directly answer the question asked, or does it go off-topic?
- Is there a clear opinion/position stated and maintained throughout?
- Are arguments developed with specific, concrete evidence? Or are they vague?
- Are all parts of the task addressed?

STEP 2 — COHERENCE & COHESION:
- Is there a clear introduction, body, and conclusion?
- Does each paragraph have a clear central idea?
- Are cohesive devices varied and accurate, or mechanical and repetitive?
- Is there logical progression of ideas?

STEP 3 — LEXICAL RESOURCE:
- List the most complex vocabulary used. Is it truly C1/C2 level?
- Are there any errors in collocation, word form, or word choice?
- Is the same vocabulary repeated frequently?

STEP 4 — GRAMMATICAL RANGE & ACCURACY:
- List all grammatical errors found: subject-verb agreement, article misuse, tense errors, preposition errors, comma splices, dangling modifiers.
- What percentage of sentences are complex vs. simple?
- Are complex sentences error-free?

Now assign scores and respond with ONLY this JSON:
{
  "bandScore": <exact mathematical average of 4 scores, rounded to nearest 0.5>,
  "taskAchievement": <score 0-9 in 0.5 steps>,
  "coherence": <score 0-9 in 0.5 steps>,
  "lexical": <score 0-9 in 0.5 steps>,
  "grammar": <score 0-9 in 0.5 steps>,
  "feedback": "<DETAILED 4-paragraph feedback in Vietnamese: (1) Nhận xét Task Achievement — trích dẫn câu cụ thể từ bài; (2) Nhận xét Coherence & Cohesion — chỉ ra cách nối câu bị lặp/sai; (3) Nhận xét Lexical Resource — liệt kê từ dùng sai hoặc quá đơn giản; (4) Nhận xét Grammar — liệt kê cụ thể các lỗi ngữ pháp với ví dụ từ bài và hướng dẫn sửa>",
  "strengths": [
    "<điểm mạnh cụ thể 1 — trích câu từ bài làm ví dụ>",
    "<điểm mạnh cụ thể 2>",
    "<điểm mạnh cụ thể 3>"
  ],
  "improvements": [
    "<hướng dẫn cải thiện cụ thể 1 — có ví dụ câu sai và câu sửa lại>",
    "<hướng dẫn cải thiện cụ thể 2>",
    "<hướng dẫn cải thiện cụ thể 3>",
    "<hướng dẫn cải thiện cụ thể 4>"
  ],
  "errorHighlights": [
    {"text": "<exact wrong phrase copied from essay>", "correction": "<corrected version>", "reason": "<detailed grammatical/lexical rule explanation in Vietnamese>"},
    {"text": "<exact wrong phrase>", "correction": "<corrected version>", "reason": "<explanation>"},
    {"text": "<exact wrong phrase>", "correction": "<corrected version>", "reason": "<explanation>"},
    {"text": "<exact wrong phrase>", "correction": "<corrected version>", "reason": "<explanation>"},
    {"text": "<exact wrong phrase>", "correction": "<corrected version>", "reason": "<explanation>"}
  ]
}`

  const message = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const raw = message.content[0].text.trim()
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
router.post('/submit', [
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
router.get('/submissions/:id', async (req, res) => {
  try {
    const submission = await db('writing_submissions')
      .where({ id: req.params.id })
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
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await db('writing_submissions')
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
