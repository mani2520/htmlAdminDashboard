// ============================================================================
// Modern Admin Dashboard - Main JavaScript File
// ============================================================================
// This file contains all JavaScript functionality for the dashboard:
// - UI interactions (sidebar, navbar, theme)
// - Data management service
// - Search and filter functionality
// - Button interactions and visual feedback
// ============================================================================

// ============================================================================
// UI INTERACTIONS - Sidebar, Navbar, Theme
// ============================================================================

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

// ============================================================================
// DATA SERVICE - Data Management
// ============================================================================

let appData = null;

async function fetchData() {
  if (appData) {
    return appData;
  }

  try {
    const response = await fetch("../assets/data/data.json");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    appData = await response.json();
    return appData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return getDefaultData();
  }
}

function getDefaultData() {
  return {
    dashboard: {
      stats: {
        users: { total: 0, change: 0, trend: "up" },
        sales: { total: 0, change: 0, trend: "up" },
        orders: { total: 0, change: 0, trend: "up" },
        revenue: { total: 0, change: 0, trend: "up" },
      },
      charts: {
        sales: { labels: [], data: [] },
        users: { labels: [], data: [] },
      },
      recentActivity: [],
    },
    users: [],
    settings: {
      profile: {
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        avatar: "AD",
      },
      notifications: { email: false, push: false, sms: false },
      preferences: { language: "English", timezone: "UTC-8 (Pacific Time)" },
    },
  };
}

async function getDashboardStats() {
  const data = await fetchData();
  return data.dashboard.stats;
}

async function getDashboardCharts() {
  const data = await fetchData();
  return data.dashboard.charts;
}

async function getRecentActivity() {
  const data = await fetchData();
  return data.dashboard.recentActivity;
}

async function getUsers() {
  const data = await fetchData();
  return data.users;
}

async function getUserById(id) {
  const data = await fetchData();
  return data.users.find((user) => user.id === id);
}

async function getSettings() {
  const data = await fetchData();
  return data.settings;
}

async function getRoles() {
  const data = await fetchData();
  return data.roles || ["Admin", "User", "Moderator"];
}

async function getStatuses() {
  const data = await fetchData();
  return data.statuses || ["Active", "Pending", "Inactive"];
}

async function updateUser(userId, userData) {
  const data = await fetchData();
  const userIndex = data.users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...userData };
    return data.users[userIndex];
  }
  return null;
}

async function deleteUser(userId) {
  const data = await fetchData();
  const userIndex = data.users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    data.users.splice(userIndex, 1);
    return true;
  }
  return false;
}

async function addUser(userData) {
  const data = await fetchData();
  const newId = Math.max(...data.users.map((u) => u.id), 0) + 1;
  const newUser = {
    id: newId,
    ...userData,
    joined: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
  data.users.push(newUser);
  return newUser;
}

async function updateSettings(settingsData) {
  const data = await fetchData();
  data.settings = { ...data.settings, ...settingsData };
  return data.settings;
}

// ============================================================================
// SEARCH SERVICE - Search and Filter Functionality
// ============================================================================

function searchUsers(users, query) {
  if (!query || query.trim() === '') {
    return users;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return users.filter(user => {
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      user.status.toLowerCase().includes(searchTerm) ||
      user.id.toString().includes(searchTerm)
    );
  });
}

function filterUsersByRole(users, role) {
  if (!role || role === 'All Roles') {
    return users;
  }
  return users.filter(user => user.role === role);
}

function filterUsersByStatus(users, status) {
  if (!status || status === 'All Status') {
    return users;
  }
  return users.filter(user => user.status === status);
}

function searchAndFilterUsers(users, searchQuery, roleFilter, statusFilter) {
  let filtered = users;
  
  if (searchQuery) {
    filtered = searchUsers(filtered, searchQuery);
  }
  
  if (roleFilter && roleFilter !== 'All Roles') {
    filtered = filterUsersByRole(filtered, roleFilter);
  }
  
  if (statusFilter && statusFilter !== 'All Status') {
    filtered = filterUsersByStatus(filtered, statusFilter);
  }
  
  return filtered;
}

async function globalSearch(query) {
  if (!query || query.trim() === '') {
    return {
      users: [],
      dashboard: null,
      message: 'Please enter a search term'
    };
  }
  
  const searchTerm = query.toLowerCase().trim();
  const results = {
    users: [],
    dashboard: null,
    message: ''
  };
  
  try {
    if (typeof getUsers === 'function') {
      const users = await getUsers();
      results.users = searchUsers(users, query);
    }
    
    if (!isNaN(searchTerm) && typeof getDashboardStats === 'function') {
      const stats = await getDashboardStats();
    }
    
    results.message = `Found ${results.users.length} result(s)`;
  } catch (error) {
    console.error('Error in global search:', error);
    results.message = 'Error performing search';
  }
  
  return results;
}

function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

// ============================================================================
// BUTTON INTERACTIONS - Visual Feedback and Animations
// ============================================================================

function initializeButtonInteractions() {
  addButtonVisualFeedback();
  initializeAddUserButton();
  initializeSaveButtons();
  initializeDeleteButtons();
  initializeEditButtons();
  initializeFilterButtons();
  initializeToggleButtons();
  initializeActionButtons();
}

function addButtonVisualFeedback() {
  const buttons = document.querySelectorAll('button, a[role="button"]');

  buttons.forEach((button) => {
    if (button.dataset.initialized === "true") return;
    button.dataset.initialized = "true";

    const isPrimaryButton =
      button.id === "addUserBtn" ||
      button.id === "saveUserBtn" ||
      button.id === "saveSettingsBtn" ||
      button.dataset.noAnimation === "true" ||
      button.classList.contains("bg-gradient-to-r");

    if (!isPrimaryButton) {
      button.addEventListener("click", function (e) {
        createRippleEffect(e, this);
      });
    }

    button.addEventListener("mousedown", function () {
      if (!isPrimaryButton) {
        this.classList.add("active");
      } else {
        this.style.transform = "scale(0.98)";
      }
    });

    button.addEventListener("mouseup", function () {
      if (!isPrimaryButton) {
        setTimeout(() => {
          this.classList.remove("active");
        }, 150);
      } else {
        this.style.transform = "";
      }
    });

    button.addEventListener("mouseleave", function () {
      if (!isPrimaryButton) {
        this.classList.remove("active");
      } else {
        this.style.transform = "";
      }
    });
  });
}

function createRippleEffect(event, button) {
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.classList.add("animate__animated", "animate__fadeOut");
  ripple.style.animationDuration = "0.4s";
  ripple.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
  ripple.style.borderRadius = "50%";
  ripple.style.position = "absolute";
  ripple.style.pointerEvents = "none";
  ripple.style.transform = "scale(0)";
  ripple.style.transition = "transform 0.4s ease-out, opacity 0.4s ease-out";

  button.style.position = "relative";
  button.style.overflow = "hidden";
  button.appendChild(ripple);

  setTimeout(() => {
    ripple.style.transform = "scale(2)";
    ripple.style.opacity = "0";
  }, 10);

  setTimeout(() => {
    ripple.remove();
  }, 400);
}

function initializeAddUserButton() {
  const addUserBtn =
    document.getElementById("addUserBtn") ||
    Array.from(document.querySelectorAll("button")).find(
      (btn) => btn.textContent && btn.textContent.includes("Add User")
    );

  if (addUserBtn) {
    addUserBtn.dataset.buttonInitialized = "true";
  }
}

function initializeSaveButtons() {
  const saveButtons = document.querySelectorAll(
    '#saveSettingsBtn, button[type="submit"], button[type="button"]'
  );

  saveButtons.forEach((button) => {
    // Skip if already initialized
    if (button.dataset.saveInitialized === "true") return;
    
    if (
      button.textContent.includes("Save") ||
      button.id === "saveSettingsBtn"
    ) {
      button.dataset.saveInitialized = "true";
      
      button.addEventListener("click", async function (e) {
        e.preventDefault();
        
        // Prevent multiple clicks
        if (this.disabled || this.classList.contains("loading")) return;
        
        const originalHTML = this.innerHTML;

        this.disabled = true;
        this.classList.add("loading");
        this.innerHTML = `
          <span class="flex items-center">
            <svg class="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Saving...
          </span>
        `;

        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));

          this.classList.remove("loading");
          this.classList.add("animate__animated", "animate__pulse");
          this.innerHTML = `
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Saved!
            </span>
          `;

          setTimeout(() => {
            this.disabled = false;
            this.classList.remove("animate__animated", "animate__pulse", "loading");
            this.innerHTML = originalHTML;
            showNotification("Settings saved successfully!", "success");
          }, 2000);
        } catch (error) {
          // Reset button on error
          this.disabled = false;
          this.classList.remove("loading", "animate__animated", "animate__pulse");
          this.innerHTML = originalHTML;
          showNotification("An error occurred while saving", "error");
        }
      });
    }
  });
}

function initializeDeleteButtons() {
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  const deleteAccountModal = document.getElementById("deleteAccountModal");
  const cancelDeleteAccountBtn = document.getElementById(
    "cancelDeleteAccountBtn"
  );
  const confirmDeleteAccountBtn = document.getElementById(
    "confirmDeleteAccountBtn"
  );

  if (deleteAccountBtn && deleteAccountModal) {
    deleteAccountBtn.addEventListener("click", function (e) {
      e.preventDefault();
      deleteAccountModal.classList.remove("hidden");
      deleteAccountModal.classList.add("animate__animated", "animate__fadeIn");
    });
  }

  function closeDeleteAccountModal() {
    if (deleteAccountModal) {
      deleteAccountModal.classList.add("hidden");
      deleteAccountModal.classList.remove(
        "animate__animated",
        "animate__fadeIn"
      );
    }
  }

  if (cancelDeleteAccountBtn) {
    cancelDeleteAccountBtn.addEventListener("click", closeDeleteAccountModal);
  }

  if (confirmDeleteAccountBtn) {
    confirmDeleteAccountBtn.addEventListener("click", function () {
      const originalText = this.textContent;
      this.disabled = true;
      this.textContent = "Deleting...";

      deleteAccountBtn.classList.add("animate__animated", "animate__shakeX");
      deleteAccountBtn.disabled = true;
      deleteAccountBtn.textContent = "Deleting...";

      setTimeout(() => {
        closeDeleteAccountModal();
        showNotification(
          "Account deletion requested. Please contact support to complete the process.",
          "warning"
        );

        this.disabled = false;
        this.textContent = originalText;
        deleteAccountBtn.disabled = false;
        deleteAccountBtn.classList.remove(
          "animate__animated",
          "animate__shakeX"
        );
        deleteAccountBtn.textContent = "Delete Account";
      }, 2000);
    });
  }

  if (deleteAccountModal) {
    deleteAccountModal.addEventListener("click", function (e) {
      if (
        e.target === deleteAccountModal ||
        e.target.classList.contains("bg-gray-500")
      ) {
        closeDeleteAccountModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      deleteAccountModal &&
      !deleteAccountModal.classList.contains("hidden")
    ) {
      closeDeleteAccountModal();
    }
  });

  document.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(
      'button[onclick*="delete"], button[onclick*="Delete"], button[onclick*="handleDelete"]'
    );
    if (
      deleteBtn &&
      (deleteBtn.textContent.includes("Delete") || deleteBtn.onclick)
    ) {
      const button = deleteBtn;
      button.classList.add("deleting");
      button.style.transform = "scale(0.95)";

      setTimeout(() => {
        button.classList.remove("deleting");
        button.style.transform = "";
      }, 200);
    }
  });
}

function initializeEditButtons() {
  document.addEventListener("click", function (e) {
    const editBtn = e.target.closest(
      'button[onclick*="edit"], button[onclick*="Edit"]'
    );
    if (editBtn) {
      editBtn.classList.add("animate__animated", "animate__pulse");
      setTimeout(() => {
        editBtn.classList.remove("animate__animated", "animate__pulse");
      }, 300);
    }
  });
}

function initializeFilterButtons() {
  const filterSelects = document.querySelectorAll(
    'select[id*="Filter"], select[id*="filter"]'
  );

  filterSelects.forEach((select) => {
    select.addEventListener("change", function () {
      this.classList.add("animate__animated", "animate__pulse");
      this.style.transform = "scale(1.02)";

      setTimeout(() => {
        this.classList.remove("animate__animated", "animate__pulse");
        this.style.transform = "";
        showNotification("Filter applied", "info");
      }, 300);
    });
  });
}

function initializeToggleButtons() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');

  toggles.forEach((toggle) => {
    const label = toggle.closest("label");
    const isToggleSwitch =
      toggle.classList.contains("peer") ||
      (label && label.querySelector("div.peer")) ||
      (label &&
        Array.from(label.children).some(
          (child) =>
            child.classList.contains("peer") ||
            child.classList.contains("rounded-full")
        ));

    if (toggle.dataset.toggleInitialized === "true") return;
    toggle.dataset.toggleInitialized = "true";

    toggle.addEventListener("change", function () {
      if (!isToggleSwitch) {
        const wrapper = this.closest("label") || this.parentElement;
        if (wrapper) {
          wrapper.classList.add("animate__animated", "animate__pulse");
          setTimeout(() => {
            wrapper.classList.remove("animate__animated", "animate__pulse");
          }, 300);
        }
      }
    });
  });
}

function initializeActionButtons() {
  document.addEventListener("click", function (e) {
    const button = e.target.closest(
      'button[class*="text-indigo"], button[class*="text-red"]'
    );
    if (
      button &&
      !button.id &&
      !button.classList.contains("bg-gradient-to-r")
    ) {
      button.classList.add("animate__animated", "animate__pulse");
      button.style.animationDuration = "0.3s";
      setTimeout(() => {
        button.classList.remove("animate__animated", "animate__pulse");
        button.style.animationDuration = "";
      }, 300);
    }
  });

  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function (e) {
      e.preventDefault();
      this.classList.add("clicked");
      showNotification("Changes cancelled", "info");
      setTimeout(() => {
        this.classList.remove("clicked");
      }, 200);
    });
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeButtonInteractions();

  const mainContent = document.querySelector("main");
  if (mainContent) {
    mainContent.classList.add("animate__animated", "animate__fadeInUp");
  }
});

// ============================================================================
// PAGE INITIALIZATION FUNCTIONS
// ============================================================================

// Initialize theme in head (before DOM ready)
function initializeThemeEarly() {
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

// Load sidebar and navbar components (common for all pages)
function loadLayoutComponents(componentPath = "../components/") {
  fetch(`${componentPath}sidebar.html`)
    .then((res) => res.text())
    .then((html) => {
      const container = document.getElementById("sidebar-container");
      const overlayContainer = document.getElementById("sidebar-overlay-container");
      if (container) {
        container.innerHTML = html;
        initializeSidebar();
        
        setTimeout(() => {
          const overlay = document.getElementById("sidebarOverlay");
          if (overlay && overlayContainer) {
            overlay.remove();
            overlayContainer.appendChild(overlay);
            initializeSidebar();
          }
        }, 50);
      }
    })
    .catch((error) => {
      console.error("Error loading sidebar:", error);
    });

  fetch(`${componentPath}navbar.html`)
    .then((res) => res.text())
    .then((html) => {
      const navbarContainer = document.getElementById("navbar-container");
      if (navbarContainer) {
        navbarContainer.innerHTML = html;
        initializeNavbar();
      }
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
}

// Set active nav link based on current page
function setActiveNavLink(pageName) {
  setTimeout(() => {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      if (link.getAttribute("data-page") === pageName) {
        link.classList.add(
          "active",
          "bg-indigo-50",
          "dark:bg-gray-700",
          "text-indigo-600",
          "dark:text-indigo-400"
        );
      }
    });
  }, 100);
}

// Initialize login page
function initializeLoginPage() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  // Password show/hide toggle
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const eyeOffIcon = document.getElementById("eyeOffIcon");

  if (togglePasswordBtn && passwordInput && eyeIcon && eyeOffIcon) {
    togglePasswordBtn.addEventListener("click", function () {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      // Toggle icons
      if (type === "text") {
        eyeIcon.classList.add("hidden");
        eyeOffIcon.classList.remove("hidden");
      } else {
        eyeIcon.classList.remove("hidden");
        eyeOffIcon.classList.add("hidden");
      }
    });
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      submitBtn.classList.add("error");
      submitBtn.innerHTML = "Please fill all fields";
      setTimeout(() => {
        submitBtn.classList.remove("error");
        submitBtn.innerHTML = originalText;
      }, 2000);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    submitBtn.innerHTML = `
      <span class="flex items-center">
        <svg class="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Signing in...
      </span>
    `;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    submitBtn.classList.remove("loading");
    submitBtn.classList.add("success");
    submitBtn.innerHTML = `
      <span class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Success! Redirecting...
      </span>
    `;

    setTimeout(() => {
      window.location.href = "pages/dashboard.html";
    }, 1000);
  });
}

// Initialize dashboard page
function initializeDashboardPage() {
  loadLayoutComponents();
  setActiveNavLink("dashboard");

  async function loadDashboardData() {
    try {
      const stats = await getDashboardStats();

      const usersTotalEl = document.getElementById("usersTotal");
      const usersChangeTextEl = document.getElementById("usersChangeText");
      const salesTotalEl = document.getElementById("salesTotal");
      const salesChangeTextEl = document.getElementById("salesChangeText");
      const ordersTotalEl = document.getElementById("ordersTotal");
      const ordersChangeTextEl = document.getElementById("ordersChangeText");
      const revenueTotalEl = document.getElementById("revenueTotal");
      const revenueChangeTextEl = document.getElementById("revenueChangeText");

      if (usersTotalEl) usersTotalEl.textContent = formatNumber(stats.users.total);
      if (usersChangeTextEl) usersChangeTextEl.textContent = `+${stats.users.change}% from last month`;
      if (salesTotalEl) salesTotalEl.textContent = formatCurrency(stats.sales.total);
      if (salesChangeTextEl) salesChangeTextEl.textContent = `+${stats.sales.change}% from last month`;
      if (ordersTotalEl) ordersTotalEl.textContent = formatNumber(stats.orders.total);
      if (ordersChangeTextEl) ordersChangeTextEl.textContent = `+${stats.orders.change}% from last month`;
      if (revenueTotalEl) revenueTotalEl.textContent = formatCurrency(stats.revenue.total);
      if (revenueChangeTextEl) revenueChangeTextEl.textContent = `+${stats.revenue.change}% from last month`;

      const chartsData = await getDashboardCharts();

      const salesCtx = document.getElementById("salesChart");
      if (salesCtx && chartsData.sales && typeof Chart !== "undefined") {
        new Chart(salesCtx, {
          type: "line",
          data: {
            labels: chartsData.sales.labels,
            datasets: [
              {
                label: "Sales",
                data: chartsData.sales.data,
                borderColor: "rgb(99, 102, 241)",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }

      const usersCtx = document.getElementById("usersChart");
      if (usersCtx && chartsData.users && typeof Chart !== "undefined") {
        new Chart(usersCtx, {
          type: "bar",
          data: {
            labels: chartsData.users.labels,
            datasets: [
              {
                label: "New Users",
                data: chartsData.users.data,
                backgroundColor: "rgba(139, 92, 246, 0.8)",
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }

      const activities = await getRecentActivity();
      const activityContainer = document.getElementById("recentActivityContainer");
      if (activityContainer && activities) {
        const colorClasses = {
          indigo: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400",
          green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
          yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
        };

        const icons = {
          user: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>`,
          check: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
          clock: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
        };

        activityContainer.innerHTML = activities
          .map((activity) => {
            return `
              <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <div class="flex items-center gap-3 sm:gap-4 flex-1">
                  <div class="w-10 h-10 flex-shrink-0 ${colorClasses[activity.color] || colorClasses.indigo} rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      ${icons[activity.icon] || icons.user}
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">${activity.title}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${activity.description}</p>
                  </div>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 sm:ml-auto">${activity.time}</span>
              </div>
            `;
          })
          .join("");
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }

  loadDashboardData();
}

// Initialize users page
function initializeUsersPage() {
  loadLayoutComponents();
  setActiveNavLink("users");

  let allUsers = [];

  async function loadUsersData() {
    try {
      allUsers = await getUsers();
      const roles = await getRoles();
      const statuses = await getStatuses();

      const roleFilter = document.getElementById("roleFilter");
      if (roleFilter && roleFilter.children.length === 1) {
        roles.forEach((role) => {
          const option = document.createElement("option");
          option.value = role;
          option.textContent = role;
          roleFilter.appendChild(option);
        });
      }

      const statusFilter = document.getElementById("statusFilter");
      if (statusFilter && statusFilter.children.length === 1) {
        statuses.forEach((status) => {
          const option = document.createElement("option");
          option.value = status;
          option.textContent = status;
          statusFilter.appendChild(option);
        });
      }

      applyFiltersAndSearch();
    } catch (error) {
      console.error("Error loading users data:", error);
    }
  }

  function applyFiltersAndSearch() {
    const searchQuery = document.getElementById("userSearchInput")?.value || "";
    const roleFilter = document.getElementById("roleFilter")?.value || "All Roles";
    const statusFilter = document.getElementById("statusFilter")?.value || "All Status";

    const filteredUsers = searchAndFilterUsers(allUsers, searchQuery, roleFilter, statusFilter);
    renderUsersTable(filteredUsers);
    updatePaginationInfo(filteredUsers.length, allUsers.length);
  }

  function updatePaginationInfo(filteredCount, totalCount) {
    const paginationText = document.querySelector(".bg-gray-50.dark\\:bg-gray-700 .text-sm");
    if (paginationText) {
      paginationText.innerHTML = `
        Showing <span class="font-medium">1</span> to <span class="font-medium">${filteredCount}</span> of 
        <span class="font-medium">${totalCount}</span> results
      `;
    }
  }

  function renderUsersTable(users) {
    const tbody = document.getElementById("usersTableBody");
    if (!tbody) return;

    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-12 text-center">
            <svg class="w-8 h-8 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <p class="text-lg font-medium text-gray-500 dark:text-gray-400">No users found</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filters</p>
          </td>
        </tr>
      `;
      return;
    }

    const avatarColors = [
      "from-indigo-500 to-purple-500",
      "from-pink-500 to-rose-500",
      "from-green-500 to-emerald-500",
      "from-blue-500 to-cyan-500",
      "from-yellow-500 to-orange-500",
    ];

    const roleColors = {
      Admin: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      User: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      Moderator: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    };

    const statusColors = {
      Active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      Pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      Inactive: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    };

    const statusIndicators = {
      Active: "bg-green-500 ring-2 ring-green-200 dark:ring-green-800",
      Pending: "bg-yellow-500 ring-2 ring-yellow-200 dark:ring-yellow-800",
      Inactive: "bg-gray-500 ring-2 ring-gray-200 dark:ring-gray-800",
    };

    const searchQuery = document.getElementById("userSearchInput")?.value.toLowerCase() || "";

    tbody.innerHTML = users
      .map((user, index) => {
        const avatarColor = avatarColors[index % avatarColors.length];
        const roleColor = roleColors[user.role] || roleColors["User"];
        const statusColor = statusColors[user.status] || statusColors["Active"];
        const statusIndicator = statusIndicators[user.status] || statusIndicators["Active"];

        return `
          <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-gradient-to-br ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  ${user.avatar}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">${highlightSearchTerm(user.name, searchQuery)}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">ID: #${user.id}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-white">${highlightSearchTerm(user.email, searchQuery)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-3 py-1 text-xs font-semibold rounded-full ${roleColor}">
                ${highlightSearchTerm(user.role, searchQuery)}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusColor}">
                <span class="inline-block w-2 h-2 rounded-full mr-2 ${statusIndicator}"></span>
                ${highlightSearchTerm(user.status, searchQuery)}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              ${user.joined}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button onclick="editUser(${user.id})" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button onclick="handleDeleteUser(${user.id})" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // User modal functions
  const userModal = document.getElementById("userModal");
  const deleteModal = document.getElementById("deleteModal");
  const userForm = document.getElementById("userForm");
  let currentDeleteUserId = null;

  function openAddUserModal() {
    const modalTitleEl = document.getElementById("modalTitle");
    const userIdEl = document.getElementById("userId");
    const userNameEl = document.getElementById("userName");
    const userEmailEl = document.getElementById("userEmail");
    const userRoleEl = document.getElementById("userRole");
    const userStatusEl = document.getElementById("userStatus");
    const saveBtn = document.getElementById("saveUserBtn");

    if (modalTitleEl) modalTitleEl.textContent = "Add User";
    if (userIdEl) userIdEl.value = "";
    if (userNameEl) userNameEl.value = "";
    if (userEmailEl) userEmailEl.value = "";
    if (userRoleEl) userRoleEl.value = "";
    if (userStatusEl) userStatusEl.value = "";
    if (saveBtn) saveBtn.textContent = "Save User";

    if (userModal) {
      userModal.style.display = "flex";
      userModal.classList.remove("hidden");
      userModal.classList.add("animate__animated", "animate__fadeIn");
      const modalContent = userModal.querySelector("div");
      if (modalContent) {
        modalContent.classList.add("animate__animated", "animate__slideInUp");
      }
      setTimeout(() => {
        if (userNameEl) userNameEl.focus();
      }, 100);
    }
  }

  async function openEditUserModal(userId) {
    const user = await getUserById(userId);
    if (user) {
      const modalTitleEl = document.getElementById("modalTitle");
      const userIdEl = document.getElementById("userId");
      const userNameEl = document.getElementById("userName");
      const userEmailEl = document.getElementById("userEmail");
      const userRoleEl = document.getElementById("userRole");
      const userStatusEl = document.getElementById("userStatus");
      const saveBtn = document.getElementById("saveUserBtn");

      if (modalTitleEl) modalTitleEl.textContent = "Edit User";
      if (userIdEl) userIdEl.value = user.id;
      if (userNameEl) userNameEl.value = user.name;
      if (userEmailEl) userEmailEl.value = user.email;
      if (userRoleEl) userRoleEl.value = user.role;
      if (userStatusEl) userStatusEl.value = user.status;
      if (saveBtn) saveBtn.textContent = "Update User";

      if (userModal) {
        userModal.style.display = "flex";
        userModal.classList.remove("hidden");
        userModal.classList.add("animate__animated", "animate__fadeIn");
        const modalContent = userModal.querySelector("div");
        if (modalContent) {
          modalContent.classList.add("animate__animated", "animate__slideInUp");
        }
        setTimeout(() => {
          if (userNameEl) userNameEl.focus();
        }, 100);
      }
    }
  }

  function closeUserModal() {
    if (userModal) {
      userModal.classList.add("hidden");
      userModal.style.display = "none";

      if (userForm) {
        userForm.reset();
        const inputs = userForm.querySelectorAll("input, select");
        inputs.forEach((input) => {
          input.classList.remove("border-red-500");
        });
      }

      const saveBtn = document.getElementById("saveUserBtn");
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save User";
      }

      const userIdInput = document.getElementById("userId");
      if (userIdInput) {
        userIdInput.value = "";
      }
    }
  }

  async function openDeleteModal(userId) {
    const user = await getUserById(userId);
    if (user) {
      currentDeleteUserId = userId;
      const deleteUserInfoEl = document.getElementById("deleteUserInfo");
      if (deleteUserInfoEl) {
        deleteUserInfoEl.textContent = `User "${user.name}" (${user.email}) will be permanently deleted. This action cannot be undone.`;
      }
      if (deleteModal) {
        deleteModal.classList.remove("hidden");
        deleteModal.classList.add("animate__animated", "animate__fadeIn");
        const deleteModalContent = deleteModal.querySelector("div");
        if (deleteModalContent) {
          deleteModalContent.classList.add("animate__animated", "animate__slideInUp");
        }
      }
    }
  }

  function closeDeleteModal() {
    if (deleteModal) {
      deleteModal.classList.add("hidden");
      currentDeleteUserId = null;
    }
  }

  async function editUser(userId) {
    await openEditUserModal(userId);
  }

  async function handleDeleteUser(userId) {
    await openDeleteModal(userId);
  }

  // Expose functions to window for onclick handlers
  window.editUser = editUser;
  window.handleDeleteUser = handleDeleteUser;

  // Event listeners
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const userId = document.getElementById("userId")?.value;
      const name = document.getElementById("userName")?.value.trim();
      const email = document.getElementById("userEmail")?.value.trim();
      const role = document.getElementById("userRole")?.value;
      const status = document.getElementById("userStatus")?.value;

      const nameParts = name.split(" ");
      const avatar =
        nameParts.length > 1
          ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
          : name.substring(0, 2).toUpperCase();

      const userData = {
        name: name,
        email: email,
        role: role,
        status: status,
        avatar: avatar,
      };

      const saveBtn = document.getElementById("saveUserBtn");
      const originalText = saveBtn?.textContent;
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = userId ? "Updating..." : "Saving...";
      }

      try {
        let result = null;
        if (userId) {
          result = await updateUser(parseInt(userId), userData);
          if (result) {
            closeUserModal();
            showNotification("User updated successfully", "success");
            loadUsersData();
            if (saveBtn) {
              setTimeout(() => {
                saveBtn.disabled = false;
                if (originalText) saveBtn.textContent = originalText;
              }, 100);
            }
          } else {
            if (saveBtn) {
              saveBtn.disabled = false;
              if (originalText) saveBtn.textContent = originalText;
            }
            showNotification("Failed to update user", "error");
          }
        } else {
          result = await addUser(userData);
          if (result) {
            closeUserModal();
            showNotification("User added successfully", "success");
            loadUsersData();
            if (saveBtn) {
              setTimeout(() => {
                saveBtn.disabled = false;
                if (originalText) saveBtn.textContent = originalText;
              }, 100);
            }
          } else {
            if (saveBtn) {
              saveBtn.disabled = false;
              if (originalText) saveBtn.textContent = originalText;
            }
            showNotification("Failed to add user", "error");
          }
        }
      } catch (error) {
        console.error("Error saving user:", error);
        if (saveBtn) {
          saveBtn.disabled = false;
          if (originalText) saveBtn.textContent = originalText;
        }
        showNotification("An error occurred", "error");
      }
    });
  }

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", async () => {
      if (currentDeleteUserId) {
        const deleteBtn = document.getElementById("confirmDeleteBtn");
        const originalText = deleteBtn?.textContent;
        if (deleteBtn) {
          deleteBtn.disabled = true;
          deleteBtn.textContent = "Deleting...";
        }

        try {
          const success = await deleteUser(currentDeleteUserId);
          if (success) {
            showNotification("User deleted successfully", "success");
            closeDeleteModal();
            loadUsersData();
          } else {
            showNotification("Failed to delete user", "error");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          showNotification("An error occurred", "error");
        } finally {
          if (deleteBtn) {
            deleteBtn.disabled = false;
            if (originalText) deleteBtn.textContent = originalText;
          }
        }
      }
    });
  }

  const addUserBtn = document.getElementById("addUserBtn");
  if (addUserBtn) {
    addUserBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openAddUserModal();
    });
  }

  const closeModalBtn = document.getElementById("closeModalBtn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeUserModal);
  }

  const cancelModalBtn = document.getElementById("cancelModalBtn");
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", closeUserModal);
  }

  const closeDeleteModalBtn = document.getElementById("closeDeleteModalBtn");
  if (closeDeleteModalBtn) {
    closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
  }

  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", closeDeleteModal);
  }

  if (userModal) {
    userModal.addEventListener("click", (e) => {
      if (e.target === userModal) {
        closeUserModal();
      }
    });
  }

  if (deleteModal) {
    deleteModal.addEventListener("click", (e) => {
      if (e.target === deleteModal) {
        closeDeleteModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (userModal && !userModal.classList.contains("hidden")) {
        closeUserModal();
      }
      if (deleteModal && !deleteModal.classList.contains("hidden")) {
        closeDeleteModal();
      }
    }
  });

  // Search and filter
  const searchInput = document.getElementById("userSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  if (searchInput) {
    let searchTimeout;

    function toggleClearButton() {
      if (clearSearchBtn) {
        if (searchInput.value.trim() !== "") {
          clearSearchBtn.classList.remove("hidden");
        } else {
          clearSearchBtn.classList.add("hidden");
        }
      }
    }

    searchInput.addEventListener("input", function () {
      toggleClearButton();
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        applyFiltersAndSearch();
        this.classList.add("searching");
        setTimeout(() => {
          this.classList.remove("searching");
        }, 300);
      }, 300);
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", function () {
        searchInput.value = "";
        toggleClearButton();
        applyFiltersAndSearch();
        searchInput.focus();
      });
    }

    toggleClearButton();
  }

  const roleFilterEl = document.getElementById("roleFilter");
  if (roleFilterEl) {
    roleFilterEl.addEventListener("change", applyFiltersAndSearch);
  }

  const statusFilterEl = document.getElementById("statusFilter");
  if (statusFilterEl) {
    statusFilterEl.addEventListener("change", applyFiltersAndSearch);
  }

  // Restore search query from sessionStorage
  window.addEventListener("DOMContentLoaded", () => {
    const storedQuery = sessionStorage.getItem("searchQuery");
    if (storedQuery) {
      if (searchInput) {
        searchInput.value = storedQuery;
        applyFiltersAndSearch();
      }
      sessionStorage.removeItem("searchQuery");
    }
  });

  loadUsersData();
}

// Initialize settings page
function initializeSettingsPage() {
  loadLayoutComponents();
  setActiveNavLink("settings");
  
  // Initialize save button after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeSaveButtons();
  }, 100);
}

// Initialize documentation page
function initializeDocumentationPage() {
  loadLayoutComponents();
}

// ============================================================================
// EXPORTS - Window Object
// ============================================================================

if (typeof window !== "undefined") {
  window.initializeSidebar = initializeSidebar;
  window.initializeNavbar = initializeNavbar;
  window.initializeTheme = initializeTheme;
  window.initializeThemeEarly = initializeThemeEarly;
  window.updateThemeIcon = updateThemeIcon;
  window.formatNumber = formatNumber;
  window.formatCurrency = formatCurrency;
  window.showNotification = showNotification;
  window.confirmAction = confirmAction;
  window.getDashboardStats = getDashboardStats;
  window.getDashboardCharts = getDashboardCharts;
  window.getRecentActivity = getRecentActivity;
  window.getUsers = getUsers;
  window.getUserById = getUserById;
  window.getSettings = getSettings;
  window.getRoles = getRoles;
  window.getStatuses = getStatuses;
  window.updateUser = updateUser;
  window.deleteUser = deleteUser;
  window.addUser = addUser;
  window.updateSettings = updateSettings;
  window.searchUsers = searchUsers;
  window.filterUsersByRole = filterUsersByRole;
  window.filterUsersByStatus = filterUsersByStatus;
  window.searchAndFilterUsers = searchAndFilterUsers;
  window.globalSearch = globalSearch;
  window.highlightSearchTerm = highlightSearchTerm;
  window.loadLayoutComponents = loadLayoutComponents;
  window.setActiveNavLink = setActiveNavLink;
  window.initializeLoginPage = initializeLoginPage;
  window.initializeDashboardPage = initializeDashboardPage;
  window.initializeUsersPage = initializeUsersPage;
  window.initializeSettingsPage = initializeSettingsPage;
  window.initializeDocumentationPage = initializeDocumentationPage;
}

// Button interactions observer for dynamic content
if (document.body) {
  const observer = new MutationObserver(() => {
    initializeButtonInteractions();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
} else {
  document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
      initializeButtonInteractions();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
