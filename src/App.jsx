import React, { useState } from 'react';
import { Search, TrendingUp, Package, DollarSign, Target, FileText, ChevronRight, Loader2, Download, Plus, Lightbulb, Zap, BookOpen, HelpCircle } from 'lucide-react';

function DemandFinderAI() {
  // ALL useState calls MUST be at the top, before any returns or conditions
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [step, setStep] = useState('intake');
  const [loading, setLoading] = useState(false);
  const [nicheData, setNicheData] = useState({
    niche: '',
    buyer: '',
    platform: '',
    productType: ''
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [buildMode, setBuildMode] = useState(false);

  const nicheExamples = [
    "Productivity tools for remote workers",
    "Pet accessories for anxious dogs",
    "Meal planning for busy parents",
    "Fitness tracking for seniors",
    "Budget management for college students"
  ];

  const handleLogin = () => {
    if (passwordInput === 'PREMIUM2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid access code!');
    }
  };

  const handleStartResearch = async () => {
    if (!nicheData.niche || !nicheData.buyer || !nicheData.platform || !nicheData.productType) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setStep('research');
    
    const initialPrompt = `You are Demand Finder AI. Analyze this niche:

Niche: ${nicheData.niche}
Buyer: ${nicheData.buyer}
Platform: ${nicheData.platform}
Product Type: ${nicheData.productType}

Provide: A) Summary B) Sub-niches C) Problems D) Solutions E) Recommendation F) Marketing G) Next Steps`;

    try {
      const response = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 4000,
          messages: [{ role: 'user', content: initialPrompt }]
        }),
      });

      const data = await response.json();
      const aiResponse = data.content.filter(item => item.type === 'text').map(item => item.text).join('\n');

      setChatHistory([
        { role: 'user', content: `Analyzing: ${nicheData.niche}` },
        { role: 'assistant', content: aiResponse },
        { role: 'assistant', content: '\n✅ RESEARCH COMPLETE! Pick a niche/problem to build.' }
      ]);
    } catch (error) {
      alert('Error: ' + error.message);
    }
    
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user', content: currentMessage }];
    setChatHistory(newHistory);
    setCurrentMessage('');
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 4000,
          messages: newHistory
        }),
      });

      const data = await response.json();
      const aiResponse = data.content.filter(item => item.type === 'text').map(item => item.text).join('\n');

      setChatHistory([...newHistory, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      alert('Error: ' + error.message);
    }

    setLoading(false);
  };

  const handleExport = () => {
    const report = chatHistory.map(m => `${m.role === 'user' ? 'YOU' : 'AI'}:\n${m.content}\n`).join('\n---\n');
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demand-finder-${Date.now()}.txt`;
    a.click();
  };

  const handleReset = () => {
    setStep('intake');
    setNicheData({ niche: '', buyer: '', platform: '', productType: '' });
    setChatHistory([]);
  };

  // LOGIN SCREEN - Now after all hooks
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🔐 Demand Finder AI</h1>
            <p className="text-gray-600">Enter your access code</p>
          </div>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Access code"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-500 focus:outline-none text-lg"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 text-lg"
          >
            Access App →
          </button>
        </div>
      </div>
    );
  }

  // MAIN APP - After login
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Demand Finder AI</h1>
              <p className="text-sm text-gray-600">Find profitable products</p>
            </div>
          </div>
          <div className="flex gap-2">
            {step === 'research' && (
              <>
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Download className="w-4 h-4" />Export
                </button>
                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  <Plus className="w-4 h-4" />New
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {step === 'intake' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Find Your Next Product Idea</h2>
                <p className="text-gray-600">Answer 4 quick questions</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">1. What niche?</label>
                  <input
                    type="text"
                    value={nicheData.niche}
                    onChange={(e) => setNicheData({...nicheData, niche: e.target.value})}
                    placeholder="e.g., productivity tools for remote workers"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {nicheExamples.map((ex, i) => (
                      <button key={i} onClick={() => setNicheData({...nicheData, niche: ex})} className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-indigo-100">
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">2. Target buyer?</label>
                  <input
                    type="text"
                    value={nicheData.buyer}
                    onChange={(e) => setNicheData({...nicheData, buyer: e.target.value})}
                    placeholder="e.g., 25-40 year old freelancers"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">3. Where to sell?</label>
                  <select value={nicheData.platform} onChange={(e) => setNicheData({...nicheData, platform: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                    <option value="">Select...</option>
                    <option value="Etsy">Etsy</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Gumroad">Gumroad</option>
