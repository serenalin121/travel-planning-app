const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Trip = require("../models/trip");
const openWeatherApiKey = process.env.OPEN_WEATHER;
const MapboxClient = require("mapbox");
const client = new MapboxClient(process.env.MAPBOX_API_KEY);

const requireLogin = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/users/signin");
  }
  next();
};

router.get("/", requireLogin, (req, res) => {
  Trip.find({ author: req.session.currentUser._id }, (err, allTrips) => {
    res.render("trips/index.ejs", { trips: allTrips });
  });
});

router.get("/new", requireLogin, (req, res) => {
  res.render("trips/new.ejs");
});

router.post("/", (req, res) => {
  req.body.itinerary = req.body.itinerary.split(",").map((item) => item.trim());
  req.body.author = req.session.currentUser._id;
  try {
    Trip.create(req.body, (err, createdTrip) => {
      err
        ? res.send(err)
        : (req.session.message = "Successfully created a new trip!");
      res.redirect(`/trips/${createdTrip._id}`);
    });
  } catch (err) {
    res.send(err.message);
  }
});

/* get autocomplete suggestions for places */
router.get("/autocomplete", (req, res) => {
  // Limit types of autocomplete result (e.g. no point of interest, postal code, etc.)
  // https://docs.mapbox.com/api/search/geocoding/#data-types
  const locationTypes = [
    "country", // countries
    "region", // top-level features (e.g. states in US)
    "district", // Larger than cities < top-level
    "place", // Cities, villages, etc.
    "locality", // sub-city
  ];

  // https://docs.mapbox.com/api/search/geocoding/
  const geocodeForwardOptions = {
    autocomplete: true,
    types: locationTypes,
  };

  client.geocodeForward(req.query.query, geocodeForwardOptions, (err, data) =>
    res.send(data)
  );
});

router.get("/:id", requireLogin, (req, res) => {
  try {
    Trip.findById(req.params.id, (err, foundTrip) => {
      if (err) {
        res.send(err);
      } else {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${+foundTrip.latitude}&lon=${+foundTrip.longitude}&appid=${openWeatherApiKey}&units=imperial`
        )
          .then((res) => res.json())
          .then((weatherData) => {
            res.render("trips/show.ejs", {
              trip: foundTrip,
              temp: weatherData.main.temp,
            });
          });
      }
    });
  } catch (err) {
    res.send(err.message);
  }
});

router.delete("/:id", (req, res) => {
  try {
    Trip.findByIdAndRemove(req.params.id, (err, deletedTrip) => {
      err
        ? res.send(err)
        : (req.session.message = "Successfully deleted a trip!");
      res.redirect("/trips");
    });
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/:id/edit", requireLogin, (req, res) => {
  try {
    Trip.findById(req.params.id, (err, foundTrip) => {
      err ? res.send(err) : res.render("trips/edit.ejs", { trip: foundTrip });
    });
  } catch (err) {
    res.send(err.message);
  }
});

router.put("/:id", (req, res) => {
  req.body.itinerary = req.body.itinerary.split(",").map((item) => item.trim());
  const { id } = req.params;
  try {
    Trip.findByIdAndUpdate(id, req.body, (err, updatedTrip) => {
      err
        ? res.send(err)
        : (req.session.message = "Successfully edited a trip!");
      res.redirect(`/trips/${id}`);
    });
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
