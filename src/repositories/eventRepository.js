const { Op } = require("sequelize");
const { Event } = require("../../models");

exports.getAllEvents = async () => {
  return await Event.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};

exports.getEvents = async (title) => {
  return await Event.findAll({
    where: {
      name: { [Op.iLike]: `%${title}%` },
    },
  });
};

exports.createEvent = async (
  name,
  description,
  date,
  location,
  availableSeats,
  userId,
  username,
  role
) => {
  return await Event.create({
    name,
    description,
    date,
    location,
    available_seats: availableSeats,
    created_by: userId,
    created_by_display: role === "admin" ? "Admin" : username,
  });
};

exports.getEventById = async (id) => {
  return await Event.findByPk(id);
};

exports.editEvent = async (
  id,
  name,
  description,
  date,
  location,
  availableSeats
) => {
  await Event.update(
    {
      name,
      description,
      date,
      location,
      available_seats: availableSeats,
    },
    { where: { id } }
  );
};

exports.deleteEvent = async (id) => {
  await Event.destroy({ where: { id } });
};
