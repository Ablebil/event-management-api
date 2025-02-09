const { Router } = require("express");
const {
  register,
  login,
  refreshToken,
} = require("../controllers/authController.js");
const {
  userValidationSchema,
} = require("../validators/userValidationSchema.js");
const { body, checkSchema } = require("express-validator");

const router = Router();

router.post("/register", checkSchema(userValidationSchema), register);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post("/refresh-token", refreshToken);

module.exports = router;
