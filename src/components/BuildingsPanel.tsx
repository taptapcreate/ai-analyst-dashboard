"use client";

import { GlassCard } from "@/components/GlassCard";

export function BuildingsPanel() {
  const plannedFeatures = [
    "Structural Analysis",
    "Energy Efficiency",
    "Interior Design AI",
    "Cost Estimation",
    "Floor Plan Review",
    "Material Suggestions",
  ];

  return (
    <div className="animate-fade-in">
      {/* Stat strip — placeholder stats */}
      <div className="stat-strip">
        <div className="stat-mini">
          <div className="stat-mini-icon">🏗️</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">Status</span>
            <span className="stat-mini-value" style={{ fontSize: '0.9rem' }}>In Development</span>
          </div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-icon">📐</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">Features</span>
            <span className="stat-mini-value">{plannedFeatures.length}</span>
          </div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-icon">🤖</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">AI Models</span>
            <span className="stat-mini-value">Coming</span>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="coming-soon-wrapper">
          <div className="coming-soon-icon">🏛️</div>
          <h2 className="coming-soon-title">Buildings Module — Coming Soon</h2>
          <p className="coming-soon-desc">
            We&apos;re building an AI-powered structural and design analysis engine. 
            Upload building photos, floor plans, or blueprints and get instant insights.
          </p>
          <div className="coming-soon-chips">
            {plannedFeatures.map((feature) => (
              <span key={feature} className="coming-soon-chip">{feature}</span>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
