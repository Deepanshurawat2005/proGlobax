import { useEffect, useState } from 'react';
import { fetchOpportunitiesFromOrchestrator } from './fetchOpportunities';
import { useMapData } from './useMapData';

interface UseOpportunitiesProps {
  orchestratorUrl?: string;
  autoFetch?: boolean;
}

export function useOpportunities({
  orchestratorUrl = 'http://localhost:8000',
  autoFetch = false,
}: UseOpportunitiesProps = {}) {
  const { opportunities, routes, updateMapData, isLoading } = useMapData();
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async (prompt: string) => {
    try {
      setError(null);
      updateMapData({ isLoading: true });

      const response = await fetchOpportunitiesFromOrchestrator(
        prompt,
        orchestratorUrl
      );

      // Handle both opportunities and routes from orchestrator response
      updateMapData({
        opportunities: response.opportunities,
        routes: response.routes,
        isLoading: false,
        reset: true, // Replace old data with new data for each search
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      updateMapData({ isLoading: false });
    }
  };

  return {
    opportunities,
    routes,
    isLoading,
    error,
    fetchOpportunities,
  };
}
