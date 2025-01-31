const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const connection = require("../db/connection");
const { ensureAuthenticated } = require("../middleware/auth"); 

//  Render Users Page (Protected with Authentication)
router.get("/", ensureAuthenticated, (req, res) => {
  const query = "SELECT userID, fullName, username, email, role, status FROM users";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      return res.status(500).send("Error fetching users");
    }
    res.render("users", { users: results, user: req.user }); // 
  });
});

//  API Endpoint to Fetch Users (Protected)
router.get("/api", ensureAuthenticated, (req, res) => {
  const query = "SELECT userID, fullName, username, email, role, status FROM users";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      return res.status(500).json({ error: "Error fetching users" });
    }
    res.json(results); //  Send users as JSON for API
  });
});

//  Add a New User (Protected)
router.post("/add", async (req, res) => {
  const { fullName, username, email, password, role, status } = req.body;

  if (!fullName || !username || !email || !password || !role || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (fullName, username, email, password, role, status) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(query, [fullName, username, email, hashedPassword, role, status], (err, result) => {
      if (err) {
        console.error("Error adding user:", err.message);
        return res.status(500).json({ error: "Error adding user" });
      }
      res.status(201).json({ message: "User added successfully", userID: result.insertId });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//  Update User (Protected)
router.put("/update/:id", ensureAuthenticated, (req, res) => {
  const { fullName, username, email, role, status } = req.body;
  const query = "UPDATE users SET fullName = ?, username = ?, email = ?, role = ?, status = ? WHERE userID = ?";
  
  connection.query(query, [fullName, username, email, role, status, req.params.id], (err) => {
    if (err) {
      console.error("Error updating user:", err.message);
      return res.status(500).json({ error: "Error updating user" });
    }
    res.json({ message: "User updated successfully" });
  });
});

//  Delete User (Protected)
router.delete("/delete/:id", ensureAuthenticated, (req, res) => {
  const query = "DELETE FROM users WHERE userID = ?";
  
  connection.query(query, [req.params.id], (err) => {
    if (err) {
      console.error("Error deleting user:", err.message);
      return res.status(500).json({ error: "Error deleting user" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

module.exports = router;
