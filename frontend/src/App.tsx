import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { TabContainer } from '@/components/workspace/TabContainer';
import { AgentChat } from '@/components/chat/AgentChat';

export type Theme = 'light' | 'dark';

function App() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Apply theme to DOM
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Persist to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden text-foreground antialiased selection:bg-primary/30">
      {/* Top Application Bar */}
      <TopNav onThemeToggle={toggleTheme} currentTheme={theme} />
      
      {/* Main 3-Column Workspace Grid */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        <Sidebar />
        <TabContainer appliedTheme={theme} />
        <AgentChat />
      </div>
    </div>
  );
}

export default App;
