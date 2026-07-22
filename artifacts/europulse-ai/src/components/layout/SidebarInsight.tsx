import React from 'react';
import { useLocation } from 'wouter';
import { 
  useGetSidebarInsight, 
  GetSidebarInsightPage 
} from '@workspace/api-client-react';
import { BrainCircuit, Bell, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SidebarInsight() {
  const [location] = useLocation();
  const [viewMode, setViewMode] = React.useState<'Simple' | 'Banker' | 'Trader'>('Simple');
  
  const getPageParam = (): GetSidebarInsightPage => {
    if (location === '/') return 'dashboard';
    if (location.startsWith('/news')) return 'news';
    if (location.startsWith('/risk')) return 'risk';
    if (location.startsWith('/forecast')) return 'forecast';
    if (location.startsWith('/simulator')) return 'simulator';
    return 'dashboard';
  };

  const { data: insight, isLoading } = useGetSidebarInsight({ page: getPageParam() });

  return (
    <aside className="w-80 border-l border-border bg-card/50 flex flex-col h-full overflow-y-auto hidden xl:flex shrink-0">
      <div className="p-4 flex flex-col gap-6">
        
        {/* Title */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground leading-tight">
              What This Means for Deutsche Bank
            </h2>
            <p className="text-xs text-muted-foreground mt-1">AI Insight Analysis</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex p-1 bg-background/50 rounded-lg border border-border/50">
          {(['Simple', 'Banker', 'Trader'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 text-xs py-1.5 px-2 rounded-md font-medium transition-colors ${
                viewMode === mode 
                  ? 'bg-card text-foreground shadow-sm border border-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : insight ? (
          <>
            {/* Top Insight Quote */}
            <div className="pl-4 border-l-2 border-primary/50 relative">
              <p className="text-sm text-foreground/90 leading-relaxed italic">
                "{insight.topInsight}"
              </p>
            </div>

            {/* Key Actions */}
            {insight.actions && insight.actions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  Key Actions
                </h3>
                <ul className="space-y-2">
                  {insight.actions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-border text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground/80 leading-tight">
                        {action}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alerts & Actions */}
            <div className="space-y-3 pt-2 border-t border-border/50">
              {insight.earlyWarning && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-amber-500 mb-1.5">
                    <Bell className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Early Warning</span>
                  </div>
                  <p className="text-sm text-amber-500/90 leading-snug">
                    {insight.earlyWarning}
                  </p>
                </div>
              )}

              {insight.recommendedAction && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-emerald-500 mb-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">Recommended Action</span>
                  </div>
                  <p className="text-sm text-emerald-500/90 leading-snug mb-3">
                    {insight.recommendedAction}
                  </p>
                  <Button variant="outline" size="sm" className="w-full text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-400">
                    View Action Plan
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No insight available for this context.
          </p>
        )}

      </div>
    </aside>
  );
}
