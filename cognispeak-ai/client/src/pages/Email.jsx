import { useState, useEffect } from 'react';
import { PenTool, CheckCircle2, XCircle, Send, AlertTriangle } from 'lucide-react';

const Email = () => {
  const [phase, setPhase] = useState('setup'); // setup, writing, results
  const [scenario, setScenario] = useState('');
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const wordCount = emailText.trim() === '' ? 0 : emailText.trim().split(/\s+/).length;
  const isWordCountValid = wordCount >= 50 && wordCount <= 150;

  const startWriting = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email/scenario');
      const data = await res.json();
      if (data.success) {
        setScenario(data.data.text);
        setEmailText('');
        setPhase('writing');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const submitEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenario,
          emailText 
        })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setPhase('results');
      } else {
        alert(data.message || 'Submission failed.');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (phase === 'setup') {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-8 text-center animate-in fade-in">
        <header>
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <PenTool className="text-[hsl(var(--primary))]" size={36} />
            Email Writing
          </h1>
          <p className="opacity-70 text-lg max-w-2xl mx-auto">
            You will be given a professional scenario. Draft an appropriate email response between 50 and 150 words.
          </p>
        </header>

        <div className="p-12 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-2xl shadow-sm">
          <button 
            onClick={startWriting}
            disabled={loading}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
          >
            {loading ? 'Loading Scenario...' : 'Start Writing Module'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'writing') {
    return (
      <div className="max-w-4xl mx-auto flex flex-col h-[80vh]">
        <header className="mb-6 flex justify-between items-end">
          <div className="flex-1 mr-8">
            <h1 className="text-xl font-bold mb-2">Scenario:</h1>
            <p className="text-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] p-4 rounded-lg font-medium">
              "{scenario}"
            </p>
          </div>
          <button 
            onClick={submitEmail}
            disabled={loading || !isWordCountValid}
            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send size={18} />
            {loading ? 'Evaluating...' : 'Submit Email'}
          </button>
        </header>

        <div className="flex-1 flex flex-col border border-[hsl(var(--foreground))/10] rounded-xl overflow-hidden shadow-sm bg-[hsl(var(--card))] focus-within:ring-2 focus-within:ring-[hsl(var(--primary))] transition-all">
          <div className="flex justify-between items-center bg-[hsl(var(--foreground))/5] px-4 py-2 border-b border-[hsl(var(--foreground))/10]">
            <div className="text-sm font-semibold opacity-70">Compose Email</div>
            <div className={`text-sm font-bold flex items-center gap-2 ${isWordCountValid ? 'text-green-500' : 'text-red-500'}`}>
              {wordCount} / 150 words
              {!isWordCountValid && <AlertTriangle size={14} />}
            </div>
          </div>
          <textarea 
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Type your email here..."
            className="flex-1 p-6 bg-transparent resize-none outline-none text-lg custom-scrollbar leading-relaxed"
          />
        </div>
        {!isWordCountValid && (
          <p className="text-red-500 text-sm mt-2 text-right font-medium">
            * Word count must be between 50 and 150 words.
          </p>
        )}
      </div>
    );
  }

  if (phase === 'results' && result) {
    const ai = result.aiRubric;
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-in slide-in-from-bottom-4">
        <header className="text-center bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-12 rounded-2xl relative overflow-hidden">
          <h1 className="text-3xl font-bold mb-2">AI Evaluation Complete!</h1>
          <div className="text-6xl font-black text-[hsl(var(--primary))] my-6">{ai.overallScore}/100</div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[hsl(var(--foreground))/10]">
            <div>
              <div className="text-xs uppercase font-bold opacity-50 mb-1">Word Count</div>
              <div className="font-medium text-lg">{result.wordCount}</div>
            </div>
            <div>
              <div className="text-xs uppercase font-bold opacity-50 mb-1">Tone</div>
              <div className="font-medium text-lg capitalize">{ai.tone}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs uppercase font-bold opacity-50 mb-1">Grammar Errors</div>
              <div className={`font-medium text-lg ${ai.grammarIssues?.length === 0 ? 'text-green-500' : 'text-red-500'}`}>
                {ai.grammarIssues?.length || 0} issues found
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-6">
          <div className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl shadow-sm">
            <h3 className="font-semibold text-xl mb-2 text-[hsl(var(--primary))]">Format & Structure</h3>
            <p className="text-[hsl(var(--foreground))/80] leading-relaxed">{ai.format}</p>
          </div>

          <div className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl shadow-sm">
            <h3 className="font-semibold text-xl mb-2 text-[hsl(var(--primary))]">Scenario Relevance</h3>
            <p className="text-[hsl(var(--foreground))/80] leading-relaxed">{ai.relevance}</p>
          </div>

          <div className="p-6 bg-[hsl(var(--card))] border border-red-500/20 rounded-xl shadow-sm">
            <h3 className="font-semibold text-xl mb-4 text-red-500 flex items-center gap-2">
              <XCircle /> Grammar Issues
            </h3>
            {ai.grammarIssues?.length > 0 ? (
              <ul className="list-disc list-inside space-y-2 text-[hsl(var(--foreground))/80]">
                {ai.grammarIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-green-500 font-medium flex items-center gap-2">
                <CheckCircle2 /> Perfect grammar!
              </p>
            )}
          </div>
        </section>

        <div className="text-center pb-12">
          <button 
            onClick={() => setPhase('setup')}
            className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Write Another Email
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Email;
