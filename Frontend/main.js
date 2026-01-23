document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     UTILS
  =============================== */

  const $ = (id) => document.getElementById(id);

  const getStoredResult = () => {
    try {
      return JSON.parse(localStorage.getItem("analysisResult"));
    } catch {
      return null;
    }
  };

  const normalizeVerdict = (verdict) => {
    if (!verdict) return "safe";
    return String(verdict).toLowerCase();
  };

  /* ===============================
     BACK BUTTON
  =============================== */

  const backBtn = $("back-button");
  if (backBtn) {
    backBtn.addEventListener("click", () => window.history.back());
  }

  /* ===============================
     AUTH (SIGN IN / SIGN UP)
  =============================== */

  const authForm = $("signin-form") || $("signup-form");
  const emailInput = $("email-input");
  const passwordInput = $("password-input");
  const confirmPasswordInput = $("confirm-password-input");

  if (authForm && emailInput && passwordInput && !$("messageInput")) {
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
     MESSAGE ANALYSIS (SUBMIT PAGE)
  =============================== */

  const scamForm = $("scamForm");
  const messageInput = $("messageInput");

  if (scamForm && messageInput) {
    scamForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const message = messageInput.value.trim();
      if (!message) {
        alert("Please enter a message.");
        return;
      }

      
      try {
        const response = await fetch("http://localhost:5000/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message })
        });

        const data = await response.json();
        if (!data.success) throw new Error("Analysis failed");

        // 🔒 Always overwrite old result
        localStorage.removeItem("analysisResult");

        localStorage.setItem("analysisResult", JSON.stringify({
          message,
          verdict: data.verdict,
          riskScore: Number(data.riskScore) || 0,
          indicators: Array.isArray(data.indicators) ? data.indicators : []
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

  const verdictText = $("verdict-text");
  const riskScoreEl = $("risk-score");
  const reasonList = $("reason-list");
  const indicatorList = $("indicator-list");
  const analyzedMessage = $("analyzed-message");
  const statusBanner = $("status-banner");

  if (verdictText && statusBanner) {

    const result = getStoredResult();
    if (!result) {
      verdictText.innerText = "No analysis result found.";
      return;
    }

    const verdict = normalizeVerdict(result.verdict);
    const riskScore = Number(result.riskScore) || 0;
    const indicators = result.indicators || [];

    // Reset UI
    statusBanner.className = "";
    reasonList.innerHTML = "";
    indicatorList.innerHTML = "";

    analyzedMessage.innerText = `"${result.message}"`;

    if (verdict.includes("safe")) {
      verdictText.innerText = "✅ Message Appears Safe";
      riskScoreEl.innerText = "0% (Low Risk)";
      statusBanner.classList.add("status-safe");

      reasonList.innerHTML = "<li>No threat indicators were detected.</li>";
      indicatorList.innerHTML = "<span>✔ No indicators</span>";
    }
    else if (verdict.includes("suspicious")) {
      verdictText.innerText = "⚠️ Suspicious Message";
      riskScoreEl.innerText = `${riskScore}% (Medium Risk)`;
      statusBanner.classList.add("status-medium-risk");

      indicators.forEach(ind => {
        reasonList.innerHTML += `<li>${ind} detected</li>`;
        indicatorList.innerHTML += `<span>⚠️ ${ind}</span>`;
      });
    }
    else {
      verdictText.innerText = "🚨 Scam Detected";
      riskScoreEl.innerText = `${riskScore}% (High Risk)`;
      statusBanner.classList.add("status-high-risk");

      indicators.forEach(ind => {
        reasonList.innerHTML += `<li>${ind} detected</li>`;
        indicatorList.innerHTML += `<span>🚨 ${ind}</span>`;
      });
    }
  }

  /* ===============================
     RESULT PAGE ACTIONS
  =============================== */

  const analyzeAgainBtn = $("secondary-btn");
  const reportBtn = $("primary-btn");

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
