import { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { Mic, Square, CheckCircle2, XCircle, ChevronRight, Zap } from 'lucide-react';

const Vocabulary = () => {
  const { isSupported, isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition();
  
  const [phase, setPhase] = useState('setup'); // setup, active, results
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]); // Array of { wordId, isCorrect, transcript }
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const startChallenge = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vocab/daily');
      const data = await res.json();
      if (data.success) {
        setWords(data.data);
        setCurrentIndex(0);
        setResults([]);
        setPhase('active');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const currentWord = words[currentIndex];

  const handleStop = async () => {
    stopRecording();
    if (!transcript) return;

    setEvaluating(true);
    try {
      const res = await fetch('/api/vocab/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          wordId: currentWord.id,
          transcript: transcript 
        })
      });
      const data = await res.json();
      if (data.success) {
        const newResults = [...results, { 
          word: currentWord.word, 
          isCorrect: data.data.isCorrect, 
          transcript: data.data.transcript 
        }];
        setResults(newResults);

        if (currentIndex < words.length - 1) {
          setTimeout(() => setCurrentIndex(prev => prev + 1), 1500); // brief pause to see result before moving on
        } else {
          setTimeout(() => setPhase('results'), 1500);
        }
      }
    } catch (error) {
      console.error(error);
    }
    setEvaluating(false);
  };

  // If user just spoke, find if we have a result for the current index
  const currentResult = results.length > currentIndex ? results[currentIndex] : null;

  if (!isSupported) {
    return <div className="p-8 text-center text-red-500">Your browser does not support Speech Recognition. Please use Chrome.</div>;
  }

  if (phase === 'setup') {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-8 text-center animate-in fade-in">
        <header>
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Zap className="text-[hsl(var(--primary))]" size={36} />
            Daily Challenge
          </h1>
          <p className="opacity-70 text-lg max-w-2xl mx-auto">
            Test your pronunciation on 5 difficult vocabulary words. Speak clearly!
          </p>
        </header>

        <div className="p-12 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-2xl shadow-sm">
          <button 
            onClick={startChallenge}
            disabled={loading}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
          >
            {loading ? 'Loading Words...' : 'Start Daily Challenge'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'active' && currentWord) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8 h-[70vh] justify-center">
        <div className="text-sm font-bold opacity-50 uppercase tracking-widest">
          Word {currentIndex + 1} of {words.length}
        </div>
        
        <div className="w-full bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-3xl p-12 text-center shadow-lg relative overflow-hidden transition-all duration-300">
          
          {/* Overlay Result State */}
          {currentResult && (
            <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center animate-in fade-in ${currentResult.isCorrect ? 'bg-green-500/90' : 'bg-red-500/90'} text-white`}>
              {currentResult.isCorrect ? <CheckCircle2 size={64} className="mb-4" /> : <XCircle size={64} className="mb-4" />}
              <h2 className="text-3xl font-bold mb-2">{currentResult.isCorrect ? 'Perfect!' : 'Not Quite'}</h2>
              <p className="opacity-90">You said: "{currentResult.transcript}"</p>
            </div>
          )}

          <h2 className="text-5xl font-black mb-4 text-[hsl(var(--primary))] tracking-tight">{currentWord.word}</h2>
          <p className="text-xl opacity-60 font-mono mb-6">{currentWord.phonetic}</p>
          <p className="text-lg opacity-80 max-w-md mx-auto">{currentWord.definition}</p>
        </div>

        <div className="flex flex-col items-center gap-4 w-full mt-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={evaluating || currentResult}
              className="flex items-center gap-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-10 py-5 rounded-full font-bold text-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:shadow-none w-full max-w-sm justify-center"
            >
              <Mic size={28} />
              Hold to Speak
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-3 bg-red-500 text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-red-600 transition-all shadow-lg animate-pulse w-full max-w-sm justify-center"
            >
              <Square size={28} />
              Stop Recording
            </button>
          )}

          {transcript && isRecording && (
            <p className="opacity-70 italic">Listening: "{transcript}"</p>
          )}
          {evaluating && (
            <p className="opacity-70 animate-pulse text-[hsl(var(--primary))] font-semibold">Evaluating pronunciation...</p>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const correctCount = results.filter(r => r.isCorrect).length;
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-in slide-in-from-bottom-4">
        <header className="text-center bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-12 rounded-2xl relative overflow-hidden">
          <h1 className="text-3xl font-bold mb-2">Challenge Complete!</h1>
          <div className="text-6xl font-black text-[hsl(var(--primary))] my-6">{correctCount}/{words.length}</div>
          <p className="opacity-70 text-lg">Words pronounced correctly.</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Summary</h2>
          {results.map((res, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${res.isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <div className="flex items-center gap-4">
                {res.isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                <span className="text-xl font-bold">{res.word}</span>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-50 uppercase font-bold">You said</div>
                <div className="font-medium italic">"{res.transcript}"</div>
              </div>
            </div>
          ))}
        </section>

        <div className="text-center pb-12 mt-8">
          <button 
            onClick={() => setPhase('setup')}
            className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Vocabulary;
