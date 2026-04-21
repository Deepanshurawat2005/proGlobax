import { useEffect } from 'react';
import { useMapData } from '@/api/useMapData';
import { useAppStore } from '@/store/useAppStore';

/**
 * Hook that automatically adds the opportunities tab when opportunities are added to the map
 */
export function useOpportunitiesTabIntegration() {
  const { opportunities } = useMapData();
  const { addTab, tabs } = useAppStore();

  useEffect(() => {
    // Check if we have opportunities and the opportunities tab doesn't exist
    if (opportunities.length > 0) {
      const opportunitiesTabExists = tabs.some(t => t.id === 'opportunities');

      if (!opportunitiesTabExists) {
        addTab({
          id: 'opportunities',
          title: `Opportunities (${opportunities.length})`,
          contentType: 'opportunities',
        });
      } else {
        // Update tab title with current count
        // Note: This would require updating the store, for now just update when refreshed
      }
    }
  }, [opportunities.length, tabs, addTab]);
}
