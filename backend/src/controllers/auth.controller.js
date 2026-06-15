import UserModul from "../modules/User.module.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {validationResult} from "express-validator"
import cookies from "cookie-parser";
/**
 * 
 * @param {*} req  
 * @param {*} res 
 * @returns 
 */
export const registerUserController=async (req,res)=>{
    try {
        const errors=validationResult(req)


        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }

        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        // Check if user already exists
        const userExists =await UserModul.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to our mock database
        const newUser =await UserModul.create({
            email,
            password: hashedPassword
        });
        
        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"7d"})

         res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Cookie only over HTTPS in production
            sameSite: "strict"
        });

        res.status(201).json({ message: "User registered successfully!", 
            user:{
                id:newUser._id,
                email:newUser.email,
            },
            token
         });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration.",error });
    }
}


export const loginUserController=async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const {email,password}=req.body
        
        const user = await UserModul.findOne({email}).select("+password")

        if(!user){
           return res.status(404).json({message:"user not found"})
        }

        const comparePassword=await bcrypt.compare(password,user.password)

         if(!comparePassword){
            return res.status(400).json({message:"Invalid password"})

         }

         const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Cookie only over HTTPS in production
            sameSite: "strict"
        });
            
        res.status(200).json({ message: "User registered successfully!", 
            user:{
                id:user._id,
                email:user.email,
            },
            token
         });

    } catch (error) {
         res.status(500).json({ message: "Server error during registration." ,error});
    }
}


export const logoutUserController=async (req,res)=>{
    try {
        res.clearCookie("token")
        res.status(200).json({message:"User logged out successfully"})
    } catch (error) {
        res.status(500).json({ message: "Server error during registration.",error });
    
    }
}


export const currentUserController=async (req,res)=>{
    try {
        const user=await UserModul.findById(req.user.id).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({user})
        
    } catch (error) {
        res.status(500).json({ message: "Server error during registration.",error });
    

}}



export const getallUserController=async (req,res)=>{

    try {
        const userId=req.user.id
        
        const users=await UserModul.find({_id:{$ne:userId}}).select("-password")
        if(!users){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json({users})
        
    } catch (error) {
        res.stuts(500).json({message:"Server error"})
        console.log(error);
        
        
    }
}