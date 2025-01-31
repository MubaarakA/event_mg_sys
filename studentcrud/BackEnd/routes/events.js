const express = require("express");
const router = express.Router();
const connection = require("../db/connection");
const { ensureAuthenticated } = require("../middleware/auth"); 

// Protect Events Page with Authentication
router.get("/", ensureAuthenticated, (req, res) => {
  const query = "SELECT * FROM events";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err.message);
      return res.status(500).send("Error fetching events");
    }
    res.render("index", { events: results, user: req.user });
  });
});



// JSON Endpoint for Fetching Events
router.get("/api", (req, res) => {
  const query = "SELECT eventID, eventName, description, location, eventDate, capacity, status FROM events";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err.message);
      return res.status(500).json({ error: "Error fetching events" });
    }
    res.json(results); // Send events as JSON for API consumption
  });
});

// Add Event Route (unchanged)
router.post("/add", (req, res) => {
  const { eventName, description, location, eventDate, capacity, status } = req.body;
  const query = "INSERT INTO events (eventName, description, location, eventDate, capacity, status) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(query, [eventName, description, location, eventDate, capacity, status], (err) => {
    if (err) {
      console.error("Error adding event:", err.message);
      return res.status(500).send("Error adding event");
    }
    res.redirect("/events"); // Redirect back to the events page
  });
});

// Update Event Route (unchanged)
router.put("/update/:id", (req, res) => {
  const { eventName, description, location, eventDate, capacity, status } = req.body;
  const query = "UPDATE events SET eventName = ?, description = ?, location = ?, eventDate = ?, capacity = ?, status = ? WHERE eventID = ?";
  connection.query(query, [eventName, description, location, eventDate, capacity, status, req.params.id], (err) => {
    if (err) {
      console.error("Error updating event:", err.message);
      return res.status(500).send("Error updating event");
    }
    res.json({ message: "Event updated successfully" });
  });
});

// Delete Event Route (unchanged)
router.delete("/delete/:id", (req, res) => {
  const query = "DELETE FROM events WHERE eventID = ?";
  connection.query(query, [req.params.id], (err) => {
    if (err) {
      console.error("Error deleting event:", err.message);
      return res.status(500).send("Error deleting event");
    }
    res.json({ message: "Event deleted successfully" });
  });
});


module.exports = router;
