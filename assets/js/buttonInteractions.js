// Button Interactions and Visual Feedback System

// Initialize all button interactions
function initializeButtonInteractions() {
  // Add visual feedback to all buttons
  addButtonVisualFeedback();

  // Initialize specific button handlers
  initializeAddUserButton();
  initializeSaveButtons();
  initializeDeleteButtons();
  initializeEditButtons();
  initializeFilterButtons();
  initializeToggleButtons();
  initializeActionButtons();
}

// Add visual feedback to all buttons
function addButtonVisualFeedback() {
  const buttons = document.querySelectorAll('button, a[role="button"]');

  buttons.forEach((button) => {
    // Skip if already initialized
    if (button.dataset.initialized === "true") return;
    button.dataset.initialized = "true";

    // Skip animation for primary action buttons (Add User, Save, etc.)
    const isPrimaryButton =
      button.id === "addUserBtn" ||
      button.id === "saveUserBtn" ||
      button.id === "saveSettingsBtn" ||
      button.dataset.noAnimation === "true" ||
      button.classList.contains("bg-gradient-to-r");

    if (!isPrimaryButton) {
      // Add ripple effect on click for non-primary buttons
      button.addEventListener("click", function (e) {
        createRippleEffect(e, this);
      });
    }

    // Add active state (subtle scale for all buttons)
    button.addEventListener("mousedown", function () {
      if (!isPrimaryButton) {
        this.classList.add("active");
      } else {
        // Subtle scale for primary buttons
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

// Create ripple effect on button click
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

  // Trigger animation
  setTimeout(() => {
    ripple.style.transform = "scale(2)";
    ripple.style.opacity = "0";
  }, 10);

  setTimeout(() => {
    ripple.remove();
  }, 400);
}

// Initialize Add User Button
function initializeAddUserButton() {
  const addUserBtn =
    document.getElementById("addUserBtn") ||
    Array.from(document.querySelectorAll("button")).find(
      (btn) => btn.textContent && btn.textContent.includes("Add User")
    );

  // The Add User button is now handled by the modal system in users.html
  // Visual feedback is still provided by addButtonVisualFeedback()
  // Skip custom handler to allow modal to work properly
  if (addUserBtn) {
    // Just mark as initialized to prevent duplicate handlers
    addUserBtn.dataset.buttonInitialized = "true";
  }
}

// Initialize Save Buttons
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

        // Show loading state
        this.disabled = true;
        this.classList.add("loading");
        this.innerHTML = `
          <svg class="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Saving...
        `;

        // Simulate save
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Show success
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

// Initialize Delete Buttons
function initializeDeleteButtons() {
  // Delete Account button
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  const deleteAccountModal = document.getElementById("deleteAccountModal");
  const cancelDeleteAccountBtn = document.getElementById(
    "cancelDeleteAccountBtn"
  );
  const confirmDeleteAccountBtn = document.getElementById(
    "confirmDeleteAccountBtn"
  );

  // Open delete account modal
  if (deleteAccountBtn && deleteAccountModal) {
    deleteAccountBtn.addEventListener("click", function (e) {
      e.preventDefault();
      deleteAccountModal.classList.remove("hidden");
      deleteAccountModal.classList.add("animate__animated", "animate__fadeIn");
    });
  }

  // Close modal functions
  function closeDeleteAccountModal() {
    if (deleteAccountModal) {
      deleteAccountModal.classList.add("hidden");
      deleteAccountModal.classList.remove(
        "animate__animated",
        "animate__fadeIn"
      );
    }
  }

  // Cancel button
  if (cancelDeleteAccountBtn) {
    cancelDeleteAccountBtn.addEventListener("click", closeDeleteAccountModal);
  }

  // Confirm delete button
  if (confirmDeleteAccountBtn) {
    confirmDeleteAccountBtn.addEventListener("click", function () {
      const originalText = this.textContent;
      this.disabled = true;
      this.textContent = "Deleting...";

      // Add animation to button
      deleteAccountBtn.classList.add("animate__animated", "animate__shakeX");
      deleteAccountBtn.disabled = true;
      deleteAccountBtn.textContent = "Deleting...";

      setTimeout(() => {
        closeDeleteAccountModal();
        showNotification(
          "Account deletion requested. Please contact support to complete the process.",
          "warning"
        );

        // Reset buttons
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

  // Close modal on backdrop click
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

  // Close modal on Escape key
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      deleteAccountModal &&
      !deleteAccountModal.classList.contains("hidden")
    ) {
      closeDeleteAccountModal();
    }
  });

  // Delete user buttons in tables
  document.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(
      'button[onclick*="delete"], button[onclick*="Delete"], button[onclick*="handleDelete"]'
    );
    if (
      deleteBtn &&
      (deleteBtn.textContent.includes("Delete") || deleteBtn.onclick)
    ) {
      const button = deleteBtn;

      // Add visual feedback
      button.classList.add("deleting");
      button.style.transform = "scale(0.95)";

      setTimeout(() => {
        button.classList.remove("deleting");
        button.style.transform = "";
      }, 200);
    }
  });
}

// Initialize Edit Buttons
function initializeEditButtons() {
  document.addEventListener("click", function (e) {
    const editBtn = e.target.closest(
      'button[onclick*="edit"], button[onclick*="Edit"]'
    );
    if (editBtn) {
      // Add visual feedback
      editBtn.classList.add("animate__animated", "animate__pulse");
      setTimeout(() => {
        editBtn.classList.remove("animate__animated", "animate__pulse");
      }, 300);
    }
  });
}

// Initialize Filter Buttons
function initializeFilterButtons() {
  const filterSelects = document.querySelectorAll(
    'select[id*="Filter"], select[id*="filter"]'
  );

  filterSelects.forEach((select) => {
    select.addEventListener("change", function () {
      // Add visual feedback
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

// Initialize Toggle Buttons (checkboxes, switches)
function initializeToggleButtons() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');

  toggles.forEach((toggle) => {
    // Skip toggle switches (they have peer classes and should not have slide animation)
    // Toggle switches are typically in labels with a sibling div that has peer classes
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

    // Skip if already has event listener
    if (toggle.dataset.toggleInitialized === "true") return;
    toggle.dataset.toggleInitialized = "true";

    toggle.addEventListener("change", function () {
      // Only add animation to regular checkboxes, not toggle switches
      // Toggle switches have their own smooth animation via Tailwind peer classes
      if (!isToggleSwitch) {
        const wrapper = this.closest("label") || this.parentElement;
        if (wrapper) {
          wrapper.classList.add("animate__animated", "animate__pulse");
          setTimeout(() => {
            wrapper.classList.remove("animate__animated", "animate__pulse");
          }, 300);
        }
      }
      // Toggle switches don't need notification - they're self-explanatory
    });
  });
}

// Initialize Action Buttons (Edit, Delete in tables)
function initializeActionButtons() {
  // This is handled by the specific page scripts, but we add visual feedback
  document.addEventListener("click", function (e) {
    // Only apply to small icon buttons, not primary action buttons
    const button = e.target.closest(
      'button[class*="text-indigo"], button[class*="text-red"]'
    );
    if (
      button &&
      !button.id &&
      !button.classList.contains("bg-gradient-to-r")
    ) {
      // Use subtle pulse instead of bounceIn
      button.classList.add("animate__animated", "animate__pulse");
      button.style.animationDuration = "0.3s";
      setTimeout(() => {
        button.classList.remove("animate__animated", "animate__pulse");
        button.style.animationDuration = "";
      }, 300);
    }
  });

  // Cancel button
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

// Show notification (using the function from app.js if available, or create one)
function showNotification(message, type = "info") {
  // Check if function exists in app.js
  if (typeof window.showNotification === "function") {
    window.showNotification(message, type);
    return;
  }

  // Create notification element
  const notification = document.createElement("div");
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-indigo-500",
  };

  notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
    colors[type] || colors.info
  } text-white`;
  notification.style.opacity = "0";
  notification.style.transform = "translateX(100%)";
  notification.textContent = message;
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Make showNotification globally available
window.showNotification = showNotification;

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeButtonInteractions);
} else {
  initializeButtonInteractions();
}

// Re-initialize after dynamic content loads
if (document.body) {
  const observer = new MutationObserver(() => {
    initializeButtonInteractions();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
} else {
  // Wait for body to be available
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
