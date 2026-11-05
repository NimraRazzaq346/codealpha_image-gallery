
// ==========================================
// 1. GET ALL DESTINATION IMAGES
// ==========================================

const allCards = [
    ...document.querySelectorAll(".destination-card")
];

const stage = document.getElementById("collageStage");
const title = document.getElementById("currentTitle");
const locationText = document.getElementById("currentLocation");
const count = document.getElementById("result-count");
const slideNumber = document.getElementById("slideNumber");

const continentButtons = document.querySelectorAll(".filter-btn");
const categoryButtons = document.querySelectorAll(".category-filter");

// LIGHTBOX ELEMENTS

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxLocation = document.getElementById("lightbox-location");

const closeBtn = document.getElementById("closeBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

// CAROUSEL BUTTONS

const carouselNext = document.getElementById("carouselNext");
const carouselPrev = document.getElementById("carouselPrev");

// ==========================================
// 2. CHECK REQUIRED HTML ELEMENTS
// ==========================================

if (
    !stage || !title || !locationText || !count ||
    !slideNumber || !lightbox || !lightboxImage ||
    !lightboxTitle || !lightboxLocation ||
    !closeBtn || !nextBtn || !prevBtn ||
    !carouselNext || !carouselPrev
) {
    console.error("Gallery error: One or more required HTML elements are missing.");
}

// ==========================================
// 3. DESTINATION INFORMATION
// ==========================================

function getName(card) {
    return card.dataset.name || "Beautiful Destination";
}

function getLocation(card) {
    return card.dataset.location || "Explore the world";
}

function getImage(card) {
    return card.querySelector("img");
}

// ==========================================
// 4. FILTER SETTINGS
// ==========================================

let selectedContinent = "all";
let selectedCategory = "all";

let visibleCards = [...allCards];

let currentIndex = 0;

// Apply both filters together.

function applyFilters() {

    visibleCards = allCards.filter(card => {

        const continentMatch =
            selectedContinent === "all" ||
            card.dataset.continent === selectedContinent;

        const categoryMatch =
            selectedCategory === "all" ||
            card.dataset.category === selectedCategory;

        return continentMatch && categoryMatch;

    });

    currentIndex = 0;

    renderGallery();
}

// ==========================================
// 5. CREATE IMAGE COLLAGE
// ==========================================

function renderGallery() {

    stage.innerHTML = "";

    if (visibleCards.length === 0) {

        title.textContent = "No destinations found";
        locationText.textContent = "Try another filter";

        count.textContent = "0 DESTINATIONS";
        slideNumber.textContent = "00 / 00";

        return;
    }

    const positions = [
        "pos-far-left",
        "pos-left",
        "pos-center",
        "pos-right",
        "pos-far-right"
    ];

    const offsets = [-2, -1, 0, 1, 2];

    let selectedOffsets;

    if (visibleCards.length >= 5) {
        selectedOffsets = offsets;
    } else if (visibleCards.length === 4) {
        selectedOffsets = [-2, -1, 0, 1];
    } else if (visibleCards.length === 3) {
        selectedOffsets = [-1, 0, 1];
    } else if (visibleCards.length === 2) {
        selectedOffsets = [-1, 0];
    } else {
        selectedOffsets = [0];
    }

    selectedOffsets.forEach(offset => {

        const index =
            (currentIndex + offset + visibleCards.length)
            % visibleCards.length;

        const card = visibleCards[index];
        const originalImage = getImage(card);

        if (!originalImage) return;

        const collageCard = document.createElement("button");

        collageCard.className =
            "collage-card " +
            positions[offset + 2];

        collageCard.type = "button";

        collageCard.setAttribute(
            "aria-label",
            "View " + getName(card)
        );

        const image = document.createElement("img");

        // Use the original image URL.
        image.src = originalImage.getAttribute("src");

        image.alt = originalImage.alt || getName(card);

        image.loading = "eager";

        // Show a fallback message if an image fails.
        image.addEventListener("error", () => {
            console.error(
                "Image failed to load:",
                getName(card),
                image.src
            );

            image.alt = getName(card) + " image unavailable";
        });

        collageCard.appendChild(image);

        collageCard.addEventListener("click", () => {

            if (offset === 0) {
                openLightbox(index);
            } else {
                currentIndex = index;
                renderGallery();
            }

        });

        stage.appendChild(collageCard);

    });

    // UPDATE DESTINATION DETAILS

    const activeCard = visibleCards[currentIndex];

    title.textContent = getName(activeCard);

    locationText.textContent = getLocation(activeCard);

    count.textContent =
        visibleCards.length + " DESTINATIONS";

    slideNumber.textContent =
        String(currentIndex + 1).padStart(2, "0") +
        " / " +
        String(visibleCards.length).padStart(2, "0");

}

// ==========================================
// 6. NEXT AND PREVIOUS IMAGES
// ==========================================

function nextImage() {

    if (visibleCards.length <= 1) return;

    currentIndex =
        (currentIndex + 1) % visibleCards.length;

    renderGallery();

}

function previousImage() {

    if (visibleCards.length <= 1) return;

    currentIndex =
        (currentIndex - 1 + visibleCards.length)
        % visibleCards.length;

    renderGallery();

}

// ==========================================
// 7. CONTINENT FILTERS
// ==========================================

continentButtons.forEach(button => {

    button.addEventListener("click", () => {

        continentButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedContinent = button.dataset.filter;

        applyFilters();

    });

});

// ==========================================
// 8. NATURE CATEGORY FILTERS
// ==========================================

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        // Reset continent filter only when selecting a category.
        selectedContinent = "all";

        continentButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        const allButton =
            document.querySelector('[data-filter="all"]');

        if (allButton) {
            allButton.classList.add("active");
        }

        applyFilters();

    });

});

// ==========================================
// 9. CAROUSEL BUTTON EVENTS
// ==========================================

carouselNext.addEventListener("click", nextImage);

carouselPrev.addEventListener("click", previousImage);

// ==========================================
// 10. OPEN LIGHTBOX
// ==========================================

function openLightbox(index) {

    if (visibleCards.length === 0) return;

    currentIndex = index;

    updateLightbox();

    lightbox.classList.add("show");

    document.body.style.overflow = "hidden";

}

// ==========================================
// 11. UPDATE LIGHTBOX IMAGE
// ==========================================

function updateLightbox() {

    const card = visibleCards[currentIndex];

    if (!card) return;

    const image = getImage(card);

    if (!image) return;

    lightboxImage.src = image.getAttribute("src");
    lightboxImage.alt = image.alt || getName(card);

    lightboxTitle.textContent = getName(card);

    lightboxLocation.textContent =
        "📍 " + getLocation(card);

}

// ==========================================
// 12. CLOSE LIGHTBOX
// ==========================================

function closeLightbox() {

    lightbox.classList.remove("show");

    document.body.style.overflow = "";

}

// ==========================================
// 13. LIGHTBOX NAVIGATION
// ==========================================

function lightboxNext() {

    if (visibleCards.length <= 1) return;

    currentIndex =
        (currentIndex + 1) % visibleCards.length;

    updateLightbox();

    renderGallery();

}

function lightboxPrevious() {

    if (visibleCards.length <= 1) return;

    currentIndex =
        (currentIndex - 1 + visibleCards.length)
        % visibleCards.length;

    updateLightbox();

    renderGallery();

}

// LIGHTBOX BUTTONS

closeBtn.addEventListener("click", closeLightbox);

nextBtn.addEventListener("click", lightboxNext);

prevBtn.addEventListener("click", lightboxPrevious);

// ==========================================
// 14. CLICK OUTSIDE LIGHTBOX
// ==========================================

lightbox.addEventListener("click", event => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});

// ==========================================
// 15. KEYBOARD CONTROLS
// ==========================================

document.addEventListener("keydown", event => {

    if (lightbox.classList.contains("show")) {

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            lightboxNext();
        }

        if (event.key === "ArrowLeft") {
            lightboxPrevious();
        }

    } else {

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

    }

});

// ==========================================
// 16. INITIALIZE GALLERY
// ==========================================

renderGallery();

console.log("Total destination cards:", allCards.length);

console.log("Gallery initialized successfully.");

console.log(
    "Moraine Lake found:",
    allCards.some(card => card.dataset.name === "Moraine Lake")
);
