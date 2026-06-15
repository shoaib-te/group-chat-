import mongoose from "mongoose";
import bcrypt from "bcrypt"

const UserSechma = new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,

    },
    password:{
        type:String,
        required:true,
        select:false,
    }
},{
    timestamps:true
})


const UserModul= mongoose.model("User",UserSechma)

export default UserModul;


