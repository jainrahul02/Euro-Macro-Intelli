import React from 'react';
import { AlertSeverity } from '@workspace/api-client-react';

interface SeverityBadgeProps {
  severity: AlertSeverity | 'LOW' | 'MEDIUM' | 'HIGH';
  className?: string;
}

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const getSeverityColors = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'HIGH':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${getSeverityColors(severity)} ${className}`}>
      {severity}
    </span>
  );
}
