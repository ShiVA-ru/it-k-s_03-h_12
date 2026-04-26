import { param } from "express-validator";

export const idValidation = param("id")
  .exists()
  .withMessage("ID is required")
  // .isMongoId()
  // .withMessage("ID must be a valid MongoDB ObjectId")
  .isString()
  .withMessage("ID must be a string")
  .isLength({ min: 1 })
  .withMessage("ID must not be empty");
