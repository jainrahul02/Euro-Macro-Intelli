import React from 'react';
import { Link, useLocation } from 'wouter';
import { SidebarInsight } from './SidebarInsight';
import { Bell, User } from 'lucide-react';

const TABS = [
  { name: 'Dashboard', path: '/' },
  { name: 'News', path: '/news' },
  { name: 'Risk Radar', path: '/risk' },
  { name: 'Forecast', path: '/forecast' },
  { name: 'Simulator', path: '/simulator' }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background text-foreground overflow-hidden">
      
      {/* Top Navigation */}
      <header className="h-14 border-b border-border bg-card/80 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-8 h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center overflow-hidden">
              <div className="w-8 h-[2px] bg-background transform -rotate-45" />
            </div>
            <span className="font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              EuroSight AI
            </span>
          </Link>

          {/* Navigation Tabs */}
          <nav className="flex items-center h-full gap-1 hidden md:flex">
            {TABS.map(tab => {
              const isActive = location === tab.path || (tab.path !== '/' && location.startsWith(tab.path));
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`h-full flex items-center px-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/20">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card" />
          </button>
          
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          {children}
        </main>

        {/* Right Panel */}
        <SidebarInsight />
      </div>

    </div>
  );
}
