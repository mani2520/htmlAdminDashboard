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

function showNotification(message, type = "info") {
  if (typeof window.showNotification === "function") {
    window.showNotification(message, type);
    return;
  }

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

  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 10);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

window.showNotification = showNotification;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeButtonInteractions);
} else {
  initializeButtonInteractions();
}

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
