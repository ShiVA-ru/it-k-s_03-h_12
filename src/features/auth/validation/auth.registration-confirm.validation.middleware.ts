import { body } from "express-validator";

export const confirmationCodeValidation = body("code")
  .trim()
  .isString()
  .withMessage("Field must be a string")
  .isUUID()
  .withMessage("Code must be UUID");
