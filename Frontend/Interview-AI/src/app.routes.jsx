import { createBrowserRouter } from "react-router";
import Login from "./Features/auth/pages/login.jsx";
import Register from "./Features/auth/pages/register.jsx";
import Protected from "./Features/auth/components/protected.jsx";
import Home from "./Features/Interview/pages/Home.jsx"

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
        element:<Protected><Home/></Protected>
    }
])