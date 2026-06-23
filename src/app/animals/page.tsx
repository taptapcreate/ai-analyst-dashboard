"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { ImageUploader } from "@/components/ImageUploader";

export default function AnimalsPage() {
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
      }
    } catch (err: any) {
      setError("Failed to analyze. " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="container animate-fade-in">
      <div className="text-center mb-8">
        <h1>🐾 AnimalFit: AI Pet & Cattle Health Analyst</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Optimize your animal's health with AI-powered diet and routine plans.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Input Form */}
        <GlassCard>
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
            <label className="form-label">Age (Years/Months)</label>
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

          <div className="mt-8 p-4 text-center" style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '12px', fontWeight: 600 }}>
            Analyzing {animalType} - {breed}
          </div>
        </GlassCard>

        {/* Right Column: AI Analysis */}
        <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
          <GlassCard>
            <h3>📸 Step 1: Upload {animalType} Photo</h3>
            <ImageUploader onImageUpload={handleImageUpload} label={`Upload photo of your ${animalType}`} />
            {isEstimating && <p className="mt-8 text-center" style={{ color: 'var(--primary)', fontWeight: 600 }}>🔍 Identifying breed...</p>}
          </GlassCard>

          <GlassCard>
            <h3>🧠 Step 2: AI Health Analysis</h3>
            {image ? (
              <button 
                className="btn-primary mt-8" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || isEstimating}
              >
                {isAnalyzing ? `🚀 Analyzing ${animalType}...` : `Generate ${animalType} HealthPlan`}
              </button>
            ) : (
              <p className="mt-8 text-center" style={{ color: 'var(--text-muted)' }}>Upload photo to start.</p>
            )}

            {error && (
              <div className="mt-8 p-4" style={{ background: '#fee2e2', color: '#b91c1c', borderRadius: '12px' }}>
                {error}
              </div>
            )}

            {analysisResult && (
              <div className="mt-8 animate-fade-in">
                <h4 style={{ color: 'var(--primary)' }}>✅ Analysis Complete!</h4>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                  {analysisResult}
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
