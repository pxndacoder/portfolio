// Dark Mode Toggle (synced across all pages)
(function () {
  const html = document.documentElement;

  // Support multiple theme toggle buttons across pages (desktop/mobile)
  function getToggleButtons() {
    return Array.from(document.querySelectorAll(".theme-toggle"));
  }

  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  // Set initial theme
  if (savedTheme === "dark" || savedTheme === "light") {
    html.setAttribute("data-theme", savedTheme);
  } else {
    html.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
  }

  // Update toggle icon(s)
  function updateIcon() {
    const isDark = html.getAttribute("data-theme") === "dark";
    const buttons = getToggleButtons();

    buttons.forEach((btn) => {
      btn.innerHTML = isDark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';

      btn.setAttribute(
        "aria-label",
        isDark ? "Toggle light mode" : "Toggle dark mode"
      );
    });
  }

  // Apply icons after DOM is ready (avoids null buttons on some pages)
  document.addEventListener("DOMContentLoaded", () => {
    updateIcon();

    // Toggle theme on click (works on every page)
    getToggleButtons().forEach((btn) => {
      btn.addEventListener("click", () => {
        const currentTheme = html.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        html.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateIcon();
      });
    });
  });

  // Listen for system theme changes (only if user hasn't chosen a theme)
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const stored = localStorage.getItem("theme");
      if (stored !== "dark" && stored !== "light") {
        html.setAttribute("data-theme", e.matches ? "dark" : "light");
        updateIcon();
      }
    });

  // Optional: if theme changes in another tab, sync this tab too
  window.addEventListener("storage", (e) => {
    if (e.key !== "theme") return;
    if (e.newValue !== "dark" && e.newValue !== "light") return;

    html.setAttribute("data-theme", e.newValue);
    updateIcon();
  });
})();
