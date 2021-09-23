require("dotenv").config();
const SESSION_SECRET = process.env.SESSION_SECRET;

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");

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

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  req.session.message = "";
  next();
});

// Controllers
app.get("/", (req, res) => {
  res.render("home.ejs");
});

const tripsController = require("./controllers/tripController");
app.use("/trips", tripsController);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
