import { body } from "express-validator";
import middleware from "../../../../utils/middleware.utils";

export const userConfigValidations = [
  body("identifier")
    .isNumeric()
    .withMessage("identifier is required")
    .notEmpty(),
  body("username")
    .isString()
    .withMessage("username is required")
    .notEmpty(),
  body("title")
    .isString()
    .withMessage("title is required")
    .notEmpty(),
  body("firstName")
    .isString()
    .withMessage("firstName is required")
    .notEmpty(),
  body("lastName")
    .isString()
    .withMessage("lastName is required")
    .notEmpty(),

  middleware.validate,
];

export const userScannerValidations = [
  body("convexikId")
    .isNumeric()
    .withMessage("identifier is required")
    .notEmpty(),
  body("text")
    .isString()
    .withMessage("text is required")
    .notEmpty(),

  middleware.validate,
];
