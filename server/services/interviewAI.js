const { GoogleGenAI } = require("@google/genai")
const Groq = require("groq-sdk")

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})


const createPrompt = ({ job, resume, previousQuestions = [] }) => {
  const previousQuestionsText =
    previousQuestions.length > 0
      ? previousQuestions
          .map((question, index) => `${index + 1}. ${question}`)
          .join("\n")
      : "No previous interview questions."

  return `
You are a technical interviewer.

Generate 5 interview questions for the candidate based on
the job and resume information below.

JOB TITLE:
${job.title}

COMPANY:
${job.company}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS:
${job.skills.join(", ")}

CANDIDATE RESUME:
${resume.rawText}

PREVIOUSLY ASKED QUESTIONS:
${previousQuestionsText}

Requirements:

1. Generate exactly 5 questions.
2. Generate practical questions relevant to this specific job.
3. Include technical questions based on the required skills.
4. Include at least one project-based question based on the candidate's resume.
5. Include one problem-solving or debugging question.
6. Do not ask about completely unrelated technologies.
7. Do not repeat any previously asked question.
8. You may ask about the same concept in a different way if useful.
9. Use the candidate's actual resume information.
10. Do not invent projects, technologies, or experience.
11. Questions should be suitable for a fresher technical interview.
12. Return ONLY valid JSON.

Required format:

{
  "questions": [
    {"question": "Question 1"},
    {"question": "Question 2"},
    {"question": "Question 3"},
    {"question": "Question 4"},
    {"question": "Question 5"}
  ]
}
`
}


const parseAIResponse = (text) => {
  let cleanedText = text.trim()

  if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim()
  }

  return JSON.parse(cleanedText)
}


const generateWithGemini = async (prompt) => {
  console.log("Trying Gemini...")

  const response = await gemini.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  })

  return parseAIResponse(response.text)
}


const generateWithGroq = async (prompt) => {
  console.log("Trying Groq fallback...")

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "You are a technical interviewer. Return only valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_completion_tokens: 1000
  })

  return parseAIResponse(
    response.choices[0].message.content
  )
}

const generateInterviewQuestions = async ({
  job,
  resume,
  previousQuestions = []
}) => {
  const prompt = createPrompt({
    job,
    resume,
    previousQuestions
  })

  try {
    return await generateWithGemini(prompt)
  } catch (geminiError) {
    console.error(
      "Gemini failed:",
      geminiError.message
    )

    console.log(
      "Switching to Groq fallback..."
    )

    try {
      return await generateWithGroq(prompt)
    } catch (groqError) {
      console.error(
        "Groq fallback failed:",
        groqError.message
      )

      throw new Error(
        "Both Gemini and Groq AI services failed"
      )
    }
  }
}


module.exports = {
  generateInterviewQuestions
}