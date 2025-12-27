// Data Service - Fetches and manages data from JSON file

let appData = null;

// Fetch data from JSON file
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
    // Return default/fallback data
    return getDefaultData();
  }
}

// Get default/fallback data if JSON fails to load
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

// Format number with commas
function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Get dashboard stats
async function getDashboardStats() {
  const data = await fetchData();
  return data.dashboard.stats;
}

// Get dashboard charts data
async function getDashboardCharts() {
  const data = await fetchData();
  return data.dashboard.charts;
}

// Get recent activity
async function getRecentActivity() {
  const data = await fetchData();
  return data.dashboard.recentActivity;
}

// Get all users
async function getUsers() {
  const data = await fetchData();
  return data.users;
}

// Get user by ID
async function getUserById(id) {
  const data = await fetchData();
  return data.users.find((user) => user.id === id);
}

// Get settings
async function getSettings() {
  const data = await fetchData();
  return data.settings;
}

// Get roles
async function getRoles() {
  const data = await fetchData();
  return data.roles || ["Admin", "User", "Moderator"];
}

// Get statuses
async function getStatuses() {
  const data = await fetchData();
  return data.statuses || ["Active", "Pending", "Inactive"];
}

// Update user (simulated - in real app, this would update the JSON or send to server)
async function updateUser(userId, userData) {
  const data = await fetchData();
  const userIndex = data.users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...userData };
    return data.users[userIndex];
  }
  return null;
}

// Delete user (simulated)
async function deleteUser(userId) {
  const data = await fetchData();
  const userIndex = data.users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    data.users.splice(userIndex, 1);
    return true;
  }
  return false;
}

// Add new user (simulated)
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

// Update settings (simulated)
async function updateSettings(settingsData) {
  const data = await fetchData();
  data.settings = { ...data.settings, ...settingsData };
  return data.settings;
}

// Export functions
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    fetchData,
    getDashboardStats,
    getDashboardCharts,
    getRecentActivity,
    getUsers,
    getUserById,
    getSettings,
    getRoles,
    getStatuses,
    updateUser,
    deleteUser,
    addUser,
    updateSettings,
    formatNumber,
    formatCurrency,
  };
}
