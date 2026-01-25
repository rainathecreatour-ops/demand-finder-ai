import React, { useState } from 'react';
import { Search, TrendingUp, Package, DollarSign, Target, FileText, Loader2, Download, Plus, Lightbulb, Zap, HelpCircle } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [step, setStep] = useState('intake');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const [nicheData, setNicheData] = useState({
    niche: '',
    buyer: '',
    platform: '',
    customPlatform: '',
    productType: ''
  });

  const handleLogin = () => {
    if (passwordInput === 'PREMIUM2024') setIsAuthenticated(true);
    else alert('Invalid access code');
  };

  const handleStartResearch = async () => {
    if (!nicheData.niche || !nicheData.buyer || !nicheData.platform || !nicheData.productType) {
      alert('Fill in all fields');
      return;
    }

    setLoading(true);
    setStep('research');

    const platform =
      nicheData.platform === 'Other' ? nicheData.customPlatform : nicheData.platform;

    const prompt = `
Analyze this niche briefly:
Niche: ${nicheData.niche}
Buyer: ${nicheData.buyer}
Platform: ${platform}
Type: ${nicheData.productType}

Give me:
A) 3 sub-niches
B) Top 3 problems
C) 3 product ideas
D) 1 marketing tip
`;

    try {
      const res = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      const text = data.content
        .filter(i => i.type === 'text')
        .map(i => i.text)
        .join('\n');

      setChatHistory([
        { role: 'user', content: nicheData.niche },
        { role: 'assistant', content: text }
      ]);
    } catch (err) {
      alert('Error talking to AI');
      setStep('intake');
    }

    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 40 }}>
        <h2>🔐 Demand Finder AI</h2>
        <input
          type="password"
          placeholder="Access code"
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
        />
        <button onClick={handleLogin}>Enter</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Demand Finder AI</h1>

      {step === 'intake' && (
        <>
          <input placeholder="Niche" onChange={e => setNicheData({ ...nicheData, niche: e.target.value })} />
          <input placeholder="Buyer" onChange={e => setNicheData({ ...nicheData, buyer: e.target.value })} />
          <input placeholder="Platform" onChange={e => setNicheData({ ...nicheData, platform: e.target.value })} />
          <input placeholder="Product Type" onChange={e => setNicheData({ ...nicheData, productType: e.target.value })} />
          <button onClick={handleStartResearch}>Start</button>
        </>
      )}

      {step === 'research' && (
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {chatHistory.map((m, i) => `${m.role.toUpperCase()}:\n${m.content}\n\n`)}
        </pre>
      )}
    </div>
  );
}
