import React, { useState, useEffect } from 'react';
import { useGetScenarios, useRunSimulation, Scenario, SimTransmissionStep, SimImpact } from '@workspace/api-client-react';
import { 
  Zap, 
  TrendingDown, 
  Activity, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Play
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export default function Simulator() {
  const { data: scenarios, isLoading: loadingScenarios } = useGetScenarios();
  const runSimulation = useRunSimulation();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(0);
  
  // Debounce intensity changes
  const [debouncedIntensity, setDebouncedIntensity] = useState<number>(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedIntensity(intensity);
    }, 300);
    return () => clearTimeout(timer);
  }, [intensity]);

  // Handle scenario selection
  useEffect(() => {
    if (scenarios && scenarios.length > 0 && !selectedScenarioId) {
      const first = scenarios[0];
      setSelectedScenarioId(first.id);
      setIntensity(first.defaultIntensity);
      setDebouncedIntensity(first.defaultIntensity);
    }
  }, [scenarios, selectedScenarioId]);

  // Run simulation when inputs change
  useEffect(() => {
    if (selectedScenarioId && debouncedIntensity !== undefined) {
      runSimulation.mutate({
        data: {
          scenarioId: selectedScenarioId,
          intensity: debouncedIntensity
        }
      });
    }
  }, [selectedScenarioId, debouncedIntensity]);

  const selectedScenario = scenarios?.find(s => s.id === selectedScenarioId);
  const result = runSimulation.data;
  const isSimulating = runSimulation.isPending;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 h-full">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Stress Simulator</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time portfolio impact modeling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
        
        {/* Left Column: Controls & Transmission */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Section 1: Choose a Shock */}
          <div className="border border-border bg-card rounded-lg p-5">
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              1. Choose a Shock Scenario
            </h2>
            
            {loadingScenarios ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {scenarios?.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => {
                      setSelectedScenarioId(scenario.id);
                      setIntensity(scenario.defaultIntensity);
                    }}
                    className={`flex flex-col gap-2 p-3 rounded-lg border text-left transition-all ${
                      selectedScenarioId === scenario.id 
                        ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'border-border bg-background hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{scenario.icon}</span>
                      <span className={`font-semibold text-sm ${selectedScenarioId === scenario.id ? 'text-primary' : 'text-foreground'}`}>
                        {scenario.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Max: {scenario.maxIntensity}{scenario.intensityUnit}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {selectedScenario && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">Adjust Shock Intensity</h3>
                  <div className="font-mono text-xl font-bold text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20">
                    {intensity} {selectedScenario.intensityUnit}
                  </div>
                </div>
                <Slider
                  min={selectedScenario.minIntensity}
                  max={selectedScenario.maxIntensity}
                  step={1}
                  value={[intensity]}
                  onValueChange={(vals) => setIntensity(vals[0])}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{selectedScenario.minIntensity}{selectedScenario.intensityUnit} (Mild)</span>
                  <span>{selectedScenario.maxIntensity}{selectedScenario.intensityUnit} (Severe)</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Transmission Flow */}
          <div className="border border-border bg-card rounded-lg flex flex-col flex-1 min-h-[300px] overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                2. Shock Transmission Flow
              </h2>
              {isSimulating && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
            </div>
            
            <div className="p-5 flex-1 relative overflow-x-auto custom-scrollbar bg-background/30">
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-border -translate-y-1/2 rounded-full hidden md:block z-0" />
              
              {result && !isSimulating ? (
                <div className="flex items-start md:items-center justify-between gap-4 md:gap-0 h-full relative z-10 flex-col md:flex-row min-w-max md:min-w-0">
                  {result.transmissionFlow.map((step, idx) => (
                    <div key={idx} className="flex flex-row md:flex-col items-center md:w-48 gap-4 bg-card md:bg-transparent p-3 md:p-0 rounded-lg border border-border md:border-none shadow-sm md:shadow-none w-full">
                      
                      <div className="w-10 h-10 rounded-full border-4 border-background bg-card flex items-center justify-center shadow-sm shrink-0 relative">
                        <div className={`absolute inset-0 rounded-full opacity-20 ${
                          step.severity === 'High' ? 'bg-destructive' :
                          step.severity === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <span className="font-bold text-sm z-10">{step.step}</span>
                      </div>
                      
                      <div className="flex flex-col md:items-center text-left md:text-center gap-1">
                        <span className={`text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm border ${
                          step.severity === 'High' ? 'text-destructive border-destructive/20 bg-destructive/5' :
                          step.severity === 'Medium' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 
                          'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                        }`}>
                          {step.severity}
                        </span>
                        <h4 className="font-semibold text-sm text-foreground mt-1">{step.label}</h4>
                        <p className="text-xs text-muted-foreground leading-snug">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
                  <Activity className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Adjust intensity to simulate transmission...</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-border bg-muted/10 text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                AI Agent simulated this transmission based on historical data and current market conditions.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: DB Impact */}
        <div className="border border-border bg-card rounded-lg flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/10 flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center shrink-0">
              <div className="w-8 h-[2px] bg-background transform -rotate-45" />
            </div>
            <h2 className="text-sm font-semibold">3. Simulated Impact on DB</h2>
          </div>

          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            {isSimulating ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Calculating exposures...</span>
              </div>
            ) : result ? (
              <>
                <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/50 pl-3">
                  "{result.aiSummary}"
                </p>
                
                <div className="space-y-3 mt-2">
                  {result.impacts.map((impact, idx) => (
                    <div key={idx} className="bg-background border border-border rounded-lg p-4 relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 w-2 h-full ${
                        impact.impactLevel === 'High' ? 'bg-destructive' :
                        impact.impactLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                        {impact.metric}
                      </h4>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-2xl font-bold tracking-tight ${
                          impact.direction === 'up' ? 'text-destructive' : 'text-emerald-500'
                        }`}>
                          {impact.direction === 'up' ? '+' : '-'}{impact.value}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">{impact.unit}</span>
                        {impact.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-destructive ml-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-emerald-500 ml-1" />
                        )}
                      </div>
                      
                      <p className="text-xs text-foreground/70 leading-snug">
                        {impact.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
}
