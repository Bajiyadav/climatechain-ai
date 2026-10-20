import React, { useState } from 'react';
import { Leaf, Flame, ShieldCheck, Lock, Award, FileCheck } from 'lucide-react';

export default function CarbonRegistryView({ creditsData, onRefresh, onToast }) {
  const [mintForm, setMintForm] = useState({
    projectName: 'Izmir Aegean Coastal Wind Energy Project',
    projectType: 'Wind Energy Clean Displacement',
    co2Tonnage: 120.0,
    recipientAddress: '0xProsumer_WindMicrogrid_Izmir',
    vintageYear: 2026
  });

  const [retireForm, setRetireForm] = useState({
    certificateId: '',
    retireeAddress: '0xEnterprise_Amazon',
    reason: 'Scope 1 & Scope 2 Decarbonization for AI Compute Data Center'
  });

  const [minting, setMinting] = useState(false);
  const [retiring, setRetiring] = useState(false);

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
          recipient_address: mintForm.recipientAddress,
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
          retiree_address: retireForm.retireeAddress,
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
                        <span className="hash-tag font-mono">{(c.proof_of_retirement_hash || '0xHASH').slice(0, 20)}...</span>
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
    </div>
  );
}
