const { StatusCodes } = require("http-status-codes");

function employeeMiddleware(req, res, next) {
  const { user } = req;
  // console.log("hello", user.userType);
  try {
    if (user && user.type === "Employee") {
      next();
    } else {
      res.status(StatusCodes.FORBIDDEN).json({
        error: "You do not have permission to perform this action",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
}

module.exports = employeeMiddleware;
