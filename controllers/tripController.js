const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");

router.get("/", (req, res) => {
  res.render("trips/index.ejs");
});

module.exports = router;
