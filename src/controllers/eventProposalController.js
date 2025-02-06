const { validationResult, matchedData } = require("express-validator");
const eventProposalRepository = require("../repositories/eventProposalRepository.js");
const eventRepository = require("../repositories/eventRepository.js");
const authRepository = require("../repositories/authRepository.js");

exports.getAllProposals = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { role } = req.user;

    const proposals = await eventProposalRepository.getAllProposals();
    if (proposals.length === 0)
      return res.status(404).json({ msg: "Event not found" });

    if (role !== "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    res.status(200).json(proposals);
  } catch {
    res.status(500).json({ msg: "Failed to retreive proposals" });
  }
};

exports.getProposalById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = matchedData(req);

  try {
    const { role } = req.user;

    const proposal = await eventProposalRepository.getProposalById(id);
    if (!proposal) return res.status(404).json({ msg: "Event not found" });

    if (role !== "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    res.status(200).json(proposal);
  } catch {
    res.status(500).json({ msg: "Failed to retreive proposal" });
  }
};

exports.createProposal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, description, date, location, available_seats } =
    matchedData(req);

  try {
    const { id: userId, username, role } = req.user;
    console.log(role);

    if (role === "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    const newProposal = await eventProposalRepository.createProposal(
      name,
      description,
      date,
      location,
      available_seats,
      userId,
      username
    );

    res.status(201).json({
      msg: "Proposal created successfully",
      proposal: {
        name: newProposal.name,
        description: newProposal.description,
        date: newProposal.date,
        location: newProposal.location,
        availableSeats: newProposal.available_seats,
        createdBy: newProposal.created_by_display,
      },
    });
  } catch {
    res.status(500).json({ msg: "Failed to create proposal" });
  }
};

exports.approveProposal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = matchedData(req);

  try {
    const { role } = req.user;

    const proposal = await eventProposalRepository.getProposalById(id);
    if (!proposal) return res.status(404).json({ msg: "Proposal not found" });

    if (proposal.status !== "pending")
      return res.status(400).json({ msg: "Proposal is not pending" });

    if (role !== "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    await eventProposalRepository.approveProposal(id);

    const proposalCreator = await authRepository.findUserById(
      proposal.created_by
    );

    const newEvent = await eventRepository.createEvent(
      proposal.name,
      proposal.description,
      proposal.date,
      proposal.location,
      proposal.available_seats,
      proposal.created_by,
      proposalCreator.username,
      proposalCreator.role
    );

    res.status(200).json({
      msg: "Proposal accepted successfully",
      event: {
        name: newEvent.name,
        description: newEvent.description,
        date: newEvent.date,
        location: newEvent.location,
        availableSeats: newEvent.available_seats,
        createdBy: newEvent.created_by_display,
      },
    });
  } catch {
    res.status(500).json({ msg: "Failed to approve proposal" });
  }
};

exports.rejectProposal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = matchedData(req);

  try {
    const { role } = req.user;

    const proposal = await eventProposalRepository.getProposalById(id);
    if (!proposal) return res.status(404).json({ msg: "Proposal not found" });

    if (proposal.status !== "pending")
      return res.status(400).json({ msg: "Proposal is not pending" });

    if (role !== "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    await eventProposalRepository.rejectProposal(id);

    res.status(200).json({ msg: "Proposal rejected successfully" });
  } catch {
    res.status(500).json({ msg: "Failed to reject proposal" });
  }
};

exports.editProposal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id, name, description, date, location, available_seats } =
    matchedData(req);

  try {
    const { id: userId, role } = req.user;

    const proposal = await eventProposalRepository.getProposalById(id);
    if (!proposal) return res.status(404).json({ msg: "Proposal not found" });

    if (proposal.status !== "pending")
      return res.status(400).json({ msg: "Proposal is not pending" });

    if (role === "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    if (userId !== proposal.created_by)
      return res.status(403).json({ msg: "Unauthorized access" });

    await eventProposalRepository.editProposal(
      id,
      name,
      description,
      date,
      location,
      available_seats
    );

    res.status(200).json({ msg: "Proposal edited successfully" });
  } catch {
    res.status(500).json({ msg: "Failed to edit proposal" });
  }
};

exports.deleteProposal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { id } = matchedData(req);

  try {
    const { id: userId, role } = req.user;

    const proposal = await eventProposalRepository.getProposalById(id);
    if (!proposal) return res.status(404).json({ msg: "Proposal not found" });

    if (role === "admin")
      return res.status(403).json({ msg: "Unauthorized access" });

    if (userId !== proposal.created_by)
      return res.status(403).json({ msg: "Unauthorized access" });

    await eventProposalRepository.deleteProposal(id);

    res.status(200).json({ msg: "Proposal deleted successfully" });
  } catch {
    res.status(500).json({ msg: "Failed to delete proposal" });
  }
};
