import React, { useState, useEffect, useRef } from 'react';
import Map from './components/Map';
import InfoPanel from './components/InfoPanel';
import { Button } from './components/ui/button';
import { Slider } from './components/ui/slider';
import { MapPin, Play, Pause, RotateCcw, Gauge } from 'lucide-react';

function App() {
  const [routeData, setRouteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [routePath, setRoutePath] = useState([]);
  const [interpolatedPosition, setInterpolatedPosition] = useState(null);
  const animationRef = useRef(null);

  // Load route data from JSON
  useEffect(() => {
    fetch('/dummy-route.json')
      .then((response) => response.json())
      .then((data) => {
        setRouteData(data);
        // Initialize with first point
        if (data.length > 0) {
          setRoutePath([[data[0].latitude, data[0].longitude]]);
          setInterpolatedPosition([data[0].latitude, data[0].longitude]);
        }
      })
      .catch((error) => console.error('Error loading route data:', error));
  }, []);

  // Calculate speed between two points
  const calculateSpeed = (point1, point2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.latitude * Math.PI) / 180) *
        Math.cos((point2.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    
    const time1 = new Date(point1.timestamp);
    const time2 = new Date(point2.timestamp);
    const timeDiff = (time2 - time1) / 1000 / 3600; // Time in hours
    
    return timeDiff > 0 ? distance / timeDiff : 0;
  };

  // Movement simulation with smooth interpolation
  useEffect(() => {
    if (isPlaying && currentIndex < routeData.length - 1) {
      const startPoint = routeData[currentIndex];
      const endPoint = routeData[currentIndex + 1];
      const duration = 1000 / speed; // Duration for transition
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(elapsed / duration, 1); // Progress from 0 to 1

        // Linear interpolation between points
        const lat = startPoint.latitude + (endPoint.latitude - startPoint.latitude) * t;
        const lng = startPoint.longitude + (endPoint.longitude - startPoint.longitude) * t;
        
        setInterpolatedPosition([lat, lng]);

        if (t < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Move to next point
          setCurrentIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            if (newIndex >= routeData.length - 1) {
              setIsPlaying(false);
            }
            
            // Update route path
            const newPoint = routeData[newIndex];
            setRoutePath((prevPath) => [
              ...prevPath,
              [newPoint.latitude, newPoint.longitude],
            ]);
            
            return newIndex;
          });
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentIndex, routeData, speed]);

  const handlePlay = () => {
    if (currentIndex >= routeData.length - 1) {
      handleReset();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    if (routeData.length > 0) {
      setRoutePath([[routeData[0].latitude, routeData[0].longitude]]);
      setInterpolatedPosition([routeData[0].latitude, routeData[0].longitude]);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const currentPosition = interpolatedPosition;

  const currentSpeed =
    currentIndex > 0
      ? calculateSpeed(routeData[currentIndex - 1], routeData[currentIndex])
      : 0;

  // Calculate bearing/rotation for vehicle marker
  const calculateBearing = (point1, point2) => {
    if (!point1 || !point2) return 0;
    
    const lat1 = (point1.latitude * Math.PI) / 180;
    const lat2 = (point2.latitude * Math.PI) / 180;
    const dLon = ((point2.longitude - point1.longitude) * Math.PI) / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - 
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    
    const bearing = Math.atan2(y, x);
    return ((bearing * 180) / Math.PI + 360) % 360; // Convert to degrees and normalize
  };

  const vehicleRotation = 
    currentIndex < routeData.length - 1
      ? calculateBearing(routeData[currentIndex], routeData[currentIndex + 1])
      : currentIndex > 0
      ? calculateBearing(routeData[currentIndex - 1], routeData[currentIndex])
      : 0;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Header with Controls integrated */}
      <header className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
        <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-4">
          {/* Mobile Layout: Stacked vertically */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* Logo and Title - Compact for mobile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-800">Vehicle Tracker</h1>
                  <p className="text-xs text-slate-600 hidden sm:block">Real-time Simulation</p>
                </div>
              </div>
              {/* Progress Badge on mobile */}
              <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {currentIndex + 1}/{routeData.length}
              </div>
            </div>

            {/* Control Buttons Row */}
            <div className="flex gap-2 items-center justify-between">
              <div className="flex gap-1.5 flex-1">
                {!isPlaying ? (
                  <Button 
                    onClick={handlePlay} 
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md flex-1 text-xs h-9"
                  >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    Play
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePause} 
                    className="bg-orange-600 hover:bg-orange-700 text-white shadow-md flex-1 text-xs h-9"
                  >
                    <Pause className="w-3.5 h-3.5 mr-1" />
                    Pause
                  </Button>
                )}
                <Button 
                  onClick={handleReset} 
                  variant="destructive"
                  className="shadow-md flex-1 text-xs h-9"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Reset
                </Button>
              </div>

              {/* Speed Control - Compact */}
              <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-600 min-w-[28px]">{speed}x</span>
                <Slider
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={speed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="cursor-pointer w-16"
                />
              </div>
            </div>
          </div>

          {/* Desktop/Tablet Layout: Horizontal */}
          <div className="hidden md:flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Vehicle Tracking System</h1>
                <p className="text-xs lg:text-sm text-slate-600">Real-time Vehicle Movement Simulation</p>
              </div>
            </div>

            {/* Right: Playback Controls */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Control Buttons */}
              <div className="flex gap-2">
                {!isPlaying ? (
                  <Button 
                    onClick={handlePlay} 
                    className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePause} 
                    className="bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                    size="lg"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button 
                  onClick={handleReset} 
                  variant="destructive"
                  className="shadow-md"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Speed Control */}
              <div className="flex items-center gap-2 lg:gap-3 bg-slate-50 px-3 lg:px-4 py-2 rounded-lg border border-slate-200">
                <Gauge className="w-5 h-5 text-blue-600" />
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-700">Speed</label>
                  <span className="text-sm font-bold text-blue-600">{speed}x</span>
                </div>
                <Slider
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={speed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="cursor-pointer w-24 lg:w-32"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Map with Info Panel */}
      <div className="flex-1 overflow-hidden flex flex-col md:block">
        {/* Mobile: Map takes available space */}
        <div className="flex-1 md:h-full px-3 sm:px-6 py-2 sm:py-4 md:container md:mx-auto">
          <div className="relative h-full">
            {/* Map - Full width */}
            <div className="h-full w-full">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
                <Map 
                  currentPosition={currentPosition} 
                  routePath={routePath} 
                  rotation={vehicleRotation}
                />
              </div>
            </div>

            {/* Info Panel - Different positioning for mobile vs desktop */}
            {/* Desktop: Floating overlay on bottom right */}
            <div className="hidden md:block absolute bottom-4 right-4 w-72 lg:w-80">
              <InfoPanel
                currentIndex={currentIndex + 1}
                totalPoints={routeData.length}
                currentCoord={routeData[currentIndex]}
                timestamp={routeData[currentIndex]?.timestamp}
                speed={currentSpeed}
              />
            </div>
          </div>
        </div>

        {/* Mobile: Info Panel at bottom - scrollable if needed */}
        <div className="md:hidden bg-white border-t border-slate-200 shadow-lg overflow-y-auto max-h-[35vh]">
          <InfoPanel
            currentIndex={currentIndex + 1}
            totalPoints={routeData.length}
            currentCoord={routeData[currentIndex]}
            timestamp={routeData[currentIndex]?.timestamp}
            speed={currentSpeed}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
}

export default App;