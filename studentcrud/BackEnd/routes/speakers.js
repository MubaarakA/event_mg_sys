const express = require("express");
const router = express.Router();
const connection = require("../db/connection"); 
const { ensureAuthenticated } = require("../middleware/auth"); 

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("speakers", { user: req.user }); // ✅ Pass user data
});

router.get("/api", ensureAuthenticated, (req, res) => {
  const query = "SELECT * FROM speaker_details"; // ✅ Use the view
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching speakers:", err.message);
      return res.status(500).json({ error: "Error fetching speakers" });
    }
    res.json(results);
  });
});

router.post("/add", ensureAuthenticated, (req, res) => {
  const { fullName, email, phone, topic, eventID } = req.body;
  const query = `
    INSERT INTO speakers (fullName, email, phone, topic, eventID) 
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(query, [fullName, email, phone, topic, eventID], (err, result) => {
    if (err) {
      console.error("Error adding speaker:", err.message);
      return res.status(500).json({ error: "Error adding speaker" });
    }
    res.status(201).json({ message: "Speaker added successfully", speakerID: result.insertId });
  });
});

//  Fetch Events for Dropdown (Protected)
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

router.put("/update/:id", ensureAuthenticated, (req, res) => {
  const { fullName, email, phone, topic, eventID } = req.body;
  const speakerID = req.params.id;

  const query = `
    UPDATE speakers 
    SET fullName = ?, email = ?, phone = ?, topic = ?, eventID = ?
    WHERE speakerID = ?
  `;

  connection.query(query, [fullName, email, phone, topic, eventID, speakerID], (err, result) => {
    if (err) {
      console.error("Error updating speaker:", err.message);
      return res.status(500).json({ error: "Error updating speaker" });
    }
    res.json({ message: "Speaker updated successfully" });
  });
});

//  Delete Speaker (Protected)
router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM speakers WHERE speakerID = ?";

  connection.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting speaker:", err.message);
      return res.status(500).json({ error: "Error deleting speaker" });
    }
    res.json({ message: "Speaker deleted successfully" });
  });
});

module.exports = router;
