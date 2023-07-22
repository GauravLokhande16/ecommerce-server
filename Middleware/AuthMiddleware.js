const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../Models/UserModel')

const protect = asyncHandler(
    async (req,res, next)=>{
        let token 

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
            try {
                token = req.headers.authorization.split(" ")[1]
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                req.user = await User.findById(decoded.id).select("-password")
                next()
            } catch (error) {
                console.error("Error: " + error)
                res.status(401) 
                throw new Error("Not authorized, token failed")             
            }
        }

        if(!token){
            res.status(401)
            throw new Error("Token not found")
        }
    }
)

module.exports = protect