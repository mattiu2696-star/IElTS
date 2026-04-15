const bcrypt = require('bcryptjs')

exports.seed = async function (knex) {
  // Clear tables
  await knex('writing_submissions').del()
  await knex('user_vocab_progress').del()
  await knex('user_progress').del()
  await knex('scores').del()
  await knex('vocabulary_words').del()
  await knex('lessons').del()
  await knex('users').del()

  // Seed users
  const hash = await bcrypt.hash('password123', 12)
  const [user] = await knex('users').insert([
    { name: 'Demo User', email: 'demo@ielts-hub.com', password_hash: hash, level: 'Intermediate', email_verified: true },
    { name: 'Admin',     email: 'admin@ielts-hub.com', password_hash: hash, level: 'Advanced', is_admin: true, email_verified: true },
  ]).returning('*')

  // Seed lessons
  await knex('lessons').insert([
    {
      type: 'Writing', title: 'Opinion Essay — Technology', difficulty: 'Medium', topic: 'Technology',
      min_words: 250, time_limit: 40,
      content: 'Some people believe that technology has made our lives more complicated. Others think it has made life easier. Discuss both views and give your own opinion.',
      model_answer: 'Technology has undeniably transformed our daily lives in profound ways. While some argue that this transformation has introduced unnecessary complexity, I believe the benefits significantly outweigh the drawbacks.\n\nOn one hand, critics point to information overload as a primary concern. The constant barrage of notifications can overwhelm individuals, making it difficult to focus on meaningful tasks. Furthermore, our growing dependence on devices means that technical failures can disrupt our lives dramatically.\n\nNevertheless, technology has simplified our lives in more ways than it has complicated them. Communication has never been more convenient — we can instantly connect with people across the globe. Access to information has been democratised, and routine tasks such as banking and navigation have been streamlined.\n\nIn conclusion, while technology does introduce some complications, its capacity to enhance productivity and improve communication makes it an overwhelmingly positive force. The key lies in using technology mindfully.',
    },
    {
      type: 'Writing', title: 'Discussion Essay — Education', difficulty: 'Hard', topic: 'Education',
      min_words: 250, time_limit: 40,
      content: 'Some people think that university education should be free for all students. Others believe students should pay tuition fees. Discuss both views and give your opinion.',
      model_answer: 'The question of whether university education should be funded by the state or by individual students is one that provokes considerable debate...',
    },
    {
      type: 'Writing', title: 'Bar Chart Description', difficulty: 'Easy', topic: 'Academic',
      min_words: 150, time_limit: 20,
      content: 'The bar chart below shows the percentage of people who used different types of transport in a city in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      model_answer: 'The bar chart illustrates how transport usage changed in a city between 2010 and 2020...',
    },
    {
      type: 'Writing', title: 'Problem-Solution Essay', difficulty: 'Hard', topic: 'Society',
      min_words: 250, time_limit: 40,
      content: 'In many cities, traffic congestion is a serious problem. What are the causes of this problem, and what measures could be taken to reduce it?',
      model_answer: 'Traffic congestion has become one of the most pressing urban challenges of the 21st century...',
    },
    {
      type: 'Writing', title: 'Agree/Disagree Essay — Environment', difficulty: 'Medium', topic: 'Environment',
      min_words: 250, time_limit: 40,
      content: 'The most important way to solve environmental problems is for individuals to make changes in their daily lives. To what extent do you agree or disagree?',
      model_answer: 'While individual action plays a role in addressing environmental challenges, I disagree that it represents the most important solution...',
    },
  ])

  // Seed vocabulary
  await knex('vocabulary_words').insert([
    { word: 'ubiquitous',   level: 'C1', topic: 'Technology',   definition: 'Present, appearing, or found everywhere',                         example_sentence: 'Mobile phones have become ubiquitous in modern society.' },
    { word: 'mitigate',     level: 'C1', topic: 'Environment',  definition: 'To make less severe, serious, or painful',                        example_sentence: 'Governments implemented policies to mitigate climate change effects.' },
    { word: 'proliferate',  level: 'C2', topic: 'Technology',   definition: 'To increase rapidly in number; multiply',                         example_sentence: 'Social media platforms continue to proliferate globally.' },
    { word: 'exacerbate',   level: 'C2', topic: 'Environment',  definition: 'To make a bad situation worse',                                   example_sentence: 'Poor waste management can exacerbate environmental pollution.' },
    { word: 'paramount',    level: 'C1', topic: 'Education',    definition: 'More important than anything else; supreme',                      example_sentence: 'Education is of paramount importance for development.' },
    { word: 'alleviate',    level: 'B2', topic: 'Health',       definition: 'To make something bad less severe',                               example_sentence: 'Healthcare reforms aim to alleviate the burden on hospitals.' },
    { word: 'pragmatic',    level: 'C1', topic: 'Education',    definition: 'Dealing with things sensibly and realistically',                  example_sentence: 'A pragmatic approach to education focuses on practical skills.' },
    { word: 'detrimental',  level: 'B2', topic: 'Health',       definition: 'Tending to cause harm',                                          example_sentence: 'Excessive screen time can be detrimental to development.' },
    { word: 'sustainable',  level: 'B2', topic: 'Environment',  definition: 'Able to be maintained at a certain rate or level',                example_sentence: 'Sustainable development meets present needs without compromising the future.' },
    { word: 'inequitable',  level: 'C1', topic: 'Society',      definition: 'Not fair or reasonable',                                         example_sentence: 'The report highlighted inequitable distribution of educational resources.' },
    { word: 'autonomous',   level: 'C1', topic: 'Technology',   definition: 'Having the freedom to govern itself or control its own affairs',  example_sentence: 'Autonomous vehicles are transforming the transport industry.' },
    { word: 'bureaucratic', level: 'C1', topic: 'Society',      definition: 'Relating to a system of complicated official rules and processes', example_sentence: 'The bureaucratic process delayed the approval of new policies.' },
  ])
}
