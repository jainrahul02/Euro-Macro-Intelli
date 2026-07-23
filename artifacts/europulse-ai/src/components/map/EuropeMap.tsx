import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { HeatmapCountry } from '@workspace/api-client-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson";

interface EuropeMapProps {
  data?: HeatmapCountry[];
  renderTooltip?: (info: HeatmapCountry) => React.ReactNode;
}

export function EuropeMap({ data = [], renderTooltip }: EuropeMapProps) {
  const countryRiskMap = React.useMemo(() => {
    const map: Record<string, HeatmapCountry> = {};

    // Ensure `data` is an array before attempting .forEach()
    if (Array.isArray(data)) {
      data.forEach((c) => {
        if (c?.countryCode) {
          map[c.countryCode.toUpperCase()] = c;
        }
      });
    }

    return map;
  }, [data]);

  const getColor = (countryCode: string) => {
    const info = countryRiskMap[countryCode];
    if (!info) return '#374151'; // gray-700
    
    switch (info.riskLevel?.toUpperCase()) {
      case 'HIGH': return '#EF4444'; // red-500
      case 'MEDIUM': return '#F59E0B'; // amber-500
      case 'LOW': return '#10B981'; // emerald-500
      default: return '#374151';
    }
  };

  const defaultTooltip = (info: HeatmapCountry) => (
    <div className="flex flex-col gap-1">
      <p className="font-bold text-foreground text-sm">{info.countryName}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Risk Score:</span>
        <span className="font-mono font-medium">{info.riskScore}/100</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Level:</span>
        <span className={`text-[10px] font-bold uppercase px-1.5 rounded-sm bg-background border ${
          info.riskLevel?.toUpperCase() === 'HIGH' ? 'text-destructive border-destructive/20' :
          info.riskLevel?.toUpperCase() === 'MEDIUM' ? 'text-amber-500 border-amber-500/20' :
          'text-emerald-500 border-emerald-500/20'
        }`}>
          {info.riskLevel}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full min-h-[400px] bg-[#0d1221] rounded-lg border border-border flex items-center justify-center overflow-hidden relative group">
      <ComposableMap 
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-15, -52, 0],
          scale: 600
        }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[15, 50]} zoom={1.5} maxZoom={4} minZoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = geo.properties.ISO2;
                const info = countryRiskMap[countryCode];
                
                return (
                  <Tooltip key={geo.rsmKey} delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Geography
                        geography={geo}
                        fill={getColor(countryCode)}
                        stroke="#0A0E1A"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            fill: info ? "hsl(var(--primary))" : '#4B5563', 
                            outline: "none",
                            transition: "all 200ms" 
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    </TooltipTrigger>
                    {info && (
                      <TooltipContent side="top" className="bg-popover border-border z-50 shadow-xl" avoidCollisions>
                        {renderTooltip ? renderTooltip(info) : defaultTooltip(info)}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-card/80 backdrop-blur border border-border p-2 rounded-md">
        <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Risk Level</h4>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-foreground">High</span>
        </div>
      </div>
    </div>
  );
}
