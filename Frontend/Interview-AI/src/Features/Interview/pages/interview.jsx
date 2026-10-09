import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import "../style/interview.scss"
import { useInterview } from '../hooks/useInterview.js'
import { InterviewSkeleton } from '../../auth/components/Skeleton.jsx'

const TABS = [
  { id: "technical", label: "Technical questions", key: "technicalQuestions" },
  { id: "behavioral", label: "Behavioral questions", key: "behavioralQuestions" },
  { id: "roadmap", label: "Road Map", key: "preparationPlan" },
]

// Shape of the report returned by GET /api/interview/report/:interviewId
//   questions:       { question, intention, answer }
//   skillGaps:       { skill, severity: "low" | "medium" | "high" }
//   preparationPlan: { day, focus, tasks: [string] }

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

const NotFound = () => (
  <main className="interview">
    <div className="status-card">
      <h1>Report not found</h1>
      <p>We couldn't load this interview report. It may have been removed, or it belongs to another account.</p>
      <Link to="/">Back to home</Link>
    </div>
  </main>
)

const Interview = () => {
  const { interviewId } = useParams()
  const { report: loaded, getReportById } = useInterview()
  const [active, setActive] = useState("technical")
  const [failed, setFailed] = useState(false)

  // the report kept in context may belong to a different interview
  const report = loaded?._id === interviewId ? loaded : null

  useEffect(() => {
    if (report) return // just generated on the Home page, no need to fetch again

    let ignore = false
    setFailed(false)
    getReportById(interviewId).then((data) => {
      if (!ignore && !data) setFailed(true)
    })

    return () => { ignore = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId])

  if (!report) return failed ? <NotFound /> : <InterviewSkeleton />

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