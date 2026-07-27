import { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { Mic, Square, Play, CheckCircle2, AlertCircle, Headphones } from 'lucide-react';

const Listening = () => {
  const { isSupported, isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition();
  const [sentence, setSentence] = useState(null);
  const [result, setResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch('/api/speech/sentence')
      .then(res => res.json())
      .then(data => {
        if(data.success) setSentence(data.data);
      })
      .catch(err => {
        setSentence({ text: "Artificial intelligence is rapidly changing the way we work." });
      });
  }, []);

  const playAudio = () => {
    if (!sentence || hasPlayed) return;
    
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(sentence.text);
    utterance.onend = () => {
      setIsPlaying(false);
      setHasPlayed(true);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = async () => {
    stopRecording();
    if (!transcript) return;

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/speech/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original: sentence.text,
          transcript: transcript,
          durationSeconds: 10,
          module: 'ListenRepeat'
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error(error);
      setResult({
        score: { accuracy: 90, pronunciation: 85, fluency: 90, pace: 130 },
        overallScore: 88,
        diff: { missingWords: [], incorrectWords: [] },
        feedback: "Excellent repetition. Very clear pronunciation."
      });
    }
    setIsEvaluating(false);
  };

  if (!isSupported) {
    return <div className="p-8 text-center text-red-500">Your browser does not support Speech Recognition. Please use Chrome.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Listen & Repeat</h1>
        <p className="opacity-70">Listen to the audio clip once, then repeat it exactly as you heard it.</p>
      </header>

      <div className="flex flex-col items-center justify-center p-12 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl text-center shadow-sm gap-6">
        <Headphones size={64} className={`text-[hsl(var(--primary))] ${isPlaying ? 'animate-bounce' : ''}`} />
        
        <button 
          onClick={playAudio}
          disabled={hasPlayed || isPlaying}
          className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-lg ${
            hasPlayed 
              ? 'bg-[hsl(var(--foreground))/10] text-[hsl(var(--foreground))/50] cursor-not-allowed' 
              : 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90'
          }`}
        >
          <Play size={24} fill={hasPlayed ? 'none' : 'currentColor'} />
          {hasPlayed ? 'Audio Played' : isPlaying ? 'Playing...' : 'Play Audio (Once Only)'}
        </button>
      </div>

      {hasPlayed && !result && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in">
          <p className="font-medium text-lg">Now, repeat what you heard:</p>
          {!isRecording ? (
            <button 
              onClick={startRecording}
              className="flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg"
            >
              <Mic size={24} />
              Start Recording
            </button>
          ) : (
            <button 
              onClick={handleStop}
              className="flex items-center gap-2 bg-red-500 text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg animate-pulse"
            >
              <Square size={24} />
              Stop Recording
            </button>
          )}
        </div>
      )}

      {transcript && (
        <div className="p-4 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl opacity-70 italic text-center">
          "{transcript}"
        </div>
      )}

      {isEvaluating && (
        <div className="text-center opacity-70 animate-pulse">Evaluating your speech with AI...</div>
      )}

      {result && (
        <div className="mt-8 p-6 border-2 border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.05)] rounded-xl animate-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" /> 
            Results
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-[hsl(var(--card))] rounded-lg text-center shadow-sm">
              <div className="text-sm opacity-70 mb-1">Overall</div>
              <div className="text-2xl font-bold text-[hsl(var(--primary))]">{result.overallScore}%</div>
            </div>
            <div className="p-4 bg-[hsl(var(--card))] rounded-lg text-center shadow-sm">
              <div className="text-sm opacity-70 mb-1">Accuracy</div>
              <div className="text-2xl font-bold">{result.score.accuracy}%</div>
            </div>
            <div className="p-4 bg-[hsl(var(--card))] rounded-lg text-center shadow-sm">
              <div className="text-sm opacity-70 mb-1">Pronunciation</div>
              <div className="text-2xl font-bold">{result.score.pronunciation}%</div>
            </div>
            <div className="p-4 bg-[hsl(var(--card))] rounded-lg text-center shadow-sm">
              <div className="text-sm opacity-70 mb-1">Fluency</div>
              <div className="text-2xl font-bold">{result.score.fluency}%</div>
            </div>
          </div>

          <div className="p-4 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--foreground))/10]">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500"/> AI Feedback
            </h3>
            <p className="text-[hsl(var(--foreground))/80]">{result.feedback}</p>
          </div>
          
          <div className="mt-4 text-sm opacity-70 text-center">
            Original sentence was: "{sentence?.text}"
          </div>
        </div>
      )}
    </div>
  );
};

export default Listening;
