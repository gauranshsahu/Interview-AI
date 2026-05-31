const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")


/**
 * @route registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req,res)
{
    const {username, email, password} = req.body

    if(!username || !email || !password)
    {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ {username: username} , {email} ]
    })

    if(isUserAlreadyExists)
    {
        return res.status(400).json({
            message: "Account already exists with this username or email address"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token",token)

    res.status(201).json({
        message: "User registered Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @route loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req,res){

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
}

/**
 * @route logoutUserController
 * @description logout a user, clears the token from cookies and adds it to the blacklist
 * @access Public
 */
async function logoutUserController(req,res){
    const token = req.cookies.token;

    if (token) {
        await tokenBlackListModel.create({token});
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @route getMeController
 * @description get the details of the logged in user
 * @access Private
 */
async function getMeController(req,res)
{
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}