const { User } = require("../../models");

exports.createUser = async (username, email, hashedPassword, role) => {
  return await User.create({
    username,
    email,
    password: hashedPassword,
    role,
  });
};

exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: email });
};
