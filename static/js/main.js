const projectCards = Array.from(document.querySelectorAll(".project-card"));
const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
const searchInput = document.querySelector("#project-search");
const emptyState = document.querySelector("#empty-state");

// The active category filter. "all" means no category restriction.
let activeFilter = "all";

function normalize(value) {
  // Normalize text so search is case-insensitive and easier to compare.
  return value.trim().toLowerCase();
}

function applyProjectFilters() {
  // Combine the selected category with the search input.
  const query = normalize(searchInput?.value || "");
  let visibleCount = 0;

  projectCards.forEach((card) => {
    // Each card stores its searchable content in data attributes rendered by Flask.
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
    // Show a friendly empty state when filters hide every project.
    emptyState.hidden = visibleCount > 0;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Update the category filter when a filter button is clicked.
    activeFilter = button.dataset.filter || "all";

    filterButtons.forEach((item) => {
      // Keep button styling and accessibility state in sync.
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
  // Reset carousel zoom and remove any custom centering offset.
  heroSlides.forEach((slide) => {
    slide.classList.remove("is-focused");
    slide.style.removeProperty("--focus-x");
  });
}

function focusHeroSlide(slide) {
  if (!heroCarousel) {
    return;
  }

  // Calculate how far the hovered slide must move to align with the carousel center.
  const carouselRect = heroCarousel.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const carouselCenter = carouselRect.left + carouselRect.width / 2;
  const slideCenter = slideRect.left + slideRect.width / 2;
  const offset = carouselCenter - slideCenter;

  clearFocusedSlide();
  // CSS reads this variable to center the focused slide during the zoom transition.
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

const aboutCards = Array.from(document.querySelectorAll(".about-list article"));
const aboutBackdrop = document.querySelector(".about-backdrop");

function closeAboutCard() {
  aboutCards.forEach((card) => {
    card.classList.remove("is-expanded");
    card.setAttribute("aria-expanded", "false");
  });
  aboutBackdrop?.classList.remove("is-visible");
}

function openAboutCard(card) {
  closeAboutCard();
  card.classList.add("is-expanded");
  card.setAttribute("aria-expanded", "true");
  aboutBackdrop?.classList.add("is-visible");
}

aboutCards.forEach((card) => {
  card.addEventListener("click", () => {
    if (card.classList.contains("is-expanded")) {
      closeAboutCard();
      return;
    }
    openAboutCard(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAboutCard(card);
    }
  });
});

aboutBackdrop?.addEventListener("click", closeAboutCard);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAboutCard();
  }
});

function setupImageLoading() {
  const images = Array.from(document.querySelectorAll("img"));

  images.forEach((img) => {
    if (img.complete && img.naturalWidth !== 0) {
      img.classList.add("is-loaded");
      return;
    }

    img.addEventListener("load", () => {
      img.classList.add("is-loaded");
    });

    img.addEventListener("error", () => {
      img.classList.add("is-loaded");
    });
  });
}

setupImageLoading();
