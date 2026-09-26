const { GoogleGenAI } = require("@google/genai")
const Groq = require("groq-sdk")

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

const createEvaluationPrompt = ({
  job,
  questions,
  answers
}) => {
  const interviewData = questions.map((question, index) => {
    const submittedAnswer =
      answers.find(
        (item) => item.questionIndex === index
      )?.answer?.trim() || ""

    return {
      questionIndex: index,
      question: question.question,
      answer: submittedAnswer
    }
  })

  return `
You are an experienced technical interviewer and interview preparation coach.

Evaluate the candidate's answers based on the job requirements.

IMPORTANT:
The candidate may leave some or all answers blank.

If an answer is blank:
- Score MUST be 0.
- Still provide complete learning material.
- Do NOT leave feedback empty.
- Do NOT leave recommendedAnswer empty.
- Do NOT leave explanation empty.
- Do NOT leave example empty.
- Do NOT leave rememberThis empty.
- Explain what the candidate should have answered.
- Provide a complete interview-ready answer.

Your goal is not only to score the candidate, but also to teach the candidate how to answer the question better in a real interview.

JOB TITLE:
${job.title}

COMPANY:
${job.company}

JOB DESCRIPTION:
${job.description}

REQUIRED SKILLS:
${job.skills.join(", ")}

INTERVIEW QUESTIONS AND ANSWERS:

${JSON.stringify(interviewData, null, 2)}

For EVERY question:

1. Give a score from 0 to 10.
2. Evaluate technical correctness.
3. Evaluate relevance.
4. Evaluate clarity.
5. Explain what the candidate did well.
6. Explain what the candidate should improve.
7. Provide a recommended interview answer.
8. The recommended answer must use simple, natural English suitable for a fresher.
9. The recommended answer should sound like something a candidate can actually speak in an interview.
10. Keep the recommended answer approximately 30 to 60 seconds when spoken.
11. Use the candidate's actual resume/project information when relevant.
12. Do not invent experience, projects, technologies, or achievements.
13. When useful, include a simple practical example.
14. Give a simple explanation of the concept.
15. Give a short "remember this" section.
16. If the candidate gives no answer, score exactly 0 but STILL provide all learning material.

For a blank answer, use feedback similar to:
"The candidate did not provide an answer. This question should be prepared before a technical interview."

Do not simply write "No answer provided" as the entire feedback.

For blank answers, the recommendedAnswer must be a complete answer that the candidate could actually speak in an interview.

Overall score:

Calculate totalScore as the average of all question scores.

Return ONLY valid JSON.

Required format:

{
  "totalScore": 0,
  "results": [
    {
      "questionIndex": 0,
      "answer": "",
      "score": 0,
      "feedback": "Complete feedback.",
      "recommendedAnswer": "Complete interview-ready answer.",
      "explanation": "Simple explanation of the concept.",
      "example": "Practical example.",
      "rememberThis": "Key point to remember."
    }
  ]
}

Important:

- Return exactly one result for every question.
- questionIndex must match the original question index.
- Scores must be numbers from 0 to 10.
- Blank answers MUST receive score 0.
- totalScore must be a number from 0 to 10.
- Every result MUST contain feedback, recommendedAnswer, explanation, example, and rememberThis.
- Do not include markdown outside the JSON.
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

const evaluateWithGemini = async (prompt) => {
  console.log("Trying Gemini for evaluation...")

  const response = await gemini.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  })

  return parseAIResponse(response.text)
}

const evaluateWithGroq = async (prompt) => {
  console.log("Trying Groq fallback for evaluation...")

  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content:
          "You are a technical interviewer and interview preparation coach. Return only valid JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2,
    max_completion_tokens: 5000
  })

  return parseAIResponse(
    response.choices[0].message.content
  )
}

const evaluateInterviewAnswers = async ({
  job,
  questions,
  answers
}) => {
  const prompt = createEvaluationPrompt({
    job,
    questions,
    answers
  })

  let evaluation

  try {
    evaluation = await evaluateWithGemini(prompt)
  } catch (geminiError) {
    console.error(
      "Gemini evaluation failed:",
      geminiError.message
    )

    console.log(
      "Switching to Groq evaluation fallback..."
    )

    try {
      evaluation = await evaluateWithGroq(prompt)
    } catch (groqError) {
      console.error(
        "Groq evaluation failed:",
        groqError.message
      )

      throw new Error(
        "Both Gemini and Groq evaluation services failed"
      )
    }
  }

  return evaluation
}

module.exports = {
  evaluateInterviewAnswers
}