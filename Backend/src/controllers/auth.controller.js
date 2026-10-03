const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")


/**
 * @route registerUserController
 * @description register a new user, expects username, email and password in the request body.
 * Does NOT log the user in: they sign in from the login page afterwards.
 * @access Public
 */
async function registerUserController(req,res)
{
    try {
        const {username, email, password} = req.body
     
        if(!username || !email || !password)
        {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const emailTaken = await userModel.findOne({ email })

        if(emailTaken)
        {
            return res.status(409).json({
                message: "This email is already registered. Try logging in instead."
            })
        }

        const usernameTaken = await userModel.findOne({ username })

        if(usernameTaken)
        {
            return res.status(409).json({
                message: "This username is already taken. Please choose another one."
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        // no token / cookie here on purpose: the user logs in after registering

        res.status(201).json({
            message: "Account created successfully. Please log in.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch(err) {
        // two requests with the same email at the same moment: the unique index rejects the second
        if(err.code === 11000)
        {
            const field = Object.keys(err.keyPattern || {})[0]
            return res.status(409).json({
                message: field === "username"
                    ? "This username is already taken. Please choose another one."
                    : "This email is already registered. Try logging in instead."
            })
        }

        console.error("Registration error:", err)
        res.status(500).json({
            message: "Internal server error during registration"
        })
    }
}


/**
 * @route loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req,res){
    try {
        const {email , password} = req.body;

        const user = await userModel.findOne({ email }) 

        if(!user)
        {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid)
        {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )
        res.cookie("token",token)
        res.status(200).json({
            message: "User logged in successfully",
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            }
        })
    } catch(err) {
        console.error("Login error:", err)
        res.status(500).json({
            message: "Internal server error during login"
        })
    }
}

/**
 * @route logoutUserController
 * @description logout a user, clears the token from cookies and adds it to the blacklist
 * @access Public
 */
async function logoutUserController(req,res){
    try {
        const token = req.cookies.token;

        if (token) {
            await tokenBlackListModel.create({token});
        }

        res.clearCookie("token")

        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch(err) {
        console.error("Logout error:", err)
        res.status(500).json({
            message: "Internal server error during logout"
        })
    }
}

/**
 * @route getMeController
 * @description get the details of the logged in user
 * @access Private
 */
async function getMeController(req,res)
{
    try {
        const user = await userModel.findById(req.user.id)

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch(err) {
        console.error("Get me error:", err)
        res.status(500).json({
            message: "Internal server error fetching user details"
        })
    }
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}