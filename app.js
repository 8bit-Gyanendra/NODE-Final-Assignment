require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//connect db
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// const checkUserRole = require("./middleware/userType");

//routers
const authRouter = require("./routes/auth");
const hackathonRouter = require("./routes/hackathon");

//error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", authenticateUser, hackathonRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
