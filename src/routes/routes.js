const { Router } = require("express");
const authRoutes = require("./authRoutes.js");
const eventRoutes = require("./eventRoutes.js");
const eventProposalRoutes = require("./eventProposalRoutes.js");

const router = Router();
router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/event-proposals", eventProposalRoutes);

module.exports = router;
