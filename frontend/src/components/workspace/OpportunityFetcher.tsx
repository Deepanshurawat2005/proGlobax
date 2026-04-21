import { useOpportunities } from '@/api/useOpportunities';
import { Loader2, Send } from 'lucide-react';
import { useState } from 'react';

interface OpportunityFetcherProps {
  orchestratorUrl?: string;
  onFetchStart?: () => void;
  onFetchComplete?: () => void;
}

/**
 * Component that provides UI for fetching opportunities from the orchestrator.
 * Used in chat interface to trigger agent-generated opportunities.
 */
export function OpportunityFetcher({
  orchestratorUrl = 'http://localhost:8000',
  onFetchStart,
  onFetchComplete,
}: OpportunityFetcherProps) {
  const [prompt, setPrompt] = useState('');
  const { fetchOpportunities, isLoading, error } = useOpportunities({ orchestratorUrl });

  const handleFetch = async () => {
    if (!prompt.trim()) return;

    onFetchStart?.();
    await fetchOpportunities(prompt);
    setPrompt('');
    onFetchComplete?.();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
          placeholder="Enter trade command (e.g., 'Find salt opportunities in Asia')..."
          className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          disabled={isLoading}
        />
        <button
          onClick={handleFetch}
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Fetch
            </>
          )}
        </button>
      </div>
      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded px-3 py-2">
          Error: {error}
        </div>
      )}
    </div>
  );
}
