require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 3003;

const tripsController = require("./controllers/tripController");
app.use("/trips", tripsController);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
