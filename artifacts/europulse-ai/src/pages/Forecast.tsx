import React from 'react';
import { useGetForecastPredictions } from '@workspace/api-client-react';
import { Loader2, Bot, Database, Network, LineChart as ChartIcon, FileText, ArrowRight } from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export default function Forecast() {
  const { data: predictions, isLoading } = useGetForecastPredictions();

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-full space-y-6">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Predictive Forecast</h1>
          <p className="text-sm text-muted-foreground mt-1">12-month forward-looking models with confidence intervals</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          {predictions?.map(prediction => (
            <div key={prediction.id} className="border border-border bg-card rounded-lg flex flex-col overflow-hidden">
              
              {/* Card Header */}
              <div className="p-4 border-b border-border bg-muted/10 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-foreground text-lg leading-tight">{prediction.metricLabel}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono uppercase tracking-widest">{prediction.metric}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-sm border border-primary/20">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold text-primary">{prediction.confidence}% CONFIDENCE</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold tracking-tight">{prediction.currentValue.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground font-medium">{prediction.unit}</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 w-full p-4 pb-0 bg-background/50 border-b border-border/50">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={prediction.chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
                      tickMargin={8}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={30}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => val.toFixed(1)}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '6px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                    />
                    
                    {/* The forecast boundary line */}
                    {prediction.chartData.find(d => d.forecast !== null && d.actual !== null) && (
                      <ReferenceLine 
                        x={prediction.chartData.find(d => d.forecast !== null && d.actual !== null)?.date} 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeDasharray="3 3" 
                      />
                    )}

                    <Area 
                      type="monotone" 
                      dataKey="forecastHigh" 
                      stroke="none" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.1} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="forecastLow" 
                      stroke="none" 
                      fill="hsl(var(--background))" 
                      fillOpacity={1} 
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      strokeDasharray="4 4" 
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Drivers */}
              <div className="p-4 flex-1 bg-card">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Key Predictive Drivers</h4>
                <ul className="space-y-2">
                  {prediction.keyDrivers.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                      <span className="leading-snug">{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* AI Agent Chain */}
      <div className="mt-8 border border-border bg-card rounded-lg p-4 shrink-0 overflow-x-auto custom-scrollbar">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <Network className="w-4 h-4" />
          Model Pipeline Architecture
        </h3>
        <div className="flex items-center gap-4 min-w-max pb-2">
          <AgentNode icon={<Database />} name="Data Agent" desc="Ingests ECB & Market Data" />
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <AgentNode icon={<ChartIcon />} name="Analysis Agent" desc="Identifies Correlations" />
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <AgentNode icon={<Bot />} name="Forecast Agent" desc="Runs Monte Carlo Sims" />
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <AgentNode icon={<FileText />} name="Explainer Agent" desc="Generates Insights" />
        </div>
      </div>
    </div>
  );
}

function AgentNode({ icon, name, desc }: { icon: React.ReactNode, name: string, desc: string }) {
  return (
    <div className="flex items-center gap-3 bg-muted/20 border border-border rounded-md p-3 min-w-[220px]">
      <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      <div>
        <div className="font-bold text-sm text-foreground">{name}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{desc}</div>
      </div>
    </div>
  );
}
