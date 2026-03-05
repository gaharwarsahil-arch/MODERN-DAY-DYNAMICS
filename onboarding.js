(() => {
  const form = document.getElementById("programForm");
  if (!form) return;

  const cached = localStorage.getItem("mrd_protocol");
  if (cached) {
    try {
      const p = JSON.parse(cached);
      form.reminder.value = p.reminder || "20:30";
      form.duration.value = p.duration || "3 minutes";
      form.channel.value = p.channel || "In-app";
    } catch (_e) {
      localStorage.removeItem("mrd_protocol");
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("mrd_protocol", JSON.stringify({
      reminder: form.reminder.value,
      duration: form.duration.value,
      channel: form.channel.value
    }));
    document.getElementById("saveState").textContent = "Plan saved. Day 1 prompt is active.";
  });
})();
