const projectCards = Array.from(document.querySelectorAll(".project-card"));
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const searchInput = document.querySelector("#project-search");
const emptyState = document.querySelector("#empty-state");

let activeFilter = "all";

function normalize(value) {
  return value.trim().toLowerCase();
}

function applyProjectFilters() {
  const query = normalize(searchInput?.value || "");
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const category = card.dataset.category || "";
    const searchableText = normalize(card.dataset.search || "");
    const matchesCategory = activeFilter === "all" || category === activeFilter;
    const matchesSearch = !query || searchableText.includes(query);
    const isVisible = matchesCategory && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    applyProjectFilters();
  });
});

searchInput?.addEventListener("input", applyProjectFilters);

const heroCarousel = document.querySelector(".hero-carousel");
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));

function clearFocusedSlide() {
  heroSlides.forEach((slide) => {
    slide.classList.remove("is-focused");
    slide.style.removeProperty("--focus-x");
  });
}

function focusHeroSlide(slide) {
  if (!heroCarousel) {
    return;
  }

  const carouselRect = heroCarousel.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const carouselCenter = carouselRect.left + carouselRect.width / 2;
  const slideCenter = slideRect.left + slideRect.width / 2;
  const offset = carouselCenter - slideCenter;

  clearFocusedSlide();
  slide.style.setProperty("--focus-x", `${offset}px`);
  slide.classList.add("is-focused");
}

heroSlides.forEach((slide) => {
  slide.addEventListener("mouseenter", () => focusHeroSlide(slide));
  slide.addEventListener("focus", () => focusHeroSlide(slide));
  slide.addEventListener("mouseleave", clearFocusedSlide);
  slide.addEventListener("blur", clearFocusedSlide);
});

window.addEventListener("resize", clearFocusedSlide);
