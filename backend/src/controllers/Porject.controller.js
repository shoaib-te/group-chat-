import ProjectModul from "../modules/Project.module.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || !userId) {
      return res.status(400).json({
        message: "Missing required fields: Name and User ID are mandatory.",
      });
    }

    const existingProject = await ProjectModul.findOne({ name });

    if (existingProject) {
      return res.status(400).json({
        message: "A project with this name already exists.",
      });
    }

    const project = await ProjectModul.create({ name, users: [userId] });

    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const allUserProjectController=async (req,res)=>{
  try {
    const userId=req.user.id

    if(!userId){
      return res.status(400).json({message:"User not found"})
    }
    const projects=await ProjectModul.find({users:userId})
  
    if(!projects){
      return res.status(404).json({message:"No project found"})
    }
    

    res.status(200).json({projects})
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  
  }
}

export const allUserToProjectController=async (req,res)=>{
  const errors=validationResult(req)
  
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
  }
   const {projectId,users}=req.body
    console.log(projectId,users);
  try {
     
   
    if (!projectId || !users) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const userId=req.user.id
    if(!projectId || !users){
      return res.status(400).json({message:"Missing required fields"})
    }
    const existingProject=await ProjectModul.findOne({users})
    if(existingProject){
      return res.status(400).json({message:"User already in project"})
    }
     
  
    const project=await ProjectModul.findOne({
      _id:projectId,
      users:userId

    })

    if(!project){
      return res.status(404).json({message:"Project not found"})
    }

    const updateProject=await ProjectModul.findOneAndUpdate(
      {_id:projectId},
      {$addToSet:{users:users}},
      {new:true}
    )

    res.status(200).json({message:"User added to project successfully",updateProject})
     

  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
    
  
   
  }
}



export const getOneProjectController=async (req,res)=>{
  try {
    const {id}=req.params
    

    const project=await ProjectModul.findOne({_id:id}).populate("users")

    if(!project){
      return res.status(404).json({message:"Project not found"})
    }

    res.status(200).json({project})
  
    
  }catch(err){
    res.status(500).json({message:"Server error"})
  
  }
}

