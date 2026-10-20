import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, Copy, Check } from 'lucide-react';

export default function CopilotView({ onToast }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `**Welcome to ClimateChain AI.** I am your autonomous climate policy auditor, smart grid engineer, and carbon market optimizer, grounded in UN COP 31 standards and ISO 14064-2 protocols.\n\nYou can ask me about carbon offset verification, anti-double-counting guarantees, Isolation Forest cyber anomaly detection, or P2P microgrid tariff balancing.`,
      source: 'ClimateChain AI Engine'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const presetQueries = [
    'How does ClimateChain prevent double-counting under Article 6?',
    'Explain how the AI Oracle detects spoofed IoT sensor telemetry.',
    'How does the dynamic tariff balance solar surplus with regional EV charging demand?',
    'What are the security mechanisms in P2PEnergyMarket.sol?',
    'How does ClimateChain fulfill IEEE Hackathon Track 1 & 2 criteria?'
  ];

  const handleSend = async (queryText = input) => {
    const textToSend = queryText.trim();
    if (!textToSend) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });
      const data = await res.json();
      const botMsg = {
        sender: 'bot',
        text: data.answer || 'No response received.',
        source: data.source || 'AI Engine'
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Error connecting to Climate Copilot service.', source: 'System' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    if (onToast) onToast('Response copied to clipboard!', 'info');
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const renderFormattedText = (rawText) => {
    // Quick, clean formatting for markdown bold and paragraphs
    return rawText.split('\n\n').map((paragraph, pIdx) => {
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={pIdx} style={{ marginBottom: pIdx < rawText.split('\n\n').length - 1 ? '0.75rem' : 0, lineHeight: 1.6 }}>
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={idx} style={{ color: 'var(--emerald-light)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="glass-panel-rich copilot-layout">
      <div className="panel-title-row">
        <div>
          <h2 className="panel-main-title">
            <Bot className="text-emerald" size={24} />
            Autonomous Climate Copilot Intelligence Agent
          </h2>
          <div className="panel-sub-title">
            Powered by Google Gemini 2.5 Flash for Climate Policy, MRV verification & Grid Optimization.
          </div>
        </div>
        <span className="badge-verified">
          <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} />
          Gemini 2.5 Flash
        </span>
      </div>

      {/* Preset prompt pills */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid var(--border-cyan)',
              color: 'var(--cyan-accent)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.4rem 0.9rem',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.22)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'}
          >
            <HelpCircle size={12} /> {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="copilot-messages" style={{ minHeight: '380px' }}>
        {messages.map((m, idx) => (
          <div key={idx} className={`msg-bubble ${m.sender}`} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.45rem', marginBottom: '0.45rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {m.sender === 'bot' ? <Bot size={14} className="text-emerald" /> : <User size={14} className="text-cyan" />}
                <span style={{ fontWeight: 600 }}>{m.sender === 'bot' ? (m.source || 'ClimateChain AI') : 'You (Web3 Node)'}</span>
              </div>

              {m.sender === 'bot' && (
                <button
                  onClick={() => copyToClipboard(m.text, idx)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedIdx === idx ? 'var(--emerald-light)' : 'var(--text-dim)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.72rem'
                  }}
                  title="Copy Response"
                >
                  {copiedIdx === idx ? <Check size={13} /> : <Copy size={13} />}
                  {copiedIdx === idx ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
              {renderFormattedText(m.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="msg-bubble bot" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <Bot size={16} className="text-emerald animate-pulse" />
            <span>Analyzing climate knowledge graph & smart grid states with Gemini 2.5 Flash...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="copilot-input-row" style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot about carbon auditing, double counting, P2P microgrid math, or IEEE standards..."
          className="rich-input"
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-emerald"
          style={{ padding: '0.75rem 1.4rem' }}
        >
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
}
