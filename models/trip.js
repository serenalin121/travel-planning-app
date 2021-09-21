const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const tripSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, min: 0, required: true },
  destination: { type: String, required: true },
  itinerary: [String],
});

module.exports = model("Trip", tripSchema);
