import type { MapOpportunity, TradeRoute } from './useMapData';

export interface StreamlitOpportunity {
  type: 'demand' | 'supply' | 'trending' | 'risk' | 'hub';
  longitude: number;
  latitude: number;
  title: string;
  country: string;
  note: string;
}

export interface ComplianceCheck {
  country: string;
  longitude: number;
  latitude: number;
  role: 'origin' | 'transit' | 'destination';
  note: string;
  compliance_status?: 'fully_compliant' | 'easy' | 'moderate' | 'risky';
}

export interface TradeRouteInfo {
  from: string;
  to: string;
  via?: string;
  distance_km?: number;
  typical_days?: number;
}

export interface AgentSignal {
  agent: string;
  action: string;
  payload: {
    message?: string;
    opportunities?: StreamlitOpportunity[];
    compliance_checks?: ComplianceCheck[];
    trade_route?: TradeRouteInfo[];
    timestamp: string;
  };
}

/**
 * Parses compliance checks and converts them to map opportunities
 */
function parseComplianceChecks(checks: ComplianceCheck[], message?: string): {
  opportunities: MapOpportunity[];
  routes: TradeRoute[];
} {
  const opportunities: MapOpportunity[] = [];
  const routes: TradeRoute[] = [];
  
  // Convert compliance checks to opportunities for map visualization
  checks.forEach((check, index) => {
    // Map role to opportunity type
    let oppType: 'demand' | 'supply' | 'trending' | 'risk' | 'hub' = 'hub';
    if (check.role === 'origin') oppType = 'supply';
    if (check.role === 'destination') oppType = 'demand';
    if (check.role === 'transit') oppType = 'hub';
    
    opportunities.push({
      id: `compliance-${check.country}-${check.role}`,
      type: oppType,
      longitude: check.longitude,
      latitude: check.latitude,
      title: `${check.country} (${check.role})`,
      country: check.country,
      note: check.note,
      subtitle: `Compliance: ${check.compliance_status || 'pending'}`,
      isComplianceData: true
    });
  });

  // Build routes between origin and destination using orchestrator's compliance status values
  const originCheck = checks.find(c => c.role === 'origin');
  const destinationCheck = checks.find(c => c.role === 'destination');
  
  if (originCheck && destinationCheck) {
    // Use compliance status from orchestrator - use origin's status for the route
    routes.push({
      source: [originCheck.longitude, originCheck.latitude],
      target: [destinationCheck.longitude, destinationCheck.latitude],
      value: 80,
      name: `${originCheck.country} → ${destinationCheck.country}`,
      compliance_status: originCheck.compliance_status as any,
      message: message // Include the payload message for route tooltip
    });
  }

  return { opportunities, routes };
}

/**
 * Parses the Streamlit agent response and converts it to MapOpportunity format
 */
export function parseStreamlitResponse(signals: AgentSignal[]): {
  opportunities: MapOpportunity[];
  routes: TradeRoute[];
} {
  const opportunities: MapOpportunity[] = [];
  const routes: TradeRoute[] = [];
  let id = 0;

  signals.forEach((signal) => {
    // Handle opportunity_finder action
    if (signal.action === 'add_opportunity' && signal.payload?.opportunities) {
      signal.payload.opportunities.forEach((opp: StreamlitOpportunity) => {
        opportunities.push({
          id: `${signal.agent}-${opp.type}-${id++}`,
          type: opp.type,
          longitude: opp.longitude,
          latitude: opp.latitude,
          title: opp.title,
          country: opp.country,
          note: opp.note,
          subtitle: opp.country,
        });
      });
    }
    
    // Handle compliance_validator action (NEW)
    if (signal.action === 'sync_compliance' && signal.payload?.compliance_checks) {
      const { opportunities: complianceOpps, routes: complianceRoutes } = 
        parseComplianceChecks(signal.payload.compliance_checks, signal.payload.message);
      
      opportunities.push(...complianceOpps);
      routes.push(...complianceRoutes);
    }
  });

  return { opportunities, routes };
}

/**
 * Fetches opportunities from the orchestrator API
 */
export async function fetchOpportunitiesFromOrchestrator(
  prompt: string,
  orchestratorUrl: string = 'http://localhost:8000'
): Promise<{ opportunities: MapOpportunity[]; routes: TradeRoute[] }> {
  try {
    console.log('📤 Sending prompt to orchestrator:', prompt);
    const response = await fetch(`${orchestratorUrl}/api/v1/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    console.log('📥 Orchestrator response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Orchestrator error:', errorText);
      throw new Error(`Failed to fetch opportunities: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Raw response data:', data);
    
    const signals: AgentSignal[] = data.signals || [];
    console.log('🔍 Parsed signals:', signals);
    
    const result = parseStreamlitResponse(signals);
    console.log('✅ Parsed result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error fetching opportunities:', error);
    return { opportunities: [], routes: [] };
  }
}
