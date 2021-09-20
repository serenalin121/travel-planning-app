const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const tripSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  destination: { type: String, required: true },
  itineray: [String],
});

module.exports = model("Trip", tripSchema);
