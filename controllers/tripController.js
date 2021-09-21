const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");

router.get("/", (req, res) => {
  Trip.find({}, (err, allTrips) => {
    res.render("trips/index.ejs", { trips: allTrips });
  });
});

router.get("/new", (req, res) => {
  res.render("trips/new.ejs");
});

router.post("/", (req, res) => {
  try {
    Trip.create(req.body, (err, createdTrip) => {
      err ? res.send(err) : res.redirect("/trips");
    });
  } catch (err) {
    res.send(err.message);
  }
});
// Seed Data
router.get("/seed", async (req, res) => {
  const newTrips = [
    {
      name: "Canada Day Trip",
      duration: 1,
      destination: "Vancouver",
      itinerary: [
        "Explore Gastown",
        "Lunch at Granville Island",
        "Take the Aquabus",
      ],
    },
    {
      name: "Tokyo, Japan",
      duration: 7,
      destination: "Tokyo",
      itinerary: [
        "Explore historic Sensoji Temple",
        "Tokyo Tower",
        "Eat the freshest sushi in town at Toyosu Fish Market",
        "Party all night in Shibuya",
      ],
    },
    {
      name: "The Big Apple",
      duration: 4,
      destination: "New York City",
      itinerary: [
        "Watch a Broadway show",
        "Visit Times Square",
        "Central Park",
        "Statue of Liberty",
        "Brooklyn Bridge Park",
      ],
    },
  ];

  try {
    const seedItems = await Trip.create(newTrips);
    res.send(seedItems);
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
