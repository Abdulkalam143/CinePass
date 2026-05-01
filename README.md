# 🎬 CinePass — Movie Ticket Booking Web App

A premium, responsive movie ticket booking application built with **React.js** and **Vite**. Features GPS-based theater discovery, interactive seat selection, and real-time pricing.

![CinePass Banner](https://img.shields.io/badge/CinePass-Movie%20Ticket%20Booking-E50914?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxyZWN0IHg9IjIiIHk9IjIiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcng9IjIuMTgiIHJ5PSIyLjE4Ii8+PGxpbmUgeDE9IjciIHkxPSIyIiB4Mj0iNyIgeTI9IjIyIi8+PGxpbmUgeDE9IjE3IiB5MT0iMiIgeDI9IjE3IiB5Mj0iMjIiLz48bGluZSB4MT0iMiIgeTE9IjEyIiB4Mj0iMjIiIHkyPSIxMiIvPjwvc3ZnPg==)

## ✨ Features

### 🎬 Movie Browsing
- **Location-Based Movies** — GPS auto-detects your region and shows movies playing nearby
- **3 Sections** — Now Playing, Coming Soon, and Trending Today (region-aware via TMDB)
- **Search & Filter** — Debounced search with genre filter chips
- **Hero Banner** — Dynamic featured movie with backdrop

### 🏢 Theater Discovery
- **GPS-Powered** — Finds real cinemas near you using OpenStreetMap
- **Screen Details** — Shows screen numbers, formats (2D/3D/IMAX/4DX/Dolby Atmos)
- **Per-Screen Showtimes** — Select theater → screen → time
- **Distance Tracking** — Shows distance in km for each theater

### 💺 Seat Selection
- **Interactive 8×12 Grid** — Theater-style layout with aisle gaps
- **3 Seat States** — Available (green), Selected (yellow), Booked (red)
- **Tiered Pricing** — Premium ₹350 / Standard ₹250 / Budget ₹150
- **Hover Effects** — Visual feedback on seat interaction

### ⏱️ Booking Timer
- **5-Minute Countdown** — Auto-holds selected seats
- **Visual Urgency** — Color changes and pulse animation at < 1 minute
- **Auto-Release** — Clears seats and shows timeout message on expiry

### 💳 Payment & Confirmation
- **Price Breakdown** — Per-seat pricing with convenience fee
- **Payment Simulation** — Realistic payment flow with loading states
- **Confetti Animation** — Celebration on successful booking
- **Ticket Card** — Booking ID, movie details, and selected seats

### 🎨 UI/UX
- **Dark Theme** — Premium dark UI with glassmorphism effects
- **Framer Motion** — Smooth page transitions and micro-animations
- **Mobile-First** — Fully responsive (480px → 1440px)
- **Toast Notifications** — Success, warning, and info messages

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 6 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Framer Motion | Animations & transitions |
| Lucide React | Icon library |
| TMDB API | Real movie data |
| OpenStreetMap | Theater discovery |
| localStorage | Booking persistence |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- TMDB API key ([Get one free](https://www.themoviedb.org/settings/api))

### Installation

```bash
# Clone the repository
git clone https://github.com/Abdulkalam143/CinePass-Movie-Ticket-Booking.git

# Navigate to the project
cd CinePass-Movie-Ticket-Booking

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your TMDB API key

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173/`

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_TMDB_API_KEY` | Your TMDB API key |

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx       # Navigation header
│   ├── Footer.jsx       # Site footer
│   ├── MovieCard.jsx    # Movie card with poster & info
│   ├── SearchBar.jsx    # Debounced search input
│   ├── FilterBar.jsx    # Genre filter chips
│   ├── SeatMap.jsx      # Interactive theater seat grid
│   ├── SeatLegend.jsx   # Seat color legend
│   ├── Timer.jsx        # 5-min countdown timer
│   ├── BookingSummary.jsx # Sidebar booking summary
│   ├── Toast.jsx        # Toast notifications
│   ├── SkeletonCard.jsx # Loading skeleton
│   ├── LocationIndicator.jsx  # GPS location badge
│   ├── TheaterShowtimes.jsx   # Theater/screen selector
│   └── NearbyTheaters.jsx     # Nearby cinema finder
├── pages/               # Route pages
│   ├── HomePage.jsx     # Movie browsing dashboard
│   ├── MovieDetailsPage.jsx   # Movie info + theater selection
│   ├── BookingPage.jsx  # Seat selection + timer
│   ├── ConfirmationPage.jsx   # Booking review
│   └── PaymentSuccessPage.jsx # Payment success + ticket
├── context/
│   └── BookingContext.jsx     # Global state management
├── utils/
│   ├── api.js           # TMDB API integration
│   ├── seatUtils.js     # Seat grid generation
│   ├── storage.js       # localStorage helpers
│   └── useGeolocation.js # GPS location hook
├── data/
│   └── movies.json      # Static fallback data
├── App.jsx              # Router + layout
└── index.css            # Design system tokens
```

## 📸 Screenshots

| Home Page | Seat Selection | Confirmation |
|---|---|---|
| Hero + movie grid with location tracking | 8×12 theater grid with timer | Price breakdown + booking review |

## 🌐 Deployment

### Vercel
1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add `VITE_TMDB_API_KEY` in Environment Variables
4. Deploy

### Netlify
1. Push to GitHub
2. Import in [Netlify](https://netlify.com)
3. Add `VITE_TMDB_API_KEY` in Environment Variables
4. Deploy

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) — Movie data API
- [OpenStreetMap](https://www.openstreetmap.org/) — Theater location data
- [Lucide](https://lucide.dev/) — Beautiful icon library
- [Framer Motion](https://www.framer.com/motion/) — Animation library

---

Made with ❤️ by **Abdul Kalam**
