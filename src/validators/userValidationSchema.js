const { User } = require("../../models");

exports.userValidationSchema = {
  username: {
    in: ["body"],
    isEmpty: {
      negated: true,
      errorMessage: "Username is required",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
    trim: true,
    isLength: {
      options: { min: 5, max: 15 },
      errorMessage: "Username must be between 5 and 15 characters",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Invalid email format",
    },

    custom: {
      options: async (email) => {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          throw new Error("Email already in use");
        }
      },
    },
  },
  password: {
    in: ["body"],
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      errorMessage:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    },
  },
  role: {
    in: ["body"],
    isIn: {
      options: [["user", "admin"]],
      errorMessage: "Invalid role provided",
    },
    optional: true,
  },
};
