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

function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
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
