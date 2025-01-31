const express = require("express");
const router = express.Router();
const connection = require("../db/connection");
const { ensureAuthenticated } = require("../middleware/auth"); 

// ✅ Render Registrations Page (Protected with Authentication)
router.get("/", ensureAuthenticated, (req, res) => {
  const query = `SELECT * FROM registration_view`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching registrations:", err.message);
      return res.status(500).send("Error fetching registrations");
    }
    res.render("registrations", { registrations: results, user: req.user }); 
  });
});

router.get("/api", ensureAuthenticated, (req, res) => {
  const query = `SELECT * FROM registration_view`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching registrations:", err.message);
      return res.status(500).json({ error: "Error fetching registrations" });
    }
    res.json(results);
  });
});

router.post("/add", ensureAuthenticated, (req, res) => {
  const { attendeeName, eventID, registeredOn, status } = req.body;

  if (!attendeeName || !eventID || !registeredOn || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO registration (attendeeName, eventID, registeredOn, status) VALUES (?, ?, ?, ?)";
  connection.query(query, [attendeeName, eventID, registeredOn, status], (err, result) => {
    if (err) {
      console.error("Error adding registration:", err.message);
      return res.status(500).json({ error: "Error adding registration" });
    }
    res.status(201).json({ message: "Registration added successfully", registrationID: result.insertId });
  });
});

router.put("/update/:id", ensureAuthenticated, (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const query = "UPDATE registration SET status = ? WHERE registrationID = ?";

  connection.query(query, [status, id], (err) => {
    if (err) {
      console.error("Error updating registration:", err.message);
      return res.status(500).json({ error: "Error updating registration" });
    }
    res.json({ message: "Registration updated successfully" });
  });
});

router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM registration WHERE registrationID = ?";

  connection.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting registration:", err.message);
      return res.status(500).json({ error: "Error deleting registration" });
    }
    res.json({ message: "Registration deleted successfully" });
  });
});

//Get Events for Registration Form (Protected)
router.get("/events", ensureAuthenticated, (req, res) => {
  const query = "SELECT eventID, eventName FROM events";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err.message);
      return res.status(500).json({ error: "Error fetching events" });
    }
    res.json(results);
  });
});

module.exports = router;
