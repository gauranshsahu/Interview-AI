import { createBrowserRouter } from "react-router";
import Login from "./Features/auth/pages/login.jsx";
import Register from "./Features/auth/pages/register.jsx";
import Protected from "./Features/auth/components/protected.jsx";

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/register",
        element:<Register />
    },
    {
        path:"/",
        element:<Protected><h1>Home Page</h1></Protected>
    }
])