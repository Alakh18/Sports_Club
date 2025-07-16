// ui.js - Central UI behavior and utility functions

/** ESC key listener for modals */
export function enableEscapeKey(onClose) {
  const handler = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}

/** Smooth scroll to element by ID */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/** Add hover animation to buttons */
export function addHoverEffect(buttons) {
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "scale(1.05)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "scale(1)";
    });
  });
}

/** Smooth scroll behavior for nav links */
export function enableSmoothNavLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      scrollToId(targetId);
    });
  });
}
