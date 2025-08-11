# Technical Architecture - GlobeTrotter (VenuePlus)

## 🏗️ System Architecture

### Frontend Architecture
- **Framework**: React.js / Next.js (recommended for SSR and routing)
- **UI Library**: Material-UI, Tailwind CSS, or Chakra UI
- **State Management**: Redux Toolkit or Zustand
- **Routing**: React Router or Next.js routing
- **Maps Integration**: Google Maps API or Mapbox
- **Calendar**: React Big Calendar or FullCalendar
- **Charts**: Chart.js or Recharts

### Backend Architecture
- **Framework**: Node.js with Express.js or FastAPI (Python)
- **Database**: PostgreSQL or MySQL
- **ORM**: Prisma (Node.js) or SQLAlchemy (Python)
- **Authentication**: JWT with bcrypt
- **File Storage**: AWS S3 or Cloudinary (for trip photos)
- **API**: RESTful API with potential GraphQL integration

### Database Schema Design

#### Core Tables

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_photo_url VARCHAR(500),
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trips Table
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    cover_photo_url VARCHAR(500),
    is_public BOOLEAN DEFAULT false,
    total_budget DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities Table
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(3),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    cost_index INTEGER, -- 1-5 scale
    popularity_score INTEGER, -- 1-100 scale
    timezone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Stops Table
CREATE TABLE trip_stops (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id),
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    order_index INTEGER NOT NULL,
    notes TEXT,
    accommodation_budget DECIMAL(8,2),
    transport_budget DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities Table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- sightseeing, food, adventure, etc.
    estimated_cost DECIMAL(8,2),
    estimated_duration INTEGER, -- in minutes
    rating DECIMAL(3,2), -- 1.00-5.00
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Activities Table (Many-to-Many)
CREATE TABLE trip_activities (
    id SERIAL PRIMARY KEY,
    trip_stop_id INTEGER REFERENCES trip_stops(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id),
    scheduled_date DATE,
    scheduled_time TIME,
    actual_cost DECIMAL(8,2),
    notes TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget Items Table
CREATE TABLE budget_items (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- transport, accommodation, food, activities, misc
    item_name VARCHAR(255),
    estimated_cost DECIMAL(8,2),
    actual_cost DECIMAL(8,2),
    date_incurred DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shared Trips Table
CREATE TABLE shared_trips (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
    shared_by_user_id INTEGER REFERENCES users(id),
    share_token VARCHAR(255) UNIQUE,
    is_public BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

## 🔧 API Endpoints Structure

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Password reset

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Trip Management
- `GET /api/trips` - Get user's trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Itinerary Management
- `GET /api/trips/:id/stops` - Get trip stops
- `POST /api/trips/:id/stops` - Add trip stop
- `PUT /api/stops/:id` - Update trip stop
- `DELETE /api/stops/:id` - Delete trip stop
- `PUT /api/stops/:id/reorder` - Reorder stops

### Search & Discovery
- `GET /api/cities/search` - Search cities
- `GET /api/cities/:id/activities` - Get city activities
- `GET /api/activities/search` - Search activities

### Budget Management
- `GET /api/trips/:id/budget` - Get trip budget
- `POST /api/trips/:id/budget/items` - Add budget item
- `PUT /api/budget/items/:id` - Update budget item
- `DELETE /api/budget/items/:id` - Delete budget item

### Sharing
- `POST /api/trips/:id/share` - Create shareable link
- `GET /api/shared/:token` - Get shared trip
- `POST /api/trips/:id/copy` - Copy shared trip

## 🎨 Frontend Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   └── ErrorBoundary.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── trips/
│   │   ├── TripCard.jsx
│   │   ├── TripForm.jsx
│   │   ├── TripList.jsx
│   │   └── TripDashboard.jsx
│   ├── itinerary/
│   │   ├── ItineraryBuilder.jsx
│   │   ├── ItineraryView.jsx
│   │   ├── StopCard.jsx
│   │   └── ActivityCard.jsx
│   ├── search/
│   │   ├── CitySearch.jsx
│   │   ├── ActivitySearch.jsx
│   │   └── SearchFilters.jsx
│   ├── budget/
│   │   ├── BudgetOverview.jsx
│   │   ├── BudgetBreakdown.jsx
│   │   └── CostChart.jsx
│   └── calendar/
│       ├── TripCalendar.jsx
│       ├── Timeline.jsx
│       └── DayView.jsx
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── CreateTrip.jsx
│   ├── TripDetails.jsx
│   ├── SharedTrip.jsx
│   └── Profile.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useTrips.js
│   └── useBudget.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── localStorage.js
└── utils/
    ├── dateHelpers.js
    ├── budgetCalculations.js
    └── validators.js
```

## 🚀 Development Roadmap

### Sprint 1: Foundation (Week 1)
- Set up project structure
- Implement authentication system
- Create basic user management
- Set up database schema

### Sprint 2: Core Trip Management (Week 2)
- Dashboard implementation
- Trip creation and listing
- Basic trip details view
- User profile management

### Sprint 3: Itinerary Builder (Week 3)
- City search and selection
- Trip stops management
- Basic activity assignment
- Itinerary view

### Sprint 4: Enhanced Features (Week 4)
- Activity search and filtering
- Budget management system
- Calendar/timeline view
- Trip sharing functionality

### Sprint 5: Polish & Optimization (Week 5)
- UI/UX improvements
- Performance optimization
- Admin dashboard (if time permits)
- Testing and bug fixes

## 🔐 Security Considerations

- JWT token authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention through ORM
- CORS configuration
- Rate limiting on API endpoints
- Secure file upload handling

## 📱 Responsive Design Strategy

- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Touch-friendly interface elements
- Optimized navigation for mobile
- Progressive Web App (PWA) capabilities
