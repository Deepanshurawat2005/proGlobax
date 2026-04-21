import { Search, Mic, HelpCircle, Bell, Sun, Moon } from 'lucide-react';

interface TopNavProps {
  onThemeToggle: () => void;
  currentTheme: 'light' | 'dark';
}

export function TopNav({ onThemeToggle, currentTheme }: TopNavProps) {
  return (
    <div className="h-14 bg-background border-b border-border/50 flex items-center justify-between px-4 shrink-0 shadow-sm z-50">
      
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center relative shadow-[0_0_15px_rgba(130,106,249,0.3)]">
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin-slow"></div>
          <div className="absolute w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        </div>
        <span className="font-semibold text-lg tracking-tight flex items-center">
          pro<span className="font-semibold text-lg tracking-tight flex items-center">Globax</span>
        </span>
      </div>

      {/* Center Search Area */}
      <div className="flex-1 max-w-2xl mx-8 hidden md:flex items-center">
        <div className="relative w-full max-w-xl flex items-center group">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Dashboard..."
            className="w-full bg-card/50 hover:bg-card focus:bg-card border border-border/50 rounded-lg pl-9 pr-10 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all text-foreground placeholder-muted-foreground/60"
          />
          <button className="absolute right-3 text-muted-foreground hover:text-foreground">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border/50 hover:border-border"
          title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
        >
          {currentTheme === 'light' ? (
            <Moon className="w-4 h-4 text-foreground" />
          ) : (
            <Sun className="w-4 h-4 text-foreground" />
          )}
        </button>
      </div>
      
    </div>
  );
}
