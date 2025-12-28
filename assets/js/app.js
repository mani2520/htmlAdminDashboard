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
    if (
      button.textContent.includes("Save") ||
      button.id === "saveSettingsBtn"
    ) {
      button.addEventListener("click", async function (e) {
        e.preventDefault();
        const originalText = this.textContent;

        this.disabled = true;
        this.classList.add("loading");
        this.innerHTML = `
          <svg class="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Saving...
        `;

        await new Promise((resolve) => setTimeout(resolve, 1500));

        this.classList.remove("loading");
        this.classList.add("animate__animated", "animate__pulse");
        this.innerHTML = `
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Saved!
        `;

        setTimeout(() => {
          this.disabled = false;
          this.classList.remove("animate__animated", "animate__pulse");
          this.textContent = originalText;
          showNotification("Settings saved successfully!", "success");
        }, 2000);
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
// EXPORTS - Window Object
// ============================================================================

if (typeof window !== "undefined") {
  window.initializeSidebar = initializeSidebar;
  window.initializeNavbar = initializeNavbar;
  window.initializeTheme = initializeTheme;
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
