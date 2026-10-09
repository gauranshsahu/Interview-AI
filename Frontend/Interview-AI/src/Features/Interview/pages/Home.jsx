import React, { useState } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {
  const { loading, generateReport } = useInterview()
  const navigate = useNavigate()

  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState("")

  // used by both the file picker and drag & drop
  // (a dropped file never reaches the <input>, so the file is kept in state)
  const handleFile = (file) => {
    if (!file) return
    if (file.type !== "application/pdf") {
      setError("Please upload your resume as a PDF.")
      return
    }
    setError("")
    setResumeFile(file)
  }

  const handleGenerateReport = async () => {
    if (!jobDescription.trim()) return setError("Please add the job description.")
    if (!resumeFile) return setError("Please upload your resume (PDF).")

    setError("")
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })

    if (!data?._id) return setError("Could not generate the report. Please try again.")
    navigate(`/interview/${data._id}`)
  }

  return (
    <main className='home'>
      <div className="interview-input-group">
        <header className="intro">
          <h1>Prepare for the interview before it starts</h1>
          <p>Add the role, your resume or a short description of yourself, and get a tailored interview report.</p>
        </header>

        <div className="left">
          <div className="field">
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
            <span className="counter">{jobDescription.length} characters</span>
          </div>
        </div>

        <div className="right">
          <div className="input-group">
            <p>Resume <small className='highlight'>Use resume and self description together for best results</small></p>
            <label
              className={`file-label ${dragging ? 'dragging' : ''} ${resumeFile ? 'has-file' : ''}`}
              htmlFor="resume"
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>
              <span>{resumeFile?.name || "Upload resume (PDF) or drop it here"}</span>
            </label>
            <input hidden type="file" name="resume" id="resume" accept=".pdf" onChange={(e) => handleFile(e.target.files[0])} />
          </div>

          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>
            <textarea
              name="selfDescription"
              id="selfDescription"
              placeholder="Describe yourself in a few sentences..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            ></textarea>
            <span className="counter">{selfDescription.length} characters</span>
          </div>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button onClick={handleGenerateReport} disabled={loading} className="button primary-button">
            {loading ? "Generating report..." : "Generate Interview Report"}
          </button>
          {loading && <p className="form-hint" role="status">Analysing your resume. This can take a little while.</p>}
        </div>
      </div>
    </main>
  )
}

export default Home