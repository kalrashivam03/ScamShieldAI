const detectScam = require("../utils/scamdetector");

exports.analyzeMessage = (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: "Message is required"
    });
  }

  const analysis = detectScam(message);

  res.json({
    success: true,
    verdict: analysis.verdict,
    riskScore: analysis.riskScore,
    indicators: analysis.indicators
  });
};
