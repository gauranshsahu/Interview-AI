import { useAuth } from "../hooks/useAuth";
import React from "react";
// import { useNavigate } from "react-router";
import { Navigate } from "react-router";
import { HomeSkeleton } from "./Skeleton";

const Protected = ({children}) =>{

    const { loading,user } = useAuth()
    // const navigate = useNavigate();
    if(loading)
    {
        return <HomeSkeleton />
    }

    if(!user){
        // navigate("/login");
        return <Navigate to={'/login'}/>
    }

    return children;
}

export default Protected;