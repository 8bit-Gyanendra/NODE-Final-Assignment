const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  technologyStack: [{ type: String, required: true }],
  registrationStartDate: { type: Date, required: true },
  registrationEndDate: { type: Date, required: true },
  maxParticipants: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Open", "Full", "Closed", "Past", "Upcomming"],
    required: true,
    defaultValue: "Open",
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide the User "],
  },
  registeredParticipants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      registrationDate: { type: Date, required: true },
    },
  ],
});

module.exports = mongoose.model("Hackathon", hackathonSchema);
