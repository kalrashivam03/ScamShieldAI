function preprocessText(text) {

  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .toLowerCase()

    // Remove URLs
    .replace(/https?:\/\/\S+/g, " ")

    // Remove special characters
    .replace(/[^\w\s]/gi, " ")

    // Remove numbers
    .replace(/\d+/g, " ")

    // Remove extra spaces
    .replace(/\s+/g, " ")

    // Trim spaces
    .trim();
}

// Tokenizer
function tokenizeText(text) {

  const processedText = preprocessText(text);

  return processedText.split(" ");
}

module.exports = {
  preprocessText,
  tokenizeText
};