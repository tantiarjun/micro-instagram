import express from "express";
import { createUser, getUser } from "../controllers/user";
import { validateCreateUser } from "../middlewares/userValidation";

const router = express.Router();

router.get("/users", getUser);
router.post("/user", validateCreateUser, createUser);

export default router;
