// NEON ORBIT: responsive motion, interactive glow, FAQ and back-to-top.
document.addEventListener("DOMContentLoaded", function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // FAQ: accessible, independent toggles
  document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (panel) panel.hidden = expanded;
      const item = button.closest(".faq-item");
      if (item) item.classList.toggle("is-open", !expanded);
      const icon = button.querySelector(".faq-icon");
      if (icon) icon.textContent = expanded ? "+" : "−";
    });
  });

  // Back to top, with reduced-motion respect
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
  }

  // Lightweight scroll progress indicator
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let pending = false;
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    bar.style.transform = "scaleX(" + fraction + ")";
    pending = false;
  }
  window.addEventListener("scroll", function () {
    if (!pending) {
      pending = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Scroll-triggered staggered entrances. No hidden content without observer support.
  const targets = document.querySelectorAll(
    ".section-heading, .about-card, .info-card, .caution-item, .tip-card, .prompt-example, .faq-item"
  );
  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px 45px 0px" });
    targets.forEach(function (el, index) {
      // Tiny stagger encourages quick, energetic cascading without prolonged waiting.
      el.style.setProperty("--reveal-delay", ((index % 3) * 65) + "ms");
      el.classList.add("reveal-ready");
      observer.observe(el);
    });
    reduceMotion.addEventListener("change", function (event) {
      if (event.matches) {
        targets.forEach(function (el) {
          el.classList.remove("reveal-ready");
          el.classList.add("is-visible");
          observer.unobserve(el);
        });
      }
    });
  }

  // Animated highlight follows pointer on cards (only for fine pointers).
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".about-card, .info-card, .tip-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--mx", (event.clientX - box.left) + "px");
        card.style.setProperty("--my", (event.clientY - box.top) + "px");
      }, { passive: true });
    });
  }
});
