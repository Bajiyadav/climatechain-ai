import React, { useState, useEffect } from 'react';
import CyberCanvas from './components/CyberCanvas';
import Header from './components/Header';
import MetricsGrid from './components/MetricsGrid';
import MrvOracleView from './components/MrvOracleView';
import P2PEnergyView from './components/P2PEnergyView';
import CarbonRegistryView from './components/CarbonRegistryView';
import BlockchainExplorerView from './components/BlockchainExplorerView';
import CopilotView from './components/CopilotView';
import { Satellite, Zap, FileText, Layers, Bot, Users, Mail, X, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('mrv');
  const [currentIdentity, setCurrentIdentity] = useState('0xEnterprise_Amazon');
  const [stats, setStats] = useState(null);
  const [market, setMarket] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  const [blocksData, setBlocksData] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showIeeeModal, setShowIeeeModal] = useState(false);

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
        <Header
          stats={stats}
          currentIdentity={currentIdentity}
          onSelectIdentity={(id) => {
            setCurrentIdentity(id);
            addToast(`Switched active Web3 identity to ${id.slice(0, 16)}...`, 'info');
          }}
        />

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
          {activeTab === 'mrv' && (
            <MrvOracleView
              onToast={addToast}
              currentIdentity={currentIdentity}
              onMintSuccess={refreshAll}
            />
          )}
          {activeTab === 'market' && (
            <P2PEnergyView
              market={market}
              onRefresh={fetchMarket}
              onTradeSuccess={refreshAll}
              onToast={addToast}
              currentIdentity={currentIdentity}
            />
          )}
          {activeTab === 'credits' && (
            <CarbonRegistryView
              creditsData={creditsData}
              onRefresh={refreshAll}
              onToast={addToast}
              currentIdentity={currentIdentity}
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
            <button
              onClick={() => setShowIeeeModal(true)}
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid var(--border-highlight)',
                color: 'var(--emerald-light)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.2rem 0.65rem',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Users size={12} /> IEEE Blockchain Türkiye Leadership & Collaboration
            </button>
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

      {/* IEEE Blockchain Türkiye Leadership Modal */}
      {showIeeeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={() => setShowIeeeModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #071811, #040d09)',
              border: '2px solid var(--emerald-primary)',
              boxShadow: '0 0 50px rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '680px',
              width: '100%',
              padding: '2.25rem',
              color: 'var(--text-main)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIeeeModal(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: 'var(--text-main)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-primary)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-pill)', color: 'var(--emerald-light)', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Approved by IEEE Blockchain & IEEE Türkiye Section
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)' }}>
                IEEE Blockchain Türkiye Group
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '540px', margin: '0.4rem auto 0', lineHeight: 1.5 }}>
                A collaborative initiative bridging Turkish universities and industries to advance blockchain research, activities, paper publications, policies, and production implementations.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Chair */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--emerald-light)', fontWeight: 800 }}>Group Chair</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>Prof. Dr. Şeref Sağıroğlu</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gazi University, Türkiye</div>
                </div>
                <a
                  href="mailto:ss@gazi.edu.tr"
                  className="btn-emerald"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', textDecoration: 'none' }}
                >
                  <Mail size={14} /> ss@gazi.edu.tr
                </a>
              </div>

              {/* Co-Chair Industry */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--cyan-accent)', fontWeight: 800 }}>Co-Chair (Industries)</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>Dr. Güven Fidan</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MindMons Technologies</div>
                </div>
                <span className="badge-verified" style={{ background: 'rgba(6, 182, 212, 0.15)', borderColor: 'var(--cyan-accent)', color: 'var(--cyan-accent)' }}>
                  Industry Partner
                </span>
              </div>

              {/* Co-Chair Universities */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.9rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--gold-accent)', fontWeight: 800 }}>Co-Chair (Universities)</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>Prof. Dr. Sedat Akleylek</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>University of Tartu</div>
                </div>
                <a
                  href="mailto:akleylek@gmail.com"
                  className="btn-cyber-gold"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', textDecoration: 'none' }}
                >
                  <Mail size={14} /> akleylek@gmail.com
                </a>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              🤝 <i>Please communicate with the leadership for further information, collaboration, organization, and joint projects.</i>
            </div>
          </div>
        </div>
      )}

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
