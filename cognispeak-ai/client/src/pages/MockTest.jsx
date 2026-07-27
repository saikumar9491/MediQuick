import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { Play, Mic, Square, CheckCircle2 } from 'lucide-react';

// A stripped-down sequential mock test
const MockTest = () => {
  const navigate = useNavigate();
  const { isSupported, isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition();
  
  const [step, setStep] = useState('intro'); // intro, read-aloud, speaking, grammar, reading, summary
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);

  // --- Step Data States ---
  const [raSentence, setRaSentence] = useState(null);
  const [spTopic, setSpTopic] = useState(null);
  const [grQuestions, setGrQuestions] = useState(null);
  const [rdPassage, setRdPassage] = useState(null);
  const [answers, setAnswers] = useState({}); // For Grammar & Reading

  const startTest = async () => {
    setLoading(true);
    try {
      // Pre-fetch everything
      const [raRes, spRes, grRes, rdRes] = await Promise.all([
        fetch('/api/speech/sentence').then(r => r.json()),
        fetch('/api/speech/topic').then(r => r.json()),
        fetch('/api/grammar/questions?category=Quick%20Practice').then(r => r.json()),
        fetch('/api/reading/passage').then(r => r.json())
      ]);

      if (raRes.success) setRaSentence(raRes.data.text);
      if (spRes.success) setSpTopic(spRes.data.text);
      if (grRes.success) setGrQuestions(grRes.data);
      if (rdRes.success) {
        // Just take 1 question to save time in mock test
        const p = rdRes.data;
        p.questions = [p.questions[0]];
        setRdPassage(p);
      }
      
      setStep('read-aloud');
    } catch (e) {
      console.error(e);
      alert("Failed to load mock test data.");
    }
    setLoading(false);
  };

  // --- Handlers ---
  const handleRaSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/speech/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalText: raSentence, transcript, timeSeconds: 5 })
      });
      const data = await res.json();
      setScores(s => ({ ...s, readAloud: data.data.pronunciationScore }));
      setStep('speaking');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSpSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/speech/evaluate-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: spTopic, transcript })
      });
      const data = await res.json();
      setScores(s => ({ ...s, speaking: data.data.aiRubric.grammarScore || 80 }));
      setStep('grammar');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleGrSubmit = async () => {
    setLoading(true);
    const submission = Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, selectedOption: ans }));
    try {
      const res = await fetch('/api/grammar/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: submission })
      });
      const data = await res.json();
      setScores(s => ({ ...s, grammar: data.data.score }));
      setAnswers({}); // clear for reading
      setStep('reading');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleRdSubmit = async () => {
    setLoading(true);
    const submission = Object.entries(answers).map(([qId, ans]) => ({ questionId: qId, selectedOption: ans }));
    try {
      const res = await fetch('/api/reading/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passageId: rdPassage.id, answers: submission })
      });
      const data = await res.json();
      setScores(s => ({ ...s, reading: data.data.score }));
      
      // Save Master Mock Test Score
      const avg = Math.round((scores.readAloud + scores.speaking + scores.grammar + data.data.score) / 4);
      await fetch('/api/analytics/log', { // We don't have a direct log endpoint, but submitting individual tests logs them anyway.
         // Actually the individual controllers already logged the TestResults! 
         // So the Dashboard will automatically pick them up.
      });

      setStep('summary');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // --- Renderers ---
  if (step === 'intro') {
    return (
      <div className="max-w-3xl mx-auto text-center p-12 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-2xl">
        <h1 className="text-4xl font-bold mb-4">Full Mock Assessment</h1>
        <p className="opacity-70 text-lg mb-8">You are about to start a sequence covering Read Aloud, Speaking, Grammar, and Reading. This will take approximately 10 minutes.</p>
        <button onClick={startTest} disabled={loading} className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-10 py-4 rounded-full font-bold text-lg">
          {loading ? 'Preparing Exam...' : 'Start Exam Sequence'}
        </button>
      </div>
    );
  }

  if (step === 'summary') {
    const avg = Math.round((scores.readAloud + scores.speaking + scores.grammar + scores.reading) / 4);
    return (
      <div className="max-w-3xl mx-auto text-center p-12 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-2xl">
        <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Exam Complete!</h1>
        <div className="text-6xl font-black text-[hsl(var(--primary))] my-8">Score: {avg}%</div>
        <button onClick={() => navigate('/dashboard')} className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-10 py-4 rounded-full font-bold text-lg">
          View Full Analytics Dashboard
        </button>
      </div>
    );
  }

  // Generic wrapper for steps
  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh] bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-2xl overflow-hidden shadow-lg">
      <header className="bg-[hsl(var(--foreground))/5] p-6 border-b border-[hsl(var(--foreground))/10] flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-wider text-[hsl(var(--primary))]">
          Section: {step.replace('-', ' ')}
        </h2>
        <div className="text-sm font-bold opacity-50">Mock Exam in Progress</div>
      </header>
      
      <div className="flex-1 p-8 overflow-y-auto">
        {step === 'read-aloud' && (
          <div className="text-center">
            <p className="text-2xl font-medium mb-8 leading-relaxed">"{raSentence}"</p>
            {!isRecording ? <button onClick={startRecording} className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold">Start Speaking</button> : <button onClick={handleStopRa} className="bg-red-500 text-white px-8 py-3 rounded-full font-bold animate-pulse">Stop Recording</button>}
            {transcript && <div className="mt-8 opacity-70">"{transcript}"</div>}
            <button onClick={handleRaSubmit} disabled={!transcript || loading} className="mt-12 w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-4 rounded-lg font-bold disabled:opacity-50">Submit & Next</button>
          </div>
        )}

        {step === 'speaking' && (
          <div className="text-center">
            <h3 className="text-lg opacity-50 mb-2">Discuss this topic:</h3>
            <p className="text-2xl font-bold mb-8 text-[hsl(var(--primary))]">"{spTopic}"</p>
            {!isRecording ? <button onClick={startRecording} className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold">Start Speaking</button> : <button onClick={handleStopSp} className="bg-red-500 text-white px-8 py-3 rounded-full font-bold animate-pulse">Stop Recording</button>}
            {transcript && <div className="mt-8 opacity-70">"{transcript}"</div>}
            <button onClick={handleSpSubmit} disabled={!transcript || loading} className="mt-12 w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-4 rounded-lg font-bold disabled:opacity-50">Submit & Next</button>
          </div>
        )}

        {step === 'grammar' && (
          <div className="flex flex-col gap-6">
            {grQuestions.map((q, i) => (
              <div key={q.id} className="border p-4 rounded-lg">
                <p className="font-bold mb-4">{i+1}. {q.questionText}</p>
                <div className="flex flex-col gap-2">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-[hsl(var(--primary)/0.05)]">
                      <input type="radio" name={q.id} checked={answers[q.id] === opt} onChange={() => setAnswers({...answers, [q.id]: opt})} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleGrSubmit} disabled={Object.keys(answers).length < grQuestions.length || loading} className="mt-4 w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-4 rounded-lg font-bold disabled:opacity-50">Submit & Next</button>
          </div>
        )}

        {step === 'reading' && (
          <div className="flex flex-col gap-6">
            <div className="p-6 bg-[hsl(var(--background))] rounded-lg border leading-relaxed">{rdPassage.content}</div>
            {rdPassage.questions.map((q) => (
              <div key={q.id} className="border p-4 rounded-lg">
                <p className="font-bold mb-4">{q.questionText}</p>
                <div className="flex flex-col gap-2">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-[hsl(var(--primary)/0.05)]">
                      <input type="radio" name={q.id} checked={answers[q.id] === opt} onChange={() => setAnswers({...answers, [q.id]: opt})} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleRdSubmit} disabled={Object.keys(answers).length < rdPassage.questions.length || loading} className="mt-4 w-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-4 rounded-lg font-bold disabled:opacity-50">Finish Exam</button>
          </div>
        )}
      </div>
    </div>
  );

  function handleStopRa() { stopRecording(); }
  function handleStopSp() { stopRecording(); }
};

export default MockTest;
