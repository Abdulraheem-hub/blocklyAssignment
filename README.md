# Vehicle Tracking System

A real-time vehicle tracking and movement simulation application built with React and Leaflet maps. This application visualizes vehicle movement along a predefined route with smooth animations and interactive controls.

## Features

- 🗺️ **Interactive Map**: Real-time vehicle tracking using Leaflet/OpenStreetMap
- 🎬 **Playback Controls**: Play, pause, and reset vehicle movement simulation
- ⚡ **Variable Speed**: Adjust playback speed from 0.5x to 3x
- 📍 **Route Visualization**: See the complete path with traveled route highlighted
- 📊 **Live Statistics**: Real-time speed, coordinates, and timestamp information
- 📱 **Responsive Design**: Fully responsive UI for mobile, tablet, and desktop

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 14.x or higher)
- **npm** (version 6.x or higher) or **yarn**

You can verify your installations by running:
```bash
node --version
npm --version
```

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repository-url>
   cd vehicle-tracking
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   
   Or if you prefer using yarn:
   ```bash
   yarn install
   ```

## Running the Project

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm start
```

Or with yarn:
```bash
yarn start
```

The application will automatically open in your default browser at [http://localhost:3000](http://localhost:3000).

If it doesn't open automatically, you can manually navigate to the URL.

### Production Build

To create an optimized production build:

```bash
npm run build
```

Or with yarn:
```bash
yarn build
```

The build files will be created in the `build` folder. You can then serve them using any static file server.

### Testing

To run the test suite:

```bash
npm test
```

Or with yarn:
```bash
yarn test
```

## Project Structure

```
vehicle-tracking/
├── public/
│   ├── dummy-route.json      # Sample route data with coordinates
│   ├── index.html             # HTML template
│   ├── manifest.json          # PWA manifest
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Map.jsx            # Map component with Leaflet integration
│   │   ├── Map.css            # Map styling
│   │   ├── InfoPanel.jsx      # Vehicle info display panel
│   │   └── ui/                # Reusable UI components
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       └── slider.jsx
│   ├── lib/
│   │   └── utils.js           # Utility functions
│   ├── App.js                 # Main application component
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles with Tailwind
├── jsconfig.json              # JavaScript configuration
├── package.json               # Project dependencies
├── postcss.config.js          # PostCSS configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## Technologies Used

- **React** (v19.2.0) - UI framework
- **React Leaflet** (v5.0.0) - Interactive maps
- **Leaflet** (v1.9.4) - Core mapping library
- **Tailwind CSS** (v3.4.1) - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **class-variance-authority** - Component variant management

## How to Use

1. **Start the application** using `npm start`
2. **View the map** with the vehicle at the starting position
3. **Click "Play"** to start the vehicle movement simulation
4. **Adjust speed** using the speed slider (0.5x to 3x)
5. **Pause** the simulation at any time using the "Pause" button
6. **Reset** to return to the starting position with the "Reset" button
7. **Monitor** real-time statistics in the info panel:
   - Current position (latitude/longitude)
   - Current speed (km/h)
   - Timestamp
   - Progress indicator

## Customizing Route Data

To use your own route data, modify the `public/dummy-route.json` file. The format should be:

```json
[
  {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timestamp": "2024-01-01T10:00:00Z"
  },
  {
    "latitude": 40.7138,
    "longitude": -74.0050,
    "timestamp": "2024-01-01T10:01:00Z"
  }
]
```

Each point requires:
- `latitude`: Decimal latitude coordinate
- `longitude`: Decimal longitude coordinate
- `timestamp`: ISO 8601 formatted timestamp

## Troubleshooting

### Port 3000 is already in use
If port 3000 is already occupied, you can specify a different port:
```bash
# Windows PowerShell
$env:PORT=3001; npm start

# Windows CMD
set PORT=3001 && npm start
```

### Dependencies installation fails
Try clearing the npm cache and reinstalling:
```bash
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install
```

### Map not displaying
Ensure you have a stable internet connection as the map tiles are loaded from OpenStreetMap servers.

## Browser Support

This application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and intended for assessment purposes.

## Contributing

This is an assessment project. For any questions or issues, please contact the project maintainer.

---

**Created for Blockly Assessment - Vehicle Tracking System**
