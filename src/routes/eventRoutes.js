const { Router } = require("express");
const {
  getEvents,
  createEvent,
  editEvent,
  deleteEvent,
} = require("../controllers/eventController.js");
const { query, param, checkSchema } = require("express-validator");
const passport = require("passport");
const {
  eventValidationSchema,
} = require("../validators/eventValidationSchema.js");

const router = Router();

router.get(
  "/",
  [
    query("title").optional().isString().withMessage("Title must be a string"),
    param("id")
      .optional()
      .isInt()
      .toInt()
      .withMessage("Event id must be an integer"),
  ],
  getEvents
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  checkSchema(eventValidationSchema),
  createEvent
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  checkSchema(eventValidationSchema),
  [param("id").isInt().toInt().withMessage("Event ID must be an integer")],
  editEvent
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  [param("id").isInt().toInt().withMessage("Event ID must be an integer")],
  deleteEvent
);

module.exports = router;
