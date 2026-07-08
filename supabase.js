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
    }

    // Auth
    async signup(email, password) {
        try {
            const response = await fetch(`${this.url}/auth/v1/signup`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Signup error:', error);
            return null;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.url}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            return null;
        }
    }

    // Database operations
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
}

// Initialize client (use actual credentials when available)
let supabase = null;

function initSupabase() {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_KEY);
    }
}