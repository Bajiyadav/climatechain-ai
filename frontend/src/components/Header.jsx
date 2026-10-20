import React from 'react';
import { Globe, ShieldCheck, Zap, Layers, Activity } from 'lucide-react';

export default function Header({ stats }) {
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
