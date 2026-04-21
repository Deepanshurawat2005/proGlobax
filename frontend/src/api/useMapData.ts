import { create } from 'zustand';

// Defines the JSON structure we expect from the Orchestrator / Backend
export interface TradeRoute {
  source: [number, number];
  target: [number, number];
  value: number;
  name: string;
  compliance_status?: 'fully_compliant' | 'easy' | 'moderate' | 'risky' | 'strict';
  message?: string;
}

export interface MapCluster {
  position: [number, number];
  weight: number;
}

export interface MapOpportunity {
  id: string;
  type: 'demand' | 'trending' | 'risk' | 'hub' | 'supply';
  longitude: number;
  latitude: number;
  title: string;
  subtitle?: string;
  country?: string;
  note?: string;
  isComplianceData?: boolean;
}

export interface MapDataStatus {
  routes: TradeRoute[];
  clusters: MapCluster[];
  opportunities: MapOpportunity[]; // Renamed from annotations based on leader API spec
  isLoading: boolean;
}

interface MapStore extends MapDataStatus {
  updateMapData: (payload: Partial<MapDataStatus> & { reset?: boolean }) => void;
  resetMap: () => void;
}

// Start with empty data - will be populated by agents
const INITIAL_MAP_STATE = {
  routes: [],
  clusters: [],
  opportunities: []
};

// We use Zustand here so ANY component can instantly inject or merge data to the globe
export const useMapData = create<MapStore>((set) => ({
  routes: INITIAL_MAP_STATE.routes,
  clusters: INITIAL_MAP_STATE.clusters,
  opportunities: INITIAL_MAP_STATE.opportunities,
  isLoading: false,

  updateMapData: (payload) => set((state) => {
    // If the reset flag is passed from the Orchestrator, completely wipe the geometries
    const baseState = payload.reset ? { routes: [], clusters: [], opportunities: [] } : state;

    return {
      ...(payload.routes !== undefined && { routes: payload.reset ? payload.routes : [...baseState.routes, ...payload.routes] }),
      ...(payload.clusters !== undefined && { clusters: payload.reset ? payload.clusters : [...baseState.clusters, ...payload.clusters] }),
      ...(payload.opportunities !== undefined && { opportunities: payload.reset ? payload.opportunities : [...baseState.opportunities, ...payload.opportunities] }),
      ...(payload.isLoading !== undefined && { isLoading: payload.isLoading })
    };
  }),

  // Rapidly wipe the map clean (Useful prior to agent responding)
  resetMap: () => set({ routes: [], clusters: [], opportunities: [] })
}));
