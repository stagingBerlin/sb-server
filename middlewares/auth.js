import createError from "http-errors"
import User from "../models/User.js";

const auth = async (req, res, next) => {
    
    try {
        // grab the token from the cookie
        // console.log("REQ COOKIES =>", req.cookies);
        const token = req.cookies.token
    
        // verify token
        const user = await User.findByToken(token)
        if(!user) next(createError(401, `Auth failed. Please try to login again!!`))
    
        // if a user exist, pass the user in the req for future use
        req.user = user

        next()
        
    } catch (error) {
        next(error)
    }
}

export default auth