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
  return await User.findOne({ where: { email } });
};

exports.findUserById = async (userId) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "username", "email", "role"],
    });

    if (user) return user;
    else return null;
  } catch (err) {
    throw new Error("Error fetching user:", err.message);
  }
};

exports.updateUserRefreshToken = async (userId, refreshToken) => {
  return await User.update(
    { refresh_token: refreshToken },
    { where: { id: userId } }
  );
};

exports.findUserByRefreshToken = async (refreshToken) => {
  return await User.findOne({ where: { refresh_token: refreshToken } });
};

exports.removeRefreshToken = async (userId) => {
  return await User.update({ refresh_token: null }, { where: { id: userId } });
};
