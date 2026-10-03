import React, { useState } from 'react'
import "../style/interview.scss"

const TABS = [
  { id: "technical", label: "Technical questions", key: "technicalQuestions" },
  { id: "behavioral", label: "Behavioral questions", key: "behavioralQuestions" },
  { id: "roadmap", label: "Road Map", key: "preparationPlan" },
]

// Assumed item shapes (adjust the field names if your schema differs):
//   questions:      { question, intention, answer }
//   skillGaps:      { skill, severity: "low" | "medium" | "high" }  (plain strings also work)
//   preparationPlan:{ day, focus, tasks: [string] }
// TODO: remove this sample and pass the real report as the `report` prop.
const sampleReport = {
  title: "Software Developer (Full Stack)",
  matchScore: 85,
  technicalQuestions: [
    { question: "How would you design a REST API for a resume analyzer?", intention: "Tests API design, resource modelling and error handling.", answer: "Start from resources (users, resumes, reports), use proper verbs and status codes, then cover validation, auth and pagination." },
    { question: "Explain how the event loop works in Node.js.", intention: "Checks your understanding of async behaviour behind your Express projects.", answer: "Describe the call stack, callback queue and microtasks, then give an example of why blocking the loop hurts throughput." },
  ],
  behavioralQuestions: [
    { question: "Tell me about a time you received critical client feedback.", intention: "Looks for ownership and how you handle pressure.", answer: "Use STAR: describe the situation, what you changed, and the measurable result." },
  ],
  skillGaps: [
    { skill: "Java Spring Boot (Professional Depth)", severity: "medium" },
    { skill: "Docker & AWS (Deployment)", severity: "medium" },
    { skill: "Microservices Architecture", severity: "low" },
    { skill: "Unit Testing (JUnit/Mockito)", severity: "medium" },
  ],
  preparationPlan: [
    { day: 1, focus: "Node.js internals", tasks: ["Read about the event loop phases", "Build a small queue worker"] },
    { day: 2, focus: "Caching with Redis", tasks: ["Add Redis caching to a project", "Practice cache invalidation questions"] },
  ],
}

const ScoreRing = ({ score }) => {
  const value = Math.max(0, Math.min(100, Number(score) || 0))
  const level = value >= 75 ? "good" : value >= 50 ? "fair" : "low"

  return (
    <div className={`score ${level}`} role="img" aria-label={`Match score ${value} out of 100`}>
      <svg className="score-ring" viewBox="0 0 36 36" aria-hidden="true">
        <circle className="track" cx="18" cy="18" r="15.9155" />
        <circle className="bar" cx="18" cy="18" r="15.9155" strokeDasharray={`${value} 100`} />
      </svg>
      <div className="score-text">
        <strong>{value}</strong>
        <span>% match</span>
      </div>
    </div>
  )
}

const EmptyState = ({ label }) => (
  <div className="empty-state">
    <p>No {label.toLowerCase()} yet.</p>
  </div>
)

const QuestionList = ({ items, label }) => {
  const [open, setOpen] = useState(0)

  if (!items.length) return <EmptyState label={label} />

  return (
    <ul className="question-list">
      {items.map((q, i) => (
        <li key={i} className={`question-card ${open === i ? 'open' : ''}`} style={{ '--i': i }}>
          <button className="question-head" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span className="q-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="q-text">{q.question}</span>
            <span className="q-chevron" aria-hidden="true" />
          </button>
          <div className="question-body">
            <div className="question-body-inner">
              {q.intention && <section><h4>Why they ask</h4><p>{q.intention}</p></section>}
              {q.answer && <section><h4>How to answer</h4><p>{q.answer}</p></section>}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

const RoadMap = ({ items }) => {
  if (!items.length) return <EmptyState label="road map" />

  return (
    <ol className="roadmap">
      {items.map((d, i) => (
        <li key={i} style={{ '--i': i }}>
          <span className="day">Day {d.day ?? i + 1}</span>
          <div className="day-body">
            <h3>{d.focus}</h3>
            {d.tasks?.length > 0 && <ul>{d.tasks.map((t, j) => <li key={j}>{t}</li>)}</ul>}
          </div>
        </li>
      ))}
    </ol>
  )
}

const Interview = ({ report: data = sampleReport }) => {
  const [active, setActive] = useState("technical")
  const report = data.interviewReport ?? data

  const tab = TABS.find((t) => t.id === active)
  const items = report[tab.key] || []
  const skillGaps = (report.skillGaps || []).map((s) => (typeof s === "string" ? { skill: s } : s))

  return (
    <main className="interview">
      <div className="interview-shell">

        <aside className="sidebar-left">
          <div className="report-head">
            <p className="eyebrow">Interview Report</p>
            <h1 className="report-title">{report.title || "Your interview prep"}</h1>
            {report.matchScore != null && <ScoreRing score={report.matchScore} />}
          </div>
          <nav>
            {TABS.map((t) => (
              <button key={t.id} className={`nav-item ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
                <span>{t.label}</span>
                <small className="count">{(report[t.key] || []).length}</small>
              </button>
            ))}
          </nav>
        </aside>

        <section className="content">
          <header className="content-head">
            <h2>{tab.label}</h2>
            <span>{items.length} {items.length === 1 ? "item" : "items"}</span>
          </header>

          <div className="content-body" key={active}>
            {active === "roadmap"
              ? <RoadMap items={items} />
              : <QuestionList items={items} label={tab.label} />}
          </div>
        </section>

        <aside className="sidebar-right">
          <h3>Skill Gaps</h3>
          {skillGaps.length === 0
            ? <p className="muted">No skill gaps found.</p>
            : (
              <ul className="chips">
                {skillGaps.map((s, i) => (
                  <li key={i} className={`chip ${s.severity || 'medium'}`} style={{ '--i': i }} title={s.severity ? `${s.severity} priority` : undefined}>
                    {s.skill}
                  </li>
                ))}
              </ul>
            )}
          {skillGaps.length > 0 && (
            <ul className="legend" aria-label="Priority legend">
              <li className="high">High</li>
              <li className="medium">Medium</li>
              <li className="low">Low</li>
            </ul>
          )}
        </aside>

      </div>
    </main>
  )
}

export default Interview