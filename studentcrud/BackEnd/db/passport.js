const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const connection = require("./connection");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      console.log("Authenticating user:", email);

      const query = "SELECT * FROM users WHERE email = ?";
      connection.query(query, [email], async (err, results) => {
        if (err) return done(err);
        if (results.length === 0) {
          return done(null, false, { message: "No user found with this email" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.userID);
  });

  passport.deserializeUser((id, done) => {
    const query = "SELECT * FROM users WHERE userID = ?";
    connection.query(query, [id], (err, results) => {
      if (err) return done(err);
      done(null, results[0]);
    });
  });
};
