const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  verdict: {
    type: String,
    enum: ["Safe", "Suspicious", "Scam"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", reportSchema);
