const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("./config/passport.config");

const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/teams", require("./routes/teamRouter"));

app.listen(PORT, () => {
  console.log(`Port is running at ${PORT}`);
});
