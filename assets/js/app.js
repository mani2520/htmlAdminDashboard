// Modern Admin Dashboard JavaScript

// Initialize Sidebar
function initializeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  
  // Get close button - ensure we query it after sidebar exists
  let sidebarClose = null;
  if (sidebar) {
    sidebarClose = sidebar.querySelector("#sidebarClose") || document.getElementById("sidebarClose");
  } else {
    sidebarClose = document.getElementById("sidebarClose");
  }

  // Ensure sidebar is properly initialized
  if (sidebar) {
    // Don't override transform with inline styles - let CSS handle it
    // Only ensure display is flex
    if (sidebar.style.display !== "flex") {
      sidebar.style.display = "flex";
    }

    // On desktop, ensure sidebar is visible
    if (window.innerWidth >= 1024) {
      sidebar.classList.remove("open"); // Remove open class, CSS will handle visibility
    } else {
      // On mobile, ensure sidebar is hidden initially
      sidebar.classList.remove("open");
    }

    // Ensure all nav links are visible
    const navLinks = sidebar.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      if (link.style.display !== "flex") {
        link.style.display = "flex";
      }
    });
  }

  // Function to open sidebar
  function openSidebar() {
    if (sidebar) {
      sidebar.classList.add("open");
      // Use class for mobile body scroll lock (better for mobile)
      if (window.innerWidth < 1024) {
        document.body.classList.add("sidebar-open");
      } else {
        document.body.style.overflow = "hidden";
      }
    }
    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("hidden");
    }
  }

  // Function to close sidebar
  function closeSidebar() {
    if (sidebar) {
      sidebar.classList.remove("open");
      // Remove mobile body scroll lock
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }
    if (sidebarOverlay) {
      sidebarOverlay.classList.add("hidden");
    }
  }
  
  // Make closeSidebar globally available for onclick fallback
  window.closeSidebar = closeSidebar;

  // Mobile sidebar toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  // Close sidebar button
  if (sidebarClose) {
    // Check if already initialized to prevent duplicate listeners
    if (sidebarClose.dataset.initialized === "true") {
      // Button already has listener, skip
    } else {
      sidebarClose.dataset.initialized = "true";
      
      sidebarClose.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeSidebar();
      });
      
      // Also add touch event for better mobile support
      sidebarClose.addEventListener("touchend", (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeSidebar();
      });
      
      // Ensure button is clickable and visible on mobile
      if (window.innerWidth < 1024) {
        sidebarClose.style.pointerEvents = "auto";
        sidebarClose.style.cursor = "pointer";
        sidebarClose.style.display = "block";
      }
    }
  }

  // Close sidebar when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  // Close sidebar on window resize (desktop)
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) {
        closeSidebar();
      }
    }, 100);
  });

  // Close sidebar on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && window.innerWidth < 1024) {
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar();
      }
    }
  });
}

// Initialize Theme (should be called early, before navbar loads)
function initializeTheme() {
  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
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
    // Check if already initialized to prevent duplicate listeners
    if (themeToggle.dataset.initialized === "true") {
      return;
    }
    themeToggle.dataset.initialized = "true";

    // Update icon based on current theme
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    updateThemeIcon(isCurrentlyDark);

    // Add click event listener
    themeToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
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
  if (!themeIcon) {
    // Retry after a short delay if icon not found
    setTimeout(() => updateThemeIcon(isDark), 100);
    return;
  }

  if (isDark) {
    // Show sun icon (light mode icon) when in dark mode (clicking will switch to light)
    themeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    `;
    themeIcon.setAttribute("aria-label", "Switch to light mode");
  } else {
    // Show moon icon (dark mode icon) when in light mode (clicking will switch to dark)
    themeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    `;
    themeIcon.setAttribute("aria-label", "Switch to dark mode");
  }

  // Update button aria-label
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
    themeToggle.setAttribute(
      "title",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
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
  // Initialize theme (as backup, though it's already initialized in head)
  initializeTheme();

  // Add fade-in animation to main content
  const mainContent = document.querySelector("main");
  if (mainContent) {
    mainContent.classList.add("animate__animated", "animate__fadeInUp");
  }

  // Initialize tooltips (if using a tooltip library)
  // Initialize other plugins as needed
});

// Make functions globally available
if (typeof window !== "undefined") {
  window.initializeSidebar = initializeSidebar;
  window.initializeNavbar = initializeNavbar;
  window.initializeTheme = initializeTheme;
  window.updateThemeIcon = updateThemeIcon;
  window.formatNumber = formatNumber;
  window.formatCurrency = formatCurrency;
  window.showNotification = showNotification;
  window.confirmAction = confirmAction;
}

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeSidebar,
    initializeNavbar,
    initializeTheme,
    updateThemeIcon,
    formatNumber,
    formatCurrency,
    showNotification,
    confirmAction,
  };
}
