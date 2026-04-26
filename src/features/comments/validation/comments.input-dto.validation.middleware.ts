import { body } from "express-validator";

const contentValidation = body("content")
  .trim()
  .isString()
  .withMessage("Field must be a string")
  .isLength({ min: 20, max: 300 })
  .withMessage("Field length must be between 20 and 300 characters");

export const commentInputDtoValidation = [contentValidation];
