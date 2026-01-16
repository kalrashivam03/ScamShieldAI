const express = require("express");
const cors = require("cors");

const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/analyze", analyzeRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("ScamShield AI Backend is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
