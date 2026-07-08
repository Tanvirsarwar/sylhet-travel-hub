// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Mock data for demonstration
const DESTINATIONS = [
    {
        id: 1,
        name: 'Ratargul',
        image: '🌿',
        rating: 4.8,
        reviews: 320,
        price: 2500
    },
    {
        id: 2,
        name: 'Jaflong',
        image: '🏞️',
        rating: 4.7,
        reviews: 280,
        price: 3000
    },
    {
        id: 3,
        name: 'Richanakandi',
        image: '🏔️',
        rating: 4.9,
        reviews: 310,
        price: 2800
    },
    {
        id: 4,
        name: 'Lalakhal',
        image: '💙',
        rating: 4.9,
        reviews: 400,
        price: 3200
    },
    {
        id: 5,
        name: 'Tanguar Haor',
        image: '🦆',
        rating: 4.8,
        reviews: 275,
        price: 2900
    }
];

const PACKAGES = [
    {
        id: 1,
        name: 'Weekend Escape',
        image: '🌊',
        days: 2,
        includes: ['Hotel', 'Transport', 'Guide'],
        price: 5900,
        rating: 4.7,
        type: 'weekend',
        destination: 'Ratargul',
        description: '2 Days weekend getaway with all inclusions',
        activities: ['adventure', 'family']
    },
    {
        id: 2,
        name: 'Adventure Package',
        image: '🏔️',
        days: 3,
        includes: ['Hotel', 'Transport', 'Guide', 'Meals'],
        price: 8900,
        rating: 4.8,
        type: 'adventure',
        destination: 'Jaflong',
        description: '3 Days thrilling adventure experience',
        activities: ['adventure']
    },
    {
        id: 3,
        name: 'Family Tour',
        image: '👨‍👩‍👧‍👦',
        days: 4,
        includes: ['Hotel', 'Transport', 'Guide', 'Meals'],
        price: 12500,
        rating: 4.9,
        type: 'family',
        destination: 'Lalakhal',
        description: '4 Days family bonding experience',
        activities: ['family', 'cultural']
    },
    {
        id: 4,
        name: 'Corporate Tour',
        image: '💼',
        days: 5,
        includes: ['Hotel', 'Transport', 'Guide', 'Meals', 'Conference Hall'],
        price: 0,
        rating: 4.6,
        type: 'corporate',
        destination: 'Multiple',
        description: 'Customized corporate team building',
        activities: ['corporate']
    }
];

const REVIEWS = [
    {
        id: 1,
        author: 'Fahim Ahmed',
        location: 'Dhaka, Bangladesh',
        avatar: '👨',
        rating: 5,
        text: 'Amazing experience! Everything was perfectly organized. The guide, hotel, and transport were excellent.'
    },
    {
        id: 2,
        author: 'Husrat Jahan',
        location: 'Sylhet, Bangladesh',
        avatar: '👩',
        rating: 5,
        text: 'Sylhet Travel Hub made our family trip memorable. Highly recommended for anyone visiting Sylhet.'
    },
    {
        id: 3,
        author: 'Arif Rahman',
        location: 'London, UK',
        avatar: '👨',
        rating: 5,
        text: 'Very professional service. Booking was easy and the support team was very helpful throughout the trip.'
    }
];