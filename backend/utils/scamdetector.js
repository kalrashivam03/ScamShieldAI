const scamKeywords = require("../datasets/scam_keywords.json");
const safeWords = require("../datasets/safe_words.json");
const phishingPatterns = require("../datasets/phishing_patterns.json");

const {
  preprocessText,
  tokenizeText
} = require("./preprocessing");

module.exports = function detectScam(message) {

  // -----------------------------
  // PREPROCESSING
  // -----------------------------

  const cleanText = preprocessText(message);
  const tokens = tokenizeText(message);

  const rawText = message.toLowerCase();

  let score = 0;

  const indicators = [];
  const matchedCategories = [];

  // -----------------------------
  // DETECTION FLAGS
  // -----------------------------

  const detected = {
    urgency: false,
    phishing: false,
    financial: false,
    credentials: false,
    threats: false,
    government: false,
    links: false
  };

  // -----------------------------
  // CATEGORY DETECTION
  // -----------------------------

  Object.keys(scamKeywords).forEach(category => {

    scamKeywords[category].forEach(keyword => {

      // Split keyword phrase into tokens
      const keywordTokens = keyword.split(" ");

      // Check if ALL keyword tokens exist
      const matched = keywordTokens.every(token =>
        cleanText.includes(token)
      );

      if (matched) {

        detected[category] = true;

        if (!matchedCategories.includes(category)) {
          matchedCategories.push(category);
        }

      }

    });

  });

  // -----------------------------
  // LINK DETECTION
  // -----------------------------

  const urlPattern = /(https?:\/\/[^\s]+)/g;

  if (urlPattern.test(rawText)) {

    detected.links = true;

    if (!matchedCategories.includes("links")) {
      matchedCategories.push("links");
    }

  }

  phishingPatterns.suspiciousLinks.forEach(link => {

    if (rawText.includes(link)) {

      detected.links = true;

      if (!matchedCategories.includes("links")) {
        matchedCategories.push("links");
      }

    }

  });

  // -----------------------------
  // SCORING SYSTEM
  // -----------------------------

  if (detected.urgency) {
    score += 15;
    indicators.push("Urgent language detected");
  }

  if (detected.phishing) {
    score += 25;
    indicators.push("Phishing-style request detected");
  }

  if (detected.financial) {
    score += 20;
    indicators.push("Financial bait detected");
  }

  if (detected.credentials) {
    score += 30;
    indicators.push("Sensitive information request detected");
  }

  if (detected.threats) {
    score += 35;
    indicators.push("Threatening language detected");
  }

  if (detected.government) {
    score += 25;
    indicators.push("Government identity scam indicators detected");
  }

  if (detected.links) {
    score += 15;
    indicators.push("Suspicious link detected");
  }

  // -----------------------------
  // COMBINATION BOOSTS
  // -----------------------------

  if (detected.urgency && detected.credentials) {
    score += 20;
  }

  if (detected.credentials && detected.phishing) {
    score += 25;
  }

  if (detected.credentials && detected.links) {
    score += 25;
  }

  if (detected.urgency && detected.links) {
    score += 15;
  }

  if (detected.phishing && detected.links) {
    score += 20;
  }

  if (detected.financial && detected.links) {
    score += 15;
  }

  if (detected.threats && detected.credentials) {
    score += 20;
  }

  if (detected.government && detected.credentials) {
    score += 20;
  }

  // -----------------------------
  // SAFE CONTEXT REDUCTION
  // -----------------------------

  safeWords.forEach(word => {

    if (tokens.includes(word)) {
      score -= 10;
    }

  });

  // -----------------------------
  // NORMALIZATION
  // -----------------------------

  score = Math.max(score, 0);
  score = Math.min(score, 100);

  // -----------------------------
  // VERDICT LOGIC
  // -----------------------------

  let verdict = "Safe";
  let riskLevel = "LOW";

  if (score >= 75) {

    verdict = "Scam";
    riskLevel = "HIGH";

  }
  else if (score >= 40) {

    verdict = "Suspicious";
    riskLevel = "MEDIUM";

  }

  // -----------------------------
  // FINAL RESPONSE
  // -----------------------------

  return {
    verdict,
    riskLevel,
    riskScore: score,
    indicators,
    matchedCategories
  };

};