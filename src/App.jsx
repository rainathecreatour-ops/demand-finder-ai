import React, { useState } from 'react';
import { Search, TrendingUp, Loader2, Download, Plus } from 'lucide-react';

function DemandFinderAI() {
  const [step, setStep] = useState('intake');
  const [loading, setLoading] = useState(false);
  const [nicheData, setNicheData] = useState({ niche: '', buyer: '', platform: '', productType: '' });
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleStartResearch = async () => {
    if (!nicheData.niche) {
      alert('Please enter a niche');
      return;
    }
    setLoading(true);
    setStep('research');
    
    try {
      const response = await fetch('/.netlify/functions/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          max_tokens: 4000,
          messages: [{ role: 'user', content: `Analyze this niche: ${nicheData.niche}. Buyer: ${nicheData.buyer}. Platform: ${nicheData.platform}. Type: ${nicheData.productType}` }]
        }),
      });

      const data = await response.json();
      const aiResponse = data.content.filter(item => item.type === 'text').map(item => item.text).join('\n');

      setChatHistory([
        { role: 'user', content: `Niche: ${nicheData.niche}` },
        { role: 'assistant', content: aiResponse }
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Demand Finder AI</h1>
        
        {step === 'intake' && (
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="space-y-4">
              <input
                type="text"
                value={nicheData.niche}
                onChange={(e) => setNicheData({...nicheData, niche: e.target.value})}
                placeholder="Enter your niche..."
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="text"
                value={nicheData.buyer}
                onChange={(e) => setNicheData({...nicheData, buyer: e.target.value})}
                placeholder="Target buyer..."
                className="w-full px-4 py-3 border rounded-lg"
              />
              <select 
                value={nicheData.platform} 
                onChange={(e) => setNicheData({...nicheData, platform: e.target.value})} 
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">Select platform...</option>
                <option value="Etsy">Etsy</option>
                <option value="Amazon">Amazon</option>
                <option value="Shopify">Shopify</option>
                <option value="Gumroad">Gumroad</option>
              </select>
              <select 
                value={nicheData.productType} 
                onChange={(e) => setNicheData({...nicheData, productType: e.target.value})} 
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">Product type...</option>
                <option value="Digital">Digital</option>
                <option value="Physical">Physical</option>
                <option value="AI Tools">AI Tools</option>
                <option value="All">All Types</option>
              </select>
              <button 
                onClick={handleStartResearch} 
                disabled={loading} 
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Start Research'}
              </button>
            </div>
          </div>
        )}

        {step === 'research' && (
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="space-y-4 mb-6">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`p-4 rounded ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-gray-50'}`}>
                  <div className="text-xs font-semibold mb-2">{msg.role === 'user' ? 'YOU' : 'AI'}</div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
              {loading && <div className="text-center">Analyzing...</div>}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 px-4 py-3 border rounded-lg"
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>

            <button 
              onClick={() => setStep('intake')} 
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              New Research
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DemandFinderAI;
