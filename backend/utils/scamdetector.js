const scamKeywords = [
  "urgent",
  "click here",
  "verify your account",
  "bank alert",
  "otp",
  "win money",
  "free reward",
  "limited time",
  "lottery",
  "suspended",
  "reset password"
];

function detectScam(text) {
  let score = 0;
  const lowerText = text.toLowerCase();

  scamKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score++;
    }
  });

  if (score >= 3) return "Scam";
  if (score === 2) return "Suspicious";
  return "Safe";
}

module.exports = detectScam;
