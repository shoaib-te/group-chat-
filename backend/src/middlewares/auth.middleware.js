import jwt from "jsonwebtoken"
import "dotenv/config"

const authmiddleware=(req,res,next)=>{
    const token=req.cookies.token|| req.header("Authorization")?.replace("Bearer ","")
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decoded
    next()
}

export {
    authmiddleware

} 