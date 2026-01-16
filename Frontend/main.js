document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     BACK BUTTON
  =============================== */
  const backButton = document.getElementById("back-button");
  if (backButton) {
    backButton.addEventListener("click", () => window.history.back());
  }

  /* ===============================
     AUTH (SIGN IN / SIGN UP)
  =============================== */
  const authForm = document.getElementById("submit-form");
  const emailInput = document.getElementById("email-input");
  const passwordInput = document.getElementById("password-input");
  const confirmPasswordInput = document.getElementById("confirm-password-input");

  if (authForm && emailInput && passwordInput && !document.getElementById("message-input")) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        alert("Please fill in all required fields.");
        return;
      }

      if (confirmPasswordInput) {
        if (password !== confirmPasswordInput.value.trim()) {
          alert("Passwords do not match.");
          return;
        }
        alert("Account created successfully!");
        window.location.href = "signin.html";
      } else {
        alert("Signed in successfully!");
        window.location.href = "Home.html";
      }
    });
  }

  /* ===============================
     MESSAGE ANALYSIS (BACKEND)
  =============================== */
  const analyzeForm = document.getElementById("scamForm");
  const messageInput = document.getElementById("messageInput");
  const resultDiv = document.getElementById("result");

  if (analyzeForm && messageInput) {
    analyzeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const message = messageInput.value.trim();
      if (!message) {
        alert("Please enter a message.");
        return;
      }

      if (resultDiv) resultDiv.innerText = "Analyzing...";

      try {
        const response = await fetch("http://localhost:5000/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        const data = await response.json();
        if (!data.success) throw new Error("Analysis failed");

        // Save backend response for result page
        localStorage.setItem("analysisResult", JSON.stringify({
          message,
          verdict: data.verdict,
          riskScore: data.riskScore,
          indicators: data.indicators
        }));

        window.location.href = "result.html";

      } catch (err) {
        console.error(err);
        alert("Unable to analyze message. Please try again.");
      }
    });
  }

  /* ===============================
     RESULT PAGE RENDERING
  =============================== */
const verdictText = document.getElementById("verdict-text");
const riskScoreEl = document.getElementById("risk-score");
const reasonList = document.getElementById("reason-list");
const indicatorList = document.getElementById("indicator-list");
const analyzedMessage = document.getElementById("analyzed-message");
const statusBanner = document.getElementById("status-banner");

const storedResult = localStorage.getItem("analysisResult");

if (!storedResult) {
  console.warn("No analysis result found");
  return;
}

const { message, verdict, riskScore, indicators } = JSON.parse(storedResult);

// ✅ SAFETY: normalize indicators
const safeIndicators = Array.isArray(indicators) ? indicators : [];

// Message
analyzedMessage.innerText = `"${message}"`;

// Reset banner state
statusBanner.classList.remove(
  "status-safe",
  "status-medium-risk",
  "status-high-risk"
);

// Clear lists
reasonList.innerHTML = "";
indicatorList.innerHTML = "";

// ================= SAFE =================
if (verdict === "Safe") {
  verdictText.innerText = "✅ Message Appears Safe";
  riskScoreEl.innerText = "0% (Low Risk)";
  statusBanner.classList.add("status-safe");

  reasonList.innerHTML = "<li>No threat indicators were detected.</li>";
  indicatorList.innerHTML = "<span>✔ No indicators</span>";
}

// ================= SUSPICIOUS =================
else if (verdict === "Suspicious") {
  verdictText.innerText = "⚠️ Suspicious Message";
  riskScoreEl.innerText = `${riskScore}% (Medium Risk)`;
  statusBanner.classList.add("status-medium-risk");

  if (safeIndicators.length === 0) {
    reasonList.innerHTML = "<li>Minor risk patterns detected.</li>";
  } else {
    safeIndicators.forEach(ind => {
      reasonList.innerHTML += `<li>${ind} detected</li>`;
      indicatorList.innerHTML += `<span>⚠️ ${ind}</span>`;
    });
  }
}

// ================= SCAM =================
else {
  verdictText.innerText = "🚨 Scam Detected";
  riskScoreEl.innerText = `${riskScore}% (High Risk)`;
  statusBanner.classList.add("status-high-risk");

  if (safeIndicators.length === 0) {
    reasonList.innerHTML = "<li>Multiple high-risk patterns detected.</li>";
  } else {
    safeIndicators.forEach(ind => {
      reasonList.innerHTML += `<li>${ind} detected</li>`;
      indicatorList.innerHTML += `<span>🚨 ${ind}</span>`;
    });
  }
}


  /* ===============================
     RESULT ACTIONS
  =============================== */
  const analyzeAgainBtn = document.getElementById("secondary-btn");
  const reportBtn = document.getElementById("primary-btn");

  if (analyzeAgainBtn) {
    analyzeAgainBtn.addEventListener("click", () => {
      window.location.href = "submit.html";
    });
  }

  if (reportBtn) {
    reportBtn.addEventListener("click", () => {
      alert("Thank you for reporting. This helps protect others.");
    });
  }

});
