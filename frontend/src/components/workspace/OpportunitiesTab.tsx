import type { MapOpportunity } from '@/api/useMapData';
import { useMapData } from '@/api/useMapData';
import { useAppStore } from '@/store/useAppStore';
import { TrendingUp, MapPin, AlertCircle, Factory, Loader2, ExternalLink } from 'lucide-react';

const TYPE_CONFIG = {
  demand: { icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  supply: { icon: Factory, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  trending: { icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  risk: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  hub: { icon: MapPin, color: 'text-green-400', bg: 'bg-green-400/10' },
};

interface OpportunitiesTabProps {
  searchQuery?: string;
  filterType?: string;
}

export function OpportunitiesTab({ searchQuery = '', filterType = '' }: OpportunitiesTabProps) {
  const { addTab } = useAppStore();
  const { opportunities, isLoading } = useMapData();

  const filteredOpportunities = opportunities.filter((opp) => {
    // Hide compliance data from card section (show only on map)
    if (opp.isComplianceData) return false;

    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.note?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !filterType || opp.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleViewDetails = (opportunity: MapOpportunity) => {
    addTab({
      id: `opportunity-details-${opportunity.id}`,
      title: opportunity.title,
      contentType: 'opportunity_details',
      isClosable: true,
      data: {
        opportunity: opportunity,
        note: opportunity.note,
        type: opportunity.type,
        country: opportunity.country,
        title: opportunity.title
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-primary/10 rounded-lg">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Market Opportunities</h2>
            <p className="text-muted-foreground text-sm">
              {filteredOpportunities.length} opportunity(ies) found
            </p>
          </div>
        </div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-card border rounded-xl">
            <MapPin className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No opportunities found</h3>
            <p className="text-muted-foreground text-sm max-w-xs text-center">
              {searchQuery || filterType
                ? 'Try adjusting your search or filter criteria'
                : 'Run the agent from the chat to discover market opportunities'}
            </p>
          </div>
        ) : (
          /* Grid of Opportunity Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: MapOpportunity;
  onViewDetails: (opportunity: MapOpportunity) => void;
}

function OpportunityCard({ opportunity, onViewDetails }: OpportunityCardProps) {
  const config = TYPE_CONFIG[opportunity.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.demand;
  const Icon = config.icon;

  return (
    <div className="group bg-card border border-border/50 rounded-xl p-6 hover:border-border transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden relative">
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 space-y-4">
        {/* Type Badge */}
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wide ${config.color}`}>
            {opportunity.type}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {opportunity.title}
          </h3>
        </div>

        {/* Location */}
        {opportunity.country && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
            <span className="font-medium">{opportunity.country}</span>
          </div>
        )}

        {/* Coordinates */}
        <div className="text-xs text-muted-foreground/70 font-mono bg-muted/50 rounded px-2 py-1.5">
          {opportunity.latitude.toFixed(4)}, {opportunity.longitude.toFixed(4)}
        </div>

        {/* Note / Description */}
        {opportunity.note && (
          <div className="pt-2 border-t border-border/30">
            <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
              {opportunity.note}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(opportunity)}
          className="w-full mt-4 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium rounded-lg transition-colors duration-200 border border-primary/30 flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
}
