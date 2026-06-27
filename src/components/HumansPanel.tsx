"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { GlassCard } from "@/components/GlassCard";
import { ImageUploader } from "@/components/ImageUploader";
import { MetricCard } from "@/components/MetricCard";

interface AnalysisHistory {
  id: number;
  date: string;
  age: number;
  weight: number;
  goal: string;
  result: string;
}

export function HumansPanel() {
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(70.0);
  const [height, setHeight] = useState<number>(170);
  const [goal, setGoal] = useState<string>("Lose Weight");
  const [image, setImage] = useState<string | null>(null);
  
  const [isEstimating, setIsEstimating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("humansAnalysisHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveToHistory = (result: string, currentAge: number, currentWeight: number, currentGoal: string) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      age: currentAge,
      weight: currentWeight,
      goal: currentGoal,
      result
    };
    const newHistory = [newEntry, ...history].slice(0, 5); // Keep last 5 entries
    setHistory(newHistory);
    localStorage.setItem("humansAnalysisHistory", JSON.stringify(newHistory));
  };

  const bmi = weight / Math.pow(height / 100, 2);
  
  let bmiCategory = "Normal";
  if (bmi < 18.5) bmiCategory = "Underweight";
  else if (bmi >= 25 && bmi < 30) bmiCategory = "Overweight";
  else if (bmi >= 30) bmiCategory = "Obese";

  const handleImageUpload = async (base64: string) => {
    setImage(base64);
    setIsEstimating(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch("/api/humans/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        if (data.age) setAge(data.age);
        if (data.weight) setWeight(data.weight);
        if (data.height) setHeight(data.height);
      }
    } catch (err: any) {
      setError("Failed to estimate metrics. " + err.message);
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
      const res = await fetch("/api/humans/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image,
          profile: { age, weight, height, bmi, goal }
        }),
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setAnalysisResult(data.plan);
        saveToHistory(data.plan, age, weight, goal);
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
          <div className="stat-mini-icon">🎂</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">Age</span>
            <span className="stat-mini-value">{age} yrs</span>
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
          <div className="stat-mini-icon">📏</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">Height</span>
            <span className="stat-mini-value">{height} cm</span>
          </div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-icon">📊</div>
          <div className="stat-mini-info">
            <span className="stat-mini-label">BMI</span>
            <span className="stat-mini-value">{bmi.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="panel-grid panel-grid-2">
        {/* Left: Profile form */}
        <GlassCard>
          <div className="section-label">Profile Setup</div>
          <h2>👤 Your Profile</h2>
          
          <div className="form-group">
            <label className="form-label">Age</label>
            <input 
              type="number" 
              className="form-input" 
              value={age} 
              onChange={e => setAge(Number(e.target.value))} 
              min={10} max={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input 
              type="number" 
              className="form-input" 
              value={weight} 
              onChange={e => setWeight(Number(e.target.value))} 
              step="0.1" min={30} max={200}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Height (cm)</label>
            <input 
              type="number" 
              className="form-input" 
              value={height} 
              onChange={e => setHeight(Number(e.target.value))} 
              min={100} max={250}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Goal</label>
            <select className="form-select" value={goal} onChange={e => setGoal(e.target.value)}>
              <option>Lose Weight</option>
              <option>Gain Muscle</option>
              <option>Maintenance</option>
              <option>Get Toned</option>
            </select>
          </div>

          <div className="flex gap-4 mt-8">
            <MetricCard label="Your BMI" value={bmi.toFixed(1)} highlight={true} />
            <MetricCard label="Category" value={bmiCategory} />
          </div>
        </GlassCard>

        {/* Right: AI Analysis */}
        <div className="panel-col">
          <GlassCard>
            <div className="section-label">Step 1</div>
            <h3>📸 Upload Profile Photo</h3>
            <ImageUploader onImageUpload={handleImageUpload} label="Upload a full-body photo" />
            {isEstimating && (
              <p className="mt-8 text-center" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                🔍 Estimating metrics...
              </p>
            )}
          </GlassCard>

          <GlassCard>
            <div className="section-label">Step 2</div>
            <h3>🧠 AI Analysis</h3>
            {image ? (
              <button 
                className="btn-primary mt-8" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || isEstimating}
              >
                {isAnalyzing ? "🚀 Analyzing..." : "Generate My FitPlan"}
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
                      Age: {item.age} • Weight: {item.weight}kg
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
