// server/Routes/noticeRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Notice = require("../models/Notice.js");

// Add Notice
router.post("/add", async (req, res) => {
  try {
    const { title, link } = req.body;
    const notice = new Notice({ title, link });
    await notice.save();
    res.status(201).json({ message: "Notice added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Notice
router.delete("/:id", async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; 
