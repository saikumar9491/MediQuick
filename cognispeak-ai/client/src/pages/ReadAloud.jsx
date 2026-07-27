import { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { Mic, Square, Play, CheckCircle2, AlertCircle } from 'lucide-react';

const ReadAloud = () => {
  const { isSupported, isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition();
  const [sentence, setSentence] = useState(null);
  const [result, setResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    // Fetch a random sentence
    fetch('/api/speech/sentence')
      .then(res => res.json())
      .then(data => {
        if(data.success) setSentence(data.data);
      })
      .catch(err => {
        // Fallback if backend is not wired up yet
        setSentence({ text: "The quick brown fox jumps over the lazy dog." });
      });
  }, []);

  const handleStop = async () => {
    stopRecording();
    if (!transcript) return;

    setIsEvaluating(true);
    // In a real app, calculate actual duration and send auth header
    try {
      const response = await fetch('/api/speech/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          original: sentence.text,
          transcript: transcript,
          durationSeconds: 10, // hardcoded for MVP test
          module: 'ReadAloud'
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error(error);
      // Fallback mock result for UI testing
      setResult({
        score: { accuracy: 80, pronunciation: 75, fluency: 85, pace: 120 },
        overallScore: 80,
        diff: { missingWords: ['lazy'], incorrectWords: ['crazy'] },
        feedback: "Good pace, but watch out for mispronouncing 'lazy'."
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
        <h1 className="text-3xl font-bold mb-2">Read Aloud</h1>
        <p className="opacity-70">Read the sentence below clearly and naturally into your microphone.</p>
      </header>

      {sentence && (
        <div className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl text-center shadow-sm">
          <p className="text-2xl font-medium leading-relaxed">{sentence.text}</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
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
        </div>
      )}
    </div>
  );
};

export default ReadAloud;
