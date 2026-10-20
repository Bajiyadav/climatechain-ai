import React, { useState, useEffect } from 'react';
import CyberCanvas from './components/CyberCanvas';
import Header from './components/Header';
import MetricsGrid from './components/MetricsGrid';
import MrvOracleView from './components/MrvOracleView';
import P2PEnergyView from './components/P2PEnergyView';
import CarbonRegistryView from './components/CarbonRegistryView';
import BlockchainExplorerView from './components/BlockchainExplorerView';
import CopilotView from './components/CopilotView';
import { Satellite, Zap, FileText, Layers, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('mrv');
  const [stats, setStats] = useState(null);
  const [market, setMarket] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  const [blocksData, setBlocksData] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.warn('Stats error:', err);
    }
  };

  const fetchMarket = async () => {
    try {
      const res = await fetch('/api/energy/market');
      if (res.ok) {
        const data = await res.json();
        setMarket(data);
      }
    } catch (err) {
      console.warn('Market error:', err);
    }
  };

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/carbon-credits/list');
      if (res.ok) {
        const data = await res.json();
        setCreditsData(data);
      }
    } catch (err) {
      console.warn('Credits error:', err);
    }
  };

  const fetchBlocks = async () => {
    try {
      const res = await fetch('/api/blockchain/blocks?limit=12');
      if (res.ok) {
        const data = await res.json();
        setBlocksData(data);
      }
    } catch (err) {
      console.warn('Blocks error:', err);
    }
  };

  const refreshAll = () => {
    fetchStats();
    fetchMarket();
    fetchCredits();
    fetchBlocks();
  };

  useEffect(() => {
    refreshAll();
    const timer = setInterval(() => {
      fetchStats();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 3D Interactive Cyber Particle Canvas */}
      <CyberCanvas />

      {/* Ambient Blur Glows */}
      <div className="ambient-glow glow-emerald"></div>
      <div className="ambient-glow glow-cyan"></div>

      <div className="app-container">
        {/* Navigation Header */}
        <Header stats={stats} />

        {/* Global Key Metrics Dashboard */}
        <MetricsGrid stats={stats} />

        {/* Navigation Tab Pills */}
        <nav className="nav-tabs-rich">
          <button
            onClick={() => setActiveTab('mrv')}
            className={`tab-pill ${activeTab === 'mrv' ? 'active' : ''}`}
          >
            <Satellite size={17} /> AI Satellite MRV Oracle
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`tab-pill ${activeTab === 'market' ? 'active' : ''}`}
          >
            <Zap size={17} /> P2P Clean Energy Grid
          </button>

          <button
            onClick={() => setActiveTab('credits')}
            className={`tab-pill ${activeTab === 'credits' ? 'active' : ''}`}
          >
            <FileText size={17} /> Carbon Credit Registry
          </button>

          <button
            onClick={() => setActiveTab('blockchain')}
            className={`tab-pill ${activeTab === 'blockchain' ? 'active' : ''}`}
          >
            <Layers size={17} /> Blockchain Explorer
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`tab-pill ${activeTab === 'copilot' ? 'active' : ''}`}
          >
            <Bot size={17} /> Climate Copilot AI
          </button>
        </nav>

        {/* Active View */}
        <main>
          {activeTab === 'mrv' && <MrvOracleView onToast={addToast} />}
          {activeTab === 'market' && (
            <P2PEnergyView
              market={market}
              onRefresh={fetchMarket}
              onTradeSuccess={refreshAll}
              onToast={addToast}
            />
          )}
          {activeTab === 'credits' && (
            <CarbonRegistryView
              creditsData={creditsData}
              onRefresh={refreshAll}
              onToast={addToast}
            />
          )}
          {activeTab === 'blockchain' && (
            <BlockchainExplorerView
              blocksData={blocksData}
              onVerifyAudit={fetchBlocks}
              onToast={addToast}
            />
          )}
          {activeTab === 'copilot' && <CopilotView onToast={addToast} />}
        </main>

        {/* Footer */}
        <footer style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
          <div>
            <b>ClimateChain.AI</b> — Official Submission for the <b>IEEE ClimateChain Global Hackathon 2026</b>
            <span style={{ margin: '0 0.5rem' }}>•</span>
            Organized by IEEE Blockchain Türkiye & Technical Committee
          </div>
          <div>
            <span>UN COP 31 Aligned</span>
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <span>ISO 14064-2 MRV Protocol</span>
            <span style={{ margin: '0 0.5rem' }}>•</span>
            <span className="text-emerald">Zero Double-Counting Guarantee</span>
          </div>
        </footer>
      </div>

      {/* Toast Stack */}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast-msg">
            <span>{t.type === 'success' ? '✅' : (t.type === 'danger' ? '🚨' : 'ℹ️')}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
