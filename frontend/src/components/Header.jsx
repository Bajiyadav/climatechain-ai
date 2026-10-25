import React, { useState, useRef, useEffect } from 'react';
import { Globe, ShieldCheck, Zap, Layers, UserCheck, ChevronDown, Wallet } from 'lucide-react';

export const DEFAULT_IDENTITIES = [
  { id: '0xProsumer_SolarFarm_Adana', name: 'Adana Solar Farm', role: 'Renewable Prosumer', icon: '☀️' },
  { id: '0xProsumer_WindMicrogrid_Izmir', name: 'Izmir Coastal Wind', role: 'Wind Prosumer', icon: '💨' },
  { id: '0xEnterprise_Amazon', name: 'Amazon AI Data Center', role: 'ESG Clean Buyer', icon: '🏢' },
  { id: '0xAI_Oracle_Coordinator', name: 'AI MRV Coordinator', role: 'Oracle Attestation', icon: '🤖' },
  { id: '0xIEEE_Validator_Node_01', name: 'IEEE Genesis Validator', role: 'PoAS Validator', icon: '🛡️' }
];

export default function Header({ stats, currentIdentity, onSelectIdentity }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const activeObj = DEFAULT_IDENTITIES.find(i => i.id === currentIdentity) || {
    id: currentIdentity,
    name: 'Custom Web3 Wallet',
    role: 'Participant',
    icon: '🔑'
  };

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon-box">
          <Globe size={32} strokeWidth={2.2} />
        </div>
        <div>
          <div className="brand-heading">
            <span>ClimateChain</span>
            <span className="text-gradient">.AI</span>
            <span className="ieee-badge">IEEE ClimateChain 2026</span>
          </div>
          <div className="brand-tagline">
            Decentralized Autonomous Carbon MRV Oracle & P2P Renewable Clean Energy Grid
          </div>
        </div>
      </div>

      <div className="header-hud">
        {/* Web3 Identity / Role Selector */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="hud-chip"
            style={{
              cursor: 'pointer',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--emerald-primary)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem'
            }}
            title="Switch Web3 Node Identity"
          >
            <span style={{ fontSize: '1rem' }}>{activeObj.icon}</span>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--emerald-light)', fontWeight: 600 }}>
                {activeObj.role}
              </div>
              <div className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                {activeObj.id.length > 22 ? `${activeObj.id.slice(0, 14)}...${activeObj.id.slice(-4)}` : activeObj.id}
              </div>
            </div>
            <ChevronDown size={14} className="text-emerald" style={{ marginLeft: '0.2rem' }} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: '330px',
                background: '#071610',
                border: '1px solid var(--emerald-primary)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 20px 45px rgba(0,0,0,0.9), 0 0 25px rgba(16,185,129,0.3)',
                zIndex: 1000,
                padding: '0.65rem',
                backdropFilter: 'blur(25px)'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--emerald-light)', padding: '0.4rem 0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, borderBottom: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '0.4rem' }}>
                Switch Active Web3 Node Identity
              </div>
              {DEFAULT_IDENTITIES.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectIdentity(item.id);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    background: item.id === currentIdentity ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                    border: item.id === currentIdentity ? '1px solid var(--border-highlight)' : '1px solid transparent',
                    transition: 'var(--transition)',
                    marginBottom: '0.25rem'
                  }}
                  onMouseEnter={(e) => {
                    if (item.id !== currentIdentity) {
                      e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (item.id !== currentIdentity) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '1.35rem' }}>{item.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: item.id === currentIdentity ? 'var(--emerald-light)' : 'var(--text-main)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {item.role} • <span className="font-mono" style={{ color: 'var(--cyan-accent)' }}>{item.id.slice(0, 18)}...</span>
                    </div>
                  </div>
                  {item.id === currentIdentity && <UserCheck size={16} className="text-emerald" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hud-chip">
          <span className="pulse-indicator"></span>
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>Consensus:</span>
          <span className="font-mono" style={{ fontWeight: 600 }}>PoAS (Active)</span>
        </div>

        <div className="hud-chip">
          <Layers size={15} className="text-emerald" />
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>Block Height:</span>
          <span className="font-mono text-emerald" style={{ fontWeight: 700 }}>
            #{stats?.blockchain_height || 0}
          </span>
        </div>

        <div className="hud-chip">
          <ShieldCheck size={15} className="text-emerald" />
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>Double-Count Shield:</span>
          <span className="font-mono text-emerald" style={{ fontWeight: 700 }}>100% Locked</span>
        </div>

        <div className="hud-chip">
          <Zap size={15} className="text-cyan" />
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>Dynamic Tariff:</span>
          <span className="font-mono text-cyan" style={{ fontWeight: 700 }}>
            ${stats?.dynamic_tariff_usd?.toFixed(3) || '0.118'} / kWh
          </span>
        </div>
      </div>
    </header>
  );
}

