// Modern Admin Dashboard JavaScript

// Initialize Sidebar
function initializeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarClose = document.getElementById("sidebarClose");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  // Ensure sidebar is visible
  if (sidebar) {
    sidebar.style.display = "flex";
    sidebar.style.visibility = "visible";
    sidebar.style.opacity = "1";

    // Ensure all nav links are visible
    const navLinks = sidebar.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.style.display = "flex";
      link.style.visibility = "visible";
      link.style.opacity = "1";

      // Ensure spans and SVGs are visible
      const spans = link.querySelectorAll("span");
      const svgs = link.querySelectorAll("svg");
      spans.forEach((span) => {
        span.style.display = "inline-block";
        span.style.visibility = "visible";
        span.style.opacity = "1";
      });
      svgs.forEach((svg) => {
        svg.style.display = "block";
        svg.style.visibility = "visible";
        svg.style.opacity = "1";
      });
    });
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      if (sidebar) sidebar.classList.add("open");
      if (sidebarOverlay) sidebarOverlay.classList.remove("hidden");
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", () => {
      if (sidebar) sidebar.classList.remove("open");
      if (sidebarOverlay) sidebarOverlay.classList.add("hidden");
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      if (sidebar) sidebar.classList.remove("open");
      sidebarOverlay.classList.add("hidden");
    });
  }

  // Close sidebar on window resize (desktop)
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      if (sidebar) sidebar.classList.remove("open");
      if (sidebarOverlay) sidebarOverlay.classList.add("hidden");
    }
  });
}

// Initialize Navbar
function initializeNavbar() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const userMenuButton = document.getElementById("userMenuButton");
  const userMenu = document.getElementById("userMenu");
  const globalSearchInput = document.getElementById("globalSearchInput");

  // Initialize global search
  if (globalSearchInput) {
    const clearGlobalSearchBtn = document.getElementById(
      "clearGlobalSearchBtn"
    );

    // Toggle clear button visibility
    function toggleClearButton() {
      if (clearGlobalSearchBtn) {
        if (globalSearchInput.value.trim() !== "") {
          clearGlobalSearchBtn.classList.remove("hidden");
        } else {
          clearGlobalSearchBtn.classList.add("hidden");
        }
      }
    }

    let searchTimeout;
    globalSearchInput.addEventListener("input", function () {
      toggleClearButton();
      clearTimeout(searchTimeout);
      const query = this.value.trim();

      if (query.length > 0) {
        searchTimeout = setTimeout(async () => {
          // Add visual feedback
          this.classList.add("searching");

          // Perform global search
          if (typeof globalSearch === "function") {
            try {
              const results = await globalSearch(query);
              if (typeof showNotification === "function") {
                showNotification(
                  results.message || `Found ${results.users.length} result(s)`,
                  "info"
                );
              }

              // If on users page, trigger search
              if (window.location.pathname.includes("users.html")) {
                const userSearchInput =
                  document.getElementById("userSearchInput");
                if (userSearchInput) {
                  userSearchInput.value = query;
                  userSearchInput.dispatchEvent(new Event("input"));
                }
              }
            } catch (error) {
              console.error("Search error:", error);
            }
          }

          setTimeout(() => {
            this.classList.remove("searching");
          }, 300);
        }, 500); // Debounce
      } else {
        // Clear search
        if (window.location.pathname.includes("users.html")) {
          const userSearchInput = document.getElementById("userSearchInput");
          if (userSearchInput) {
            userSearchInput.value = "";
            userSearchInput.dispatchEvent(new Event("input"));
          }
        }
      }
    });

    // Clear button handler
    if (clearGlobalSearchBtn) {
      clearGlobalSearchBtn.addEventListener("click", function () {
        globalSearchInput.value = "";
        toggleClearButton();
        globalSearchInput.dispatchEvent(new Event("input"));
        globalSearchInput.focus();
      });
    }

    // Handle Enter key
    globalSearchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
          // Navigate to users page if not already there
          if (!window.location.pathname.includes("users.html")) {
            window.location.href = "users.html";
            // Store search query
            sessionStorage.setItem("searchQuery", query);
          }
        }
      }
    });

    // Initial state
    toggleClearButton();
  }

  // Theme Toggle
  if (themeToggle) {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      updateThemeIcon(true);
    } else {
      document.documentElement.classList.remove("dark");
      updateThemeIcon(false);
    }

    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateThemeIcon(isDark);
    });
  }

  // User Menu Toggle
  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      userMenu.classList.toggle("hidden");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.add("hidden");
      }
    });
  }
}

// Update Theme Icon
function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById("themeIcon");
  if (!themeIcon) return;

  if (isDark) {
    themeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    `;
  } else {
    themeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    `;
  }
}

// Utility: Format numbers
function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

// Utility: Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Utility: Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
      ? "bg-red-500 text-white"
      : type === "warning"
      ? "bg-yellow-500 text-white"
      : "bg-indigo-500 text-white"
  }`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Utility: Confirm dialog
function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Add fade-in animation to main content
  const mainContent = document.querySelector("main");
  if (mainContent) {
    mainContent.classList.add("animate__animated", "animate__fadeInUp");
  }

  // Initialize tooltips (if using a tooltip library)
  // Initialize other plugins as needed
});

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeSidebar,
    initializeNavbar,
    formatNumber,
    formatCurrency,
    showNotification,
    confirmAction,
  };
}
