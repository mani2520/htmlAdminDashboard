// Search Service - Handles search functionality across the application

// Search users
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

// Filter users by role
function filterUsersByRole(users, role) {
  if (!role || role === 'All Roles') {
    return users;
  }
  return users.filter(user => user.role === role);
}

// Filter users by status
function filterUsersByStatus(users, status) {
  if (!status || status === 'All Status') {
    return users;
  }
  return users.filter(user => user.status === status);
}

// Combined search and filter
function searchAndFilterUsers(users, searchQuery, roleFilter, statusFilter) {
  let filtered = users;
  
  // Apply search
  if (searchQuery) {
    filtered = searchUsers(filtered, searchQuery);
  }
  
  // Apply role filter
  if (roleFilter && roleFilter !== 'All Roles') {
    filtered = filterUsersByRole(filtered, roleFilter);
  }
  
  // Apply status filter
  if (statusFilter && statusFilter !== 'All Status') {
    filtered = filterUsersByStatus(filtered, statusFilter);
  }
  
  return filtered;
}

// Global search (searches across all data)
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
    // Search users - check if getUsers function is available
    if (typeof getUsers === 'function') {
      const users = await getUsers();
      results.users = searchUsers(users, query);
    }
    
    // Search dashboard stats (if query matches numbers)
    if (!isNaN(searchTerm) && typeof getDashboardStats === 'function') {
      const stats = await getDashboardStats();
      // Could search by stat values here if needed
    }
    
    results.message = `Found ${results.users.length} result(s)`;
  } catch (error) {
    console.error('Error in global search:', error);
    results.message = 'Error performing search';
  }
  
  return results;
}

// Make globalSearch available globally
window.globalSearch = globalSearch;

// Highlight search term in text
function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

// Make functions globally available
window.searchUsers = searchUsers;
window.filterUsersByRole = filterUsersByRole;
window.filterUsersByStatus = filterUsersByStatus;
window.searchAndFilterUsers = searchAndFilterUsers;
window.globalSearch = globalSearch;
window.highlightSearchTerm = highlightSearchTerm;

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    searchUsers,
    filterUsersByRole,
    filterUsersByStatus,
    searchAndFilterUsers,
    globalSearch,
    highlightSearchTerm
  };
}

