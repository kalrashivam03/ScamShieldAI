const detectScam = require("../utils/scamdetector");
exports.analyzeMessage = (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "Message is required"
    });
  }

  const result = detectScam(message);

  let confidence = "Low";
  if (result === "Scam") confidence = "High";
  else if (result === "Suspicious") confidence = "Medium";

  res.json({
    success: true,
    verdict: result,
    confidence
  });
};
