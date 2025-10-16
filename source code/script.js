const passwordInput = document.getElementById('password');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const strengthText = document.getElementById('strength-text');
const suggestionsDiv = document.getElementById('suggestions');

passwordInput.addEventListener('input', function() {
    const pwd = passwordInput.value;
    const strength = analyzeStrength(pwd);
    drawVisualizer(pwd, strength.score);
    displayFeedback(strength);
});

function analyzeStrength(password) {
    let score = 0;
    let suggestions = [];

    if (password.length >= 8) score++;
    else suggestions.push("Use at least 8 characters.");
    if (/[a-z]/.test(password)) score++;
    else suggestions.push("Add lowercase letters.");
    if (/[A-Z]/.test(password)) score++;
    else suggestions.push("Include uppercase letters.");
    if (/[0-9]/.test(password)) score++;
    else suggestions.push("Use numbers.");
    if (/[^A-Za-z0-9]/.test(password)) score++;
    else suggestions.push("Add special symbols (e.g., !@#).");

    let text = ["Chaotic (Weak)", "Somewhat weak", "Moderate", "Nearly strong", "Strong (Harmonious)"][score];

    return { score, text, suggestions };
}

function drawVisualizer(password, score) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Artistic Feedback: weak = many random lines, strong = smooth rainbow
    if (score < 3) {
        // Chaotic pattern: random lines
        for (let i = 0; i < 40; i++) {
            ctx.strokeStyle = `rgba(${rand(50,200)},${rand(60,200)},${rand(50,200)}, 0.4)`;
            ctx.beginPath();
            ctx.moveTo(rand(0,320), rand(0,80));
            ctx.lineTo(rand(0,320), rand(0,80));
            ctx.stroke();
        }
    } else {
        // Harmonious pattern: rainbow arcs
        for (let i = 0; i < password.length; i++) {
            ctx.strokeStyle = `hsl(${i*40}, 80%, 60%)`;
            ctx.beginPath();
            ctx.arc(160, 40, 16+i*6, Math.PI*1.5, Math.PI*2, false);
            ctx.stroke();
        }
    }
}

// Utility random number function
function rand(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function displayFeedback(strength) {
    const texts = [
        "Very Weak (easily guessable)",
        "Weak",
        "Moderate",
        "Strong",
        "Very Strong"
    ];
    const colors = ["#c0392b", "#e67e22", "#f1c40f", "#17a589", "#229954"];
    strengthText.textContent = "Strength: " + texts[strength.score];
    strengthText.style.color = colors[strength.score];
    suggestionsDiv.innerHTML = "Suggestions:<ul>" + strength.suggestions.map(s => `<li>${s}</li>`).join('') + "</ul>";
}
