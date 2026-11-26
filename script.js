"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
      menuToggle.focus();
    }
  });
}

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const welcomeScreen = document.querySelector(".welcome-screen");

if (welcomeScreen && document.documentElement.classList.contains("intro-pending")) {
  const finishWelcome = () => {
    document.documentElement.classList.remove("intro-pending");
    welcomeScreen.remove();
  };

  if (prefersReducedMotion) {
    finishWelcome();
  } else {
    window.setTimeout(finishWelcome, 2250);
  }
}

const codeEditor = document.querySelector("#code-editor");
const codeGutter = document.querySelector(".code-gutter");
const editorStatus = document.querySelector("#editor-status");
const heroArt = document.querySelector(".hero-art");
const codeWindow = document.querySelector(".code-window");

if (codeEditor && codeGutter && editorStatus) {
  const updateEditor = () => {
    const lineCount = codeEditor.value.split("\n").length;
    const visibleLineCount = Math.max(10, lineCount);
    codeGutter.textContent = Array.from(
      { length: visibleLineCount },
      (_, index) => String(index + 1).padStart(2, "0")
    ).join("\n");
    editorStatus.textContent = `Editing · ${lineCount} ${lineCount === 1 ? "line" : "lines"}`;
  };

  updateEditor();
  codeEditor.addEventListener("input", updateEditor);
  codeEditor.addEventListener("scroll", () => {
    codeGutter.scrollTop = codeEditor.scrollTop;
  });
  codeEditor.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const start = codeEditor.selectionStart;
      const end = codeEditor.selectionEnd;
      codeEditor.setRangeText("  ", start, end, "end");
      updateEditor();
    }
  });
}

if (
  heroArt &&
  codeWindow &&
  !prefersReducedMotion &&
  window.matchMedia("(pointer: fine)").matches
) {
  heroArt.addEventListener("pointermove", (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;
    codeWindow.style.setProperty("--tilt-y", `${horizontalPosition * 8}deg`);
    codeWindow.style.setProperty("--tilt-x", `${verticalPosition * -8}deg`);
  });

  heroArt.addEventListener("pointerleave", () => {
    codeWindow.style.setProperty("--tilt-x", "0deg");
    codeWindow.style.setProperty("--tilt-y", "0deg");
  });
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}
