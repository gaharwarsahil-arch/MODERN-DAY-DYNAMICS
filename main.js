(() => {
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach((a) => {
    if (a.getAttribute("href") === page) {
      a.classList.add("active");
    }
  });

  const slogans = [
    "Feelings + Frameworks = Better Choices",
    "From Panic Texts to Secure Bids",
    "Turn Conflict into Clarity",
    "Win-Win Dynamics, Not Mind Games"
  ];

  const slot = document.getElementById("rotatingSlogan");
  if (slot) {
    let idx = 0;
    slot.textContent = slogans[idx];
    setInterval(() => {
      idx = (idx + 1) % slogans.length;
      slot.textContent = slogans[idx];
    }, 2400);
  }

  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const groupName = group.getAttribute("data-tab-group");
    const buttons = document.querySelectorAll(`[data-tab-target][data-tab-group="${groupName}"]`);
    const panels = document.querySelectorAll(`[data-tab-panel][data-tab-group="${groupName}"]`);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab-target");
        buttons.forEach((b) => b.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const panel = document.querySelector(`[data-tab-panel="${target}"][data-tab-group="${groupName}"]`);
        if (panel) panel.classList.add("active");
      });
    });
  });
})();
