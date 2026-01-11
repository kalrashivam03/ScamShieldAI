document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       BACK BUTTON HANDLING
    =============================== */
    const backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.addEventListener("click", () => {
            window.history.back();
        });
    }

    /* ===============================
       SIGN IN & SIGN UP HANDLING
    =============================== */
    const authForm = document.getElementById("submit-form");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const confirmPasswordInput = document.getElementById("confirm-password-input");

    if (authForm && emailInput && passwordInput) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                alert("Please fill in all required fields.");
                return;
            }

            // SIGN UP PAGE
            if (confirmPasswordInput) {
                const confirmPassword = confirmPasswordInput.value.trim();

                if (password !== confirmPassword) {
                    alert("Passwords do not match.");
                    return;
                }

                localStorage.setItem("scamshield_user", email);
                alert("Account created successfully!");
                window.location.href = "signin.html";
            }
            // SIGN IN PAGE
            else {
                localStorage.setItem("scamshield_user", email);
                alert("Signed in successfully!");
                window.location.href = "Home.html";
            }
        });
    }

    /* ===============================
       SUBMIT MESSAGE FOR ANALYSIS
    =============================== */
    const messageInput = document.getElementById("message-input");

    if (authForm && messageInput) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const message = messageInput.value.trim();

            if (!message) {
                alert("Please enter a message to analyze.");
                return;
            }

            // Save message for result page
            localStorage.setItem("scamshield_message", message);

            // Fake risk score for demo (AI placeholder)
            const riskScore = Math.floor(Math.random() * 40) + 60; // 60–99%
            localStorage.setItem("scamshield_risk", riskScore);

            window.location.href = "result.html";
        });
    }

    /* ===============================
       RESULT PAGE LOGIC
    =============================== */
    const messageBox = document.getElementById("message-box");
    const riskBanner = document.getElementById("status-banner-high-risk");

    if (messageBox && riskBanner) {
        const storedMessage = localStorage.getItem("scamshield_message");
        const riskScore = localStorage.getItem("scamshield_risk");

        if (storedMessage) {
            messageBox.innerHTML = `<p>"${storedMessage}"</p>`;
        }

        if (riskScore) {
            riskBanner.querySelector("p").innerHTML =
                `Risk Score: <strong>${riskScore}%</strong> (High Risk)`;
        }
    }

    /* ===============================
       RESULT PAGE ACTION BUTTONS
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
            alert("Thank you for reporting! This helps protect others.");
        });
    }

});
