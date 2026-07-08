// Initialize Supabase on page load
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    setupEventListeners();
    renderDestinations();
    renderPackages();
    renderReviews();
    checkUserSession();
});

// Check if user is logged in
function checkUserSession() {
    const user = supabase?.getCurrentUser();
    if (user) {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.textContent = `Welcome, ${user.name || user.email}`;
            loginBtn.onclick = showUserMenu;
        }
    }
}

// Setup all event listeners
function setupEventListeners() {
    const loginBtn = document.getElementById('loginBtn');
    const searchBtn = document.getElementById('searchBtn');
    const showFiltersBtn = document.getElementById('showFiltersBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const destinationSearch = document.getElementById('destinationSearch');

    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', searchPackages);
    }

    if (showFiltersBtn) {
        showFiltersBtn.addEventListener('click', showFilters);
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', switchTab);
    });

    if (destinationSearch) {
        destinationSearch.addEventListener('input', handleDestinationSearch);
    }

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// Render destinations
function renderDestinations() {
    const carousel = document.getElementById('destinationsCarousel');
    if (!carousel) return;

    carousel.innerHTML = DESTINATIONS.map(dest => `
        <div class="destination-card" onclick="selectDestination('${dest.name}')">
            <div class="destination-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; height: 100%;">
                <span style="font-size: 60px;">${dest.image}</span>
            </div>
            <div class="destination-info">
                <div class="destination-name">${dest.name}</div>
                <div class="destination-rating">
                    ⭐ ${dest.rating} (${dest.reviews} reviews)
                </div>
            </div>
        </div>
    `).join('');
}

// Render packages
function renderPackages() {
    const grid = document.getElementById('packagesGrid');
    if (!grid) return;

    grid.innerHTML = PACKAGES.map(pkg => `
        <div class="package-card">
            <div class="package-image">${pkg.image}</div>
            <div class="package-content">
                <div class="package-title">${pkg.name}</div>
                <div class="package-meta">
                    <span>📅 ${pkg.days} Days</span>
                    <span>⭐ ${pkg.rating}</span>
                </div>
                <div class="package-meta">
                    ${pkg.includes.map(inc => `<span>${inc}</span>`).join('')}
                </div>
                <div class="package-price">
                    ৳${pkg.price.toLocaleString()}
                    <small>/person</small>
                </div>
                <div class="package-actions">
                    <button class="btn-details" onclick="showPackageDetails(${pkg.id})">Details</button>
                    <button class="btn-book" onclick="startBooking(${pkg.id}, '${pkg.name}', ${pkg.price})">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render reviews
function renderReviews() {
    const carousel = document.getElementById('reviewsCarousel');
    if (!carousel) return;

    carousel.innerHTML = REVIEWS.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${review.avatar}</div>
                <div class="review-info">
                    <div class="review-name">${review.author}</div>
                    <div class="review-location">${review.location}</div>
                </div>
            </div>
            <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
            <div class="review-text">"${review.text}"</div>
        </div>
    `).join('');
}

// Select destination
function selectDestination(destName) {
    document.getElementById('destinationSearch').value = destName;
    document.getElementById('destinationSuggestions').classList.remove('active');
}

// Handle destination search autocomplete
function handleDestinationSearch(e) {
    const query = e.target.value.toLowerCase();
    const suggestions = document.getElementById('destinationSuggestions');
    
    if (query.length === 0) {
        suggestions.classList.remove('active');
        return;
    }

    const filtered = DESTINATIONS.filter(d => 
        d.name.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        suggestions.classList.remove('active');
        return;
    }

    suggestions.innerHTML = filtered.map(dest => `
        <div class="suggestion-item" onclick="selectDestination('${dest.name}')">
            ${dest.name}
        </div>
    `).join('');
    suggestions.classList.add('active');
}

// Switch between tabs
function switchTab(e) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
}

// Search packages
function searchPackages() {
    const destination = document.getElementById('destinationSearch').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const travelers = document.getElementById('travelersSelect').value;

    if (!destination || !checkIn || !checkOut) {
        alert('Please fill all search fields');
        return;
    }

    console.log('Searching packages:', { destination, checkIn, checkOut, travelers });
    // Filter packages based on destination
    const filtered = PACKAGES.filter(p => 
        p.destination.toLowerCase().includes(destination.toLowerCase())
    );

    if (filtered.length === 0) {
        alert('No packages found for this destination');
        return;
    }

    alert(`Found ${filtered.length} packages for ${destination}`);
}

// Show/Hide filters
function showFilters() {
    const filtersSection = document.getElementById('filtersSection');
    filtersSection.style.display = filtersSection.style.display === 'none' ? 'block' : 'none';
}

// Apply filters
function applyFilters() {
    const priceMin = document.getElementById('priceMin').value;
    const priceMax = document.getElementById('priceMax').value;
    
    console.log(`Filtering packages: ৳${priceMin} - ৳${priceMax}`);
    // Filter packages based on selected criteria
}

// Show package details
function showPackageDetails(packageId) {
    const pkg = PACKAGES.find(p => p.id === packageId);
    if (!pkg) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>${pkg.name}</h2>
        <p><strong>Destination:</strong> ${pkg.destination}</p>
        <p><strong>Duration:</strong> ${pkg.days} Days</p>
        <p><strong>Description:</strong> ${pkg.description}</p>
        <p><strong>Includes:</strong> ${pkg.includes.join(', ')}</p>
        <p><strong>Price:</strong> ৳${pkg.price.toLocaleString()} per person</p>
        <p><strong>Rating:</strong> ${pkg.rating} stars</p>
        <button class="btn-book" onclick="startBooking(${pkg.id}, '${pkg.name}', ${pkg.price})">Book This Package</button>
    `;

    document.getElementById('packageModal').classList.add('show');
}

// Start booking flow
function startBooking(packageId, packageName, basePrice) {
    const user = supabase?.getCurrentUser();
    
    if (!user) {
        alert('Please login to book a package');
        showLoginModal();
        return;
    }

    // Store booking data temporarily
    window.currentBooking = {
        packageId,
        packageName,
        basePrice,
        userId: user.userId,
        location: document.getElementById('destinationSearch').value,
        checkIn: document.getElementById('checkInDate').value,
        checkOut: document.getElementById('checkOutDate').value,
        travelers: document.getElementById('travelersSelect').value
    };

    // Close current modal
    document.getElementById('packageModal').classList.remove('show');
    
    // Show booking details modal
    showBookingModal();
}

// Show booking details modal
function showBookingModal() {
    const booking = window.currentBooking;
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Parse travelers (e.g., "2 Adults - 1 Child")
    const travelerParts = booking.travelers.split(' - ');
    const adults = parseInt(travelerParts[0]);
    
    // Calculate total price
    const subtotal = booking.basePrice * adults * Math.max(1, nights);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Booking Confirmation</h2>
        <div class="booking-details">
            <p><strong>Package:</strong> ${booking.packageName}</p>
            <p><strong>Location:</strong> ${booking.location}</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p><strong>Duration:</strong> ${nights} nights</p>
            <p><strong>Travelers:</strong> ${booking.travelers}</p>
            <hr>
            <p><strong>Base Price (per person):</strong> ৳${booking.basePrice.toLocaleString()}</p>
            <p><strong>Subtotal (${adults} travelers x ${Math.max(1, nights)} night${nights !== 1 ? 's' : ''}):</strong> ৳${subtotal.toLocaleString()}</p>
            <p><strong>Tax (10%):</strong> ৳${tax.toLocaleString()}</p>
            <h3 style="color: #1a7a5a; margin-top: 15px;">Total: ৳${total.toLocaleString()}</h3>
        </div>
        <button class="btn-book" onclick="proceedToPayment(${total})">Proceed to Payment</button>
        <button class="btn-details" onclick="document.getElementById('packageModal').classList.remove('show')">Cancel</button>
    `;

    document.getElementById('packageModal').classList.add('show');
}

// Proceed to payment
function proceedToPayment(totalAmount) {
    const booking = window.currentBooking;
    
    if (!booking) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Payment Information</h2>
        <form id="paymentForm" onsubmit="completePayment(event, ${totalAmount})">
            <div class="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="Full Name" required>
            </div>
            
            <div class="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" maxlength="19" required>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" maxlength="5" required>
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="123" maxlength="3" required>
                </div>
            </div>

            <div class="form-group">
                <label>Email</label>
                <input type="email" value="${supabase?.getCurrentUser()?.email}" readonly>
            </div>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Amount to Pay: ৳${totalAmount.toLocaleString()}</strong></p>
            </div>

            <button type="submit" class="btn-book" style="width: 100%;">Pay Now</button>
            <button type="button" class="btn-details" onclick="showBookingModal()" style="width: 100%; margin-top: 10px;">Back</button>
        </form>
    `;

    document.getElementById('packageModal').classList.add('show');
}

// Complete payment
async function completePayment(event, totalAmount) {
    event.preventDefault();
    
    const booking = window.currentBooking;
    const user = supabase?.getCurrentUser();

    if (!booking || !user) {
        alert('Booking information missing');
        return;
    }

    // Prepare payment data
    const paymentData = {
        userId: user.userId,
        packageId: booking.packageId,
        amount: totalAmount,
        location: booking.location,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        travelers: booking.travelers,
        status: 'completed',
        paymentDate: new Date().toISOString()
    };

    // Process payment through Supabase
    const result = await supabase.processPayment(paymentData);

    if (result.success || result.id) {
        showPaymentSuccess(booking, totalAmount, result.id || 'BK' + Date.now());
    } else {
        alert('Payment failed. Please try again.');
    }
}

// Show payment success
function showPaymentSuccess(booking, totalAmount, bookingId) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <h2 style="color: #27ae60;">Payment Successful!</h2>
            <p style="font-size: 48px; margin: 20px 0;">✓</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
                <h3>Booking Confirmation</h3>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Package:</strong> ${booking.packageName}</p>
                <p><strong>Location:</strong> ${booking.location}</p>
                <p><strong>Check-in:</strong> ${booking.checkIn}</p>
                <p><strong>Check-out:</strong> ${booking.checkOut}</p>
                <p><strong>Travelers:</strong> ${booking.travelers}</p>
                <p><strong>Total Amount Paid:</strong> ৳${totalAmount.toLocaleString()}</p>
            </div>

            <p>A confirmation email has been sent to <strong>${supabase?.getCurrentUser()?.email}</strong></p>
            
            <button class="btn-book" onclick="document.getElementById('packageModal').classList.remove('show'); location.reload();" style="width: 100%;">Done</button>
        </div>
    `;

    document.getElementById('packageModal').classList.add('show');
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = handleLoginSubmit;
    }

    // Add signup tab
    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent.querySelector('.auth-tabs')) {
        modalContent.innerHTML = `
            <span class="close" onclick="this.closest('.modal').classList.remove('show')">&times;</span>
            <div class="auth-tabs">
                <button class="auth-tab-btn active" onclick="switchAuthTab('login')">Login</button>
                <button class="auth-tab-btn" onclick="switchAuthTab('signup')">Create Account</button>
            </div>
            
            <form id="loginForm" style="display: block;">
                <h2>Login to Your Account</h2>
                <input type="email" placeholder="Email" id="loginEmail" required>
                <input type="password" placeholder="Password" id="loginPassword" required>
                <button type="submit" class="btn-login" style="width: 100%; background: #1a7a5a; margin-top: 10px;">Login</button>
                <p style="text-align: center; margin-top: 15px; font-size: 12px; color: #666;">Don't have an account? Click Create Account above</p>
            </form>

            <form id="signupForm" style="display: none;">
                <h2>Create New Account</h2>
                <input type="text" placeholder="Full Name" id="signupName" required>
                <input type="email" placeholder="Email" id="signupEmail" required>
                <input type="password" placeholder="Password (min 6 characters)" id="signupPassword" required>
                <input type="password" placeholder="Confirm Password" id="signupPasswordConfirm" required>
                <button type="submit" class="btn-login" style="width: 100%; background: #1a7a5a; margin-top: 10px;">Create Account</button>
                <p style="text-align: center; margin-top: 15px; font-size: 12px; color: #666;">Already have an account? Click Login above</p>
            </form>
        `;

        document.getElementById('loginForm').onsubmit = handleLoginSubmit;
        document.getElementById('signupForm').onsubmit = handleSignupSubmit;
    }
}

// Switch auth tabs
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('form').forEach(form => form.style.display = 'none');
    
    if (tab === 'login') {
        document.querySelector('.auth-tab-btn:first-child').classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
    } else {
        document.querySelector('.auth-tab-btn:last-child').classList.add('active');
        document.getElementById('signupForm').style.display = 'block';
    }
}

// Handle login
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!supabase) {
        alert('Supabase not initialized. Please check your configuration.');
        return;
    }

    const result = await supabase.login(email, password);
    
    if (result.success) {
        alert('Login successful!');
        document.getElementById('loginModal').classList.remove('show');
        checkUserSession();
    } else {
        alert('Login failed: ' + result.error);
    }
}

// Handle signup
async function handleSignupSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

    if (password !== passwordConfirm) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    if (!supabase) {
        alert('Supabase not initialized. Please check your configuration.');
        return;
    }

    const result = await supabase.signup(email, password, name);
    
    if (result.success) {
        alert('Account created successfully! You are now logged in.');
        document.getElementById('loginModal').classList.remove('show');
        checkUserSession();
    } else {
        alert('Signup failed: ' + result.error);
    }
}

// Show user menu
function showUserMenu() {
    const user = supabase?.getCurrentUser();
    if (!user) return;

    const choice = confirm(`Logged in as: ${user.name || user.email}\n\nClick OK to view bookings or Cancel to logout`);
    
    if (choice) {
        viewUserBookings();
    } else {
        supabase.logout();
        alert('You have been logged out');
        location.reload();
    }
}

// View user bookings
async function viewUserBookings() {
    const user = supabase?.getCurrentUser();
    if (!user) return;

    const bookings = await supabase?.getBookings(user.userId);
    
    const modalBody = document.getElementById('modalBody');
    if (bookings && bookings.length > 0) {
        modalBody.innerHTML = `
            <h2>Your Bookings</h2>
            ${bookings.map((booking, i) => `
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
                    <p><strong>Booking ${i + 1}:</strong> ${booking.packageName || 'Package'}</p>
                    <p>Location: ${booking.location}</p>
                    <p>Check-in: ${booking.checkIn}</p>
                </div>
            `).join('')}
        `;
    } else {
        modalBody.innerHTML = `
            <h2>Your Bookings</h2>
            <p>You haven't made any bookings yet.</p>
        `;
    }

    document.getElementById('packageModal').classList.add('show');
}

// Add CSS for modals
const style = document.createElement('style');
style.textContent = `
    .auth-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        border-bottom: 2px solid #e0e0e0;
    }

    .auth-tab-btn {
        background: none;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        color: #666;
        font-weight: 500;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
        transition: all 0.3s;
    }

    .auth-tab-btn.active {
        color: #1a7a5a;
        border-bottom-color: #1a7a5a;
    }

    .booking-details {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
        line-height: 1.8;
    }

    .booking-details hr {
        margin: 10px 0;
        border: none;
        border-top: 1px solid #e0e0e0;
    }

    .booking-details p {
        margin: 8px 0;
        font-size: 14px;
    }

    #loginForm input, #signupForm input {
        width: 100%;
        padding: 12px;
        margin-bottom: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 14px;
        font-family: Inter, sans-serif;
    }

    #loginForm button, #signupForm button {
        width: 100%;
    }

    #loginForm p, #signupForm p {
        margin-top: 15px;
    }
`;
document.head.appendChild(style);
