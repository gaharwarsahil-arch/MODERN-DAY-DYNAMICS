const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

function compute(values) {
  const predictability = (values.responsiveness + values.boundaryClarity) / 2;
  const safety = clamp((predictability + values.repairAttempts - (values.threatReactivity * 0.35)), 0, 10);
  const prb = clamp(((values.responsiveness + values.repairAttempts) / 2) / Math.max(values.oneSidedPursuit, 1), 0, 2);
  const conflictValue = clamp((((11 - values.defensiveness) + values.repairAttempts + values.boundaryClarity) / 3), 0, 10);
  const stability = clamp((((11 - values.threatReactivity) + values.boundaryClarity + values.responsiveness) / 3) - (values.oneSidedPursuit * 0.2), 0, 10);
  const equilibrium = Math.round((safety * 0.35 + clamp(prb * 5, 0, 10) * 0.2 + conflictValue * 0.25 + stability * 0.2) * 10);

  return { safety, prb, conflictValue, stability, equilibrium };
}

function label(score) {
  if (score <= 30) return "unstable loop";
  if (score <= 60) return "mixed stability";
  if (score <= 80) return "recovering stability";
  return "high-functioning";
}

function recommendations(scores) {
  const stack = [
    { key: "safety", text: "Run the 90-second regulation reset before any high-stakes message." },
    { key: "prb", text: "Use one secure bid script instead of repeated reassurance requests." },
    { key: "conflictValue", text: "Set one explicit boundary and one expectation this week." },
    { key: "stability", text: "Track triggers daily and separate body alarm from story." }
  ];

  return stack.sort((a, b) => scores[a.key] - scores[b.key]).slice(0, 3).map((x) => x.text);
}

function setupForm() {
  const form = document.getElementById("scannerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const values = {
      threatReactivity: Number(form.threatReactivity.value),
      responsiveness: Number(form.responsiveness.value),
      repairAttempts: Number(form.repairAttempts.value),
      oneSidedPursuit: Number(form.oneSidedPursuit.value),
      defensiveness: Number(form.defensiveness.value),
      boundaryClarity: Number(form.boundaryClarity.value),
      mode: form.mode.value,
      goal: form.goal.value
    };

    const scores = compute(values);
    const payload = {
      values,
      scores,
      label: label(scores.equilibrium),
      recs: recommendations(scores)
    };

    localStorage.setItem("mrd_scan", JSON.stringify(payload));
    window.location.href = "results.html";
  });
}

function renderResults() {
  const root = document.getElementById("resultRoot");
  if (!root) return;

  const fallback = {
    scores: { equilibrium: 47, safety: 4.9, prb: 0.64, conflictValue: 4.1, stability: 4.5 },
    label: "mixed stability",
    recs: [
      "Run the 90-second regulation reset before any high-stakes message.",
      "Use one secure bid script instead of repeated reassurance requests.",
      "Set one explicit boundary and one expectation this week."
    ]
  };

  let data = fallback;
  const raw = localStorage.getItem("mrd_scan");
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch (_e) {
      localStorage.removeItem("mrd_scan");
    }
  }

  document.getElementById("eqScore").textContent = `${data.scores.equilibrium}/100`;
  document.getElementById("eqLabel").textContent = data.label;
  document.getElementById("safetyScore").textContent = `${data.scores.safety.toFixed(1)}/10`;
  document.getElementById("prbScore").textContent = data.scores.prb.toFixed(2);
  document.getElementById("conflictScore").textContent = `${data.scores.conflictValue.toFixed(1)}/10`;
  document.getElementById("stabilityScore").textContent = `${data.scores.stability.toFixed(1)}/10`;

  const list = document.getElementById("recList");
  list.innerHTML = "";
  data.recs.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r;
    list.appendChild(li);
  });
}

setupForm();
renderResults();
