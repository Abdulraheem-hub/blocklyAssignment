import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Info, MapPin, Clock, Gauge, Navigation } from 'lucide-react';

function InfoPanel({ currentIndex, totalPoints, currentCoord, timestamp, speed, isMobile = false }) {
  const InfoItem = ({ icon: Icon, label, value, iconColor = "text-blue-600" }) => (
    <div className={`flex items-start gap-2 ${isMobile ? 'p-2' : 'p-2.5'} bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors`}>
      <div className={`flex-shrink-0 ${iconColor}`}>
        <Icon className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} mt-0.5`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-slate-600 mb-0.5`}>{label}</p>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold text-slate-900 truncate`}>{value}</p>
      </div>
    </div>
  );

  return (
    <Card className={`${isMobile ? 'shadow-none rounded-none border-0' : 'shadow-xl border-slate-200 bg-white/95 backdrop-blur-sm'}`}>
      <CardHeader className={`${isMobile ? 'pb-2 pt-3 px-3' : 'pb-3'}`}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
          <Info className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-blue-600`} />
          Vehicle Information
        </CardTitle>
        <CardDescription className={`${isMobile ? 'text-[10px]' : 'text-xs'}`}>Current position and status</CardDescription>
      </CardHeader>
      <CardContent className={`space-y-${isMobile ? '1.5' : '2'} ${isMobile ? 'px-3 pb-3' : ''}`}>
        {/* Progress Badge - Hide on mobile as it's in header */}
        {!isMobile && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-medium text-slate-700">Journey Progress</span>
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1">
              {currentIndex} / {totalPoints}
            </Badge>
          </div>
        )}

        {/* Info Items */}
        {isMobile ? (
          // Mobile: Grid layout for compact display
          <div className="grid grid-cols-2 gap-1.5">
            <InfoItem
              icon={MapPin}
              label="Latitude"
              value={currentCoord?.latitude.toFixed(5) || 'N/A'}
              iconColor="text-green-600"
            />
            
            <InfoItem
              icon={Navigation}
              label="Longitude"
              value={currentCoord?.longitude.toFixed(5) || 'N/A'}
              iconColor="text-purple-600"
            />
            
            <InfoItem
              icon={Clock}
              label="Timestamp"
              value={timestamp ? new Date(timestamp).toLocaleTimeString() : 'N/A'}
              iconColor="text-orange-600"
            />
            
            <InfoItem
              icon={Gauge}
              label="Speed"
              value={speed ? `${speed.toFixed(1)} km/h` : 'N/A'}
              iconColor="text-red-600"
            />
          </div>
        ) : (
          // Desktop: Vertical stacked layout
          <div className="space-y-2">
            <InfoItem
              icon={MapPin}
              label="Latitude"
              value={currentCoord?.latitude.toFixed(6) || 'N/A'}
              iconColor="text-green-600"
            />
            
            <InfoItem
              icon={Navigation}
              label="Longitude"
              value={currentCoord?.longitude.toFixed(6) || 'N/A'}
              iconColor="text-purple-600"
            />
            
            <InfoItem
              icon={Clock}
              label="Timestamp"
              value={timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}
              iconColor="text-orange-600"
            />
            
            <InfoItem
              icon={Gauge}
              label="Current Speed"
              value={speed ? `${speed.toFixed(2)} km/h` : 'N/A'}
              iconColor="text-red-600"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default InfoPanel;