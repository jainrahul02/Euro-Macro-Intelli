import React, { useState } from 'react';
import { 
  useGetRiskCountries, 
  useGetRiskHeatmap,
  GetRiskCountriesRiskType 
} from '@workspace/api-client-react';
import { EuropeMap } from '@/components/map/EuropeMap';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Loader2, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const TABS: { label: string; value: GetRiskCountriesRiskType }[] = [
  { label: 'Overall Risk Score', value: 'overall' },
  { label: 'Inflation Risk', value: 'inflation' },
  { label: 'FX Stress', value: 'fx' },
  { label: 'Energy Risk', value: 'energy' },
  { label: 'Housing Risk', value: 'housing' },
  { label: 'Geopolitical Risk', value: 'geopolitical' },
];

export default function RiskRadar() {
  const [activeTab, setActiveTab] = useState<GetRiskCountriesRiskType>('overall');

  const { data: countries, isLoading: loadingCountries } = useGetRiskCountries({ riskType: activeTab });
  const { data: heatmapData, isLoading: loadingHeatmap } = useGetRiskHeatmap({ riskType: activeTab });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 flex flex-col h-full">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">European Risk Radar</h1>
          <p className="text-sm text-muted-foreground mt-1">Cross-dimensional macro vulnerability assessment</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 shrink-0 custom-scrollbar border-b border-border">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.value 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Map */}
        <div className="border border-border bg-card rounded-lg h-full flex flex-col relative">
          {loadingHeatmap ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : null}
          <div className="flex-1 p-2">
            <EuropeMap 
              data={heatmapData} 
              renderTooltip={(info) => (
                <div className="w-64 p-2 flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-bold text-foreground">{info.countryName}</span>
                    <span className="font-mono text-sm text-primary font-bold">{info.riskScore}/100</span>
                  </div>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                        { subject: 'Inflation', A: info.inflationRisk, fullMark: 100 },
                        { subject: 'FX', A: info.fxStress, fullMark: 100 },
                        { subject: 'Energy', A: info.energyRisk, fullMark: 100 },
                        { subject: 'Housing', A: info.housingRisk, fullMark: 100 },
                        { subject: 'Geopolitics', A: info.geopoliticalRisk, fullMark: 100 },
                      ]}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <Radar name="Risk" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Ranking Table */}
        <div className="border border-border bg-card rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10 shrink-0">
            <h3 className="font-semibold">Country Risk Ranking</h3>
            <span className="text-xs text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-sm">
              {TABS.find(t => t.value === activeTab)?.label}
            </span>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            {loadingCountries && (
               <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                 <Loader2 className="w-8 h-8 animate-spin text-primary" />
               </div>
            )}
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-4 py-3 font-medium w-12 text-center">#</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {countries?.map((country) => (
                  <tr key={country.countryCode} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3 text-center text-muted-foreground font-mono">
                      {country.rank}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg" title={country.countryCode}>{country.countryFlag}</span>
                        <span>{country.countryName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-foreground font-medium w-6">{country.overallScore}</span>
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              country.riskLevel === 'High' ? 'bg-destructive' :
                              country.riskLevel === 'Medium' ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${country.overallScore}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center">
                        {country.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-destructive" />
                        ) : country.trend === 'down' ? (
                          <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Minus className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!countries?.length && !loadingCountries && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No data available for this risk type.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
