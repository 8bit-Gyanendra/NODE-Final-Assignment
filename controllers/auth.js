const User = require("../models/User");
const Hackathon = require("../models/Hackathon");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please Provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  //code for comparing the password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: user, token });
};

const users = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};

const participatedHackathons = async (req, res) => {
  const { userId } = req.params;

  const employee = await User.findOne({ _id: userId });
  if (!employee) {
    throw new NotFoundError("Employee not found");
  }

  const hackathonIds = User.registeredHackathons.map(
    (registration) => registration.hackathon
  );

  //Find the hackathons where their IDs match the ones in the hackathonIds array
  const hackathons = await Hackathon.find({ _id: { $in: hackathonIds } });

  res.status(StatusCodes.OK).json(hackathons);
};

module.exports = {
  register,
  login,
  users,
  participatedHackathons,
};
