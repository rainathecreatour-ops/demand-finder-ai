import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Package,
  DollarSign,
  Target,
  FileText,
  Loader2,
  Download,
  Plus,
  Lightbulb,
  Zap,
  HelpCircle,
} from 'lucide-react';

function App() {
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
    productType: '',
  });

  const nicheExamples = [
    'Productivity tools for remote workers',
    'Pet accessories for anxious dogs',
    'Meal planning for busy parents',
    'Fitness tracking for seniors',
    'Budget management for college students',
  ];

  const handleLogin = () => {
    if (passwordInput === 'PREMIUM2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid access code');
    }
  };

  const handleStartResearch = async () => {
    if (
      !nicheData.niche ||
      !nicheData.buyer ||
      !nicheData.platform ||
      (nicheData.platform === 'Other' && !nicheData.customPlatform) ||
      !nicheData.productType
    ) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setStep('research');

    const platform =
      nicheData.platform === 'Other'
        ? nicheData.customPlatform
        : nicheData.platform;

    const prompt = `Analyze this niche briefly:
Niche: ${nicheData.niche}
Buyer: ${nicheData.buyer}
Platform: ${platform}
Type: ${nicheData.productType}

Give me:
A) 3 sub-niches
B) Top 3 problems
C) 3 product ideas
D) 1 marketing tip`;

    try {
      const res = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      const output = data.content
        ?.filter((c) => c.type === 'text')
        .map((c) => c.text)
        .join('\n');

      setChatHistory([
        { role: 'user', content: `Analyze: ${nicheData.niche}` },
        { role: 'assistant', content: output || 'No response returned.' },
      ]);
    } catch (err) {
      alert(err.message);
      setStep('intake');
    }

    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const updated = [...chatHistory, { role: 'user', content: currentMessage }];
    setChatHistory(updated);
    setCurrentMessage('');
    setLoading(true);

    try {
      const res = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated.slice(-10) }),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      const reply = data.content
        ?.filter((c) => c.type === 'text')
        .map((c) => c.text)
        .join('\n');

      setChatHistory([...updated, { role: 'assistant', content: reply }]);
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setStep('intake');
    setChatHistory([]);
    setNicheData({
      niche: '',
      buyer: '',
      platform: '',
      customPlatform: '',
      productType: '',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="bg-white p-8 rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">🔐 Demand Finder AI</h1>
          <input
            type="password"
            className="w-full border p-3 rounded mb-4"
            placeholder="Access code"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-3 rounded font-semibold"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {step === 'intake' && (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">Find Product Demand</h2>

          <input
            className="w-full border p-3 rounded mb-4"
            placeholder="Niche"
            value={nicheData.niche}
            onChange={(e) =>
              setNicheData({ ...nicheData, niche: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded mb-4"
            placeholder="Buyer"
            value={nicheData.buyer}
            onChange={(e) =>
              setNicheData({ ...nicheData, buyer: e.target.value })
            }
          />

          <select
            className="w-full border p-3 rounded mb-4"
            value={nicheData.platform}
            onChange={(e) =>
              setNicheData({
                ...nicheData,
                platform: e.target.value,
                customPlatform: '',
              })
            }
          >
            <option value="">Select platform</option>
            <option>Etsy</option>
            <option>Amazon</option>
            <option>Shopify</option>
            <option>Gumroad</option>
            <option>Fiverr</option>
            <option>Upwork</option>
            <option>LinkedIn</option>
            <option>Own Website</option>
            <option>Other</option>
          </select>

          {nicheData.platform === 'Other' && (
            <input
              className="w-full border p-3 rounded mb-4"
              placeholder="Custom platform"
              value={nicheData.customPlatform}
              onChange={(e) =>
                setNicheData({
                  ...nicheData,
                  customPlatform: e.target.value,
                })
              }
            />
          )}

          <select
            className="w-full border p-3 rounded mb-6"
            value={nicheData.productType}
            onChange={(e) =>
              setNicheData({ ...nicheData, productType: e.target.value })
            }
          >
            <option value="">Product type</option>
            <option>Digital</option>
            <option>Physical</option>
            <option>AI Tool</option>
            <option>Automation</option>
          </select>

          <button
            onClick={handleStartResearch}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded font-semibold"
          >
            {loading ? 'Analyzing…' : 'Start Research'}
          </button>
        </div>
      )}

      {step === 'research' && (
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
          <div className="space-y-4 mb-4">
            {chatHistory.map((m, i) => (
              <div key={i}>
                <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong>
                <pre className="whitespace-pre-wrap">{m.content}</pre>
              </div>
            ))}
            {loading && <Loader2 className="animate-spin" />}
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 border p-3 rounded"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask a follow-up…"
            />
            <button
              onClick={handleSendMessage}
              className="bg-indigo-600 text-white px-4 rounded"
            >
              Send
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-300 px-4 rounded"
            >
              New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
