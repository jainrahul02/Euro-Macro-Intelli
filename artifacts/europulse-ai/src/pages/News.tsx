import React, { useState } from 'react';
import { useGetNews, GetNewsParams, NewsItemSeverity } from '@workspace/api-client-react';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { Bot, ChevronRight, Activity, FilterX, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function News() {
  const [filters, setFilters] = useState<GetNewsParams>({});

  const { data: newsItems, isLoading } = useGetNews(filters);

  const resetFilters = () => setFilters({});

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Market Intel</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-curated breaking news and impact analysis</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 p-3 border border-border bg-card rounded-lg flex-wrap">
        <Select 
          value={filters.country || "all"} 
          onValueChange={v => setFilters(f => ({ ...f, country: v === "all" ? undefined : v }))}
        >
          <SelectTrigger className="w-[160px] h-9 bg-background/50">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="DE">Germany</SelectItem>
            <SelectItem value="FR">France</SelectItem>
            <SelectItem value="IT">France</SelectItem>
            <SelectItem value="ES">Italy</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.severity || "all"} 
          onValueChange={v => setFilters(f => ({ ...f, severity: v === "all" ? undefined : v as NewsItemSeverity }))}
        >
          <SelectTrigger className="w-[160px] h-9 bg-background/50">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.sector || "all"} 
          onValueChange={v => setFilters(f => ({ ...f, sector: v === "all" ? undefined : v }))}
        >
          <SelectTrigger className="w-[160px] h-9 bg-background/50">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            <SelectItem value="Energy">Energy</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Real Estate">Real Estate</SelectItem>
            <SelectItem value="Tech">Tech</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="h-9 px-3 text-muted-foreground hover:text-foreground"
          disabled={Object.keys(filters).length === 0}
        >
          <FilterX className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : newsItems?.length === 0 ? (
          <div className="text-center p-12 border border-border border-dashed rounded-lg bg-card/50">
            <p className="text-muted-foreground">No intel matches your filters.</p>
          </div>
        ) : (
          newsItems?.map(item => <NewsCard key={item.id} item={item} />)
        )}
      </div>

    </div>
  );
}

function NewsCard({ item }: { item: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border bg-card rounded-lg overflow-hidden transition-all hover:border-primary/30">
      <div className="p-5 flex flex-col gap-4">
        
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-sm border border-primary/20">
              <Bot className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold tracking-wider text-primary uppercase">AI Agent</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {item.timestamp}
            </span>
          </div>
          <SeverityBadge severity={item.severity} />
        </div>

        {/* Headline & Analysis */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground leading-tight tracking-tight">
            {item.headline}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">What happened:</span>
              <p className="text-sm text-foreground/80 leading-relaxed">{item.whatHappened}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Why it matters:</span>
              <p className="text-sm text-foreground/80 leading-relaxed">{item.whyItMatters}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Market impact:</span>
              <p className="text-sm text-foreground/80 leading-relaxed">{item.marketImpact}</p>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg" title={item.countryCode}>{item.countryFlag}</span>
              <span className="text-sm font-medium">{item.countryName}</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{item.marketIndex}</span>
              <span className={`text-sm font-bold ${item.marketChange > 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                {item.marketChange > 0 ? '+' : ''}{item.marketChange}%
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
          >
            {expanded ? 'Hide Impact' : 'View Impact'}
            <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Expanded Transmission Flow */}
      {expanded && item.transmissionFlow && item.transmissionFlow.length > 0 && (
        <div className="bg-muted/10 border-t border-border p-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Simulated Transmission Flow
          </h4>
          <div className="flex items-start gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {item.transmissionFlow.map((step: any, idx: number) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col gap-2 min-w-[200px] flex-1">
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className={`h-full ${
                      step.direction === 'up' ? 'bg-destructive' : 
                      step.direction === 'down' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} style={{ width: '100%' }} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground">{step.label}</span>
                    <p className="text-xs text-muted-foreground leading-snug">{step.detail}</p>
                  </div>
                </div>
                {idx < item.transmissionFlow.length - 1 && (
                  <div className="pt-4 px-2 shrink-0 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
