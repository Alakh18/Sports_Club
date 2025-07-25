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

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function goTo(navigate, location, id) {
  if (location.pathname === "/") {
    const elementID = document.getElementById(id);
    if (elementID) {
      elementID.scrollIntoView({ behavior: "smooth" });
    }
  } else {
    navigate("/");
    setTimeout(() => {
      const elementID = document.getElementById(id);
      elementID?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }
}

export function handleAboutClick(navigate, location, target = "") {
  if (location.pathname.startsWith("/about")) {
    // Already on About page
    if (target === "contact") {
      const el = document.getElementById("contact");
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    // Navigate to About page and scroll after load
    navigate("/about");

    // Delay to ensure page renders before scrolling
    setTimeout(() => {
      if (target === "contact") {
        const el = document.getElementById("contact");
        el?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 150);
  }
}
