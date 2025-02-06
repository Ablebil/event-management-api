const { EventProposal } = require("../../models");

exports.getAllProposals = async () => {
  return await EventProposal.findAll({
    attributes: { exclude: ["createdAt, updatedAt"] },
  });
};

exports.getProposalById = async (id) => {
  return await EventProposal.findByPk(id);
};

exports.createProposal = async (
  name,
  description,
  date,
  location,
  availableSeats,
  userId,
  username
) => {
  return await EventProposal.create({
    name,
    description,
    date,
    location,
    available_seats: availableSeats,
    created_by: userId,
    created_by_display: username,
  });
};

exports.approveProposal = async (id) => {
  await EventProposal.update({ status: "approved" }, { where: { id } });
};

exports.rejectProposal = async (id) => {
  await EventProposal.update({ status: "rejected" }, { where: { id } });
};

exports.editProposal = async (
  id,
  name,
  description,
  date,
  location,
  availableSeats
) => {
  await EventProposal.update(
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

exports.deleteProposal = async (id) => {
  await EventProposal.destroy({ where: { id } });
};
