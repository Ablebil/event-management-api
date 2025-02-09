const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository.js");
const { validationResult, matchedData } = require("express-validator");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).send({ errors: errors.array() });

  const { username, email, password, role } = matchedData(req);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authRepository.createUser(
      username,
      email,
      hashedPassword,
      role
    );

    res.status(200).json({
      msg: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({ msg: "Register failed" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = matchedData(req);

  try {
    const user = await authRepository.findUserByEmail(email);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ msg: "Invalid password" });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await authRepository.updateUserRefreshToken(user.id, refreshToken);

    res
      .status(200)
      .json({ msg: "Login successful", accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Login failed" });
  }
};

exports.refreshToken = async (req, res) => {
  const {
    body: { refreshToken },
  } = req;

  if (!refreshToken)
    return res.status(401).json({ msg: "Refresh token is required" });

  try {
    const user = await authRepository.findUserByRefreshToken(refreshToken);
    if (!user) return res.status(404).json({ msg: "Invalid refresh token" });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, _decoded) => {
        if (err) return res.status(403).json({ msg: "Invalid refresh token" });

        const newAccessToken = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_REFRESH_SECRET,
          { expiresIn: "1d" }
        );

        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch {
    res.status(500).json({ msg: "Failed to refresh token" });
  }
};

exports.logout = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { refreshToken } = matchedData(req);

  try {
    const user = await authRepository.findUserByRefreshToken(refreshToken);
    if (!user) return res.status(403).json({ msg: "Invalid refresh token" });

    await authRepository.removeRefreshToken(user.id);

    res.status(200).json({ msg: "Logout successful" });
  } catch {
    res.status(500).json({ msg: "Logout failed" });
  }
};
