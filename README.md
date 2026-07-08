# Sylhet Travel Hub - Web Application

## Overview
Sylhet Travel Hub is a comprehensive travel booking platform for exploring and booking tours, packages, and experiences in Sylhet, Bangladesh. This is a fully functional web application built with vanilla HTML, CSS, and JavaScript with Supabase integration for backend services.

## Features

### ✨ Core Features
- **Search & Filter System**: Advanced filtering by destination, date, travelers, price, rating, duration, activity type, and inclusions
- **Package Management**: Browse ready-made packages or build custom trips
- **User Authentication**: Login/Register system with Supabase
- **Booking System**: Complete booking flow from search to confirmation
- **Responsive Design**: Fully mobile-optimized interface
- **Real-time Updates**: Instant filter results and dynamic content loading

### 🎯 Main Sections
1. **Navigation Bar**: Quick access to all sections and user authentication
2. **Hero Section**: Eye-catching banner with main search functionality
3. **Search Widget**: Multi-field search (destination, dates, travelers)
4. **Stats Dashboard**: Key metrics (travelers, hotels, guides, etc.)
5. **Popular Destinations**: Carousel of top destinations with ratings
6. **Filter Panel**: Comprehensive filtering options
7. **Ready-Made Packages**: Pre-designed tour packages with descriptions
8. **Build Your Trip**: Step-by-step custom trip builder
9. **Why Choose Us**: Features and benefits showcase
10. **Reviews Section**: Traveler testimonials and ratings
11. **App Download**: Mobile app promotion
12. **Footer**: Quick links, contact info, and social media

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (Vanilla)**: No frameworks, pure JS for speed and smoothness

### Backend (Optional)
- **Supabase**: PostgreSQL database, authentication, and real-time updates
- **Authentication**: JWT-based user management
- **Database**: Packages, bookings, hotels, reviews

## File Structure

```
sylhet-travel-hub/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # Main JavaScript logic
├── config.js           # Configuration and mock data
├── supabase.js         # Supabase integration
└── README.md           # Documentation
```

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sylhet-travel-hub.git
cd sylhet-travel-hub
```

2. Open the project:
```bash
# Using any local server
python -m http.server 8000
# or
node -m http-server
# or open index.html directly in browser
```

### Supabase Setup

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your Supabase URL and Anon Key
4. Update `config.js`:

```javascript
const SUPABASE_URL = 'your_supabase_url';
const SUPABASE_KEY = 'your_anon_key';
```

### Database Schema (Supabase)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Packages table
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  duration INT NOT NULL,
  price INT NOT NULL,
  description TEXT,
  includes TEXT[],
  rating DECIMAL(3, 1),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  package_id INT REFERENCES packages(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  travelers INT NOT NULL,
  total_price INT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT REFERENCES bookings(id),
  rating INT NOT NULL,
  text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Filtering System

The app includes comprehensive filtering with:

### 1. **Price Range Filter**
   - Dual range slider (min/max)
   - Real-time price display
   - Default: ৳0 - ৳50,000

### 2. **Rating Filter**
   - Filter by star ratings (3+, 4+, 5 star)
   - Checkbox selection

### 3. **Duration Filter**
   - 1-2 Days
   - 3-4 Days
   - 5+ Days

### 4. **Activity Type Filter**
   - Adventure
   - Cultural
   - Family
   - Corporate

### 5. **Includes Filter**
   - Hotel
   - Transport
   - Guide
   - Meals

## Key JavaScript Functions

```javascript
// Search and Filter
performSearch()        // Execute search with selected criteria
applyFilters()         // Apply all active filters
toggleFilters()        // Show/hide filter panel

// Package Management
renderPackages()       // Render package cards
viewPackageDetails()   // Show detailed package information
bookPackage()          // Initiate booking process

// Destination Management
renderDestinations()   // Display destination carousel
selectDestination()    // Select destination and search

// User Management
openLoginModal()       // Open login modal
closeModals()          // Close all modals

// UI Interactions
handleDestinationSearch()  // Handle destination search input
handleTabChange()          // Handle tab switching
updatePriceDisplay()       // Update price range display
```

## CSS Features

### Design System
- **Color Scheme**:
  - Primary: #1a7a5a (Forest Green)
  - Accent: #f4a840 (Gold)
  - Text Dark: #1a1a1a
  - Background: #f9f9f9

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: 480px - 767px
- Small Mobile: < 480px

### Animations
- Smooth transitions (0.3s)
- Hover effects on cards and buttons
- Modal fade-in animations
- Scroll-smooth behavior

## Performance Optimization

1. **Vanilla JavaScript**: No heavy framework overhead
2. **CSS Grid & Flexbox**: Efficient layouts
3. **Event Delegation**: Reduced event listeners
4. **Lazy Loading**: Images loaded on demand
5. **Smooth Scrolling**: Native scroll-behavior

## Browser Support
- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

- [ ] Real-time availability calendar
- [ ] Payment gateway integration (Stripe/SSLCommerz)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Rating and review system
- [ ] Wishlist functionality
- [ ] Email confirmations
- [ ] SMS notifications
- [ ] Admin panel

## API Documentation

### Search Packages
```javascript
GET /api/packages?destination=&startDate=&endDate=&travelers=
RETURN: Array of matching packages
```

### Create Booking
```javascript
POST /api/bookings
BODY: { packageId, userId, checkIn, checkOut, travelers }
RETURN: Booking confirmation
```

### Get User Bookings
```javascript
GET /api/bookings?userId=
RETURN: Array of user bookings
```

## Troubleshooting

### Supabase Connection Issues
- Verify URL and key in `config.js`
- Check CORS settings in Supabase
- Ensure database tables are created

### Filter Not Working
- Check browser console for errors
- Verify filter values in `selectedFilters` object
- Ensure packages have required fields

### Modal Not Opening
- Check z-index values
- Verify modal HTML is properly rendered
- Check JavaScript event listeners

## Contact & Support

- Email: hello@sylhettravel.com
- Phone: +880-524-667990
- Address: Zindabazar, Sylhet 3100

## License

MIT License - Feel free to use this project for personal and commercial purposes.

## Author

Sylhet Travel Hub Development Team

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**