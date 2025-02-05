const { Router } = require("express");
const authRoutes = require("./authRoutes.js");
const eventRoutes = require("./eventRoutes.js");

const router = Router();
router.use("/auth", authRoutes);
router.use("/events", eventRoutes);

module.exports = router;
