"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { GlassCard } from "@/components/GlassCard";
import { ImageUploader } from "@/components/ImageUploader";

interface AnimalAnalysisHistory {
  id: number;
  date: string;
  type: string;
  breed: string;
  goal: string;
  result: string;
}

export function AnimalsPanel() {
  const [animalType, setAnimalType] = useState<string>("Dog");
  const [breed, setBreed] = useState<string>("Unknown");
  const [age, setAge] = useState<number>(2.0);
  const [weight, setWeight] = useState<number>(10.0);
  const [goal, setGoal] = useState<string>("Healthy Growth");
  const [image, setImage] = useState<string | null>(null);
  
  const [isEstimating, setIsEstimating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnimalAnalysisHistory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("animalsAnalysisHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveToHistory = (result: string, type: string, currentBreed: string, currentGoal: string) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      type,
      breed: currentBreed,
      goal: currentGoal,
      result
    };
    const newHistory = [newEntry, ...history].slice(0, 5); // Keep last 5 entries
    setHistory(newHistory);
    localStorage.setItem("animalsAnalysisHistory", JSON.stringify(newHistory));
  };

  const animalTypes = ["Dog", "Cat", "Cattle", "Horse", "Sheep/Goat", "Others"];
  const healthGoals = [
    "Healthy Growth", 
    "Weight Management", 
    "Energy/Performance", 
    "Recovery/Supplementation",
    "Daily Maintenance"
  ];

  const handleImageUpload = async (base64: string) => {
    setImage(base64);
    setIsEstimating(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/animals/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, animalType }),
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        if (data.breed) setBreed(data.breed);
      }
    } catch (err: any) {
      setError("Failed to identify breed. " + err.message);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/animals/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          profile: { type: animalType, breed, age, weight, goal }
        }),
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setAnalysisResult(data.plan);
        saveToHistory(data.plan, animalType, breed, goal);
      }
    } catch (err: any) {
      setError("Failed to analyze. " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Stat strip */}
      <div className="stat-strip">
        <div className="stat-mini">
          <div className="stat-mini-icon">🐾</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">Animal</span>
            <span className="stat-mini-value">{animalType}</span>
          </div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-icon">🧬</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">Breed</span>
            <span className="stat-mini-value">{breed}</span>
          </div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-icon">⚖️</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">Weight</span>
            <span className="stat-mini-value">{weight} kg</span>
          </div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-icon">🎯</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">Goal</span>
            <span className="stat-mini-value" style={{ fontSize: '0.9rem' }}>{goal}</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="panel-grid panel-grid-2">
        {/* Left: Profile form */}
        <GlassCard>
          <div className="section-label">Profile Setup</div>
          <h2>🐾 Animal Profile</h2>
          
          <div className="form-group">
            <label className="form-label">Animal Type</label>
            <select className="form-select" value={animalType} onChange={e => setAnimalType(e.target.value)}>
              {animalTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Breed / Variety</label>
            <input 
              type="text" 
              className="form-input" 
              value={breed} 
              onChange={e => setBreed(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age (Years)</label>
            <input 
              type="number" 
              className="form-input" 
              value={age} 
              onChange={e => setAge(Number(e.target.value))} 
              step="0.1" min={0.1} max={50.0}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input 
              type="number" 
              className="form-input" 
              value={weight} 
              onChange={e => setWeight(Number(e.target.value))} 
              step="0.1" min={0.1} max={2000.0}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Health Goal</label>
            <select className="form-select" value={goal} onChange={e => setGoal(e.target.value)}>
              {healthGoals.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </GlassCard>

        {/* Right: AI Analysis */}
        <div className="panel-col">
          <GlassCard>
            <div className="section-label">Step 1</div>
            <h3>📸 Upload {animalType} Photo</h3>
            <ImageUploader onImageUpload={handleImageUpload} label={`Upload a photo of your ${animalType}`} />
            {isEstimating && (
              <p className="mt-8 text-center" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                🔍 Identifying breed...
              </p>
            )}
          </GlassCard>

          <GlassCard>
            <div className="section-label">Step 2</div>
            <h3>🧠 AI Health Analysis</h3>
            {image ? (
              <button 
                className="btn-primary mt-8" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || isEstimating}
              >
                {isAnalyzing ? `🚀 Analyzing ${animalType}...` : `Generate ${animalType} HealthPlan`}
              </button>
            ) : (
              <p className="mt-8 text-center" style={{ color: 'var(--text-muted)' }}>
                Upload a photo above to get started.
              </p>
            )}

            {error && (
              <div className="mt-8 error-box">{error}</div>
            )}

            {analysisResult && (
              <div className="mt-8 animate-fade-in">
                <h4 style={{ color: 'var(--accent)' }}>✅ Analysis Complete!</h4>
                <div className="result-box markdown-content">
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </GlassCard>

          {history.length > 0 && (
            <GlassCard>
              <div className="section-label">History</div>
              <h3>📜 Saved Analyses</h3>
              <div className="history-list">
                {history.map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-header">
                      <span className="history-date">{item.date}</span>
                      <span className="history-goal">{item.goal}</span>
                    </div>
                    <div className="history-meta">
                      Type: {item.type} • Breed: {item.breed}
                    </div>
                    <div className="result-box markdown-content history-result">
                      <ReactMarkdown>{item.result}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
