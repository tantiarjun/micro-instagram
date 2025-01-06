import express from "express";
import {
  createPost,
  deletePost,
  getAllPostOfUser,
  getPost,
  updatePost,
} from "../controllers/post";
import upload from "../middlewares/multerConfig";
import { validateCreatePost } from "../middlewares/postValidation";

const router = express.Router();

router.get("/post", getPost);

router.post(
  "/post",
  upload.array("images", 10),
  validateCreatePost,
  createPost
);

router.get("/user/:userid/posts", getAllPostOfUser);

router.put(
  "/post/:id",
  upload.array("images", 10),
  validateCreatePost,
  updatePost
);

router.delete("/post/:id", deletePost);

export default router;
