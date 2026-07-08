// Supabase Integration
class SupabaseClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        this.headers = {
            'Content-Type': 'application/json',
            'apikey': key,
            'Authorization': `Bearer ${key}`
        };
        this.currentUser = null;
    }

    // Auth - Signup
    async signup(email, password, fullName) {
        try {
            const response = await fetch(`${this.url}/auth/v1/signup`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (data.user) {
                this.currentUser = data.user;
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', fullName);
                localStorage.setItem('userId', data.user.id);
                return { success: true, user: data.user };
            }
            return { success: false, error: data.error_description || 'Signup failed' };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    }

    // Auth - Login
    async login(email, password) {
        try {
            const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (data.user) {
                this.currentUser = data.user;
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('accessToken', data.access_token);
                return { success: true, user: data.user };
            }
            return { success: false, error: data.error_description || 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get current user
    getCurrentUser() {
        const email = localStorage.getItem('userEmail');
        const name = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        
        if (email && userId) {
            return { email, name, userId };
        }
        return null;
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('accessToken');
    }

    // Database operations - Get packages
    async getPackages() {
        try {
            const response = await fetch(
                `${this.url}/rest/v1/packages`,
                { headers: this.headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching packages:', error);
            return [];
        }
    }

    // Create booking
    async createBooking(bookingData) {
        try {
            const response = await fetch(
                `${this.url}/rest/v1/bookings`,
                {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify(bookingData)
                }
            );
            return await response.json();
        } catch (error) {
            console.error('Error creating booking:', error);
            return null;
        }
    }

    // Get user bookings
    async getBookings(userId) {
        try {
            const response = await fetch(
                `${this.url}/rest/v1/bookings?user_id=eq.${userId}`,
                { headers: this.headers }
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    }

    // Process payment (mock payment gateway)
    async processPayment(paymentData) {
        try {
            // This would connect to Stripe, PayPal, or other payment gateway
            // For now, we'll mock it
            const response = await fetch(
                `${this.url}/rest/v1/payments`,
                {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify(paymentData)
                }
            );
            return await response.json();
        } catch (error) {
            console.error('Payment error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize client
let supabase = null;

function initSupabase() {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_KEY);
    }
}
