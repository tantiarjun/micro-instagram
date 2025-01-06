import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// controllers for getting Alluser
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUsers = await prisma.user.findMany();

    const formattedUsers = allUsers.map((user) => ({
      ...user,
      post_count: user.post_count.toString(),
    }));

    res.status(200).json({ message: "Success", Data: formattedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// controllers for creating user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, mobile_number, address } = req.body;

    const userExist = await prisma.user.findUnique({
      where: { mobile_number },
    });

    if (userExist) {
      res.status(400).json({
        message: "User already exists with this mobile number",
      });

      return;
    }

    const newUser = await prisma.user.create({
      data: { name, mobile_number, address },
    });

    const formattedNewUser = {
      ...newUser,
      post_count: newUser.post_count.toString(),
    };

    res.status(201).json(formattedNewUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};
