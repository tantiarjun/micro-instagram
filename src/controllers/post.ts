import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// controllers for getting all post
export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const allPosts = await prisma.post.findMany();
    res.status(200).json(allPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// controllers for creating post
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, userId } = req.body;
    const userid = parseInt(userId);

    const user = await prisma.user.findUnique({
      where: { id: userid },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const imagePaths = files.map((file) => `uploads/${file.filename}`);

    console.log("res files", req.files);

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        userId: userid,
        images: imagePaths,
      },
    });

    await prisma.user.update({
      where: { id: userid },
      data: { post_count: { increment: 1 } },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// controllers for getting all post by specific user
export const getAllPostOfUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userid = parseInt(req.params.userid);

    // Fetch the user details along with posts
    const user = await prisma.user.findUnique({
      where: { id: userid },
      select: { name: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Fetch all posts for the user
    const allPostByUser = await prisma.post.findMany({
      where: { userId: userid },
    });

    if (allPostByUser.length === 0) {
      res.status(200).send(`There are no posts by  ${user.name}`);
      return;
    }

    res.status(200).send(allPostByUser);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// controllers for updating post
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { title, description } = req.body;

    const postexist = await prisma.post.findUnique({
      where: { id },
    });

    if (!postexist) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const files = req.files as Express.Multer.File[];
    const imagePaths = files?.map((file) => `uploads/${file.filename}`) || [];

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        description,
        images: imagePaths,
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
};

// controllers for deleting post
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const postexist = await prisma.post.findUnique({
      where: { id },
    });

    if (!postexist) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const post = await prisma.post.delete({
      where: { id },
    });

    // Decrement post count for the user
    await prisma.user.update({
      where: { id: post.userId },
      data: { post_count: { decrement: 1 } },
    });

    res.status(200).json({ message: "Post deleted successfully", post });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
