// Initialize Supabase
initSupabase();

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const showFiltersBtn = document.getElementById('showFiltersBtn');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const loginBtn = document.getElementById('loginBtn');
const destinationSearch = document.getElementById('destinationSearch');
const destinationSuggestions = document.getElementById('destinationSuggestions');
const destinationsCarousel = document.getElementById('destinationsCarousel');
const packagesGrid = document.getElementById('packagesGrid');
const reviewsCarousel = document.getElementById('reviewsCarousel');
const filtersSection = document.getElementById('filtersSection');
const packageModal = document.getElementById('packageModal');
const loginModal = document.getElementById('loginModal');
const tabButtons = document.querySelectorAll('.tab-btn');

// State
let filteredPackages = [...PACKAGES];
let selectedFilters = {
    priceMin: 0,
    priceMax: 50000,
    ratings: [],
    duration: [],
    activities: [],
    includes: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderDestinations();
    renderPackages();
    renderReviews();
    setupEventListeners();
    setupDateValidation();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', performSearch);
    
    // Filters
    showFiltersBtn.addEventListener('click', toggleFilters);
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    // Login
    loginBtn.addEventListener('click', openLoginModal);
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Destination search
    destinationSearch.addEventListener('input', handleDestinationSearch);
    destinationSearch.addEventListener('blur', () => {
        setTimeout(() => {
            destinationSuggestions.classList.remove('active');
        }, 200);
    });
    
    // Tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', handleTabChange);
    });
    
    // Filter range sliders
    document.getElementById('priceMin')?.addEventListener('input', updatePriceDisplay);
    document.getElementById('priceMax')?.addEventListener('input', updatePriceDisplay);
}

// Date Validation
function setupDateValidation() {
    const checkInInput = document.getElementById('checkInDate');
    const checkOutInput = document.getElementById('checkOutDate');
    const today = new Date().toISOString().split('T')[0];
    
    checkInInput.min = today;
    checkOutInput.min = today;
    
    checkInInput.addEventListener('change', () => {
        checkOutInput.min = checkInInput.value;
    });
}

// Destination Search
function handleDestinationSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (!query) {
        destinationSuggestions.classList.remove('active');
        return;
    }
    
    const suggestions = DESTINATIONS.filter(d => 
        d.name.toLowerCase().includes(query)
    );
    
    if (suggestions.length > 0) {
        destinationSuggestions.innerHTML = suggestions
            .map(s => `<div class="suggestion-item" data-name="${s.name}">${s.name}</div>`)
            .join('');
        destinationSuggestions.classList.add('active');
        
        destinationSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                destinationSearch.value = item.dataset.name;
                destinationSuggestions.classList.remove('active');
            });
        });
    } else {
        destinationSuggestions.classList.remove('active');
    }
}

// Render Destinations
function renderDestinations() {
    destinationsCarousel.innerHTML = DESTINATIONS.map(dest => `
        <div class="destination-card" onclick="selectDestination('${dest.name}')">
            <div style="font-size: 60px; display: flex; align-items: center; justify-content: center; height: 100%;">${dest.image}</div>
            <div class="destination-info">
                <div class="destination-name">${dest.name}</div>
                <div class="destination-rating">
                    <span>⭐ ${dest.rating}</span>
                    <span>(${dest.reviews})</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Select Destination
function selectDestination(name) {
    destinationSearch.value = name;
    document.querySelector('.search-card').scrollIntoView({ behavior: 'smooth' });
}

// Render Packages
function renderPackages(packages = PACKAGES) {
    packagesGrid.innerHTML = packages.map(pkg => `
        <div class="package-card" onclick="viewPackageDetails(${pkg.id})">
            <div style="font-size: 80px; display: flex; align-items: center; justify-content: center; height: 200px; background: var(--bg-light);">${pkg.image}</div>
            <div class="package-content">
                <h3 class="package-title">${pkg.name}</h3>
                <div class="package-meta">
                    <span>📅 ${pkg.days} Days</span>
                    <span>📍 ${pkg.destination}</span>
                </div>
                <div class="package-price">৳${pkg.price.toLocaleString()} <small>/ person</small></div>
                <div style="margin-bottom: 15px; font-size: 12px; color: var(--text-light);">
                    Includes: ${pkg.includes.join(', ')}
                </div>
                <div class="package-actions">
                    <button class="btn-details" onclick="event.stopPropagation(); viewPackageDetails(${pkg.id})">View Details</button>
                    <button class="btn-book" onclick="event.stopPropagation(); bookPackage(${pkg.id})">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

// View Package Details
function viewPackageDetails(id) {
    const pkg = PACKAGES.find(p => p.id === id);
    if (!pkg) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="font-size: 100px; text-align: center; margin-bottom: 20px;">${pkg.image}</div>
            <h2>${pkg.name}</h2>
            <p style="color: var(--text-light); margin: 10px 0;">${pkg.description}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
                <strong>Duration:</strong> ${pkg.days} Days
            </div>
            <div>
                <strong>Destination:</strong> ${pkg.destination}
            </div>
            <div>
                <strong>Rating:</strong> ⭐ ${pkg.rating}
            </div>
            <div>
                <strong>Type:</strong> ${pkg.type.charAt(0).toUpperCase() + pkg.type.slice(1)}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <strong>What's Included:</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                ${pkg.includes.map(inc => `<li>${inc}</li>`).join('')}
            </ul>
        </div>
        
        <div style="margin-bottom: 20px;">
            <strong>Activities:</strong>
            <p>${pkg.activities.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')}</p>
        </div>
        
        <div style="background: var(--bg-light); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <div style="font-size: 28px; color: var(--primary-color); font-weight: bold;">৳${pkg.price.toLocaleString()}</div>
            <small style="color: var(--text-light);">per person</small>
        </div>
        
        <button class="btn-book" style="width: 100%; padding: 12px;" onclick="bookPackage(${pkg.id})">Book This Package</button>
    `;
    
    packageModal.classList.add('show');
}

// Book Package
function bookPackage(packageId) {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Please login to book a package');
        openLoginModal();
        return;
    }
    
    const pkg = PACKAGES.find(p => p.id === packageId);
    alert(`Package "${pkg.name}" booking initiated!\n\nIn a real app, this would proceed to payment.`);
    packageModal.classList.remove('show');
}

// Render Reviews
function renderReviews() {
    reviewsCarousel.innerHTML = REVIEWS.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${review.avatar}</div>
                <div class="review-info">
                    <div class="review-name">${review.author}</div>
                    <div class="review-location">${review.location}</div>
                </div>
            </div>
            <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');
}

// Search
function performSearch() {
    const destination = document.getElementById('destinationSearch').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const travelers = document.getElementById('travelersSelect').value;
    
    if (!destination || !checkIn || !checkOut) {
        alert('Please fill all search fields');
        return;
    }
    
    console.log('Searching for:', {
        destination,
        checkIn,
        checkOut,
        travelers
    });
    
    document.querySelector('.packages-section').scrollIntoView({ behavior: 'smooth' });
    alert(`Searched for ${destination} from ${checkIn} to ${checkOut}!`);
}

// Toggle Filters
function toggleFilters() {
    if (filtersSection.style.display === 'none') {
        filtersSection.style.display = 'block';
        showFiltersBtn.textContent = 'Hide Filters';
        filtersSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        filtersSection.style.display = 'none';
        showFiltersBtn.textContent = 'Show Filters';
    }
}

// Update Price Display
function updatePriceDisplay() {
    const priceMin = document.getElementById('priceMin').value;
    const priceMax = document.getElementById('priceMax').value;
    
    document.getElementById('priceMinDisplay').textContent = priceMin;
    document.getElementById('priceMaxDisplay').textContent = priceMax;
}

// Apply Filters
function applyFilters() {
    // Get filter values
    selectedFilters.priceMin = parseInt(document.getElementById('priceMin').value);
    selectedFilters.priceMax = parseInt(document.getElementById('priceMax').value);
    
    selectedFilters.ratings = Array.from(document.querySelectorAll('.rating-filter input:checked'))
        .map(el => parseInt(el.value));
    
    selectedFilters.duration = Array.from(document.querySelectorAll('.duration-filter input:checked'))
        .map(el => el.value);
    
    selectedFilters.activities = Array.from(document.querySelectorAll('.activity-filter input:checked'))
        .map(el => el.value);
    
    selectedFilters.includes = Array.from(document.querySelectorAll('.includes-filter input:checked'))
        .map(el => el.value);
    
    // Filter packages
    filteredPackages = PACKAGES.filter(pkg => {
        // Price filter
        if (pkg.price > 0 && (pkg.price < selectedFilters.priceMin || pkg.price > selectedFilters.priceMax)) {
            return false;
        }
        
        // Rating filter
        if (selectedFilters.ratings.length > 0) {
            const hasRating = selectedFilters.ratings.some(r => pkg.rating >= r);
            if (!hasRating) return false;
        }
        
        // Duration filter
        if (selectedFilters.duration.length > 0) {
            const durationMatch = selectedFilters.duration.some(d => {
                if (d === '1-2') return pkg.days >= 1 && pkg.days <= 2;
                if (d === '3-4') return pkg.days >= 3 && pkg.days <= 4;
                if (d === '5+') return pkg.days >= 5;
                return false;
            });
            if (!durationMatch) return false;
        }
        
        // Activity filter
        if (selectedFilters.activities.length > 0) {
            const hasActivity = selectedFilters.activities.some(a => pkg.activities.includes(a));
            if (!hasActivity) return false;
        }
        
        // Includes filter
        if (selectedFilters.includes.length > 0) {
            const hasIncludes = selectedFilters.includes.every(inc => pkg.includes.includes(inc));
            if (!hasIncludes) return false;
        }
        
        return true;
    });
    
    renderPackages(filteredPackages);
    document.querySelector('.packages-section').scrollIntoView({ behavior: 'smooth' });
    
    if (filteredPackages.length === 0) {
        packagesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">No packages found matching your filters.</div>';
    }
}

// Tab Handling
function handleTabChange(e) {
    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked tab
    e.target.closest('.tab-btn').classList.add('active');
    
    const tab = e.target.closest('.tab-btn').dataset.tab;
    console.log('Switched to tab:', tab);
}

// Modal Handling
function openLoginModal() {
    loginModal.classList.add('show');
}

function closeModals() {
    packageModal.classList.remove('show');
    loginModal.classList.remove('show');
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === packageModal) {
        packageModal.classList.remove('show');
    }
    if (e.target === loginModal) {
        loginModal.classList.remove('show');
    }
});

// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    // Mock login
    console.log('Logging in:', email);
    localStorage.setItem('authToken', 'mock-token-' + Date.now());
    localStorage.setItem('userEmail', email);
    
    alert('Logged in successfully!');
    closeModals();
    loginBtn.textContent = 'Logout';
    
    // Add logout functionality
    loginBtn.onclick = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        loginBtn.textContent = 'Login';
        loginBtn.onclick = openLoginModal;
    };
});

// Check if user is already logged in
window.addEventListener('load', () => {
    if (localStorage.getItem('authToken')) {
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            loginBtn.textContent = 'Login';
            loginBtn.onclick = openLoginModal;
        };
    }
});