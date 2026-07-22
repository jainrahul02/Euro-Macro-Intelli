import React from 'react';
import { 
  useGetDashboardSummary,
  useGetDashboardAlerts,
  useGetDashboardHeatmap
} from '@workspace/api-client-react';
import { EuropeMap } from '@/components/map/EuropeMap';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { ArrowDownRight, ArrowUpRight, ChevronRight, Activity, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Fake data for sparklines to match "Bloomberg terminal" feel
const SPARKLINE_DATA = {
  inflation: Array.from({ length: 15 }, () => ({ val: 50 + Math.random() * 20 })),
  eurUsd: Array.from({ length: 15 }, () => ({ val: 1.05 + Math.random() * 0.1 })),
  bondYield: Array.from({ length: 15 }, () => ({ val: 2 + Math.random() * 1.5 })),
  risk: Array.from({ length: 15 }, () => ({ val: 60 + Math.random() * 30 }))
};

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetDashboardSummary();
  const { data: alerts, isLoading: loadingAlerts } = useGetDashboardAlerts();
  const { data: heatmapData, isLoading: loadingHeatmap } = useGetDashboardHeatmap();
  const alertItems = Array.isArray(alerts) ? alerts : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">European Macro Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time risk metrics and AI-generated alerts</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Inflation Index"
          value={summary?.inflationIndex}
          delta={summary?.inflationChange}
          suffix="%"
          loading={loadingSummary}
          sparklineData={SPARKLINE_DATA.inflation}
        />
        <KpiCard 
          title="EUR/USD"
          value={summary?.eurUsd}
          delta={summary?.eurUsdChange}
          loading={loadingSummary}
          sparklineData={SPARKLINE_DATA.eurUsd}
          invertDeltaColor // higher is not necessarily bad, but let's say higher = green
        />
        <KpiCard 
          title="Bond Yield 10Y"
          value={summary?.bondYield10y}
          delta={summary?.bondYieldChange}
          suffix="bps"
          loading={loadingSummary}
          sparklineData={SPARKLINE_DATA.bondYield}
        />
        <KpiCard 
          title="Overall Risk Score"
          value={summary?.overallRiskScore}
          delta={summary?.riskScoreChange}
          suffix="/100"
          loading={loadingSummary}
          sparklineData={SPARKLINE_DATA.risk}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alerts List */}
        <div className="lg:col-span-1 border border-border bg-card rounded-lg flex flex-col h-[500px]">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Top Alerts Today
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loadingAlerts ? (
              <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : alertItems.map(alert => (
              <div key={alert.id} className="p-3 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors cursor-pointer group flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base" title={alert.countryCode}>{alert.countryFlag}</span>
                    <SeverityBadge severity={alert.severity} />
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {alert.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {alert.headline}
                  </p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {alert.agentGenerated && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Activity className="w-3 h-3 text-primary" />
                    <span className="text-[10px] text-primary uppercase tracking-wide font-semibold">AI Agent Generated</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-2 border border-border bg-card rounded-lg flex flex-col h-[500px]">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Europe Risk Heatmap
            </h3>
            {summary?.lastUpdated && (
              <span className="text-xs text-muted-foreground">
                Last updated: {summary.lastUpdated} ↺
              </span>
            )}
          </div>
          <div className="flex-1 p-4 flex items-center justify-center">
            {loadingHeatmap ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : (
              <EuropeMap data={heatmapData} />
            )}
          </div>
          <div className="p-3 text-center border-t border-border bg-muted/5">
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Source: EuroPulse AI Models
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}

function KpiCard({ 
  title, 
  value, 
  delta, 
  suffix = '', 
  loading, 
  sparklineData,
  invertDeltaColor = false
}: { 
  title: string; 
  value?: number; 
  delta?: number; 
  suffix?: string; 
  loading?: boolean;
  sparklineData: { val: number }[];
  invertDeltaColor?: boolean;
}) {
  const isPositive = (delta || 0) > 0;
  const isNegative = (delta || 0) < 0;
  
  // For things like inflation/risk, going UP is BAD (red).
  // If inverted, going UP is GOOD (green).
  const upColor = invertDeltaColor ? 'text-emerald-500' : 'text-destructive';
  const downColor = invertDeltaColor ? 'text-destructive' : 'text-emerald-500';
  
  const deltaColor = isPositive ? upColor : isNegative ? downColor : 'text-muted-foreground';

  return (
    <div className="border border-border bg-card rounded-lg p-4 flex flex-col gap-3 relative overflow-hidden group">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      
      {loading ? (
        <div className="h-10 flex items-center"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {value?.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-muted-foreground mb-1">{suffix}</span>
          </div>
          
          <div className={`flex items-center gap-1 font-semibold text-sm ${deltaColor}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : isNegative ? <ArrowDownRight className="w-4 h-4" /> : null}
            {Math.abs(delta || 0).toFixed(2)}
          </div>
        </div>
      )}

      {/* Sparkline */}
      <div className="h-10 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke="currentColor" 
              className="text-primary/40"
              strokeWidth={2} 
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
