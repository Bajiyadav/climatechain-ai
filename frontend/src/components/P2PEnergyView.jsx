import React, { useState } from 'react';
import { Zap, RefreshCw, ArrowRight, ShieldCheck, Activity, Award } from 'lucide-react';

export default function P2PEnergyView({ market, onRefresh, onTradeSuccess, onToast }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tradeKwh, setTradeKwh] = useState(150);
  const [buyerAddress, setBuyerAddress] = useState('0xEnterprise_Amazon');
  const [trading, setTrading] = useState(false);

  const orders = market?.open_sell_orders || [];
  const tariff = market?.dynamic_tariff;

  const currentOrder = selectedOrder || (orders.length > 0 ? orders[0] : null);
  const effectivePrice = currentOrder ? currentOrder.price_per_kwh_usd : (tariff?.dynamic_tariff_usd_per_kwh || 0.118);
  const estimatedCost = (tradeKwh * effectivePrice).toFixed(2);
  const estimatedCo2Avoided = (tradeKwh * 0.82).toFixed(2);

  const handleExecuteTrade = async () => {
    if (!currentOrder) {
      onToast('Please select a sell order from the book', 'danger');
      return;
    }
    setTrading(true);
    try {
      const res = await fetch('/api/energy/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_address: buyerAddress,
          seller_order_id: currentOrder.order_id,
          kwh: parseFloat(tradeKwh)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        onToast(data.detail || 'Trade failed', 'danger');
        return;
      }

      onToast(`⚡ Settled ${tradeKwh} kWh Clean Energy in Block #${data.block_index}!`, 'success');
      onTradeSuccess();
    } catch (err) {
      onToast('Trade settlement failed', 'danger');
    } finally {
      setTrading(false);
    }
  };

  return (
    <div className="two-col-grid">
      {/* Order Book */}
      <div className="glass-panel-rich">
        <div className="panel-title-row">
          <div>
            <h2 className="panel-main-title">
              <Zap className="text-cyan" size={22} />
              Decentralized Microgrid Order Book
            </h2>
            <div className="panel-sub-title">
              Verified renewable prosumers selling surplus clean kWh directly to consumers.
            </div>
          </div>
          <button onClick={onRefresh} className="btn-cyber-gold" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Refresh Book
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="rich-table">
            <thead>
              <tr>
                <th>Prosumer Node</th>
                <th>Source</th>
                <th>Available</th>
                <th>Tariff</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                    No active prosumer sell orders currently open.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.order_id} style={{ background: currentOrder?.order_id === o.order_id ? 'rgba(16, 185, 129, 0.08)' : 'transparent' }}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{o.trader_address.replace('0xProsumer_', '')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{o.location}</div>
                    </td>
                    <td>
                      <span className="badge-verified">{o.energy_source}</span>
                    </td>
                    <td>
                      <b className="text-cyan font-mono">{o.remaining_kwh} kWh</b>
                    </td>
                    <td>
                      <b className="text-emerald font-mono">${o.price_per_kwh_usd.toFixed(3)}</b>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="btn-emerald"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic AMM & Instant Trade Settlement */}
      <div className="glass-panel-rich">
        <div className="panel-title-row">
          <div>
            <h2 className="panel-main-title">
              <Activity className="text-emerald" size={22} />
              Dynamic AMM Tariff & Instant Settlement
            </h2>
            <div className="panel-sub-title">
              Automated market-clearing tariff balances microgrid solar surplus & peak load.
            </div>
          </div>
          <span className="badge-verified">Atomic Escrow</span>
        </div>

        {/* Dynamic Pricing Gauge */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(5, 14, 11, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Market Clearing Tariff
            </div>
            <div className="text-cyan font-mono" style={{ fontSize: '2rem', fontWeight: 800 }}>
              ${tariff?.dynamic_tariff_usd_per_kwh?.toFixed(3) || '0.118'}
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>per kWh</div>
          </div>

          <div style={{ width: '1px', height: '50px', background: 'var(--border-subtle)' }}></div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Grid Stress Ratio
            </div>
            <div className="text-emerald font-mono" style={{ fontSize: '2rem', fontWeight: 800 }}>
              {tariff?.grid_stress_index || '0.42'} / 1.0
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>Optimal Load</div>
          </div>
        </div>

        {/* Trade Box */}
        <div style={{ background: 'rgba(8, 18, 14, 0.85)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.4rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            Execute P2P Clean Energy Settlement
          </div>

          <div className="form-grid-2">
            <div className="input-field-group">
              <label className="input-label">Buyer Consumer Account</label>
              <select
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                className="rich-input"
              >
                <option value="0xEnterprise_Amazon">0xEnterprise_Amazon (Data Center)</option>
                <option value="0xCity_Istanbul_Transit">0xCity_Istanbul_Transit (Metro Transit)</option>
                <option value="0xResidential_Microgrid_User">0xResidential_Microgrid_User</option>
              </select>
            </div>

            <div className="input-field-group">
              <label className="input-label">Required Energy (kWh)</label>
              <input
                type="number"
                value={tradeKwh}
                onChange={(e) => setTradeKwh(e.target.value)}
                min="1"
                step="5"
                required
                className="rich-input"
              />
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.35)', borderRadius: 'var(--radius-md)', padding: '0.95rem 1.15rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Seller Target:</span>
              <b>{currentOrder ? currentOrder.trader_address.replace('0xProsumer_', '') : 'Select Order'}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estimated Cost:</span>
              <b className="text-cyan font-mono">${estimatedCost} USD</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Avoided CO2 Grid Emissions:</span>
              <b className="text-emerald font-mono">{estimatedCo2Avoided} kg CO2</b>
            </div>
          </div>

          <button
            onClick={handleExecuteTrade}
            disabled={trading || !currentOrder}
            className="btn-emerald btn-w-full"
          >
            <Zap size={18} />
            {trading ? 'Settling Smart Contract...' : 'Execute Atomic P2P Smart Contract Trade'}
          </button>
        </div>
      </div>
    </div>
  );
}
