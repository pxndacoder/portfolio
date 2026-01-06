document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  if (!buttons.length || !cards.length) return;

  const setActive = (activeBtn) => {
    buttons.forEach((b) => b.classList.remove("active"));
    activeBtn.classList.add("active");
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      setActive(btn);

      cards.forEach((card) => {
        const category = card.dataset.category;
        const show = filter === "all" || category === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });
});
