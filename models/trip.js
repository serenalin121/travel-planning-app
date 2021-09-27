const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const tripSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, min: 0, required: true },
  destination: { type: String, require: true },
  latitude: Number,
  longitude: Number,
  itinerary: [String],
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Trip", tripSchema);
