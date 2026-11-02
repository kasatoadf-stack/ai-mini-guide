// 生成AI活用ミニガイド：FAQとトップへ戻るボタン
document.addEventListener("DOMContentLoaded", function () {
  // FAQをクリックして回答を表示・非表示にする
  const faqButtons = document.querySelectorAll(".faq-question");
  faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      const answerId = button.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);
      if (answer) {
        answer.hidden = isExpanded;
      }
      const faqItem = button.closest(".faq-item");
      if (faqItem) {
        faqItem.classList.toggle("is-open", !isExpanded);
      }
      const icon = button.querySelector(".faq-icon");
      if (icon) {
        icon.textContent = isExpanded ? "+" : "−";
      }
    });
  });

  // ページの先頭へ戻る
  const backToTopButton = document.getElementById("backToTop");
  if (backToTopButton) {
    backToTopButton.addEventListener("click", function () {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }
});
