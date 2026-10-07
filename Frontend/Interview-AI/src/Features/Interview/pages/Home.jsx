import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
const Home = () => {
  const {loading,generateReport} = useInterview()
  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const [resumeName, setResumeName] = useState("")
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") setResumeName(file.name)
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
              className={`file-label ${dragging ? 'dragging' : ''} ${resumeName ? 'has-file' : ''}`}
              htmlFor="resume"
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>
              <span>{resumeName || "Upload resume (PDF) or drop it here"}</span>
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

          <button className="button primary-button">Generate Interview Report</button>
        </div>
      </div>
    </main>
  )
}

export default Home