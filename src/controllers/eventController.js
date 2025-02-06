const eventRepository = require("../repositories/eventRepository.js");
const { validationResult, matchedData } = require("express-validator");

exports.getEvents = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { title } = matchedData(req);

    let results;

    if (title) {
      results = await eventRepository.getEvents(title);
      if (results.length === 0) {
        return res.status(404).json({ msg: "Event not found" });
      }
    } else {
      results = await eventRepository.getAllEvents();
    }
    return res.status(200).send(results);
  } catch {
    res.status(500).json({ msg: "Failed to retrieve events" });
  }
};

exports.getEventById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = matchedData(req);

  try {
    const event = await eventRepository.getEventById(id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    res.status(200).json(event);
  } catch {
    res.status(500).json({ msg: "Failed to retrieve event" });
  }
};

exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, description, date, location, available_seats } =
    matchedData(req);

  try {
    const { id: userId, username, role } = req.user;

    if (role !== "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    const newEvent = await eventRepository.createEvent(
      name,
      description,
      date,
      location,
      available_seats,
      userId,
      username,
      role
    );

    res.status(201).json({
      msg: "Event created successfully",
      newEvent: {
        name: newEvent.name,
        description: newEvent.description,
        date: newEvent.date,
        location: newEvent.location,
        availableSeats: newEvent.available_seats,
        createdBy: newEvent.created_by_display,
      },
    });
  } catch {
    res.status(500).json({ msg: "Failed to create event" });
  }
};

exports.editEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id, name, description, date, location, available_seats } =
    matchedData(req);

  try {
    const { role } = req.user;

    const event = await eventRepository.getEventById(id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (role !== "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    await eventRepository.editEvent(
      id,
      name,
      description,
      date,
      location,
      available_seats
    );

    res.status(200).json({ msg: "Event edited successfully" });
  } catch {
    res.status(500).json({ msg: "Failed to edit event" });
  }
};

exports.deleteEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = matchedData(req);

  try {
    const { role } = req.user;

    const event = await eventRepository.getEventById(id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (role !== "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    await eventRepository.deleteEvent(id);

    res.status(200).json({ msg: "Successfully deleted event" });
  } catch {
    res.status(500).json({ msg: "Failed to delete event" });
  }
};
