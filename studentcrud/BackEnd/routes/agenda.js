const express = require("express");
const router = express.Router();
const connection = require("../db/connection");
const { ensureAuthenticated } = require("../middleware/auth"); 

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("agenda", { user: req.user }); 
});

router.get("/api", ensureAuthenticated, (req, res) => {
  const query = "SELECT * FROM agenda_view"; 
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching agendas:", err.message);
      return res.status(500).json({ error: "Error fetching agendas" });
    }
    res.json(results);
  });
});

router.post("/add", ensureAuthenticated, (req, res) => {
  const { eventID, speakerID, sessionTitle, startTime, endTime } = req.body;
  const query = "INSERT INTO agenda (eventID, speakerID, sessionTitle, startTime, endTime) VALUES (?, ?, ?, ?, ?)";

  connection.query(query, [eventID, speakerID, sessionTitle, startTime, endTime], (err, result) => {
    if (err) {
      console.error("Error adding agenda:", err.message);
      return res.status(500).json({ error: "Error adding agenda" });
    }
    res.json({ message: "Agenda added successfully" });
  });
});

router.put("/update/:id", ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  const { eventID, speakerID, sessionTitle, startTime, endTime } = req.body;

  const query = `
    UPDATE agenda
    SET eventID = ?, speakerID = ?, sessionTitle = ?, startTime = ?, endTime = ?
    WHERE agendaID = ?
  `;

  connection.query(query, [eventID, speakerID, sessionTitle, startTime, endTime, id], (err, result) => {
    if (err) {
      console.error("Error updating agenda:", err.message);
      return res.status(500).json({ error: "Error updating agenda" });
    }
    res.json({ message: "Agenda updated successfully" });
  });
});

router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM agenda WHERE agendaID = ?";

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting agenda:", err.message);
      return res.status(500).json({ error: "Error deleting agenda" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Agenda not found" });
    }

    res.json({ message: "Agenda deleted successfully" });
  });
});
//Fetch events for Dropdown

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

//Fetch Speakers for Dropdown
router.get("/speakers", ensureAuthenticated, (req, res) => {
  const query = "SELECT speakerID, fullName FROM speakers";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching speakers:", err.message);
      return res.status(500).json({ error: "Error fetching speakers" });
    }
    res.json(results);
  });
});

module.exports = router;
