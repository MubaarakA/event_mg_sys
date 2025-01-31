const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// ✅ Import Routes
const eventsRoutes = require("./routes/events");
const usersRoutes = require("./routes/users");
const registrationsRoutes = require("./routes/registrations");
const speakersRoutes = require("./routes/speakers");
const agendaRoutes = require("./routes/agenda");
const authRoutes = require("./middleware/auth"); // ✅ Correctly require auth.js

const app = express();
const PORT = 3000;


const cors = require("cors");

app.use(cors({
  origin: "https://your-frontend.vercel.app", // ✅ Allow only your frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));


// ✅ Passport Config
require("./db/passport")(passport);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../FrontEnd/public")));
app.set("views", path.join(__dirname, "..", "FrontEnd", "views")); // Correct the path

app.set("view engine", "ejs");

// ✅ Session Middleware
app.use(
  session({
    secret: "1234", // Change this to a secure key
    resave: false,
    saveUninitialized: true
  })
);

// ✅ Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Flash Messages Middleware
app.use(flash());

// ✅ Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null; // Make user accessible in all views
  next();
});

// ✅ Routes
app.use("/auth", authRoutes); // ✅ Use auth routes correctly
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
