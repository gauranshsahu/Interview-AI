import { createBrowserRouter } from "react-router";
import Login from "./Features/auth/pages/login.jsx";
import Register from "./Features/auth/pages/register.jsx";

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/register",
        element:<Register />
    }
])