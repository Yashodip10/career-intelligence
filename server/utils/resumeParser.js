const skillList = [
  "JavaScript",
  "Java",
  "Python",
  "C",
  "C++",
  "C#",
  "HTML",
  "HTML5",
  "CSS",
  "CSS3",
  "React",
  "React.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "MySQL",
  "SQL",
  "REST APIs",
  "Bootstrap",
  "Tailwind CSS",
  "Git",
  "GitHub",
  "Docker",
  "AWS",
  "Spring Boot",
  "Maven",
  "PHP",
  "TypeScript",
  "Next.js",
  "Angular",
  "Vue.js",
  "Firebase",
  "PostgreSQL",
  "Redis"
]

const extractEmail = (text) => {
  const match = text.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  )

  return match ? match[0] : ""
}

const extractPhone = (text) => {
  const match = text.match(
    /(?:\+91[\s-]?)?[6-9]\d{9}/
  )

  return match ? match[0] : ""
}

const extractName = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return ""
  }

  return lines[0]
}

const extractSkills = (text) => {
  const lowerText = text.toLowerCase()

  const foundSkills = skillList.filter((skill) =>
    lowerText.includes(skill.toLowerCase())
  )

  return [...new Set(foundSkills)]
}

const extractSection = (text, sectionName, nextSections) => {
  const lines = text.split("\n")

  const startIndex = lines.findIndex(
    (line) =>
      line.trim().toLowerCase() ===
      sectionName.toLowerCase()
  )

  if (startIndex === -1) {
    return []
  }

  const sectionLines = []

  for (
    let i = startIndex + 1;
    i < lines.length;
    i++
  ) {
    const currentLine = lines[i].trim()

    const isNextSection = nextSections.some(
      (section) =>
        currentLine.toLowerCase() ===
        section.toLowerCase()
    )

    if (isNextSection) {
      break
    }

    if (currentLine) {
      sectionLines.push(currentLine)
    }
  }

  return sectionLines
}

const parseResume = (text) => {
  const education = extractSection(
    text,
    "Education",
    [
      "Experience",
      "Projects",
      "Technical Skills",
      "Certifications & Training",
      "Achievements"
    ]
  )

  const projects = extractSection(
    text,
    "Projects",
    [
      "Technical Skills",
      "Certifications & Training",
      "Achievements"
    ]
  )

  const experience = extractSection(
    text,
    "Experience",
    [
      "Projects",
      "Technical Skills",
      "Certifications & Training",
      "Achievements"
    ]
  )

  const certifications = extractSection(
    text,
    "Certifications & Training",
    [
      "Achievements"
    ]
  )

  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    education,
    skills: extractSkills(text),
    projects,
    experience,
    certifications
  }
}

module.exports = parseResume