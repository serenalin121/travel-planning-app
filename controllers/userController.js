const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register.ejs");
});

router.post("/register", (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(req.body.password, salt);
  User.findOne({ username: req.body.username }, (err, userExists) => {
    if (userExists) {
      res.send("That username is takend!");
    } else {
      User.create(req.body, (err, createdUser) => {
        req.session.currentUser = createdUser;
        res.redirect("/trips");
      });
    }
  });
});

router.get("/signin", (req, res) => {
  res.render("users/signin.ejs");
});

router.post("/signin", (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (foundUser) {
      const validLogin = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );
      if (validLogin) {
        req.session.currentUser = foundUser;
        res.redirect("/trips");
      } else {
        res.send("Invalid username or password");
      }
    } else {
      res.send("Invalid username or password");
    }
  });
});

router.get("/signout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
