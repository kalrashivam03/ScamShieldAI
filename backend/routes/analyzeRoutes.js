const express = require("express");
const { analyzeMessage } = require("../controllers/analyzeController");

const router = express.Router();

// POST /api/analyze
router.post("/", analyzeMessage);

module.exports = router;
