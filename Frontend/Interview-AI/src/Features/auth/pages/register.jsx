import React, { useState } from 'react';
import "../auth.form.scss"
import { useNavigate,Link } from 'react-router';
import { AuthSkeleton } from '../components/Skeleton';
import {useAuth} from '../hooks/useAuth';

const Register = () => {

    const navigate = useNavigate()
    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [error, setError] = useState("")

    const {loading,handleRegister} = useAuth()

        const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleRegister({username,email,password})
        if(result.ok){
            navigate("/login")
        } else {
            setError(result.message)
        }
    }

    if(loading){
        return <AuthSkeleton fields={3} />
    }

    return (
        <main className="auth">
            <div className="form-container">
                <h1>Register</h1>
                <p className="subtitle">Create an account to start preparing for interviews.</p>

                <form onSubmit={handleSubmit}>

                    {error && <p className="form-message error" role="alert">{error}</p>}

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input 
                        value={username}
                        onChange={(e)=>{setUsername(e.target.value)}}
                        type="text" id="username" name='username' placeholder='Enter Username' />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value); setError("")}}
                        type="email" id="email" name='email' placeholder='Enter Email Address' />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                        value={password}
                        onChange={(e)=>{setpassword(e.target.value)}}
                        type="password" id="password" name='password' placeholder='Enter Password' />
                    </div>

                    <button className='button primary-button'>Register</button>

                </form>

                <p>Already have an account? <Link to={"/login"}>Login</Link> </p>
            </div>
        </main>
    );
}

export default Register;