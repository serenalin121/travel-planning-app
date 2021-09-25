const mongoose = require("mongoose");
const Trip = require("./trip");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  trips: [{type: Schema.Types.ObjectId, ref: 'Trip'}]
});

module.exports = model("User", userSchema);
