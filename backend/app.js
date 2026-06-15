import express from "express"
import morgan from "morgan"
import connectionDB from "./src/config/db.js";
import  "dotenv/config"
import authRoute from "./src/routers/auth.route.js"
import projectRoute from "./src/routers/project.route.js"
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"))
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))


 connectionDB()


// all Route 
app.get("/",(req,res)=>{
    res.send("hello world")
})
app.use("/api/auth",authRoute)
app.use("/api/project",projectRoute)
    


export default app

