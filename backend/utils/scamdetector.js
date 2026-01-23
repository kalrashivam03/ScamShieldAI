module.exports = function detectScam(message) {
  const text = message.toLowerCase();
  let score = 0;
  const indicators = [];

  const rules = [
    { pattern: /urgent|immediately|act now/, score: 20, label: "Urgent language" },
    { pattern: /click here|verify now|login now/, score: 25, label: "Suspicious link prompt" },
    { pattern: /free money|won|lottery|prize/, score: 30, label: "Too-good-to-be-true offer" },
    { pattern: /bank|account|password|otp/, score: 35, label: "Sensitive information request" },
    { pattern: /http:\/\/|https:\/\//, score: 15, label: "External link detected" }
  ];

  rules.forEach(rule => {
    if (rule.pattern.test(text)) {
      score += rule.score;
      indicators.push(rule.label);
    }
  });

  let verdict = "Safe";
  if (score >= 70) verdict = "Scam";
  else if (score >= 30) verdict = "Suspicious";

  return {
    verdict,
    riskScore: Math.min(score, 100),
    indicators
  };
};
