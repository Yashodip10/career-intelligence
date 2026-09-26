const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#.]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const calculateKeywordMatch = (resumeSkills, jobSkills) => {
  if (!jobSkills || jobSkills.length === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: []
    }
  }

  const normalizedResumeSkills = resumeSkills.map(
    (skill) => normalizeText(skill)
  )

  const normalizedJobSkills = jobSkills.map(
    (skill) => normalizeText(skill)
  )

  const matchedSkills = []
  const missingSkills = []

  normalizedJobSkills.forEach((jobSkill, index) => {
    const originalJobSkill = jobSkills[index]

    const isMatched = normalizedResumeSkills.some(
      (resumeSkill) =>
        resumeSkill === jobSkill ||
        resumeSkill.includes(jobSkill) ||
        jobSkill.includes(resumeSkill)
    )

    if (isMatched) {
      matchedSkills.push(originalJobSkill)
    } else {
      missingSkills.push(originalJobSkill)
    }
  })

  const score = Math.round(
    (matchedSkills.length / normalizedJobSkills.length) *
      100
  )

  return {
    score,
    matchedSkills,
    missingSkills
  }
}

module.exports = {
  calculateKeywordMatch
}