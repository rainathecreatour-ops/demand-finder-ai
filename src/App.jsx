import React, { useState } from 'react';
import { Search, TrendingUp, Package, DollarSign, Target, FileText, ChevronRight, Loader2, Download, Plus, Lightbulb, Zap, BookOpen, HelpCircle } from 'lucide-react';

function DemandFinderAI() {
  🚀 TURN ANY NICHE INTO PROFITABLE PRODUCTS WITH AI

Demand Finder AI uses advanced AI to analyze markets and find real customer problems you can solve for profit.

✅ WHAT YOU GET:
- AI-powered niche analyzer
- Real customer pain points (with urgency scores)
- Digital, physical, AI & automation product ideas
- Complete business blueprints
- 30-day launch plans
- SEO keywords & marketing strategies

💡 PERFECT FOR:
- Entrepreneurs looking for their next product idea
- E-commerce sellers (Etsy, Amazon, Shopify)
- Digital product creators
- Anyone wanting validated ideas before investing

⚡ HOW IT WORKS:
1. Enter your niche
2. AI finds real problems people will pay to solve
3. Get ranked product ideas
4. Receive a complete business blueprint
5. Launch with confidence!

🔒 INSTANT ACCESS - Get your link and password immediately
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

  const handleStartResearch = async () => {
    if (!nicheData.niche || !nicheData.buyer || !nicheData.platform || !nicheData.productType) {
      alert('Please fill in all fields to begin research');
      return;
    }

    setLoading(true);
    setStep('research');
    
    const initialPrompt = `You are Demand Finder AI. I need you to analyze this niche:

Niche: ${nicheData.niche}
Buyer: ${nicheData.buyer}
Platform: ${nicheData.platform}
Product Type Preference: ${nicheData.productType}

Please provide a complete niche analysis following this structure:

A) NICHE INTAKE SUMMARY
Summarize the niche, audience, and goals in 2-3 sentences.

B) SUB-NICHE MAP (5-8 sub-niches)
List 5-8 focused sub-niches within this market.

C) PROBLEM LIBRARY (Top 3 sub-niches only)
For each of the top 3 sub-niches, list 5-7 problems people face with urgency scores.

D) PRODUCT SOLUTIONS (Top 5 problems only)
Suggest solutions across digital products, physical products, AI Tools, and automation.

E) MY RECOMMENDATION
Pick the #1 best opportunity and explain why.

F) MARKETING PLAN
Include SEO keywords, platforms, and positioning.

G) NEXT STEPS
Offer 3 clear next actions.

Keep everything simple, clear, and actionable.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [
            { role: 'user', content: initialPrompt }
          ],
        }),
      });

      const data = await response.json();
      const aiResponse = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      setChatHistory([
        { role: 'user', content: `Analyzing: ${nicheData.niche}` },
        { role: 'assistant', content: aiResponse },
        { role: 'assistant', content: `\n\n✅ RESEARCH COMPLETE!\n\nWhich opportunity excites you most? Pick a niche/problem and I'll create your complete business blueprint!` }
      ]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate research. Please try again.');
    }
    
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newHistory = [
      ...chatHistory,
      { role: 'user', content: currentMessage }
    ];

    setChatHistory(newHistory);
    setCurrentMessage('');
    setLoading(true);

    const buildKeywords = ['build', 'start with', 'work on', 'create', 'launch', 'i want to'];
    const wantsToBuild = buildKeywords.some(keyword => currentMessage.toLowerCase().includes(keyword));

    try {
      let prompt = currentMessage;
      if (wantsToBuild && !buildMode) {
        setBuildMode(true);
        prompt = `Create a COMPLETE BUSINESS BLUEPRINT with: Product Creation Plan, Business Structure, 30-Day Launch Strategy, Marketing Roadmap, Customer Acquisition, Scaling Plan, Tools & Resources, and Weekly Checklist. User selected: ${currentMessage}`;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [...newHistory.slice(0, -1), { role: 'user', content: prompt }],
        }),
      });

      const data = await response.json();
      const aiResponse = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');

      setChatHistory([
        ...newHistory,
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again.');
    }

    setLoading(false);
  };

  const handleExport = () => {
    const fullReport = chatHistory
      .map(msg => `${msg.role === 'user' ? 'YOU' : 'DEMAND FINDER AI'}:\n${msg.content}\n\n`)
      .join('---\n\n');
    
    const blob = new Blob([fullReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demand-finder-${nicheData.niche.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
  };

  const handleReset = () => {
    setStep('intake');
    setNicheData({ niche: '', buyer: '', platform: '', productType: '' });
    setChatHistory([]);
  };

  const useExample = (example) => {
    setNicheData({...nicheData, niche: example});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demand Finder AI</h1>
              <p className="text-sm text-gray-600">Find profitable products in any niche</p>
            </div>
          </div>
          <div className="flex gap-2">
            {step === 'research' && (
              <>
                <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                  <Plus className="w-4 h-4" />
                  New Research
                </button>
              </>
            )}
            <button onClick={() => setShowHelp(!showHelp)} className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition">
              <HelpCircle className="w-4 h-4" />
              Help
            </button>
          </div>
        </div>
      </header>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">How to Use Demand Finder AI</h2>
                <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Step 1: Define Your Niche
                </h3>
                <p className="text-gray-600">Tell us what market you want to explore. Be specific but not too narrow.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Step 2: Describe Your Buyer
                </h3>
                <p className="text-gray-600">Who will buy this? Include age, role, or situation.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-500" />
                  Step 3: Choose Product Types
                </h3>
                <p className="text-gray-600">Select from digital products, physical products, AI tools, or automation.</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button onClick={() => setShowHelp(false)} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Got it! Let's start
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {step === 'intake' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Product Idea</h2>
                <p className="text-gray-600">Answer 4 quick questions to discover profitable opportunities</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                    <span>1. What niche do you want to explore?</span>
                    <span className="text-xs font-normal text-indigo-600 cursor-pointer" onClick={() => setShowHelp(true)}>See examples</span>
                  </label>
                  <input
                    type="text"
                    value={nicheData.niche}
                    onChange={(e) => setNicheData({...nicheData, niche: e.target.value})}
                    placeholder="e.g., productivity tools for remote workers"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {nicheExamples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => useExample(example)}
                        className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    2. Who is your target buyer?
                  </label>
                  <input
                    type="text"
                    value={nicheData.buyer}
                    onChange={(e) => setNicheData({...nicheData, buyer: e.target.value})}
                    placeholder="e.g., 25-40 year old freelancers working from home"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">Include age, role, or situation</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    3. Where do you want to sell?
                  </label>
                  <select
                    value={nicheData.platform}
                    onChange={(e) => setNicheData({...nicheData, platform: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select a platform...</option>
                    <option value="Etsy">Etsy</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Gumroad">Gumroad</option>
                    <option value="Own Website">Own Website</option>
                    <option value="Multiple Platforms">Multiple Platforms</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    4. What type of products interest you?
                  </label>
                  <select
                    value={nicheData.productType}
                    onChange={(e) => setNicheData({...nicheData, productType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select preference...</option>
                    <option value="Digital">📄 Digital Products (eBooks, templates, courses)</option>
                    <option value="Physical">📦 Physical Products (tangible goods)</option>
                    <option value="AI Tools">🤖 AI Tools (AI-powered apps & services)</option>
                    <option value="Automation">⚡ Automation (workflows, bots, integrations)</option>
                    <option value="AI + Automation">🚀 AI Tools + Automation Combined</option>
                    <option value="All Types">✨ All Types (show me everything!)</option>
                  </select>
                </div>

                <button
                  onClick={handleStartResearch}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Finding Opportunities...
                    </>
                  ) : (
                    <>
                      Start Research
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Real Problems</h3>
                <p className="text-sm text-gray-600">Find what customers actually complain about</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AI & Automation</h3>
                <p className="text-sm text-gray-600">Discover opportunities for smart tools</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Clear Action Plan</h3>
                <p className="text-sm text-gray-600">Get SEO keywords and launch strategies</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Profit Focused</h3>
                <p className="text-sm text-gray-600">Ranked by urgency and willingness to pay</p>
              </div>
            </div>
          </div>
        )}

        {step === 'research' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Your Research
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Niche</span>
                    <p className="text-sm text-gray-900 font-medium">{nicheData.niche}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Buyer</span>
                    <p className="text-sm text-gray-900">{nicheData.buyer}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Platform</span>
                    <p className="text-sm text-gray-900">{nicheData.platform}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Focus</span>
                    <p className="text-sm text-gray-900">{nicheData.productType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col" style={{height: '75vh'}}>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-3xl rounded-lg p-4 ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                          : 'bg-gray-50 text-gray-900 border border-gray-200'
                      }`}>
                        <div className={`text-xs font-semibold mb-2 ${msg.role === 'user' ? 'text-indigo-100' : 'text-gray-500'}`}>
                          {msg.role === 'user' ? 'YOU' : '🤖 DEMAND FINDER AI'}
                        </div>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        <span className="text-sm text-gray-600">Analyzing market data...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask anything..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={loading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || !currentMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      Send
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setCurrentMessage("I want to build the top opportunity - give me the complete business blueprint")}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm hover:from-green-700 hover:to-emerald-700 transition font-semibold"
                    >
                      🚀 Build This Business
                    </button>
                    <button
                      onClick={() => setCurrentMessage("Go deeper on the top sub-niche")}
                      className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
                    >
                      🔍 Go Deeper
                    </button>
                    <button
                      onClick={() => setCurrentMessage("Create AI tool outline")}
                      className="px-3 py-1.5 bg-white border border-purple-300 text-purple-700 rounded-lg text-sm hover:bg-purple-50 transition"
                    >
                      🤖 AI Tool
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
