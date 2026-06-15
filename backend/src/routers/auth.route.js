import { Router } from "express";
import {
  currentUserController,
  getallUserController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { authmiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  registerUserController,
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  loginUserController,
);

router.get("/logout", authmiddleware ,logoutUserController);
router.get("/profile",authmiddleware, currentUserController);

router.get('/allUser',authmiddleware,getallUserController)

export default router;
