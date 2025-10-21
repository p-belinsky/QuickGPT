import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import Chat from "../models/Chat.js"


const gernerateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}


export const registerUser = async (req, res) => {
    
    const {name, email, password} = req.body
    
    try {
        const userExists = await User.findOne({email})
        if (userExists) {
            res.json({
                success: false,
                message: "User already exists"
            })
        }

        const user = await User.create({
            name,
            email,
            password
        })

        const token = gernerateToken(user._id)

        res.json({
            success: true,
            token           
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    
    const {email, password} = req.body

    try {
        const user= await User.findOne({email})
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const token = gernerateToken(user._id)
                return res.json({
                    success: true,
                    token
                })
        }
    }
    return res.json({
        success: false,
        message: "Invalid email or password"
    })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })        
    }
}

export const getUser = async (req, res) => {

    try{
        const user = req.user;
        return res.json({
            success: true,
            user
        })

    }catch(error){
        return res.json({
            success: false,
            message: error.message
        })
    }



}

export const getPublishedImages = async (req, res) => {
    try {
     
        const publishedImageMessages = await Chat.aggregate([
            {$unwind: "$messages"},
            {$match: {"messages.isImage": true, "messages.isPublished": true}},
            {
                $project: {
                    _id: 0,
                    image: "$messages.content",
                    userName: "$userName"
                }
            }
        ])

        res.json({
            success: true,
            images: publishedImageMessages.reverse()
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}
