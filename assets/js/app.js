let sidebarDocumentListenersAttached = false;

function initializeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  
  let sidebarClose = null;
  if (sidebar) {
    sidebarClose = sidebar.querySelector("#sidebarClose") || document.getElementById("sidebarClose");
  } else {
    sidebarClose = document.getElementById("sidebarClose");
  }

  if (sidebar) {
    if (sidebar.style.display !== "flex") {
      sidebar.style.display = "flex";
    }

    if (window.innerWidth >= 1024) {
      sidebar.classList.remove("open");
      updateSidebarToggleIcon(false);
    } else {
      sidebar.classList.remove("open");
      updateSidebarToggleIcon(false);
    }

    const navLinks = sidebar.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      if (link.style.display !== "flex") {
        link.style.display = "flex";
      }
    });
  }

  function openSidebar() {
    const currentSidebar = document.getElementById("sidebar");
    const currentOverlay = document.getElementById("sidebarOverlay");
    const overlayContainer = document.getElementById("sidebar-overlay-container");
    if (currentSidebar) {
      currentSidebar.classList.add("open");
      if (window.innerWidth < 1024) {
        document.body.classList.add("sidebar-open");
      } else {
        document.body.style.overflow = "hidden";
      }
    }
    if (currentOverlay) {
      currentOverlay.classList.remove("hidden");
      currentOverlay.style.pointerEvents = "auto";
    }
    if (overlayContainer) {
      overlayContainer.style.pointerEvents = "auto";
    }
    updateSidebarToggleIcon(true);
  }

  function closeSidebar() {
    const currentSidebar = document.getElementById("sidebar");
    const currentOverlay = document.getElementById("sidebarOverlay");
    const overlayContainer = document.getElementById("sidebar-overlay-container");
    if (currentSidebar) {
      currentSidebar.classList.remove("open");
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }
    if (currentOverlay) {
      currentOverlay.classList.add("hidden");
      currentOverlay.style.pointerEvents = "none";
    }
    if (overlayContainer) {
      overlayContainer.style.pointerEvents = "none";
    }
    updateSidebarToggleIcon(false);
  }
  
  function updateSidebarToggleIcon(isOpen) {
    const hamburgerIcon = document.getElementById("sidebarToggleIcon");
    const closeIcon = document.getElementById("sidebarToggleCloseIcon");
    if (hamburgerIcon && closeIcon) {
      if (isOpen) {
        hamburgerIcon.classList.add("hidden");
        closeIcon.classList.remove("hidden");
      } else {
        hamburgerIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      }
    }
  }
  
  window.closeSidebar = closeSidebar;
  window.openSidebar = openSidebar;
  window.updateSidebarToggleIcon = updateSidebarToggleIcon;

  function handleSidebarToggle(e) {
    e.stopPropagation();
    e.preventDefault();
    const currentSidebar = document.getElementById("sidebar");
    if (currentSidebar && currentSidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
  
  if (!sidebarDocumentListenersAttached) {
    sidebarDocumentListenersAttached = true;
    
    document.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest("#sidebarToggle");
      if (toggleBtn) {
        handleSidebarToggle(e);
      }
    });
    
    document.addEventListener("click", (e) => {
      if (e.target && e.target.id === "sidebarOverlay") {
        e.stopPropagation();
        if (typeof window.closeSidebar === "function") {
          window.closeSidebar();
        }
      }
    });
  }
  
  if (sidebarToggle && !sidebarToggle.dataset.initialized) {
    sidebarToggle.dataset.initialized = "true";
    sidebarToggle.addEventListener("click", handleSidebarToggle);
  }

  if (sidebarClose) {
    if (sidebarClose.dataset.initialized === "true") {
    } else {
      sidebarClose.dataset.initialized = "true";
      
      sidebarClose.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeSidebar();
      });
      
      sidebarClose.addEventListener("touchend", (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeSidebar();
      });
      
      if (window.innerWidth < 1024) {
        sidebarClose.style.pointerEvents = "auto";
        sidebarClose.style.cursor = "pointer";
        sidebarClose.style.display = "block";
      }
    }
  }

  if (sidebarOverlay && !sidebarOverlay.dataset.initialized) {
    sidebarOverlay.dataset.initialized = "true";
    sidebarOverlay.addEventListener("click", (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) {
        closeSidebar();
      }
    }, 100);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && window.innerWidth < 1024) {
      if (sidebar && sidebar.classList.contains("open")) {
        closeSidebar();
      }
    }
  });
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  
  if (savedTheme) {
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }
}

function initializeNavbar() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const userMenuButton = document.getElementById("userMenuButton");
  const userMenu = document.getElementById("userMenu");
  const globalSearchInput = document.getElementById("globalSearchInput");
  
  setTimeout(() => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar && typeof window.updateSidebarToggleIcon === "function") {
      window.updateSidebarToggleIcon(sidebar.classList.contains("open"));
    }
  }, 100);

  if (globalSearchInput) {
    const clearGlobalSearchBtn = document.getElementById(
      "clearGlobalSearchBtn"
    );

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
          this.classList.add("searching");

          if (typeof globalSearch === "function") {
            try {
              const results = await globalSearch(query);
              if (typeof showNotification === "function") {
                showNotification(
                  results.message || `Found ${results.users.length} result(s)`,
                  "info"
                );
              }

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
        }, 500);
      } else {
        if (window.location.pathname.includes("users.html")) {
          const userSearchInput = document.getElementById("userSearchInput");
          if (userSearchInput) {
            userSearchInput.value = "";
            userSearchInput.dispatchEvent(new Event("input"));
          }
        }
      }
    });

    if (clearGlobalSearchBtn) {
      clearGlobalSearchBtn.addEventListener("click", function () {
        globalSearchInput.value = "";
        toggleClearButton();
        globalSearchInput.dispatchEvent(new Event("input"));
        globalSearchInput.focus();
      });
    }

    globalSearchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
          if (!window.location.pathname.includes("users.html")) {
            window.location.href = "users.html";
            sessionStorage.setItem("searchQuery", query);
          }
        }
      }
    });

    toggleClearButton();
  }

  if (themeToggle) {
    if (themeToggle.dataset.initialized === "true") {
      return;
    }
    themeToggle.dataset.initialized = "true";

    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    updateThemeIcon(isCurrentlyDark);

    themeToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateThemeIcon(isDark);
    });
  }

  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      userMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.add("hidden");
      }
    });
  }
}

function updateThemeIcon(isDark) {
  const themeIcon = document.getElementById("themeIcon");
  if (!themeIcon) {
    setTimeout(() => updateThemeIcon(isDark), 100);
    return;
  }

  if (isDark) {
    themeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    `;
    themeIcon.setAttribute("aria-label", "Switch to light mode");
  } else {
    themeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    `;
    themeIcon.setAttribute("aria-label", "Switch to dark mode");
  }

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

function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

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

function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  const mainContent = document.querySelector("main");
  if (mainContent) {
    mainContent.classList.add("animate__animated", "animate__fadeInUp");
  }
});

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
