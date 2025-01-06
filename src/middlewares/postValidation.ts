import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateCreatePost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description, userId } = req.body;

  // Schema for validating post data
  const schema = Joi.object({
    title: Joi.string().min(3).max(256).required().messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title cannot exceed 256 characters",
    }),
    description: Joi.string().min(10).max(1000).required().messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description cannot exceed 1000 characters",
    }),
    userId: Joi.number().integer().required().messages({
      "number.empty": "User ID is required",
      "number.base": "User ID must be a number",
    }),
  });

  const { error } = schema.validate({ title, description, userId });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }

  // Validate file uploads (images)
  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    const imageTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 1 * 1024 * 1024;

    // Check for invalid file types
    const invalidFiles = files.filter(
      (file) => !imageTypes.includes(file.mimetype)
    );
    if (invalidFiles.length > 0) {
      res.status(400).json({
        error:
          "Invalid file type. Only image files (JPEG, PNG, GIF) are allowed.",
      });
      return;
    }

    // Check for file size limits
    const oversizedFiles = files.filter((file) => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      res.status(400).json({
        error: "Image size should not exceed 1 MB.",
      });
      return;
    }

    // Limit the number of images uploaded
    const maxImages = 2;
    if (files.length > maxImages) {
      res.status(400).json({
        error: `You can only upload up to ${maxImages} images per post.`,
      });
      return;
    }
  }

  // If all validations pass, proceed to the next middleware
  next();
};
