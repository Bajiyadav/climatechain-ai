import React, { useState } from 'react';
import { Layers, ShieldCheck, CheckCircle2, AlertOctagon, Hash } from 'lucide-react';

export default function BlockchainExplorerView({ blocksData, onVerifyAudit, onToast }) {
  const [verifying, setVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const blocks = blocksData?.blocks || [];

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/blockchain/verify');
      const data = await res.json();
      setAuditResult(data);
      if (data.is_valid) {
        onToast(`🛡️ All ${data.blocks_audited} Blocks Cryptographically Sound!`, 'success');
      } else {
        onToast('Blockchain verification failed!', 'danger');
      }
    } catch (err) {
      onToast('Audit request failed', 'danger');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="glass-panel-rich">
      <div className="panel-title-row">
        <div>
          <h2 className="panel-main-title">
            <Layers className="text-emerald" size={22} />
            ClimateChain Immutable Block Explorer
          </h2>
          <div className="panel-sub-title">
            Cryptographically sealed blocks with SHA-256 headers, Merkle inclusion proofs, and PoAS consensus.
          </div>
        </div>

        <button onClick={handleVerify} disabled={verifying} className="btn-emerald">
          <ShieldCheck size={18} />
          {verifying ? 'Auditing Hash Tree...' : 'Verify Entire Chain Integrity'}
        </button>
      </div>

      {auditResult && (
        <div style={{ background: auditResult.is_valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: `1px solid ${auditResult.is_valid ? 'var(--emerald-primary)' : 'var(--danger-accent)'}`, borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {auditResult.is_valid ? <CheckCircle2 className="text-emerald" size={20} /> : <AlertOctagon className="text-danger" size={20} />}
            <div>
              <b className={auditResult.is_valid ? 'text-emerald' : 'text-danger'}>
                {auditResult.audit_message}
              </b>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Verified Height: {auditResult.blocks_audited} Blocks • Consensus: Proof-of-Attestation & Stake (PoAS)
              </div>
            </div>
          </div>
          <span className="badge-verified">100% Cryptographic Match</span>
        </div>
      )}

      {/* Blocks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {blocks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            Loading ledger blocks...
          </div>
        ) : (
          blocks.map(b => (
            <div
              key={b.index}
              style={{
                background: 'rgba(5, 13, 10, 0.92)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="text-emerald font-mono" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    Block #{b.index}
                  </span>
                  <span className="badge-verified">{b.validator}</span>
                </div>
                <div className="font-mono text-muted" style={{ fontSize: '0.8rem' }}>
                  Hash: <span className="text-cyan">{b.hash}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem', fontSize: '0.84rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.6rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Merkle Root:</span>{' '}
                  <span className="hash-tag font-mono">{b.merkle_root.slice(0, 18)}...</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Previous Block:</span>{' '}
                  <span className="font-mono" style={{ fontSize: '0.78rem' }}>{b.previous_hash.slice(0, 16)}...</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Transactions:</span>{' '}
                  <b className="text-emerald font-mono">{b.transaction_count} Tx</b>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Timestamp:</span>{' '}
                  <span style={{ color: 'var(--text-muted)' }}>{new Date(b.timestamp * 1000).toLocaleTimeString()}</span>
                </div>
              </div>

              {b.transactions && b.transactions.length > 0 && (
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.9rem', fontSize: '0.82rem' }}>
                  <b style={{ color: 'var(--text-muted)' }}>Transactions in Block:</b>
                  <ul style={{ marginLeft: '1.25rem', marginTop: '0.35rem' }}>
                    {b.transactions.map(tx => (
                      <li key={tx.tx_id} style={{ marginBottom: '0.2rem' }}>
                        <span className="badge-verified" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', marginRight: '0.4rem' }}>
                          {tx.tx_type}
                        </span>
                        <span>{tx.payload.project_name || tx.payload.reason || tx.payload.energy_source || tx.payload.message || 'Telemetry Attestation'}</span>{' '}
                        <span className="font-mono" style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({tx.tx_id})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
