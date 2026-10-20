import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle } from 'lucide-react';

export default function CopilotView({ onToast }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `**Welcome to ClimateChain AI.** I am your autonomous climate policy auditor and microgrid optimizer, grounded in UN COP 31 standards and ISO 14064-2 protocols.\n\nYou can ask me about carbon offset verification, anti-double-counting guarantees, or P2P microgrid tariff balancing.`,
      source: 'ClimateChain AI Engine'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const presetQueries = [
    'How does ClimateChain prevent double-counting under Article 6?',
    'Explain how the AI Oracle detects spoofed IoT sensor telemetry.',
    'How does the dynamic tariff balance solar surplus with regional EV charging demand?'
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
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid var(--border-cyan)',
              color: 'var(--cyan-accent)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.35rem 0.85rem',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <HelpCircle size={12} /> {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="copilot-messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`msg-bubble ${m.sender}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {m.sender === 'bot' ? <Bot size={14} className="text-emerald" /> : <User size={14} className="text-cyan" />}
              <b>{m.sender === 'bot' ? 'ClimateChain AI Copilot' : 'You (Auditor)'}</b>
              {m.source && <span style={{ color: 'var(--text-dim)' }}>• {m.source}</span>}
            </div>
            <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="msg-bubble bot">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <div className="pulse-indicator" style={{ width: '8px', height: '8px' }}></div>
              <i>Reasoning over ISO 14064-2 protocols and grid telemetry...</i>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ClimateChain AI about carbon credits, P2P microgrids, or sensor audits..."
          className="rich-input"
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading} className="btn-emerald">
          <Send size={16} />
          Send
        </button>
      </form>
    </div>
  );
}
