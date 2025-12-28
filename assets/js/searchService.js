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

window.globalSearch = globalSearch;

function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

window.searchUsers = searchUsers;
window.filterUsersByRole = filterUsersByRole;
window.filterUsersByStatus = filterUsersByStatus;
window.searchAndFilterUsers = searchAndFilterUsers;
window.globalSearch = globalSearch;
window.highlightSearchTerm = highlightSearchTerm;

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

