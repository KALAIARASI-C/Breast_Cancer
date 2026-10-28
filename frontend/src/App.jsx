import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewAnalysis from './pages/NewAnalysis';
import AnalysisResults from './pages/AnalysisResults';
import Explainability from './pages/Explainability';
import Reports from './pages/Reports';
import { api } from './services/api';
import { MOCK_ANALYSES } from './services/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyses, setAnalyses] = useState(MOCK_ANALYSES);
  const [currentAnalysis, setCurrentAnalysis] = useState(MOCK_ANALYSES[0]);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial load & connection check
  useEffect(() => {
    async function initApp() {
      try {
        const health = await api.checkHealth();
        setIsLiveBackend(health.isLive);

        const listRes = await api.listAnalyses();
        if (listRes.data && listRes.data.length > 0) {
          setAnalyses(listRes.data);
          setCurrentAnalysis(listRes.data[0]);
        }
      } catch (err) {
        console.warn('Initialization using fallback mock data:', err);
      } finally {
        setLoading(false);
      }
    }
    initApp();
  }, []);

  const handleSelectAnalysis = (analysisId) => {
    const found = analyses.find(a => a.analysis_id === analysisId);
    if (found) {
      setCurrentAnalysis(found);
    }
  };

  const handleAnalysisCreated = (newRecord) => {
    setAnalyses(prev => [newRecord, ...prev]);
    setCurrentAnalysis(newRecord);
    setActiveTab('results');
  };

  const handleGradCamUpdated = (newAgent3Output) => {
    if (!currentAnalysis) return;
    const updated = {
      ...currentAnalysis,
      agent3_explainability: newAgent3Output
    };
    setCurrentAnalysis(updated);
    setAnalyses(prev => prev.map(a => a.analysis_id === updated.analysis_id ? updated : a));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Sticky Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isLiveBackend={isLiveBackend} 
      />

      {/* Main Two-Column Layout */}
      <div className="app-layout">
        <Sidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentAnalysis={currentAnalysis}
          analyses={analyses}
          onSelectAnalysis={handleSelectAnalysis}
        />

        <main className="main-content">
          <div className="page-container">
            {activeTab === 'dashboard' && (
              <Dashboard 
                currentAnalysis={currentAnalysis}
                analyses={analyses}
                setActiveTab={setActiveTab}
                onSelectAnalysis={handleSelectAnalysis}
                isLiveBackend={isLiveBackend}
              />
            )}

            {activeTab === 'new-analysis' && (
              <NewAnalysis 
                onAnalysisCreated={handleAnalysisCreated}
              />
            )}

            {activeTab === 'results' && (
              <AnalysisResults 
                currentAnalysis={currentAnalysis}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'explainability' && (
              <Explainability 
                currentAnalysis={currentAnalysis}
                onGradCamUpdated={handleGradCamUpdated}
              />
            )}

            {activeTab === 'reports' && (
              <Reports 
                currentAnalysis={currentAnalysis}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
