"use client";

import { useState, useCallback } from "react";
import { AnimalsPanel } from "@/components/AnimalsPanel";
import { HumansPanel } from "@/components/HumansPanel";
import { BuildingsPanel } from "@/components/BuildingsPanel";

type TabId = "animals" | "humans" | "buildings";

interface TabConfig {
  id: TabId;
  icon: string;
  label: string;
  description: string;
  headerTitle: string;
  headerIcon: string;
  badgeText: string;
  accentVar: string;
  glowVar: string;
}

const TABS: TabConfig[] = [
  {
    id: "animals",
    icon: "🐾",
    label: "Animals",
    description: "Pet & cattle health",
    headerTitle: "Animal Health Analyst",
    headerIcon: "🐾",
    badgeText: "AI Powered",
    accentVar: "var(--accent-animals)",
    glowVar: "var(--accent-animals-glow)",
  },
  {
    id: "humans",
    icon: "👤",
    label: "Humans",
    description: "Fitness & nutrition",
    headerTitle: "Human Health Analyst",
    headerIcon: "🥗",
    badgeText: "AI Powered",
    accentVar: "var(--accent-humans)",
    glowVar: "var(--accent-humans-glow)",
  },
  {
    id: "buildings",
    icon: "🏗️",
    label: "Buildings",
    description: "Structural analysis",
    headerTitle: "Building Analyst",
    headerIcon: "🏛️",
    badgeText: "Coming Soon",
    accentVar: "var(--accent-buildings)",
    glowVar: "var(--accent-buildings-glow)",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("animals");

  const currentTab = TABS.find((t) => t.id === activeTab)!;

  const handleTabChange = useCallback((tabId: TabId) => {
    setActiveTab(tabId);
    // Update CSS custom properties for accent theming
    const root = document.documentElement;
    const tab = TABS.find((t) => t.id === tabId)!;
    root.style.setProperty("--accent", tab.accentVar);
    root.style.setProperty("--accent-glow", tab.glowVar);
  }, []);

  return (
    <div className="dashboard">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">🧠</div>
            <div>
              <div className="sidebar-title">AI Analyst</div>
              <div className="sidebar-subtitle">Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Modules</div>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => handleTabChange(tab.id)}
              id={`tab-${tab.id}`}
            >
              <div className="tab-icon">{tab.icon}</div>
              <div className="tab-btn-text">
                <span className="tab-btn-label">{tab.label}</span>
                <span className="tab-btn-desc">{tab.description}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <div className="status-dot" />
            <span>AI engine online</span>
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main className="main-content">
        {/* Header bar */}
        <header className="content-header">
          <div className="content-header-inner">
            <h1 className="content-title">
              <span className="content-title-icon">{currentTab.headerIcon}</span>
              {currentTab.headerTitle}
            </h1>
            <div className="content-badge">
              <span className="content-badge-dot" />
              {currentTab.badgeText}
            </div>
          </div>
        </header>

        {/* Tab panel */}
        <div className="tab-panel" key={activeTab}>
          {activeTab === "animals" && <AnimalsPanel />}
          {activeTab === "humans" && <HumansPanel />}
          {activeTab === "buildings" && <BuildingsPanel />}
        </div>
      </main>
    </div>
  );
}
