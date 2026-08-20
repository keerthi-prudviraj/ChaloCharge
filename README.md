# EV Route Planner

A React-based Electric Vehicle route planning application with Mapbox integration for finding charging stations along your route.

## Features

- **Interactive Map**: Click on the map to set source and destination points
- **Route Planning**: Visualize routes between source and destination
- **Charging Station Discovery**: Find charging stations along your route
- **Real-time Data**: View station availability, pricing, and wait times
- **Filter Options**: Filter stations by availability, type, price, and renewable energy
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Mapbox Access Token

1. Go to [Mapbox](https://www.mapbox.com/) and create a free account
2. Get your access token from your Mapbox dashboard
3. Create a `.env.local` file in the project root:

```bash
echo VITE_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_token_here > .env.local
```

Replace `your_actual_mapbox_token_here` with your real Mapbox access token.

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5174` (or the next available port).

## How to Use

1. **Set Source and Destination**:
   - Click on the map to set your starting point (blue "S" marker)
   - Click again to set your destination (red "D" marker)
   - Or manually enter coordinates in the input fields

2. **Plan Route**:
   - Click "Plan Route" to calculate the route
   - The system will show charging stations along your route

3. **Filter Stations**:
   - Use the sidebar filters to find stations that match your preferences
   - Filter by availability, charging type, price, and renewable energy

4. **View Station Details**:
   - Click on station markers on the map for detailed information
   - View station list below the map for quick overview

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Mapbox GL JS** for interactive maps
- **Lucide React** for icons
- **React Router** for navigation

## Project Structure

```
src/
├── components/
│   ├── EVMap.tsx          # Interactive map component
│   ├── Header.tsx         # Application header
│   └── Footer.tsx         # Application footer
├── pages/
│   ├── MapPage.tsx        # Main map page with route planning
│   ├── HomePage.tsx       # Landing page
│   ├── AboutPage.tsx      # About page
│   ├── ContactPage.tsx    # Contact page
│   ├── InsightsPage.tsx   # Analytics and insights
│   └── TripPlannerPage.tsx # Trip planning page
└── App.tsx               # Main application component
```

## Environment Variables

Create a `.env.local` file with:

```
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 