const express = require("express");
const router = express.Router();
const passport = require("passport");

// ✅ Login Page Route
router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("asc") });
});

// ✅ Handle Login Authentication
router.post("/login", (req, res, next) => {
  console.log("Login attempt:", req.body);

  passport.authenticate("local", {
    successRedirect: "/events", // ✅ Redirect to Events if successful
    failureRedirect: "/auth/login",
    failureFlash: true
  })(req, res, next);
});

// ✅ Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You have been logged out");
    res.redirect("/auth/login");
  });
});

// ✅ Authentication Middleware (To Protect Routes)
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // Proceed if user is authenticated
  }
  req.flash("error_msg", "Please log in to view this resource");
  res.redirect("/auth/login");
}

// ✅ Export Both Router and Middleware Separately
module.exports = router; // Export the router
module.exports.ensureAuthenticated = ensureAuthenticated; // Export the middleware separately
