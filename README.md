# Modern Admin Dashboard

A beautiful, responsive admin dashboard built with HTML, Tailwind CSS, and vanilla JavaScript. Features a modern UI design with dark mode support, interactive charts, and a fully responsive layout.

## Features

- 🎨 **Modern UI Design** - Clean, attractive interface with gradient accents and smooth animations
- 🌙 **Dark Mode** - Toggle between light and dark themes with persistent storage
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 📊 **Interactive Charts** - Data visualization using Chart.js
- 👥 **User Management** - Complete user management system with search and filters
- ⚙️ **Settings Page** - Comprehensive settings and preferences management
- 🔐 **Login Page** - Beautiful authentication interface
- 📚 **Documentation** - Built-in documentation page

## Project Structure

```
htmlAdminDashboard/
├── assets/
│   ├── css/
│   │   └── style.css          # Custom styles and animations
│   └── js/
│       └── app.js             # Main JavaScript functionality
├── components/
│   ├── navbar.html            # Top navigation bar component
│   └── sidebar.html           # Sidebar navigation component
├── pages/
│   ├── dashboard.html         # Main dashboard with stats and charts
│   ├── users.html             # User management page
│   └── settings.html          # Settings and preferences page
├── documentation/
│   └── index.html             # Documentation page
└── login.html                 # Login/authentication page
```

## Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Data visualization library
- **Google Fonts (Inter)** - Modern typography

## Getting Started

1. Clone or download this repository
2. Open `login.html` in your web browser
3. Use any email and password to login (demo mode)
4. Navigate through the dashboard, users, and settings pages

## Features in Detail

### Dashboard
- Key metrics cards with gradient icons
- Interactive line and bar charts
- Recent activity feed
- Responsive grid layout

### Users Management
- Search and filter functionality
- User table with status badges
- Action buttons (Edit/Delete)
- Pagination controls

### Settings
- Profile management
- Security settings (password change)
- Notification preferences
- Language and timezone selection
- Danger zone for account deletion

### Responsive Design
- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized for all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

### Colors
Edit the CSS variables in `assets/css/style.css`:
```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  /* ... */
}
```

### Adding New Pages
1. Create a new HTML file in the `pages/` directory
2. Include the sidebar and navbar components
3. Add a navigation link in `components/sidebar.html`

## License

This project is open source and available for personal and commercial use.

## Credits

- Icons: Heroicons
- Fonts: Google Fonts (Inter)
- Charts: Chart.js
- CSS Framework: Tailwind CSS
