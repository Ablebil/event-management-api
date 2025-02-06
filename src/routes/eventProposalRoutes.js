const { Router } = require("express");
const {
  getAllProposals,
  getProposalById,
  createProposal,
  approveProposal,
  rejectProposal,
  editProposal,
  deleteProposal,
} = require("../controllers/eventProposalController.js");
const passport = require("passport");
const { param, checkSchema } = require("express-validator");
const {
  eventProposalValidationSchema,
} = require("../validators/eventProposalValidationSchema.js");

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllProposals
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  [param("id").isInt().toInt().withMessage("Event ID must be an integer")],
  getProposalById
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkSchema(eventProposalValidationSchema()),
  createProposal
);

router.post(
  "/:id/approve",
  passport.authenticate("jwt", { session: false }),
  [param("id").isInt().toInt().withMessage("Event ID must be an integer")],
  approveProposal
);

router.post(
  "/:id/reject",
  passport.authenticate("jwt", { session: false }),
  [param("id").isInt().toInt().withMessage("Event ID must be an integer")],
  rejectProposal
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  [param("id").isInt().toInt().withMessage("Event ID must be an integer")],
  checkSchema(eventProposalValidationSchema(true)),
  editProposal
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  [param("id").isInt().toInt().withMessage("Event ID must be an integer")],
  deleteProposal
);

module.exports = router;
