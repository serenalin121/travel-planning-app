require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Trip = require("./models/trip");

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to Database
const mongoURI = process.env.MONGODB_URI;
const db = mongoose.connection;

mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`database connectd`);
  }
);

db.on("error", (err) => {
  console.log("mongoose error" + err.message);
});
db.on("connected", () => console.log("mongo connected: ", mongoURI));
db.on("disconnected", () => console.log("mongo disconnected"));

// middleware
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

// Controllers
const tripsController = require("./controllers/tripController");
app.use("/trips", tripsController);

// Seed Data
app.get("/seed", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
