const express = require("express");
const cors = require("cors");

const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`Port is running at ${PORT}`);
});
