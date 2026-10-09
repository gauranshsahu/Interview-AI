import React from 'react'
import "../skeleton.scss"

const Bar = ({ w = "100%", h = "1rem", r, className = "" }) => (
    <span
        className={`sk ${className}`}
        style={{ width: w, ...(h && { height: h }), ...(r && { borderRadius: r }) }}
    />
)

// Matches the Login / Register card (fields = 2 for login, 3 for register)
export const AuthSkeleton = ({ fields = 2 }) => (
    <main className="sk-page" role="status" aria-busy="true" aria-label="Loading">
        <div className="sk-card sk-auth">
            <Bar w="45%" h="2rem" />
            <Bar w="80%" h="0.9rem" />

            <div className="sk-form">
                {Array.from({ length: fields }).map((_, i) => (
                    <div className="sk-group" key={i}>
                        <Bar w="30%" h="0.85rem" />
                        <Bar h="2.9rem" r="0.6rem" />
                    </div>
                ))}
                <Bar h="3rem" r="0.6rem" />
            </div>

            <Bar w="60%" h="0.85rem" className="sk-center" />
        </div>
    </main>
)

// Matches the Home card (job description | resume + self description)
export const HomeSkeleton = () => (
    <main className="sk-page" role="status" aria-busy="true" aria-label="Loading">
        <div className="sk-card sk-home">
            <div className="sk-intro">
                <Bar w="55%" h="2.2rem" />
                <Bar w="75%" h="0.9rem" />
            </div>

            <div className="sk-col">
                <Bar w="35%" h="0.9rem" />
                <Bar h={null} r="0.6rem" className="sk-grow" />
            </div>

            <div className="sk-col">
                <Bar w="30%" h="0.9rem" />
                <Bar h="3rem" r="0.6rem" />
                <Bar w="35%" h="0.9rem" />
                <Bar h={null} r="0.6rem" className="sk-grow" />
                <Bar h="3rem" r="0.6rem" />
            </div>
        </div>
    </main>
)

// Matches the interview report page (nav | content | skill gaps)
export const InterviewSkeleton = () => (
    <main className="sk-page" role="status" aria-busy="true" aria-label="Loading">
        <div className="sk-card sk-interview">
            <div className="sk-side">
                <Bar w="30%" h="0.75rem" />
                <Bar w="85%" h="1.4rem" />
                <Bar w="7rem" h="7rem" r="50%" />
                {Array.from({ length: 3 }).map((_, i) => <Bar key={i} h="2.8rem" r="0.6rem" />)}
            </div>

            <div className="sk-main">
                <Bar w="50%" h="1.9rem" />
                {Array.from({ length: 4 }).map((_, i) => <Bar key={i} h="4rem" r="0.8rem" />)}
            </div>

            <div className="sk-side">
                <Bar w="40%" h="0.8rem" />
                <div className="sk-chips">
                    {["7rem", "9rem", "6rem", "8rem"].map((w, i) => <Bar key={i} w={w} h="2rem" r="0.9rem" />)}
                </div>
            </div>
        </div>
    </main>
)