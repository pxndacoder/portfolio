// script.js (shared across all pages)

// Force the loader to show on next visit to index.html (KB logo behavior)
window.forceShowLoader = function forceShowLoader() {
  sessionStorage.setItem("forceLoader", "true");
  sessionStorage.removeItem("hasSeenLoader");
};

// ---------- Loading Screen (index.html only) ----------
class LoadingScreen {
  constructor() {
    const forceLoader = sessionStorage.getItem("forceLoader") === "true";
    const hasSeenLoader = sessionStorage.getItem("hasSeenLoader") === "true";

    this.progressValue = 0;
    this.messages = [
      "Loading datasets...",
      "Training models...",
      "Building workflows...",
      "Welcome!",
    ];

    this.typewriterTexts = [
      "Analyzing data patterns",
      "Building automation workflows",
      "Visualizing insights",
    ];

    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    this.loadingScreen = document.getElementById("loadingScreen");
    this.mainContent = document.getElementById("mainContent");
    this.progress = document.getElementById("progress");
    this.progressPercent = document.getElementById("progressPercent");
    this.loadingStatus = document.getElementById("loadingStatus");
    this.typewriter = document.getElementById("typewriter");

    // Only applies on index.html where these elements exist
    if (!this.loadingScreen || !this.mainContent) return;

    // If loader should be skipped (not forced), ensure correct html classes
    if (!forceLoader && hasSeenLoader) {
      document.documentElement.classList.remove("show-loader");
      document.documentElement.classList.add("skip-loader");

      this.loadingScreen.classList.add("hidden");
      this.mainContent.classList.remove("hidden");
      return;
    }

    // If forcing, clear flag so it only forces once per click
    if (forceLoader) {
      sessionStorage.removeItem("forceLoader");
    }

    // Ensure we're in "show loader" mode while it runs
    document.documentElement.classList.remove("skip-loader");
    document.documentElement.classList.add("show-loader");

    this.startTypewriter();
    this.startProgress();
  }

  startTypewriter() {
    const tick = () => {
      if (!this.typewriter) return;

      const currentText = this.typewriterTexts[this.textIndex];

      if (this.isDeleting) {
        this.typewriter.textContent = currentText.substring(
          0,
          this.charIndex - 1
        );
        this.charIndex--;
      } else {
        this.typewriter.textContent = currentText.substring(
          0,
          this.charIndex + 1
        );
        this.charIndex++;
      }

      if (!this.isDeleting && this.charIndex === currentText.length) {
        setTimeout(() => {
          this.isDeleting = true;
          tick();
        }, 1500);
        return;
      }

      if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.typewriterTexts.length;
      }

      setTimeout(tick, this.isDeleting ? 50 : 100);
    };

    tick();
  }

  startProgress() {
    const interval = setInterval(() => {
      this.progressValue += Math.random() * 15;

      if (this.progressValue >= 100) {
        this.progressValue = 100;
        clearInterval(interval);

        setTimeout(() => {
          // Hide loader UI, show main content
          this.loadingScreen.classList.add("hidden");
          this.mainContent.classList.remove("hidden");

          // Mark as seen so HOME doesn't replay loader this session
          sessionStorage.setItem("hasSeenLoader", "true");

          // IMPORTANT: switch html classes so CSS stops hiding mainContent
          document.documentElement.classList.remove("show-loader");
          document.documentElement.classList.add("skip-loader");
        }, 500);
      }

      if (this.progress) this.progress.style.width = `${this.progressValue}%`;
      if (this.progressPercent) {
        this.progressPercent.textContent = `${Math.floor(this.progressValue)}%`;
      }

      const msgIndex = Math.min(
        Math.floor(this.progressValue / 25),
        this.messages.length - 1
      );

      if (this.loadingStatus) {
        this.loadingStatus.textContent = this.messages[msgIndex];
      }
    }, 200);
  }
}

// Make skipLoading available for your button onclick
window.skipLoading = function skipLoading() {
  const loadingScreen = document.getElementById("loadingScreen");
  const mainContent = document.getElementById("mainContent");

  if (loadingScreen) loadingScreen.classList.add("hidden");
  if (mainContent) mainContent.classList.remove("hidden");

  sessionStorage.setItem("hasSeenLoader", "true");
  sessionStorage.removeItem("forceLoader");

  // IMPORTANT: switch html classes so CSS stops hiding mainContent
  document.documentElement.classList.remove("show-loader");
  document.documentElement.classList.add("skip-loader");
};

// ---------- Mobile Menu (all pages) ----------
window.showMenu = function showMenu() {
  const navLinks = document.getElementById("navLinks");
  if (!navLinks) return;
  navLinks.style.right = "0";
  document.body.style.overflow = "hidden";
};

window.hideMenu = function hideMenu() {
  const navLinks = document.getElementById("navLinks");
  if (!navLinks) return;
  navLinks.style.right = "-300px";
  document.body.style.overflow = "auto";
};

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  const navLinks = document.getElementById("navLinks");
  const openBtn = document.querySelector("nav .fa-bars");
  if (!navLinks || !openBtn) return;

  const clickedInsideMenu = navLinks.contains(e.target);
  const clickedHamburger = openBtn.contains(e.target);

  if (!clickedInsideMenu && !clickedHamburger) {
    navLinks.style.right = "-300px";
    document.body.style.overflow = "auto";
  }
});

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  new LoadingScreen();
});
