import React, { useState } from 'react';
import { Leaf, Flame, ShieldCheck, Lock, Award, FileCheck, Printer, CheckCircle2, X, ExternalLink, QrCode } from 'lucide-react';

export default function CarbonRegistryView({ creditsData, onRefresh, onToast, currentIdentity = '0xEnterprise_Amazon' }) {
  const [mintForm, setMintForm] = useState({
    projectName: 'Izmir Aegean Coastal Wind Energy Project',
    projectType: 'Wind Energy Clean Displacement',
    co2Tonnage: 120.0,
    recipientAddress: currentIdentity,
    vintageYear: 2026
  });

  const [retireForm, setRetireForm] = useState({
    certificateId: '',
    retireeAddress: currentIdentity,
    reason: 'Scope 1 & Scope 2 Decarbonization for AI Compute Data Center'
  });

  const [minting, setMinting] = useState(false);
  const [retiring, setRetiring] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null); // For ESG Modal

  const activeCredits = creditsData?.active_credits || [];
  const retiredCredits = creditsData?.retired_credits || [];
  const allCredits = [...activeCredits, ...retiredCredits];

  const handleMint = async (e) => {
    e.preventDefault();
    setMinting(true);
    try {
      const res = await fetch('/api/carbon-credits/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: mintForm.projectName,
          project_type: mintForm.projectType,
          co2_tonnage: parseFloat(mintForm.co2Tonnage),
          recipient_address: mintForm.recipientAddress || currentIdentity,
          vintage_year: parseInt(mintForm.vintageYear),
          oracle_confidence: 0.95
        })
      });
      const data = await res.json();
      if (!res.ok) {
        onToast(data.detail || 'Minting rejected', 'danger');
        return;
      }

      onToast(`🌱 Minted Certificate ${data.certificate_id} in Block #${data.block_index}!`, 'success');
      onRefresh();
    } catch (err) {
      onToast('Failed to mint carbon credit', 'danger');
    } finally {
      setMinting(false);
    }
  };

  const handleRetire = async (e) => {
    e.preventDefault();
    if (!retireForm.certificateId) {
      onToast('Please select a certificate to retire', 'danger');
      return;
    }
    setRetiring(true);
    try {
      const res = await fetch('/api/carbon-credits/retire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificate_id: retireForm.certificateId,
          retiree_address: retireForm.retireeAddress || currentIdentity,
          reason: retireForm.reason
        })
      });
      const data = await res.json();
      if (!res.ok) {
        onToast(data.detail || 'Retirement rejected', 'danger');
        return;
      }

      onToast(`🔥 Certificate ${retireForm.certificateId} Permanently Locked & Retired!`, 'success');
      onRefresh();

      // Automatically open the official ESG certificate
      const retiredItem = data.proof_of_retirement || {
        certificate_id: retireForm.certificateId,
        retiree_address: retireForm.retireeAddress,
        reason: retireForm.reason,
        co2_tonnage: 120.0,
        project_name: 'Verified Clean Project',
        burn_address: '0x0000000000000000000000000000000000000000',
        block_index: data.block_index
      };
      setSelectedCertificate(retiredItem);
    } catch (err) {
      onToast('Failed to retire certificate', 'danger');
    } finally {
      setRetiring(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="two-col-grid">
        {/* Mint Studio */}
        <div className="glass-panel-rich">
          <div className="panel-title-row">
            <div>
              <h2 className="panel-main-title">
                <Leaf className="text-emerald" size={22} />
                Mint Verified Carbon Asset
              </h2>
              <div className="panel-sub-title">
                Issues multi-vintage tokens backed by cryptographic AI MRV attestation hash.
              </div>
            </div>
            <span className="badge-verified">ERC-1155 Compatible</span>
          </div>

          <form onSubmit={handleMint}>
            <div className="input-field-group">
              <label className="input-label">Project / Facility Name</label>
              <input
                type="text"
                value={mintForm.projectName}
                onChange={(e) => setMintForm({ ...mintForm, projectName: e.target.value })}
                required
                className="rich-input"
              />
            </div>

            <div className="form-grid-2">
              <div className="input-field-group">
                <label className="input-label">Asset Category</label>
                <input
                  type="text"
                  value={mintForm.projectType}
                  onChange={(e) => setMintForm({ ...mintForm, projectType: e.target.value })}
                  required
                  className="rich-input"
                />
              </div>

              <div className="input-field-group">
                <label className="input-label">Offset Tonnage (tCO2e)</label>
                <input
                  type="number"
                  value={mintForm.co2Tonnage}
                  onChange={(e) => setMintForm({ ...mintForm, co2Tonnage: e.target.value })}
                  step="0.5"
                  min="0.5"
                  required
                  className="rich-input"
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="input-field-group">
                <label className="input-label">Developer / Beneficiary Address</label>
                <input
                  type="text"
                  value={mintForm.recipientAddress}
                  onChange={(e) => setMintForm({ ...mintForm, recipientAddress: e.target.value })}
                  required
                  className="rich-input"
                />
              </div>

              <div className="input-field-group">
                <label className="input-label">Vintage Year</label>
                <input
                  type="number"
                  value={mintForm.vintageYear}
                  onChange={(e) => setMintForm({ ...mintForm, vintageYear: e.target.value })}
                  required
                  className="rich-input"
                />
              </div>
            </div>

            <button type="submit" disabled={minting} className="btn-emerald btn-w-full" style={{ marginTop: '0.5rem' }}>
              <FileCheck size={18} />
              {minting ? 'Minting On-Chain Asset...' : 'Mint Immutable Carbon Certificate'}
            </button>
          </form>
        </div>

        {/* Anti-Double-Counting Retirement Terminal */}
        <div className="glass-panel-rich">
          <div className="panel-title-row">
            <div>
              <h2 className="panel-main-title">
                <Flame className="text-gold" size={22} />
                Permanent Retirement & Proof-of-Burn
              </h2>
              <div className="panel-sub-title">
                Burn certificate to claim emissions offset. Locks token permanently against double-counting.
              </div>
            </div>
            <span className="badge-locked">
              <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Zero Double-Counting
            </span>
          </div>

          <form onSubmit={handleRetire}>
            <div className="input-field-group">
              <label className="input-label">Select Active Carbon Certificate</label>
              <select
                value={retireForm.certificateId}
                onChange={(e) => setRetireForm({ ...retireForm, certificateId: e.target.value })}
                required
                className="rich-input"
              >
                <option value="">-- Choose active unretired certificate --</option>
                {activeCredits.filter(c => !c.retired).map(c => (
                  <option key={c.certificate_id} value={c.certificate_id}>
                    {c.certificate_id} — {c.project_name} ({c.co2_tonnage} tCO2e)
                  </option>
                ))}
              </select>
            </div>

            <div className="input-field-group">
              <label className="input-label">Retiring Organization / Address</label>
              <input
                type="text"
                value={retireForm.retireeAddress}
                onChange={(e) => setRetireForm({ ...retireForm, retireeAddress: e.target.value })}
                required
                className="rich-input"
              />
            </div>

            <div className="input-field-group">
              <label className="input-label">Public Audit Retirement Statement</label>
              <input
                type="text"
                value={retireForm.reason}
                onChange={(e) => setRetireForm({ ...retireForm, reason: e.target.value })}
                required
                className="rich-input"
              />
            </div>

            <button type="submit" disabled={retiring} className="btn-crimson-burn btn-w-full" style={{ marginTop: '0.5rem' }}>
              <Flame size={18} />
              {retiring ? 'Burning & Locking Token...' : 'Burn & Permanently Lock Certificate'}
            </button>
          </form>
        </div>
      </div>

      {/* Full Certificate Registry Table */}
      <div className="glass-panel-rich">
        <div className="panel-title-row">
          <div>
            <h2 className="panel-main-title">
              <Award className="text-emerald" size={22} />
              On-Chain Carbon Certificate Directory
            </h2>
            <div className="panel-sub-title">
              Complete audit ledger tracking all active, transferred, and retired certificates.
            </div>
          </div>
          <span className="hud-chip font-mono">{allCredits.length} Certificates Registered</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="rich-table">
            <thead>
              <tr>
                <th>Certificate ID</th>
                <th>Project Name</th>
                <th>Tonnage</th>
                <th>Vintage</th>
                <th>Current Owner</th>
                <th>Status</th>
                <th>Proof of Retirement</th>
              </tr>
            </thead>
            <tbody>
              {allCredits.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                    No carbon credit certificates issued yet.
                  </td>
                </tr>
              ) : (
                allCredits.map(c => (
                  <tr key={c.certificate_id}>
                    <td><b className="text-cyan font-mono">{c.certificate_id}</b></td>
                    <td>{c.project_name}</td>
                    <td><b className="text-emerald font-mono">{c.co2_tonnage} tCO2e</b></td>
                    <td>{c.vintage_year}</td>
                    <td><span className="font-mono" style={{ fontSize: '0.8rem' }}>{c.owner ? c.owner.slice(0, 16) + '...' : '0x0'}</span></td>
                    <td>
                      {c.retired ? (
                        <span className="badge-locked">🔥 RETIRED (BURNED)</span>
                      ) : (
                        <span className="badge-verified">✓ ACTIVE</span>
                      )}
                    </td>
                    <td>
                      {c.retired ? (
                        <button
                          onClick={() => setSelectedCertificate(c)}
                          className="btn-cyber-gold"
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem' }}
                        >
                          📜 View ESG Certificate
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>Available for Trading</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Cryptographic Certificate of Retirement Modal */}
      {selectedCertificate && (
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
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #071811, #040d09)',
              border: '2px solid var(--emerald-primary)',
              boxShadow: '0 0 50px rgba(16, 185, 129, 0.4), inset 0 0 30px rgba(16, 185, 129, 0.08)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '680px',
              width: '100%',
              padding: '2.5rem',
              color: 'var(--text-main)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCertificate(null)}
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

            {/* Certificate Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald-primary)', padding: '0.35rem 1rem', borderRadius: 'var(--radius-pill)', color: 'var(--emerald-light)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
                <CheckCircle2 size={14} /> Official Proof of Decarbonization
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                CRYPTOGRAPHIC CERTIFICATE OF CARBON RETIREMENT
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Issued via ClimateChain Decentralized Autonomous Ledger • IEEE ClimateChain 2026
              </div>
            </div>

            {/* Certificate Details Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Certificate Serial ID</div>
                  <div className="font-mono text-cyan" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    {selectedCertificate.certificate_id}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Offset Volume</div>
                  <div className="font-mono text-emerald" style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    {selectedCertificate.co2_tonnage} tCO2e
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Retiring Beneficiary</div>
                  <div className="font-mono" style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    {selectedCertificate.retiree_address || selectedCertificate.owner || 'Amazon AI Compute Hub'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Compliance Standards</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--emerald-light)' }}>
                    ISO 14064-2 & Paris Agreement Art. 6
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Audit Justification Statement</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: 'rgba(0, 0, 0, 0.4)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  "{selectedCertificate.reason || 'Scope 1 & Scope 2 Decarbonization for AI Compute Data Center'}"
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Permanent Burn Contract (Double-Counting Lock)</div>
                <div className="hash-tag font-mono" style={{ color: 'var(--gold-accent)' }}>
                  0x0000000000000000000000000000000000000000 (Immutable Null Sink)
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Cryptographic Proof Hash</div>
                <div className="hash-tag font-mono">
                  {selectedCertificate.proof_of_retirement_hash || '0xPROOF_7f3b890a21ce45d9e8712390847291a4'}
                </div>
              </div>
            </div>

            {/* Certificate Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Timestamped on-chain in Block #{selectedCertificate.block_index || 'Genesis'}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="btn-emerald"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                >
                  <Printer size={15} /> Print / Export PDF
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedCertificate, null, 2));
                    onToast('Cryptographic JSON Proof Copied to Clipboard!', 'success');
                  }}
                  className="btn-cyber-gold"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                >
                  Copy Proof Hash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
