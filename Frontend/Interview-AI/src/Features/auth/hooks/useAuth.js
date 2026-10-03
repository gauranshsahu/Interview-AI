import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api"
import { useEffect } from "react";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try{
            const data = await login(email, password)
            setUser(data.user)
        }
        catch(err){
            console.error("Login error:", err)
        }
        finally{
            setLoading(false)
        }
    }

    // Registering no longer logs the user in: it returns { ok, message } and the
    // user signs in from the login page afterwards.
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try{
            const data = await register(username, email, password)
            if(!data) return { ok: false, message: "Registration failed. Please try again." }
            if(data.error) return { ok: false, message: data.error }
            return { ok: true }
        }
        catch(err){
            console.error("Register error:", err)
            return { ok: false, message: "Something went wrong. Please try again." }
        }
        finally{
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try{
            const data = await logout()
            setUser(null)
        }
        catch(err){
            console.error("Logout error:", err)
        }
        finally{
            setLoading(false)
        }
    }


// until the token is present in the cookies this function will redirect the user to the home page but if the token is not present then the user will redirect to login

        useEffect(()=>{
    
            const getAndSetUser = async()=>{
                    try{
                        const data = await getMe()
                        if(data && data.user){
                            setUser(data.user)
                        } else {
                            setUser(null)
                        }
                    }
                    catch(err){
                        console.error("getMe error:", err)
                        setUser(null)
                    }
                    finally{
                        setLoading(false)
                    }
            }
    
            getAndSetUser()
        },[])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}