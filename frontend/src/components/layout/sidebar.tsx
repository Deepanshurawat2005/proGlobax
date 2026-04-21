import { 
  LayoutDashboard, 
  LineChart, 
  Settings, 
  Users,
  Briefcase,
  MapPin,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useOpportunitiesTabIntegration } from '@/hooks/useOpportunitiesTabIntegration';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  // { id: 'market', icon: LineChart, label: 'Market Opportunity', actionId: 'market_opportunity_overview' },
  // { id: 'opportunities', icon: MapPin, label: 'Opportunities', actionId: 'opportunities_tab' },
  { id: 'negotiation', icon: Briefcase, label: 'Negotiation', actionId: 'negotiation_hub' },
  // { id: 'partners', icon: Users, label: 'Partners' },
  { id: 'add_item', icon: Plus, label: 'Add Item' },
];

const BOTTOM_NAV_ITEMS = [
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { tabs, activeTabId, addTab } = useAppStore();
  
  useOpportunitiesTabIntegration();

  const handleNavClick = (item: typeof NAV_ITEMS[0]) => {
    if (item.id === 'add_item') {
      addTab({
        id: 'add_item_form',
        title: item.label,
        contentType: 'add_item',
        isClosable: true,
      });
    } else if (item.actionId) {
      addTab({
        id: item.actionId,
        title: item.label,
        contentType: item.id !== 'opportunities' ? item.id : 'opportunities',
        isClosable: item.id !== 'dashboard',
      });
    }
  };

  const handleBottomNavClick = (item: typeof BOTTOM_NAV_ITEMS[0]) => {
    if (item.id === 'settings') {
      addTab({
        id: 'settings',
        title: item.label,
        contentType: 'settings',
        isClosable: true,
      });
    }
  };

  const NavItem = ({ item, isBottom = false }: { item: typeof NAV_ITEMS[0] | typeof BOTTOM_NAV_ITEMS[0]; isBottom?: boolean }) => {
    const isActive = tabs.find(t => t.id === activeTabId)?.contentType === item.id || 
                     (item.id === 'dashboard' && tabs.find(t => t.id === activeTabId)?.contentType === 'map');

    const handleClick = () => {
      if (isBottom) {
        handleBottomNavClick(item as typeof BOTTOM_NAV_ITEMS[0]);
      } else {
        handleNavClick(item as typeof NAV_ITEMS[0]);
      }
    };

    return (
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center justify-center p-3 relative transition-colors group",
          isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
        )}
        title={item.label}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-primary rounded-r-md shadow-[0_0_10px_rgba(130,106,249,0.5)]"></div>
        )}
        <item.icon className="w-6 h-6 stroke-[1.5]" />
        
        <div className="absolute left-14 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border shadow-lg">
          {item.label}
        </div>
      </button>
    );
  };

  return (
    <div className="w-[64px] h-full bg-background border-r flex flex-col items-center py-4 shrink-0 transition-all select-none">
      <nav className="flex-1 w-full flex flex-col items-center gap-2 mt-2">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>

      <nav className="w-full flex flex-col items-center mb-2 gap-2">
        <div className="w-8 h-px bg-border/50 my-2"></div>
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavItem key={item.id} item={item} isBottom={true} />
        ))}
      </nav>
    </div>
  );
}
