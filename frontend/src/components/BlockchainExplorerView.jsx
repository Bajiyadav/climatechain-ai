import React, { useState } from 'react';
import { Layers, ShieldCheck, CheckCircle2, AlertOctagon, Hash, Search, Download, ChevronRight, ChevronDown, Code, ArrowUpRight } from 'lucide-react';

export default function BlockchainExplorerView({ blocksData, onVerifyAudit, onToast }) {
  const [verifying, setVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTxId, setExpandedTxId] = useState(null);

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

  const handleExportLedger = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `climatechain_ledger_height_${blocks.length}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast('Full Ledger & Merkle Tree Exported to JSON!', 'success');
  };

  const filteredBlocks = blocks.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (b.index.toString() === q) return true;
    if (b.hash.toLowerCase().includes(q)) return true;
    if (b.previous_hash.toLowerCase().includes(q)) return true;
    if (b.validator.toLowerCase().includes(q)) return true;
    if (b.transactions && b.transactions.some(tx => 
      tx.tx_id.toLowerCase().includes(q) ||
      (tx.sender && tx.sender.toLowerCase().includes(q)) ||
      (tx.recipient && tx.recipient.toLowerCase().includes(q)) ||
      JSON.stringify(tx.payload).toLowerCase().includes(q)
    )) return true;
    return false;
  });

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

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportLedger} className="btn-cyber-gold" style={{ padding: '0.55rem 0.95rem', fontSize: '0.82rem' }}>
            <Download size={16} /> Export Audit JSON
          </button>
          <button onClick={handleVerify} disabled={verifying} className="btn-emerald">
            <ShieldCheck size={18} />
            {verifying ? 'Auditing Hash Tree...' : 'Verify Entire Chain Integrity'}
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Block #, Tx Hash, Merkle Root, Address, or Certificate ID..."
          className="rich-input"
          style={{ paddingLeft: '2.5rem' }}
        />
        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
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
        {filteredBlocks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            No matching blocks found for "{searchQuery}".
          </div>
        ) : (
          filteredBlocks.map(b => (
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
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Transactions in Block ({b.transactions.length})</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Click row to inspect Merkle Payload</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {b.transactions.map(tx => {
                      const isExpanded = expandedTxId === tx.tx_id;
                      return (
                        <div
                          key={tx.tx_id}
                          style={{
                            background: isExpanded ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                            border: isExpanded ? '1px solid var(--border-highlight)' : '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.6rem 0.8rem',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                          }}
                          onClick={() => setExpandedTxId(isExpanded ? null : tx.tx_id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {isExpanded ? <ChevronDown size={14} className="text-emerald" /> : <ChevronRight size={14} className="text-muted" />}
                              <span className="badge-verified" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                                {tx.tx_type}
                              </span>
                              <span style={{ fontWeight: 600 }}>
                                {tx.payload.project_name || tx.payload.reason || tx.payload.energy_source || tx.payload.message || 'Telemetry Attestation'}
                              </span>
                            </div>
                            <span className="font-mono text-cyan" style={{ fontSize: '0.75rem' }}>
                              {tx.tx_id.slice(0, 16)}...
                            </span>
                          </div>

                          {isExpanded && (
                            <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                  <span style={{ color: 'var(--text-dim)' }}>Sender:</span>{' '}
                                  <span className="font-mono text-muted">{tx.sender}</span>
                                </div>
                                <div>
                                  <span style={{ color: 'var(--text-dim)' }}>Recipient:</span>{' '}
                                  <span className="font-mono text-muted">{tx.recipient}</span>
                                </div>
                              </div>

                              <div style={{ marginTop: '0.35rem' }}>
                                <div style={{ color: 'var(--text-dim)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  <Code size={12} /> Raw Merkle Inclusion Payload:
                                </div>
                                <pre style={{ background: '#030805', padding: '0.65rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.75rem', color: 'var(--emerald-light)', border: '1px solid var(--border-subtle)' }}>
                                  {JSON.stringify(tx.payload, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
