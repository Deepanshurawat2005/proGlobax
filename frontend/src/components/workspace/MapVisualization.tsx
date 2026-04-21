import { useState, useRef, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
// @ts-ignore
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { TrendingUp, Pickaxe, MapPin, Loader2, AlertCircle, Factory, X, ExternalLink } from 'lucide-react';
import { useMapData } from '@/api/useMapData';
import { useAppStore } from '@/store/useAppStore';

interface MapVisualizationProps {
  theme: 'light' | 'dark';
}

// Common view state for the map
const INITIAL_VIEW_STATE = {
  longitude: 10,
  latitude: 50,
  zoom: 2.5,
  pitch: 45,
  bearing: 0
};

const TYPE_COLORS = {
  demand: { icon: TrendingUp, bgColor: 'bg-orange-400', textColor: 'text-orange-400' },
  supply: { icon: Factory, bgColor: 'bg-blue-400', textColor: 'text-blue-400' },
  trending: { icon: Pickaxe, bgColor: 'bg-yellow-400', textColor: 'text-yellow-400' },
  risk: { icon: AlertCircle, bgColor: 'bg-red-400', textColor: 'text-red-400' },
  hub: { icon: MapPin, bgColor: 'bg-green-400', textColor: 'text-green-400' },
};

export function MapVisualization({ theme }: MapVisualizationProps) {
  const { addTab } = useAppStore();
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<{ index: number; compliance_status?: string; message?: string } | null>(null);
  const [hoveredRouteIndex, setHoveredRouteIndex] = useState<number | null>(null);
  const { routes, clusters, opportunities, isLoading } = useMapData();
  const mapRef = useRef<any>(null);

  // Switch map style based on theme
  const mapStyle = theme === 'light' 
    ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

  // Apply text color styling for country labels in light mode
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.getMap) return;
    
    const map = mapRef.current.getMap();
    if (!map.isStyleLoaded()) {
      map.on('load', () => applyTextStyling());
    } else {
      applyTextStyling();
    }

    function applyTextStyling() {
      if (theme === 'light') {
        // Apply black color to all text labels in light mode
        const layers = map.getStyle().layers;
        layers?.forEach((layer: any) => {
          if (layer.type === 'symbol' && layer.layout?.['text-field']) {
            map.setPaintProperty(layer.id, 'text-color', '#000000');
            map.setPaintProperty(layer.id, 'text-halo-color', '#ffffff');
            map.setPaintProperty(layer.id, 'text-halo-width', 1);
          }
        });
      }
    }
  }, [theme]);

  const layers = [
    new ArcLayer({
      id: 'trade-routes',
      data: routes,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: (d: any, highlight: any) => {
        const isHovered = highlight && highlight.index === hoveredRouteIndex;
        const status = d.compliance_status;
        const baseAlpha = isHovered ? 255 : 200;
        
        if (status === 'fully_compliant') return [34, 197, 94, baseAlpha];
        if (status === 'easy') return [234, 179, 8, baseAlpha];
        if (status === 'moderate') return [249, 115, 22, baseAlpha];
        if (status === 'risky') return [239, 68, 68, baseAlpha];
        if (status === 'strict') return [127, 29, 29, baseAlpha]; // Dark red
        return [130, 106, 249, baseAlpha];
      },
      getTargetColor: (d: any, highlight: any) => {
        const isHovered = highlight && highlight.index === hoveredRouteIndex;
        const status = d.compliance_status;
        const baseAlpha = isHovered ? 255 : 200;
        
        if (status === 'fully_compliant') return [34, 197, 94, baseAlpha];
        if (status === 'easy') return [234, 179, 8, baseAlpha];
        if (status === 'moderate') return [249, 115, 22, baseAlpha];
        if (status === 'risky') return [239, 68, 68, baseAlpha];
        if (status === 'strict') return [127, 29, 29, baseAlpha]; // Dark red
        return [100, 200, 255, baseAlpha];
      },
      getWidth: (d: any) => {
        const isHovered = hoveredRouteIndex !== null && routes.indexOf(d) === hoveredRouteIndex;
        return isHovered ? Math.max(3, d.value / 20) : Math.max(1.5, d.value / 30);
      },
      getTilt: 15,
      pickable: true,
      onClick: (info: any) => {
        if (info.object) {
          setSelectedRoute({
            index: info.index,
            compliance_status: info.object.compliance_status,
            message: info.object.message || `Route: ${info.object.name}`
          });
        }
      },
      onHover: (info: any) => {
        if (info.object) {
          setHoveredRouteIndex(info.index);
        } else {
          setHoveredRouteIndex(null);
        }
      }
    }),
    // Only render HexagonLayer when there's cluster data
    clusters && clusters.length > 0 && new HexagonLayer({
      id: 'heatmap',
      data: clusters,
      pickable: true,
      extruded: true,
      radius: 100000,
      elevationScale: 5000,
      getPosition: d => d.position,
      getElevationValue: points => points.reduce((sum, p) => sum + p.weight, 0),
      getColorValue: points => points.reduce((sum, p) => sum + p.weight, 0),
      colorRange: [
        [15, 16, 21],
        [35, 30, 60],
        [65, 52, 140],
        [100, 80, 210],
        [130, 106, 249],
        [180, 160, 255]
      ],
      transitions: {
        elevationScale: 1000
      }
    })
  ].filter(Boolean);

  const selectedOppData = opportunities.find(o => o.id === selectedOpportunity);
  const selectedOppConfig = selectedOppData 
    ? TYPE_COLORS[selectedOppData.type as keyof typeof TYPE_COLORS] || TYPE_COLORS.demand
    : null;

  return (
    <div className="flex-1 relative w-full h-full bg-background overflow-hidden">
      
      {/* Container for DeckGL and Map */}
      <div className="absolute inset-0">
        <DeckGL
          layers={layers}
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState as any)}
        >
          <Map
            ref={mapRef}
            mapStyle={mapStyle}
            reuseMaps
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
          >
             {/* Map-locked Geopositioned UI Markers injected via JSON */}
             {opportunities.map((opportunity) => {
               const config = TYPE_COLORS[opportunity.type as keyof typeof TYPE_COLORS] || TYPE_COLORS.demand;
               const Icon = config.icon;
               
               return (
                 <Marker 
                   key={opportunity.id} 
                   longitude={opportunity.longitude} 
                   latitude={opportunity.latitude}
                   anchor="bottom"
                 >
                   <button
                     onClick={() => setSelectedOpportunity(opportunity.id)}
                     className="backdrop-blur-xl bg-card/95 border border-border/80 pl-2 pr-4 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-3 relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform z-50"
                   >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className={`w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0`}>
                         <Icon className={`w-3.5 h-3.5 ${config.textColor}`} />
                      </div>
                      <span className="text-sm font-semibold text-foreground/90 tracking-wide whitespace-nowrap">{opportunity.title}</span>
                   </button>
                 </Marker>
               );
             })}

             {/* Popup for selected opportunity */}
             {selectedOppData && selectedOppConfig && (
               <Popup
                 longitude={selectedOppData.longitude}
                 latitude={selectedOppData.latitude}
                 anchor="top"
                 onClose={() => setSelectedOpportunity(null)}
                 closeButton={false}
                 className="custom-popup"
               >
                 <div className="w-80 bg-card border border-border rounded-lg p-5 shadow-xl">
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-2">
                       <div className={`p-2 rounded-lg ${selectedOppConfig.bgColor}/20`}>
                         {(() => {
                           const Icon = selectedOppConfig.icon;
                           return <Icon className={`w-4 h-4 ${selectedOppConfig.textColor}`} />;
                         })()}
                       </div>
                       <span className={`text-xs font-semibold uppercase tracking-wide ${selectedOppConfig.textColor}`}>
                         {selectedOppData.type}
                       </span>
                     </div>
                     <button
                       onClick={() => setSelectedOpportunity(null)}
                       className="p-1 hover:bg-white/10 rounded transition-colors"
                     >
                       <X className="w-4 h-4 text-muted-foreground" />
                     </button>
                   </div>

                   <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
                     {selectedOppData.title}
                   </h3>

                   {selectedOppData.country && (
                     <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                       <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
                       <span className="font-medium">{selectedOppData.country}</span>
                     </div>
                   )}

                   {selectedOppData.note && (
                     <div className="mb-4 pt-3 border-t border-border">
                       <p className="text-sm text-muted-foreground line-clamp-5 leading-relaxed">
                         {selectedOppData.note}
                       </p>
                     </div>
                   )}

                   <div className="text-xs text-muted-foreground/70 font-mono bg-secondary/50 rounded px-2 py-1.5">
                     {selectedOppData.latitude.toFixed(4)}, {selectedOppData.longitude.toFixed(4)}
                   </div>
                 </div>
               </Popup>
             )}
          </Map>
        </DeckGL>
      </div>

      {/* Hover Tooltip for Compliance Status */}
      {hoveredRouteIndex !== null && routes[hoveredRouteIndex] && (
        <div className="absolute top-8 left-8 bg-secondary border border-border rounded-lg px-3 py-2 shadow-lg z-40 pointer-events-none animate-in fade-in">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              routes[hoveredRouteIndex].compliance_status === 'fully_compliant' ? 'bg-green-500' :
              routes[hoveredRouteIndex].compliance_status === 'easy' ? 'bg-yellow-500' :
              routes[hoveredRouteIndex].compliance_status === 'moderate' ? 'bg-orange-500' :
              routes[hoveredRouteIndex].compliance_status === 'risky' ? 'bg-red-500' :
              routes[hoveredRouteIndex].compliance_status === 'strict' ? 'bg-red-900' :
              'bg-gray-500'
            }`} />
            <span className="text-xs font-semibold text-foreground capitalize whitespace-nowrap">
              {routes[hoveredRouteIndex].compliance_status ? routes[hoveredRouteIndex].compliance_status!.replace('_', ' ') : 'Unknown'} Compliance
            </span>
          </div>
        </div>
      )}

      {/* Click Tooltip for Route Details */}
      {selectedRoute && (
        <div className="absolute bottom-8 left-8 bg-card border border-border rounded-lg p-4 shadow-xl max-w-xs z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Compliance Status</h3>
            <button
              onClick={() => setSelectedRoute(null)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{selectedRoute.message}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${
              selectedRoute.compliance_status === 'fully_compliant' ? 'bg-green-500' :
              selectedRoute.compliance_status === 'easy' ? 'bg-yellow-500' :
              selectedRoute.compliance_status === 'moderate' ? 'bg-orange-500' :
              selectedRoute.compliance_status === 'risky' ? 'bg-red-500' :
              selectedRoute.compliance_status === 'strict' ? 'bg-red-900' :
              'bg-gray-500'
            }`} />
            <span className="text-sm font-medium text-foreground capitalize">
              {selectedRoute.compliance_status ? selectedRoute.compliance_status.replace('_', ' ') : 'Unknown'}
            </span>
          </div>

          <button
            onClick={() => {
              addTab({
                id: `compliance-details-${Date.now()}`,
                title: 'Compliance Details',
                contentType: 'compliance_details',
                isClosable: true,
                data: {
                  message: selectedRoute.message,
                  compliance_status: selectedRoute.compliance_status
                }
              });
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Details
          </button>
        </div>
      )}

    </div>
  );
}
