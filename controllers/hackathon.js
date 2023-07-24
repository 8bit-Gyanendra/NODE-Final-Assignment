const { StatusCodes } = require("http-status-codes");
const Hackathon = require("../models/Hackathon");
const User = require("../models/User");
const { NotFoundError } = require("../errors");

const listHackathons = async (req, res) => {
  const hackathons = await Hackathon.find({
    createdBy: req.user.userId,
  });
  res.status(StatusCodes.OK).json({ hackathons });
};

//create hackathon only organizer has the access to this api
const createHackathon = async (req, res) => {
  const { user, body } = req;

  try {
    const {
      name,
      company,
      technologyStack,
      registrationStartDate,
      registrationEndDate,
      maxParticipants,
      participants,
      status,
    } = body;

    const newHackathon = await Hackathon.create({
      name,
      company,
      technologyStack,
      registrationStartDate,
      registrationEndDate,
      maxParticipants,
      participants,
      status,
      createdBy: user.userId,
    });
    res.status(StatusCodes.CREATED).json(newHackathon);
  } catch (error) {
    // Handle any potential errors
    console.error("Error creating a new hackathon:", error);
    throw error; // Rethrow the error to be handled in the calling code
  }
};

//assign user to the Hackathons
const registerHackathon = async (req, res) => {
  const { hackathonId, userId } = req.body;

  const hackathon = await Hackathon.findOne({ _id: hackathonId });
  // console.log(hackathon);
  const employee = await User.findOne({ _id: userId });
  // console.log(employee);
  if (!hackathon || !employee) {
    throw new NotFoundError("No employee and hackathon found");
  }

  if (hackathon.status !== "Open") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Hackathon registration is closed" });
  }

  if (hackathon.participants.length >= hackathon.maxParticipants) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Hackathon is full" });
  }
  if (Date.now() > hackathon.registrationEndDate) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Registration date has passed" });
  }

  //chcek for the user not registered in other hackathon
  const checkOverlapRegistrations = employee.registeredHackathons.filter(
    (registeredHackathon) => {
      return (
        registeredHackathon.hackathon.equals({ _id: hackathonId }) && // The hackathon is the same
        hackathon.registrationStartDate <=
          registeredHackathon.registrationDate &&
        hackathon.registrationEndDate >= registeredHackathon.registrationDate // Overlapping time slots
      );
    }
  );

  if (checkOverlapRegistrations.length > 0) {
    return res.status(StatusCodes.CONFLICT).json({
      error:
        "Employee is registered for another hackathon with overlapping time slots",
    });
  }
  //register
  employee.registeredHackathons.push({
    hackathon: hackathonId,
    registrationDate: new Date(),
  });

  await employee.save();
  res
    .status(StatusCodes.CREATED)
    .json({ message: "User Successfully Registered for the Hackathon" });
};

//serach hackathon based on name, company, and technology stack
const serachHackathon = async (req, res) => {
  const { company, name, technologyStack } = req.query;
  const filteredHackathon = {};
  if (name) {
    filteredHackathon.name = { $regex: name, $options: "i" };
  }
  if (company) {
    filteredHackathon.company = { $regex: company, $options: "i" };
  }
  if (technologyStack) {
    filteredHackathon.technologyStack = {
      $regex: technologyStack,
      $options: "i",
    };
  }
  const hackathons = await Hackathon.find(filteredHackathon);
  res.status(StatusCodes.OK).json({ hackathons });
};

module.exports = {
  createHackathon,
  listHackathons,
  registerHackathon,
  serachHackathon,
};
