// ============================================
// KEYBOARD NAVIGATION APP
// ============================================

// Image data
const images = [
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    caption: "Mountain Landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1469022563149-aa64dbd37daa?w=800&h=600&fit=crop",
    caption: "Ocean Waves",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    caption: "Forest Path",
  },
  {
    src: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
    caption: "Sunset Sky",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    caption: "Snowy Mountain",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    caption: "Desert Dunes",
  },
  {
    src: "https://images.unsplash.com/photo-1469022563149-aa64dbd37daa?w=800&h=600&fit=crop",
    caption: "Aurora Borealis",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    caption: "Tropical Beach",
  },
  {
    src: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
    caption: "City Lights",
  },
];

// Commands
const commands = [
  {
    icon: "▶",
    name: "Play Slideshow",
    shortcut: "Space",
    action: "playSlideshow",
  },
  {
    icon: "⏸",
    name: "Pause Slideshow",
    shortcut: "Space",
    action: "pauseSlideshow",
  },
  { icon: "←", name: "Previous Image", shortcut: "←", action: "previousImage" },
  { icon: "→", name: "Next Image", shortcut: "→", action: "nextImage" },
  {
    icon: "🔍",
    name: "Toggle Fullscreen",
    shortcut: "F",
    action: "toggleFullscreen",
  },
  {
    icon: "🎨",
    name: "Random Background",
    shortcut: "R",
    action: "randomBackground",
  },
  { icon: "ℹ️", name: "Show Help", shortcut: "?", action: "showHelp" },
  { icon: "🔄", name: "Reset View", shortcut: "Home", action: "resetView" },
];

// ============================================
// DOM ELEMENTS
// ============================================
const mainImage = document.querySelector("#mainImage");
const imageCounter = document.querySelector("#imageCounter");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const playBtn = document.querySelector("#playBtn");
const openPaletteBtn = document.querySelector("#openPaletteBtn");

const imageModal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const modalCaption = document.querySelector("#modalCaption");
const modalClose = document.querySelector("#modalClose");

const commandPalette = document.querySelector("#commandPalette");
const paletteInput = document.querySelector("#paletteInput");
const commandsList = document.querySelector("#commandsList");

const thumbnailsContainer = document.querySelector("#thumbnailsContainer");

// ============================================
// STATE
// ============================================
let currentImageIndex = 0;
let isPlaying = false;
let slideshowInterval = null;
let selectedCommandIndex = 0;
let filteredCommands = [...commands];

// ============================================
// 1. GALLERY FUNCTIONS
// ============================================
function initGallery() {
  renderImage();
  renderThumbnails();
}

function renderImage() {
  mainImage.src = images[currentImageIndex].src;
  imageCounter.textContent = `${currentImageIndex + 1}/${images.length}`;
  updateThumbnailSelection();
}

function renderThumbnails() {
  thumbnailsContainer.innerHTML = "";

  images.forEach((img, index) => {
    const thumbnail = document.createElement("img");
    thumbnail.src = img.src;
    thumbnail.alt = img.caption;
    thumbnail.className = "thumbnail";
    if (index === currentImageIndex) {
      thumbnail.classList.add("active");
    }

    thumbnail.addEventListener("click", () => {
      currentImageIndex = index;
      renderImage();
      stopSlideshow();
    });

    thumbnail.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        currentImageIndex = index;
        renderImage();
        stopSlideshow();
      }
    });

    thumbnailsContainer.appendChild(thumbnail);
  });
}

function updateThumbnailSelection() {
  document.querySelectorAll(".thumbnail").forEach((thumb, index) => {
    thumb.classList.toggle("active", index === currentImageIndex);
  });
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  renderImage();
}

function previousImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  renderImage();
}

function jumpToImage(index) {
  if (index > 0 && index <= images.length) {
    currentImageIndex = index - 1;
    renderImage();
    stopSlideshow();
  }
}

// ============================================
// 2. SLIDESHOW FUNCTIONS
// ============================================
function playSlideshow() {
  if (isPlaying) return;

  isPlaying = true;
  playBtn.textContent = "⏸ Pause";
  playBtn.setAttribute("aria-label", "Pause slideshow");

  slideshowInterval = setInterval(() => {
    nextImage();
  }, 3000);
}

function pauseSlideshow() {
  if (!isPlaying) return;

  isPlaying = false;
  playBtn.textContent = "▶ Play";
  playBtn.setAttribute("aria-label", "Play slideshow");

  clearInterval(slideshowInterval);
}

function stopSlideshow() {
  pauseSlideshow();
}

// ============================================
// 3. MODAL FUNCTIONS
// ============================================
function openImageModal() {
  modalImage.src = images[currentImageIndex].src;
  modalCaption.textContent = images[currentImageIndex].caption;
  imageModal.classList.remove("hidden");
}

function closeImageModal() {
  imageModal.classList.add("hidden");
}

mainImage.addEventListener("click", openImageModal);

modalClose.addEventListener("click", closeImageModal);
imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) closeImageModal();
});

// ============================================
// 4. BUTTON LISTENERS
// ============================================
prevBtn.addEventListener("click", () => {
  previousImage();
  stopSlideshow();
});

nextBtn.addEventListener("click", () => {
  nextImage();
  stopSlideshow();
});

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSlideshow();
  } else {
    playSlideshow();
  }
});

openPaletteBtn.addEventListener("click", openCommandPalette);

// ============================================
// 5. KEYBOARD SHORTCUTS
// ============================================
document.addEventListener("keydown", (e) => {
  // Command palette
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    toggleCommandPalette();
    return;
  }

  // Escape to close modals
  if (e.key === "Escape") {
    e.preventDefault();
    if (!commandPalette.classList.contains("hidden")) {
      closeCommandPalette();
    } else if (!imageModal.classList.contains("hidden")) {
      closeImageModal();
    }
    return;
  }

  // Gallery navigation (only if palette is closed)
  if (commandPalette.classList.contains("hidden")) {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        previousImage();
        stopSlideshow();
        break;
      case "ArrowRight":
        e.preventDefault();
        nextImage();
        stopSlideshow();
        break;
      case " ":
        e.preventDefault();
        if (isPlaying) {
          pauseSlideshow();
        } else {
          playSlideshow();
        }
        break;
      case "f":
      case "F":
        e.preventDefault();
        openImageModal();
        break;
      case "r":
      case "R":
        e.preventDefault();
        randomBackground();
        break;
      case "?":
        e.preventDefault();
        showHelp();
        break;
      default:
        // Jump to image (1-9)
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9) {
          e.preventDefault();
          jumpToImage(num);
        }
    }
  } else {
    // Command palette navigation
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        selectPreviousCommand();
        break;
      case "ArrowDown":
        e.preventDefault();
        selectNextCommand();
        break;
      case "Enter":
        e.preventDefault();
        executeCommand(filteredCommands[selectedCommandIndex]);
        closeCommandPalette();
        break;
    }
  }
});

// ============================================
// 6. COMMAND PALETTE FUNCTIONS
// ============================================
function openCommandPalette() {
  commandPalette.classList.remove("hidden");
  paletteInput.focus();
  filteredCommands = [...commands];
  selectedCommandIndex = 0;
  renderCommands();
}

function closeCommandPalette() {
  commandPalette.classList.add("hidden");
  paletteInput.value = "";
}

function toggleCommandPalette() {
  if (commandPalette.classList.contains("hidden")) {
    openCommandPalette();
  } else {
    closeCommandPalette();
  }
}

function renderCommands() {
  commandsList.innerHTML = "";

  filteredCommands.forEach((cmd, index) => {
    const li = document.createElement("li");
    li.className = "command-item";
    if (index === selectedCommandIndex) {
      li.classList.add("focused");
    }

    li.innerHTML = `
            <span class="command-icon">${cmd.icon}</span>
            <span class="command-name">${cmd.name}</span>
            <span class="command-shortcut">${cmd.shortcut}</span>
        `;

    li.addEventListener("click", () => {
      executeCommand(cmd);
      closeCommandPalette();
    });

    li.addEventListener("mouseover", () => {
      selectedCommandIndex = index;
      renderCommands();
    });

    commandsList.appendChild(li);
  });
}

function selectNextCommand() {
  selectedCommandIndex = (selectedCommandIndex + 1) % filteredCommands.length;
  renderCommands();
  scrollCommandIntoView();
}

function selectPreviousCommand() {
  selectedCommandIndex =
    (selectedCommandIndex - 1 + filteredCommands.length) %
    filteredCommands.length;
  renderCommands();
  scrollCommandIntoView();
}

function scrollCommandIntoView() {
  const items = document.querySelectorAll(".command-item");
  if (items[selectedCommandIndex]) {
    items[selectedCommandIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

function executeCommand(cmd) {
  switch (cmd.action) {
    case "playSlideshow":
      playSlideshow();
      break;
    case "pauseSlideshow":
      pauseSlideshow();
      break;
    case "previousImage":
      previousImage();
      break;
    case "nextImage":
      nextImage();
      break;
    case "toggleFullscreen":
      openImageModal();
      break;
    case "randomBackground":
      randomBackground();
      break;
    case "showHelp":
      showHelp();
      break;
    case "resetView":
      currentImageIndex = 0;
      renderImage();
      stopSlideshow();
      break;
  }
}

// ============================================
// 7. PALETTE SEARCH
// ============================================
paletteInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  filteredCommands = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(searchTerm) ||
      cmd.shortcut.toLowerCase().includes(searchTerm),
  );

  selectedCommandIndex = 0;
  renderCommands();
});

// ============================================
// 8. UTILITY FUNCTIONS
// ============================================
function randomBackground() {
  const colors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.background = randomColor;
}

function showHelp() {
  alert(
    "🎹 Keyboard Shortcuts:\n\n" +
      "← / → : Previous / Next Image\n" +
      "1-9 : Jump to Image\n" +
      "Space : Play / Pause Slideshow\n" +
      "F : Fullscreen\n" +
      "R : Random Background\n" +
      "Ctrl+K : Open Command Palette\n" +
      "Escape : Close Modal\n",
  );
}

// ============================================
// 9. INITIALIZATION
// ============================================
initGallery();
