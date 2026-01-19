import React, { useState } from 'react';
import { Search, TrendingUp, Package, DollarSign, Target, FileText, ChevronRight, Loader2, Download, Plus, Lightbulb, Zap, BookOpen, HelpCircle } from 'lucide-react';

function DemandFinderAI() {
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
      alert('Please fill in all fields to begin research');
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
          messages: [{ role: 'user', content: initialPrompt }],
        }),
      });

      const data = await response.json();
      
      console.log('API Response:', data);

      if (data.error) {
        alert('API Error: ' + JSON.stringify(data.error));
        setLoading(false);
        return;
      }

      if (!data.content) {
        alert('No content in response: ' + JSON.stringify(data));
        setLoading(false);
        return;
      }

      if (!Array.isArray(data.content)) {
        alert('Content is not an array: ' + JSON.stringify(data.content));
        setLoading(false);
        return;
      }

      const aiResponse = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      if (!aiResponse) {
        alert('No text found in response');
        setLoading(false);
        return;
      }

      setChatHistory([
        { role: 'user', content: `Analyzing: ${nicheData.niche}` },
        { role: 'assistant', content: aiResponse },
        { role: 'assistant', content: '\n✅ RESEARCH COMPLETE! Pick a niche/problem to build.' }
      ]);
    } catch (error) {
      console.error('Full error:', error);
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

    const buildKeywords = ['build', 'start with', 'work on', 'create', 'launch'];
    const wantsToBuild = buildKeywords.some(k => currentMessage.toLowerCase().includes(k));

    try {
      let prompt = currentMessage;
      
      if (wantsToBuild && !buildMode) {
        setBuildMode(true);
        prompt = `The user wants to build this: ${currentMessage}

Create a brief business blueprint with:
1. Product to create (3-5 bullet points)
2. Pricing strategy (1-2 tiers)
3. First 2 weeks action plan
4. Top 3 marketing channels
5. How to get first 5 customers

Keep it concise and actionable.`;
      }

      const response = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 4000,
          messages: [...newHistory.slice(0, -1), { role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      
      console.log('Send Message API Response:', data);

      if (data.error) {
        alert('API Error: ' + JSON.stringify(data.error));
        setLoading(false);
        return;
      }

      if (!data.content) {
        alert('No content in response: ' + JSON.stringify(data));
        setLoading(false);
        return;
      }

      if (!Array.isArray(data.content)) {
        alert('Content is not an array: ' + JSON.stringify(data.content));
        setLoading(false);
        return;
      }

      const aiResponse = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      if (!aiResponse) {
        alert('No text found in response');
        setLoading(false);
        return;
      }

      setChatHistory([...newHistory, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Full error:', error);
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
          <button onClick={handleLogin} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 text-lg">
            Access App →
          </button>
        </div>
      </div>
    );
  }

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
            <button onClick={() => setShowHelp(!showHelp)} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
              <HelpCircle className="w-4 h-4" />Help
            </button>
          </div>
        </div>
      </header>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">How to Use</h2>
                <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />Step 1: Define Your Niche
                </h3>
                <p className="text-gray-600">Enter your niche, target buyer, platform, and product type.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />Step 2: Review Results
                </h3>
                <p className="text-gray-600">Get sub-niches, problems, product ideas, and marketing plans.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />Step 3: Build It
                </h3>
                <p className="text-gray-600">Pick an opportunity and get a complete business blueprint.</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t">
              <button onClick={() => setShowHelp(false)} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <option value="Own Website">Own Website</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">4. Product type?</label>
                  <select value={nicheData.productType} onChange={(e) => setNicheData({...nicheData, productType: e.target.value})} className="w-full px-4 py-3 border rounded-lg">
                    <option value="">Select...</option>
                    <option value="Digital">📄 Digital Products</option>
                    <option value="Physical">📦 Physical Products</option>
                    <option value="AI Tools">🤖 AI Tools</option>
                    <option value="Automation">⚡ Automation</option>
                    <option value="All Types">✨ All Types</option>
                  </select>
                </div>

                <button
                  onClick={handleStartResearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 shadow-lg"
                >
                  {loading ? 'Finding Opportunities...' : 'Start Research →'}
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold mb-1">Real Problems</h3>
                <p className="text-sm text-gray-600">Find what customers complain about</p>
              </div>
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">AI & Automation</h3>
                <p className="text-sm text-gray-600">Smart tools opportunities</p>
              </div>
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Action Plan</h3>
                <p className="text-sm text-gray-600">SEO keywords & strategies</p>
              </div>
              <div className="bg-white p-4 rounded-lg border hover:shadow-md transition">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Profit Focused</h3>
                <p className="text-sm text-gray-600">Ranked by demand</p>
              </div>
            </div>
          </div>
        )}

        {step === 'research' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 border sticky top-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />Your Research
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Niche</span>
                    <p className="text-sm font-medium">{nicheData.niche}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Buyer</span>
                    <p className="text-sm">{nicheData.buyer}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Platform</span>
                    <p className="text-sm">{nicheData.platform}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Focus</span>
                    <p className="text-sm">{nicheData.productType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg border flex flex-col" style={{height: '75vh'}}>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-3xl rounded-lg p-4 ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-50 border'}`}>
                        <div className={`text-xs font-semibold mb-2 ${msg.role === 'user' ? 'text-indigo-100' : 'text-gray-500'}`}>
                          {msg.role === 'user' ? 'YOU' : '🤖 AI'}
                        </div>
                        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 border rounded-lg p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        <span className="text-sm">Analyzing...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t p-4 bg-gray-50">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask anything..."
                      className="flex-1 px-4 py-3 border rounded-lg"
                      disabled={loading}
                    />
                    <button onClick={handleSendMessage} disabled={loading} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-semibold">
                      Send
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setCurrentMessage("I want to build the top opportunity")} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm hover:from-green-700 hover:to-emerald-700 font-semibold">
                      🚀 Build This
                    </button>
                    <button onClick={() => setCurrentMessage("Go deeper on the top sub-niche")} className="px-3 py-1.5 bg-white border text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                      🔍 Go Deeper
                    </button>
                    <button onClick={() => setCurrentMessage("Create AI tool outline")} className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 rounded-lg text-sm hover:bg-purple-50">
                      🤖 AI Tool
                    </button>
                    <button onClick={() => setCurrentMessage("Suggest automation workflows")} className="px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm hover:bg-blue-50">
                      ⚡ Automation
                    </button>
                    <button onClick={() => setCurrentMessage("What tech stack do I need?")} className="px-3 py-1.5 bg-white border border-indigo-300 text-indigo-700 rounded-lg text-sm hover:bg-indigo-50">
                      🛠️ Tech Stack
                    </button>
                    <button onClick={() => setCurrentMessage("Write listing copy")} className="px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-lg text-sm hover:bg-green-50">
                      ✍️ Listing
                    </button>
                    <button onClick={() => setCurrentMessage("Create 30-day launch plan")} className="px-3 py-1.5 bg-white border border-orange-300 text-orange-700 rounded-lg text-sm hover:bg-orange-50">
                      📅 Launch
                    </button>
                    <button onClick={() => setCurrentMessage("Give me marketing strategies")} className="px-3 py-1.5 bg-white border border-pink-300 text-pink-700 rounded-lg text-sm hover:bg-pink-50">
                      📢 Marketing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DemandFinderAI;
