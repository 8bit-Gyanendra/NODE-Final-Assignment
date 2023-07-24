const express = require("express");
const router = express.Router();
const {
  listHackathons,
  createHackathon,
  registerHackathon,
  serachHackathon,
} = require("../controllers/hackathon");
const checkUserRole = require("../middleware/userType");
const employeeMiddleware = require("../middleware/employeeType");

router.post("/hackathon", checkUserRole, createHackathon);
router.post("/hackathon/register", employeeMiddleware, registerHackathon);
router.get("/hackathon", listHackathons);
router.get("/hackathon/search", serachHackathon);

module.exports = router;
