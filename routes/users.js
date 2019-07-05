const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// User model
const User = require("../models/User");

router.get("/register", (req, res) => res.render("register"));
router.get("/login", (req, res) => res.render("login"));

// Register Handler
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields." });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match." });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Passwords sould be at least 6 characters." });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    User.findOne({ email: email }).then(user => {
      // User already exists
      if (user) {
        errors.push({ msg: "User already exists!" });

        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Set password to hashed
            newUser.password = hash;

            // Save user
            newUser
              .save()
              .then(res.redirect("/users/login"))
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

module.exports = router;
