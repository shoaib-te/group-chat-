import { Router } from "express";
import { body } from "express-validator";
import { authmiddleware } from "../middlewares/auth.middleware.js";
import * as Projectcontroller from "../controllers/Porject.controller.js";

const router = Router();
/**
 * /api/project
 */
router.post(
  "/create",
  authmiddleware,
  body("name").notEmpty().withMessage("Name is required"),
  Projectcontroller.createProjectController,
);


router.get("/all",authmiddleware,Projectcontroller.allUserProjectController)

router.put('/user-update', authmiddleware, [
  // 1. Validates that projectId exists and is not empty
  body('projectId').trim().notEmpty().withMessage('Project ID is required'),
  
  // 2. Streamlined array validation
  body('users').isArray({ min: 1 }).withMessage('User array cannot be empty')
], Projectcontroller.allUserToProjectController);

router.get('/get-project/:id',authmiddleware,Projectcontroller.getOneProjectController)

export default router;
