const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const dotenv = require("dotenv");

// ✅ Load Environment Variables
dotenv.config();

// ✅ Import Routes
const eventsRoutes = require("./routes/events");
const usersRoutes = require("./routes/users");
const registrationsRoutes = require("./routes/registrations");
const speakersRoutes = require("./routes/speakers");
const agendaRoutes = require("./routes/agenda");
const authRoutes = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;





const cors = require("cors");
app.use(cors({ origin: "https://event-mg-sys-git-master-mubaraks-projects-15463fd0.vercel.app/", credentials: true }));

// ✅ Passport Config
require("./db/passport")(passport);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "FrontEnd", "views")); // ✅ Fix View Path

// ✅ Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "1234",
    resave: false,
    saveUninitialized: true
  })
);

// ✅ Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Flash Messages Middleware
app.use(flash());

// ✅ Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/users", usersRoutes);
app.use("/registrations", registrationsRoutes);
app.use("/speakers", speakersRoutes);
app.use("/agenda", agendaRoutes);

// ✅ Default Route (Redirect to Login)
app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
