import React, { useState } from 'react';
import { Zap, RefreshCw, ArrowRight, ShieldCheck, Activity, Award, PlusCircle, Sun, Wind, Flame, CheckCircle2 } from 'lucide-react';

export default function P2PEnergyView({ market, onRefresh, onTradeSuccess, onToast, currentIdentity = '0xEnterprise_Amazon' }) {
  const [activeSubTab, setActiveSubTab] = useState('buy'); // 'buy' | 'sell'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tradeKwh, setTradeKwh] = useState(150);
  const [buyerAddress, setBuyerAddress] = useState(currentIdentity);
  const [trading, setTrading] = useState(false);

  // Prosumer Sell Order form state
  const [sellForm, setSellForm] = useState({
    energySource: 'Solar PV',
    kwh: 500,
    pricePerKwh: 0.125,
    location: 'Adana Solar District, TR'
  });
  const [listing, setListing] = useState(false);

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
          buyer_address: buyerAddress || currentIdentity,
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

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setListing(true);
    try {
      const res = await fetch('/api/energy/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_type: 'SELL',
          trader_address: currentIdentity,
          kwh: parseFloat(sellForm.kwh),
          price_per_kwh_usd: parseFloat(sellForm.pricePerKwh),
          energy_source: sellForm.energySource,
          location: sellForm.location
        })
      });
      const data = await res.json();
      if (!res.ok) {
        onToast(data.detail || 'Order placement failed', 'danger');
        return;
      }

      onToast(`☀️ Clean Energy Offer Placed: ${sellForm.kwh} kWh at $${sellForm.pricePerKwh}/kWh!`, 'success');
      onRefresh();
      setActiveSubTab('buy');
    } catch (err) {
      onToast('Failed to place energy order', 'danger');
    } finally {
      setListing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Interactive Microgrid Topology & Flow Diagram */}
      <div className="glass-panel-rich" style={{ padding: '1.4rem 1.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap className="text-cyan" size={20} />
              Live Regional Microgrid Topology & AMM Flow
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Decentralized peer-to-peer transmission bus balancing renewable generation with urban load.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge-verified">IEEE 1547 Grid Standard</span>
            <span className="badge-verified" style={{ background: 'rgba(6, 182, 212, 0.15)', borderColor: 'var(--cyan-accent)', color: 'var(--cyan-accent)' }}>
              Latency &lt; 24ms
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
          {/* Prosumer Sources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--emerald-light)', fontWeight: 700 }}>
              ⚡ Renewable Prosumer Nodes (Generation)
            </div>

            <div style={{ background: 'rgba(5, 14, 10, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sun className="text-emerald" size={18} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Adana Agro-Solar</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Output: 3,200 kWh • Irradiance: 890 W/m²</div>
                </div>
              </div>
              <span className="font-mono text-emerald" style={{ fontSize: '0.85rem', fontWeight: 700 }}>ONLINE</span>
            </div>

            <div style={{ background: 'rgba(5, 14, 10, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wind className="text-cyan" size={18} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Izmir Offshore Wind</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Output: 4,800 kWh • Wind: 8.4 m/s</div>
                </div>
              </div>
              <span className="font-mono text-cyan" style={{ fontSize: '0.85rem', fontWeight: 700 }}>ONLINE</span>
            </div>

            <div style={{ background: 'rgba(5, 14, 10, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame className="text-gold" size={18} />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Bursa Clean Biomass</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Output: 1,500 kWh • Baseload</div>
                </div>
              </div>
              <span className="font-mono text-gold" style={{ fontSize: '0.85rem', fontWeight: 700 }}>ONLINE</span>
            </div>
          </div>

          {/* Central AMM Microgrid Hub */}
          <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid var(--border-cyan)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.6rem', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--cyan-accent)', color: '#000', fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.6rem', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase' }}>
              Automated Market Maker
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>P2P Clearing Price</div>
            <div className="text-cyan font-mono" style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>
              ${tariff?.dynamic_tariff_usd_per_kwh?.toFixed(3) || '0.118'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>vs. Utility Grid $0.180 (25% Savings)</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
              <span className="badge-verified" style={{ fontSize: '0.72rem' }}>Stress Index: {tariff?.grid_stress_index || '0.42'}</span>
              <span className="badge-verified" style={{ fontSize: '0.72rem' }}>No Grid Curtailment</span>
            </div>
          </div>

          {/* Consumer Loads */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cyan-accent)', fontWeight: 700 }}>
              🏢 Regional Consumer Clusters (Demand)
            </div>

            <div style={{ background: 'rgba(5, 14, 10, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Amazon AI Compute Hub</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Demand: 2,400 kWh • 100% Green Target</div>
              </div>
              <span className="font-mono text-emerald" style={{ fontSize: '0.82rem', fontWeight: 700 }}>MATCHED</span>
            </div>

            <div style={{ background: 'rgba(5, 14, 10, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Istanbul Metro & EV Hub</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Demand: 1,800 kWh • Fast Chargers</div>
              </div>
              <span className="font-mono text-emerald" style={{ fontSize: '0.82rem', fontWeight: 700 }}>MATCHED</span>
            </div>

            <div style={{ background: 'rgba(5, 14, 10, 0.9)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Residential District Microgrid</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Demand: 950 kWh • Local Households</div>
              </div>
              <span className="font-mono text-emerald" style={{ fontSize: '0.82rem', fontWeight: 700 }}>MATCHED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Order Book & Trading Interface */}
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
                          onClick={() => {
                            setSelectedOrder(o);
                            setActiveSubTab('buy');
                          }}
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

        {/* Action Panel: Buy or List Clean Power */}
        <div className="glass-panel-rich">
          {/* Sub-tab Switcher: Buy vs Sell */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
            <button
              onClick={() => setActiveSubTab('buy')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: activeSubTab === 'buy' ? '1px solid var(--emerald-primary)' : '1px solid transparent',
                background: activeSubTab === 'buy' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: activeSubTab === 'buy' ? 'var(--emerald-light)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Zap size={16} /> Buy Clean Energy
            </button>
            <button
              onClick={() => setActiveSubTab('sell')}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: activeSubTab === 'sell' ? '1px solid var(--cyan-accent)' : '1px solid transparent',
                background: activeSubTab === 'sell' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: activeSubTab === 'sell' ? 'var(--cyan-accent)' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <PlusCircle size={16} /> Offer Surplus Energy
            </button>
          </div>

          {activeSubTab === 'buy' ? (
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                Execute P2P Clean Energy Settlement
              </div>

              <div className="form-grid-2">
                <div className="input-field-group">
                  <label className="input-label">Buyer Consumer Account</label>
                  <input
                    type="text"
                    value={buyerAddress}
                    onChange={(e) => setBuyerAddress(e.target.value)}
                    className="rich-input"
                    placeholder="0x..."
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    Active Identity: {currentIdentity}
                  </div>
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
                  <span style={{ color: 'var(--text-muted)' }}>Effective Rate:</span>
                  <b className="text-cyan font-mono">${effectivePrice.toFixed(3)} / kWh</b>
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
          ) : (
            <form onSubmit={handleCreateOrder}>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                List Prosumer Surplus Energy to Microgrid
              </div>

              <div className="form-grid-2">
                <div className="input-field-group">
                  <label className="input-label">Energy Generation Source</label>
                  <select
                    value={sellForm.energySource}
                    onChange={(e) => setSellForm({ ...sellForm, energySource: e.target.value })}
                    className="rich-input"
                  >
                    <option value="Solar PV">Rooftop Solar PV</option>
                    <option value="Offshore Wind">Coastal Wind Turbine</option>
                    <option value="Biomass Generator">Biomass / Biogas Facility</option>
                    <option value="Micro-Hydro">Micro-Hydro Run of River</option>
                  </select>
                </div>

                <div className="input-field-group">
                  <label className="input-label">Available Capacity (kWh)</label>
                  <input
                    type="number"
                    value={sellForm.kwh}
                    onChange={(e) => setSellForm({ ...sellForm, kwh: e.target.value })}
                    min="10"
                    step="10"
                    required
                    className="rich-input"
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: '0.85rem' }}>
                <div className="input-field-group">
                  <label className="input-label">Asking Tariff ($ USD / kWh)</label>
                  <input
                    type="number"
                    value={sellForm.pricePerKwh}
                    onChange={(e) => setSellForm({ ...sellForm, pricePerKwh: e.target.value })}
                    min="0.05"
                    max="0.50"
                    step="0.005"
                    required
                    className="rich-input"
                  />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    Recommended: ${tariff?.dynamic_tariff_usd_per_kwh?.toFixed(3) || '0.118'}
                  </div>
                </div>

                <div className="input-field-group">
                  <label className="input-label">Microgrid Substation Location</label>
                  <input
                    type="text"
                    value={sellForm.location}
                    onChange={(e) => setSellForm({ ...sellForm, location: e.target.value })}
                    required
                    className="rich-input"
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="submit"
                  disabled={listing}
                  className="btn-cyan btn-w-full"
                >
                  <PlusCircle size={18} />
                  {listing ? 'Broadcasting Order to Microgrid...' : `Broadcast ${sellForm.kwh} kWh Clean Energy Offer`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
