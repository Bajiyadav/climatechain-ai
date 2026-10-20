import React from 'react';
import { Leaf, Flame, Zap, TrendingDown } from 'lucide-react';

export default function MetricsGrid({ stats }) {
  return (
    <section className="metrics-section">
      <div className="metric-card-rich">
        <div className="card-top">
          <span className="card-label">Total Verified Offsets</span>
          <div className="card-icon">
            <Leaf size={18} />
          </div>
        </div>
        <div className="card-value-box">
          <span className="card-big-num">
            {(stats?.total_co2_minted_tco2e || 0).toFixed(2)}
          </span>
          <span className="card-unit">tCO2e</span>
        </div>
        <div className="card-footer-sub">
          <span className="text-emerald font-mono">↑ 100%</span> AI Verified via Satellite MRV
        </div>
      </div>

      <div className="metric-card-rich">
        <div className="card-top">
          <span className="card-label">Permanently Retired (Burned)</span>
          <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--gold-accent)' }}>
            <Flame size={18} />
          </div>
        </div>
        <div className="card-value-box">
          <span className="card-big-num text-gold">
            {(stats?.total_co2_retired_tco2e || 0).toFixed(2)}
          </span>
          <span className="card-unit">tCO2e</span>
        </div>
        <div className="card-footer-sub">
          <span className="text-gold">Zero Double-Counting</span> (Permanent State Lock)
        </div>
      </div>

      <div className="metric-card-rich">
        <div className="card-top">
          <span className="card-label">Clean Energy Traded P2P</span>
          <div className="card-icon" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--cyan-accent)' }}>
            <Zap size={18} />
          </div>
        </div>
        <div className="card-value-box">
          <span className="card-big-num text-cyan">
            {(stats?.total_energy_traded_kwh || 0).toLocaleString()}
          </span>
          <span className="card-unit">kWh</span>
        </div>
        <div className="card-footer-sub">
          Direct Prosumer ➔ Consumer Microgrid
        </div>
      </div>

      <div className="metric-card-rich">
        <div className="card-top">
          <span className="card-label">Conventional Grid Savings</span>
          <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-primary)' }}>
            <TrendingDown size={18} />
          </div>
        </div>
        <div className="card-value-box">
          <span className="card-big-num text-emerald">
            {stats?.consumer_savings_vs_utility_pct || 34.4}%
          </span>
          <span className="card-unit">SAVINGS</span>
        </div>
        <div className="card-footer-sub">
          vs. Centralized Utility Rates ($0.18 / kWh)
        </div>
      </div>
    </section>
  );
}
