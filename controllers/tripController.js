const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");

router.get("/", (req, res) => {
  res.send("Yeah!!! you hit the trip homepage");
});

module.exports = router;
