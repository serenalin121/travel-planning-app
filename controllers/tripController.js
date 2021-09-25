const express = require("express");
const router = express.Router();
const Trip = require("../models/trip");

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
  req.body.destinationCoord = {
    lat: 12.550343,
    lng: 55.665957,
  };
  try {
    Trip.create(req.body, (err, createdTrip) => {
      err
        ? res.send(err)
        : (req.session.message = "Successfully created a new trip!");
      console.log(createdTrip);
      res.redirect(`/trips/${createdTrip._id}`);
    });
  } catch (err) {
    res.send(err.message);
  }
});

// Seed Data
// router.get("/seed", async (req, res) => {
//   const newTrips = [
//     {
//       name: "Canada Day Trip",
//       duration: 1,
//       destination: "Vancouver",
//       itinerary: [
//         "Explore Gastown",
//         "Lunch at Granville Island",
//         "Take the Aquabus",
//       ],
//     },
//     {
//       name: "Tokyo, Japan",
//       duration: 7,
//       destination: "Tokyo",
//       itinerary: [
//         "Explore historic Sensoji Temple",
//         "Tokyo Tower",
//         "Eat the freshest sushi in town at Toyosu Fish Market",
//         "Party all night in Shibuya",
//       ],
//     },
//     {
//       name: "The Big Apple",
//       duration: 4,
//       destination: "New York City",
//       itinerary: [
//         "Watch a Broadway show",
//         "Visit Times Square",
//         "Central Park",
//         "Statue of Liberty",
//         "Brooklyn Bridge Park",
//       ],
//     },
//   ];

//   try {
//     const seedItems = await Trip.create(newTrips);
//     res.send(seedItems);
//   } catch (err) {
//     console.log(err);
//     res.send(err.message);
//   }
// });

router.get("/:id", requireLogin, (req, res) => {
  try {
    Trip.findById(req.params.id, (err, foundTrip) => {
      err ? res.send(err) : res.render("trips/show.ejs", { trip: foundTrip });
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
