import { create } from 'zustand';

export type TabContentType = 'map' | 'market_opportunity' | 'negotiation' | 'opportunities' | 'settings' | 'add_item' | 'compliance_details' | 'opportunity_details';

export interface Tab {
  id: string;
  title: string;
  contentType: TabContentType | string;
  isClosable: boolean;
  data?: any; // Optional data to pass to tab content
}

interface AppState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Omit<Tab, 'isClosable'> & { isClosable?: boolean }) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  tabs: [
    {
      id: 'default-map',
      title: 'Global Center',
      contentType: 'map',
      isClosable: false,
    },
  ],
  activeTabId: 'default-map',

  addTab: (newTab) => {
    const state = get();
    // Prevent adding existing tabs by ID
    const existingTab = state.tabs.find((t) => t.id === newTab.id);
    
    if (existingTab) {
      set({ activeTabId: existingTab.id });
      return;
    }

    set({
      tabs: [...state.tabs, { ...newTab, isClosable: newTab.isClosable ?? true }],
      activeTabId: newTab.id,
    });
  },

  removeTab: (id) => {
    const state = get();
    // cannot close non-closable tabs
    const tabToClose = state.tabs.find((t) => t.id === id);
    if (tabToClose && !tabToClose.isClosable) return;

    const newTabs = state.tabs.filter((t) => t.id !== id);
    
    // Determine new active tab if we're closing the currently active one
    let newActiveId = state.activeTabId;
    if (state.activeTabId === id) {
      const closingIndex = state.tabs.findIndex((t) => t.id === id);
      if (newTabs.length > 0) {
        const fallbackIndex = closingIndex > 0 ? closingIndex - 1 : 0;
        newActiveId = newTabs[fallbackIndex].id;
      } else {
        newActiveId = null;
      }
    }

    set({
      tabs: newTabs,
      activeTabId: newActiveId,
    });
  },

  setActiveTab: (id) => {
    set({ activeTabId: id });
  },
}));
