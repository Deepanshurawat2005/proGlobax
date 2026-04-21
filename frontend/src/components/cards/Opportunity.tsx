import React, { useState } from 'react';

// 1. Define the interface for the opportunity data object
export interface Opportunity {
  id?: string;
  summary: string;
  companyName: string;
  location: string;
  purchasePrice: number | string;
  profitPercentage: number | string;
  productName: string;
  specialRequirement?: string; // The '?' makes this property optional
  riskLevel?: 'high' | 'medium' | 'low'; // Risk assessment level
}

// 2. Define the interface for the component props
interface OpportunityCardProps {
  opportunity?: Opportunity; // Optional to handle the null/loading state gracefully
  onStartTrade?: () => void;
}

// Theme colors
const COLORS = {
  primary: '#1a2a3a',
  primaryDark: '#0f1a2a',
  success: '#27ae60',
  successLight: '#e8f5e9',
  background: '#ffffff',
  border: '#f0f0f0',
  text: '#333',
  textLight: '#666',
  textMuted: '#999',
  skeleton: '#e0e0e0',
  skeletonAnimated: '#f0f0f0',
} as const;

/**
 * Loading skeleton for the card
 */
const CardSkeleton = () => (
  <div style={{
    backgroundColor: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    padding: '2rem',
    margin: '1.5rem',
    maxWidth: '400px',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  }}>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
    <div style={{
      height: '24px',
      backgroundColor: COLORS.skeleton,
      borderRadius: '4px',
      marginBottom: '2rem'
    }} />
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '2rem'
    }}>
      {[...Array(2)].map((_, i) => (
        <div key={i}>
          <div style={{
            height: '12px',
            backgroundColor: COLORS.skeleton,
            borderRadius: '4px',
            marginBottom: '0.5rem',
            width: '80%'
          }} />
          <div style={{
            height: '16px',
            backgroundColor: COLORS.skeleton,
            borderRadius: '4px'
          }} />
        </div>
      ))}
    </div>
  </div>
);

/**
 * OpportunityCard Component
 * Displays structured information about a business opportunity with enhanced UX.
 */
const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onStartTrade
}) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Gracefully handle missing data
  if (!opportunity) {
    return <CardSkeleton />;
  }

  // Destructuring for easier access
  const {
    id = '',
    summary,
    companyName,
    location,
    purchasePrice,
    profitPercentage,
    productName,
    specialRequirement,
    riskLevel = 'medium'
  } = opportunity;

  const handleCopyPrice = async () => {
    try {
      const price = typeof purchasePrice === 'number'
        ? purchasePrice.toLocaleString()
        : purchasePrice;
      await navigator.clipboard.writeText(price);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStartTrade = () => {
    if (onStartTrade) {
      onStartTrade();
    }
  };

  const formattedPrice = typeof purchasePrice === 'number'
    ? purchasePrice.toLocaleString()
    : purchasePrice;

  // Risk level styling
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return { bg: '#ffebee', text: '#c62828', label: 'High Risk' };
      case 'low':
        return { bg: '#e8f5e9', text: '#2e7d32', label: 'Low Risk' };
      case 'medium':
      default:
        return { bg: '#fff3e0', text: '#e65100', label: 'Medium Risk' };
    }
  };

  const riskConfig = getRiskColor(riskLevel);

  return (
    <div style={{
      backgroundColor: COLORS.background,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '8px',
      padding: '2rem',
      margin: '1.5rem',
      maxWidth: '400px',
      fontFamily: '"Segoe UI", "-apple-system", sans-serif',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      cursor: 'default',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }}
    role="article"
    aria-label={`Opportunity: ${summary}`}
    >
      {/* Header with risk level */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: 0,
          fontSize: '1.3rem',
          fontWeight: '600',
          color: COLORS.primary,
          lineHeight: '1.4',
          flex: 1,
          wordBreak: 'break-word'
        }}>
          {summary}
        </h2>
        <div
          style={{
            backgroundColor: riskConfig.bg,
            color: riskConfig.text,
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          role="status"
          aria-label={`Risk level: ${riskConfig.label}`}
        >
          {riskConfig.label}
        </div>
      </div>

      {/* Company and Location section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem',
        paddingBottom: '2rem',
        borderBottom: `1px solid ${COLORS.border}`
      }}>
        <div>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Company
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.95rem',
              color: COLORS.text,
              fontWeight: '500',
              wordBreak: 'break-word'
            }}
            title={companyName}
          >
            {companyName}
          </p>
        </div>
        <div>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Location
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.95rem',
              color: COLORS.text,
              fontWeight: '500',
              wordBreak: 'break-word'
            }}
            title={location}
          >
            {location}
          </p>
        </div>
      </div>

      {/* Offer Price and Profit Margin section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem',
        paddingBottom: '2rem',
        borderBottom: `1px solid ${COLORS.border}`
      }}>
        <div
          onClick={handleCopyPrice}
          role="button"
          tabIndex={0}
          aria-label="Click to copy price"
          style={{
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            borderRadius: '4px',
            padding: '0.5rem'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLDivElement).style.backgroundColor = COLORS.border;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCopyPrice();
            }
          }}
        >
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Offer Price {showCopyFeedback && '✓'}
          </p>
          <p style={{
            margin: 0,
            fontSize: '1.4rem',
            fontWeight: '600',
            color: COLORS.primary,
            transition: 'color 0.2s ease'
          }}>
            ${formattedPrice}
          </p>
        </div>
        <div style={{
          borderRadius: '4px',
          padding: '0.5rem',
          backgroundColor: COLORS.successLight,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <p style={{
            margin: '0 0 0.5rem 0',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Profit Margin
          </p>
          <p style={{
            margin: 0,
            fontSize: '1.4rem',
            fontWeight: '600',
            color: COLORS.success
          }}>
            +{profitPercentage}%
          </p>
        </div>
      </div>

      {/* Product/Niche section */}
      <div style={{
        marginBottom: '2rem',
        paddingBottom: '2rem',
        borderBottom: `1px solid ${COLORS.border}`
      }}>
        <p style={{
          margin: '0 0 0.5rem 0',
          fontSize: '0.9rem',
          color: COLORS.text
        }}>
          <strong>Product/Niche:</strong>{' '}
          <span style={{ fontWeight: 'normal', color: COLORS.textLight }}>
            {productName}
          </span>
        </p>
      </div>

      {/* Special requirements section */}
      {specialRequirement && (
        <div
          onClick={() => setExpandedSection(expandedSection === 'special' ? null : 'special')}
          role="button"
          tabIndex={0}
          aria-expanded={expandedSection === 'special'}
          style={{
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '2rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderLeft: `3px solid ${COLORS.textMuted}`
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f0f0f0';
            (e.currentTarget as HTMLDivElement).style.borderLeftColor = COLORS.primary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = '#f9f9f9';
            (e.currentTarget as HTMLDivElement).style.borderLeftColor = COLORS.textMuted;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setExpandedSection(expandedSection === 'special' ? null : 'special');
            }
          }}
        >
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: COLORS.text,
            lineHeight: '1.5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>
              <strong>⚠️ Special Requirement:</strong> {specialRequirement}
            </span>
            <span style={{ fontSize: '0.7rem', marginLeft: '0.5rem' }}>
              {expandedSection === 'special' ? '▼' : '▶'}
            </span>
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
      }}>
        <button
          onClick={handleStartTrade}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: COLORS.primary,
            color: COLORS.background,
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(26, 42, 58, 0.2)'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLORS.primaryDark;
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(26, 42, 58, 0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLORS.primary;
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(26, 42, 58, 0.2)';
          }}
          aria-label="Start trading this opportunity"
        >
          🚀 Start Trade
        </button>
        <button
          onClick={() => {
            navigator.share?.({ title: summary }).catch(() => {
              alert('Share: ' + summary);
            });
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: COLORS.primary,
            border: `2px solid ${COLORS.primary}`,
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = COLORS.primary;
            (e.currentTarget as HTMLButtonElement).style.color = COLORS.background;
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = COLORS.primary;
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
          aria-label="Share this opportunity"
        >
          📤 Share
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
export type { OpportunityCardProps };
