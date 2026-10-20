import React, { useState } from 'react';
import { Satellite, ShieldAlert, CheckCircle2, AlertTriangle, Cpu, Radio } from 'lucide-react';

export default function MrvOracleView({ onToast }) {
  const [formData, setFormData] = useState({
    projectType: 'Solar PV Microgrid',
    reportedTonnage: 2.5,
    outputKwh: 3200,
    hourOfDay: 13,
    co2Ppm: 418,
    thermalCelsius: 32.0,
    productionIndex: 0.88
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVerify = async (dataToVerify = formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/mrv/verify-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_type: dataToVerify.projectType,
          reported_tonnage: parseFloat(dataToVerify.reportedTonnage),
          output_kwh: parseFloat(dataToVerify.outputKwh),
          hour_of_day: parseInt(dataToVerify.hourOfDay),
          co2_ppm: parseFloat(dataToVerify.co2Ppm),
          thermal_celsius: parseFloat(dataToVerify.thermalCelsius),
          production_index: parseFloat(dataToVerify.productionIndex)
        })
      });
      const data = await res.json();
      setResult(data);
      if (data.is_valid) {
        onToast('AI Oracle Verified Genuine Carbon Reduction!', 'success');
      } else {
        onToast('Cyber-Threat / Physical Anomaly Intercepted!', 'danger');
      }
    } catch (err) {
      onToast('Failed to connect to AI Oracle API', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const triggerSpoofedAttack = () => {
    const attackPayload = {
      projectType: 'Solar PV Microgrid',
      reportedTonnage: 4.5,
      outputKwh: 4800,
      hourOfDay: 2, // Midnight darkness (physical violation!)
      co2Ppm: 416,
      thermalCelsius: 86.5, // Extreme thermal discrepancy
      productionIndex: 0.95
    };
    setFormData(attackPayload);
    onToast('Injected Spoofed Vector: Solar Generation at 2:00 AM', 'info');
    handleVerify(attackPayload);
  };

  return (
    <div className="two-col-grid">
      {/* Telemetry Input Panel */}
      <div className="glass-panel-rich">
        <div className="panel-title-row">
          <div>
            <h2 className="panel-main-title">
              <Satellite className="text-emerald" size={22} />
              Satellite & IoT Sensory Telemetry Ingestion
            </h2>
            <div className="panel-sub-title">
              Simulates live environmental sensor telemetry for automated AI verification.
            </div>
          </div>
          <span className="badge-verified">ISO 14064-2 Compliant</span>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
          <div className="form-grid-2">
            <div className="input-field-group">
              <label className="input-label">Facility / Asset Type</label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="rich-input"
              >
                <option value="Solar PV Microgrid">Solar PV Microgrid (Adana Agro-Solar)</option>
                <option value="Offshore Wind Turbines">Offshore Wind Farm (Izmir Coastal)</option>
                <option value="Biomass Clean Energy">Biomass Generator (Bursa Clean Energy)</option>
                <option value="Industrial Decarbonization">Industrial Factory Scrubber</option>
              </select>
            </div>

            <div className="input-field-group">
              <label className="input-label">Claimed Offset (tCO2e)</label>
              <input
                type="number"
                name="reportedTonnage"
                value={formData.reportedTonnage}
                onChange={handleChange}
                step="0.1"
                min="0.1"
                required
                className="rich-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="input-field-group">
              <label className="input-label">Measured Clean Output (kWh)</label>
              <input
                type="number"
                name="outputKwh"
                value={formData.outputKwh}
                onChange={handleChange}
                step="50"
                required
                className="rich-input"
              />
            </div>

            <div className="input-field-group">
              <label className="input-label">Observation Hour (0–23 UTC)</label>
              <input
                type="number"
                name="hourOfDay"
                value={formData.hourOfDay}
                onChange={handleChange}
                min="0"
                max="23"
                required
                className="rich-input"
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="input-field-group">
              <label className="input-label">CO2 Concentration (ppm)</label>
              <input
                type="number"
                name="co2Ppm"
                value={formData.co2Ppm}
                onChange={handleChange}
                step="1"
                className="rich-input"
              />
            </div>

            <div className="input-field-group">
              <label className="input-label">Satellite Thermal IR (°C)</label>
              <input
                type="number"
                name="thermalCelsius"
                value={formData.thermalCelsius}
                onChange={handleChange}
                step="0.5"
                className="rich-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-emerald"
              style={{ flex: '1 1 200px' }}
            >
              <Cpu size={18} />
              {loading ? 'Auditing Telemetry...' : 'Run AI Oracle Audit'}
            </button>

            <button
              type="button"
              onClick={triggerSpoofedAttack}
              className="btn-cyber-gold"
              style={{ flex: '1 1 200px' }}
            >
              <ShieldAlert size={18} />
              Test Spoofed Cyber-Attack Vector
            </button>
          </div>
        </form>
      </div>

      {/* AI Oracle Verdict Box */}
      <div className="glass-panel-rich">
        <div className="panel-title-row">
          <div>
            <h2 className="panel-main-title">
              <Radio className="text-cyan" size={22} />
              AI Oracle Decision & Attestation Proof
            </h2>
            <div className="panel-sub-title">
              Isolation Forest Anomaly Classifier + Physical Law Guardrails
            </div>
          </div>
          {result && (
            <span className={result.is_valid ? 'badge-verified' : 'badge-threat'}>
              {result.is_valid ? 'Verified Genuine' : (result.verdict || 'Threat Intercepted')}
            </span>
          )}
        </div>

        {!result ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-dim)' }}>
            <div className="pulse-indicator" style={{ width: '36px', height: '36px', margin: '0 auto 1.5rem' }}></div>
            <p style={{ maxWidth: '380px', margin: '0 auto', fontSize: '0.92rem' }}>
              Submit sensory telemetry or click <b>"Test Spoofed Cyber-Attack Vector"</b> to view real-time ML anomaly detection and cryptographic attestation generation.
            </p>
          </div>
        ) : (
          <div className="attestation-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800 }} className={result.is_valid ? 'text-emerald' : 'text-danger'}>
                  {result.is_valid ? '✓ Verified Carbon Reduction' : '✕ Telemetry Rejected by Cyber Shield'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Protocol: ISO 14064-2 & UN COP 31 Standard
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Confidence Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }} className={result.confidence_score >= 0.7 ? 'text-emerald font-mono' : 'text-danger font-mono'}>
                  {(result.confidence_score * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div>
                <b>Verified Carbon Asset:</b>{' '}
                <span className="text-emerald font-mono" style={{ fontWeight: 700 }}>
                  {result.verified_tonnage.toFixed(2)} tCO2e
                </span>
              </div>
              <div>
                <b>Asset Category:</b> {result.project_type}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Cryptographic Oracle Attestation Hash (Required for Minting):
              </div>
              <div className="hash-tag">{result.attestation_hash}</div>
            </div>

            {result.anomalies && result.anomalies.length > 0 && (
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', borderLeft: '3px solid var(--danger-accent)', padding: '0.85rem', borderRadius: '6px', color: '#fca5a5', fontSize: '0.84rem' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <AlertTriangle size={15} /> Cyber-Security / Physical Law Flags:
                </div>
                <ul style={{ marginLeft: '1.25rem' }}>
                  {result.anomalies.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
