# Modern Admin Dashboard

A beautiful, responsive admin dashboard template built with HTML, Tailwind CSS, and vanilla JavaScript. Features a modern UI design with dark mode support, interactive charts, and a fully responsive layout.

## 🌟 Features

- 🎨 **Modern UI Design** - Clean, attractive interface with gradient accents and smooth animations
- 🌙 **Dark Mode** - Toggle between light and dark themes with persistent storage
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 📊 **Interactive Charts** - Data visualization using Chart.js
- 👥 **User Management** - Complete user management system with search and filters
- ⚙️ **Settings Page** - Comprehensive settings and preferences management
- 🔐 **Login Page** - Beautiful authentication interface
- 📚 **Documentation** - Built-in documentation page
- 🚀 **No Build Process** - Works directly in the browser, no compilation needed
- ♿ **Accessible** - Semantic HTML with proper ARIA labels
- ⚡ **Fast Loading** - Optimized CSS and JavaScript

## 📦 Installation

1. **Download the template** from ThemeForest
2. **Extract the files** to your web server directory
3. **Open `index.html` or `login.html`** in your web browser
4. **Start customizing** to match your needs

### Requirements

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (optional, but recommended for development)
- No additional dependencies or build tools required

### Using a Local Server (Recommended)

For best results, use a local web server instead of opening files directly:

**Using Python:**

```bash
python -m http.server 8000
```

**Using Node.js (http-server):**

```bash
npx http-server
```

**Using PHP:**

```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
htmlAdminDashboard/
├── assets/
│   ├── css/
│   │   └── style.css          # Custom styles and theme variables
│   ├── js/
│   │   ├── app.js             # Main JavaScript functionality
│   │   ├── dataService.js     # Data management service
│   │   ├── searchService.js   # Search and filter functionality
│   │   └── buttonInteractions.js # Button interactions and animations
│   └── data/
│       └── data.json          # Sample data for the template
├── components/
│   ├── navbar.html            # Top navigation bar component
│   └── sidebar.html           # Sidebar navigation component
├── pages/
│   ├── dashboard.html         # Main dashboard with stats and charts
│   ├── users.html             # User management page
│   └── settings.html          # Settings and preferences page
├── documentation/
│   └── index.html             # Documentation page
├── index.html                 # Entry point (redirects to login)
├── login.html                 # Login/authentication page
├── README.md                  # This file
├── CHANGELOG.md               # Version history
└── LICENSE.txt                # License information
```

## 🚀 Getting Started

1. **Open the template** - Start with `index.html` or `login.html`
2. **Demo Login** - Use any email and password to login (demo mode)
3. **Explore** - Navigate through the dashboard, users, and settings pages
4. **Customize** - Edit the files to match your design and requirements

## 📄 Pages Included

### Dashboard (`pages/dashboard.html`)

- Key metrics cards with gradient icons
- Interactive line and bar charts using Chart.js
- Recent activity feed
- Responsive grid layout
- Real-time data visualization

### Users Management (`pages/users.html`)

- Search and filter functionality
- User table with status badges
- Add/Edit/Delete user functionality
- Modal dialogs for user operations
- Pagination controls
- Role and status filtering

### Settings (`pages/settings.html`)

- Profile management with avatar upload
- Security settings (password change)
- Notification preferences (email, push, SMS)
- Language and timezone selection
- Danger zone for account deletion

### Login (`login.html`)

- Beautiful gradient design
- Form validation
- Remember me functionality
- Smooth animations and transitions

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `assets/css/style.css`:

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
  /* ... */
}
```

### Adding New Pages

1. Create a new HTML file in the `pages/` directory
2. Include the sidebar and navbar components using the fetch API:
   ```html
   <div id="sidebar-container"></div>
   <div id="navbar-container"></div>
   ```
3. Add a navigation link in `components/sidebar.html`
4. Include the necessary JavaScript files

### Modifying Components

The template uses component-based architecture:

- **Navbar**: `components/navbar.html`
- **Sidebar**: `components/sidebar.html`

These components are loaded dynamically using JavaScript fetch API.

### Using Your Own Data

Replace the sample data in `assets/data/data.json` with your own data structure. Update the data service functions in `assets/js/dataService.js` to match your backend API endpoints.

## 💻 Technologies Used

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Data visualization library
- **Animate.css** - CSS animation library
- **Google Fonts (Inter)** - Modern typography
- **Heroicons** - Beautiful SVG icons

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

The template uses modern web standards and should work in any browser that supports ES6 JavaScript and CSS Grid.

## 📚 Dependencies & Credits

### Third-Party Libraries

- **Tailwind CSS** - [MIT License](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE) - Utility-first CSS framework
- **Chart.js** - [MIT License](https://github.com/chartjs/Chart.js/blob/master/LICENSE.md) - Data visualization library
- **Animate.css** - [MIT License](https://github.com/animate-css/animate.css/blob/main/LICENSE) - CSS animation library
- **Google Fonts (Inter)** - [SIL Open Font License](https://fonts.google.com/specimen/Inter/about) - Typography
- **Heroicons** - [MIT License](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE) - SVG icons

All third-party libraries are loaded via CDN and are properly credited. Please review their individual licenses before use.

## 📝 License

This template is licensed under the MIT License. See the [LICENSE.txt](LICENSE.txt) file for more information.

## 📖 Documentation

For detailed documentation, please visit the built-in documentation page at `documentation/index.html` or refer to the inline code comments.

## 🐛 Support

For support, feature requests, or bug reports, please contact the template author through ThemeForest.

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.

## 🙏 Acknowledgments

- **Tailwind Labs** for Tailwind CSS
- **Chart.js Team** for Chart.js
- **Animate.css Contributors** for Animate.css
- **Heroicons Team** for the beautiful icons
- **Google Fonts** for Inter font family

---

**Version:** 1.0.0  
**Last Updated:** December 2025  
**Author:** [Your Name]  
**ThemeForest Item:** [Item Name]
