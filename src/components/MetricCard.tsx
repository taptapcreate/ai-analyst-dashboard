import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export function MetricCard({ label, value, highlight = false }: MetricCardProps) {
  return (
    <div className="metric-card" style={highlight ? { borderColor: "var(--primary)", background: "rgba(255, 255, 255, 0.4)" } : {}}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}
