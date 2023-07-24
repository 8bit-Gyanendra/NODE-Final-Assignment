const express = require("express");
const authenticateUser = require("../middleware/authentication");

const router = express.Router();
const {
  register,
  login,
  users,
  participatedHackathons,
} = require("../controllers/auth");
router.post("/register", register);
router.post("/login", login);
router.get("/users", users);
router.get("/participatedHackathons");
router.get("/participatedHackathons", authenticateUser, participatedHackathons);

module.exports = router;
