import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, mobile_number, address } = req.body;

  // Schema for validating user data
  const schema = Joi.object({
    name: Joi.string().max(256).required().messages({
      "string.empty": "Name is required",
      "string.max": "Name cannot exceed 256 characters",
    }),
    mobile_number: Joi.string()
      .trim()
      .pattern(/^[0-9]+$/)
      .min(10)
      .max(15)
      .required()
      .messages({
        "string.empty": "Mobile number is required",
        "string.pattern.base": "Mobile number must contain only digits",
        "string.min": "Mobile number must be at least 10 characters long",
        "string.max": "Mobile number cannot exceed 15 characters",
      }),
    address: Joi.string().min(5).max(100).required().messages({
      "string.empty": "Address is required",
      "string.min": "Address must be at least 5 characters long",
      "string.max": "Address cannot exceed 100 characters",
    }),
  });

  const { error } = schema.validate({ name, mobile_number, address });
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};
