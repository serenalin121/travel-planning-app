const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");

router.get("/", (req, res) => {
  Trip.find({}, (err, allTrips) => {
    res.render("trips/index.ejs", { trips: allTrips });
  });
});

module.exports = router;
