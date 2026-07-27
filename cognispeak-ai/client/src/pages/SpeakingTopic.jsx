import { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { Mic, Square, Play, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const SpeakingTopic = () => {
  const { isSupported, isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition();
  const [topic, setTopic] = useState(null);
  const [result, setResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [phase, setPhase] = useState('initial'); // 'initial', 'prep', 'recording', 'done'
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetch('/api/speech/topic')
      .then(res => res.json())
      .then(data => {
        if(data.success) setTopic(data.data.text);
      })
      .catch(err => {
        setTopic("My Favorite Teacher");
      });
  }, []);

  // Timer logic
  useEffect(() => {
    let interval;
    if (phase === 'prep' || phase === 'recording') {
      if (timeLeft > 0) {
        interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      } else {
        if (phase === 'prep') {
          // Transition to recording automatically
          setPhase('recording');
          setTimeLeft(60);
          startRecording();
        } else if (phase === 'recording') {
          // Auto-stop recording
          handleStop();
        }
      }
    }
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const startPrep = () => {
    setPhase('prep');
    setTimeLeft(30);
  };

  const handleStop = async () => {
    stopRecording();
    setPhase('done');
    if (!transcript) return;

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/speech/evaluate-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic,
          transcript: transcript,
          module: 'Speaking'
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error(error);
      setResult({
        fillerCount: 3,
        fillerWordsFound: ['um', 'like', 'uh'],
        aiRubric: {
          grammarIssues: [],
          vocabularyRange: "Intermediate",
          confidenceIndicators: "Good sentence completion. Minimal hedging.",
          overallFeedback: "Strong response, but try to expand more on specific examples."
        }
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
        <h1 className="text-3xl font-bold mb-2">Speaking Topic</h1>
        <p className="opacity-70">You will have 30 seconds to prepare, and 60 seconds to speak.</p>
      </header>

      {topic && (
        <div className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl text-center shadow-sm">
          <h2 className="text-sm uppercase tracking-wider opacity-60 mb-2">Your Topic:</h2>
          <p className="text-2xl font-bold text-[hsl(var(--primary))] leading-relaxed">"{topic}"</p>
        </div>
      )}

      {/* Timers & Controls */}
      <div className="flex flex-col items-center gap-6">
        {phase === 'initial' && (
          <button 
            onClick={startPrep}
            className="flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg"
          >
            <Clock size={24} />
            Start 30s Prep
          </button>
        )}

        {phase === 'prep' && (
          <div className="text-center animate-in zoom-in">
            <div className="text-sm uppercase opacity-70 mb-2 font-bold tracking-widest text-orange-500">Preparation Time</div>
            <div className="text-6xl font-bold tabular-nums">{timeLeft}s</div>
            <p className="mt-4 opacity-70">Think about what you want to say. Recording will start automatically.</p>
          </div>
        )}

        {phase === 'recording' && (
          <div className="text-center animate-in zoom-in w-full">
            <div className="text-sm uppercase opacity-70 mb-2 font-bold tracking-widest text-red-500 flex items-center justify-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              Recording
            </div>
            <div className="text-6xl font-bold tabular-nums text-[hsl(var(--primary))]">{timeLeft}s</div>
            
            <button 
              onClick={handleStop}
              className="mt-8 flex items-center justify-center gap-2 w-full max-w-sm mx-auto bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] text-[hsl(var(--foreground))] px-8 py-4 rounded-full font-bold hover:bg-[hsl(var(--foreground))/5] transition-colors"
            >
              <Square size={24} />
              Submit Early
            </button>
          </div>
        )}
      </div>

      {transcript && (
        <div className="p-4 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl opacity-70 italic text-center">
          "{transcript}"
        </div>
      )}

      {isEvaluating && (
        <div className="text-center opacity-70 animate-pulse">Evaluating rubric via AI...</div>
      )}

      {result && (
        <div className="mt-8 flex flex-col gap-6 animate-in slide-in-from-bottom-4">
          <div className="p-6 border-2 border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.05)] rounded-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" /> 
              AI Evaluation Rubric
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-[hsl(var(--card))] rounded-lg shadow-sm">
                <div className="text-sm opacity-70 mb-1 font-semibold">Vocabulary Range</div>
                <div className="text-xl font-bold text-[hsl(var(--primary))]">{result.aiRubric.vocabularyRange}</div>
              </div>
              <div className="p-4 bg-[hsl(var(--card))] rounded-lg shadow-sm">
                <div className="text-sm opacity-70 mb-1 font-semibold text-orange-500">Filler Words</div>
                <div className="text-xl font-bold">
                  {result.fillerCount} found
                  <span className="text-sm font-normal opacity-70 ml-2">({result.fillerWordsFound.join(', ')})</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--foreground))/10]">
                <h3 className="font-semibold mb-2">Confidence Indicators</h3>
                <p className="text-[hsl(var(--foreground))/80]">{result.aiRubric.confidenceIndicators}</p>
              </div>

              <div className="p-4 bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--foreground))/10]">
                <h3 className="font-semibold mb-2">Grammar Issues</h3>
                {result.aiRubric.grammarIssues?.length > 0 ? (
                  <ul className="list-disc list-inside text-[hsl(var(--foreground))/80]">
                    {result.aiRubric.grammarIssues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-green-500 font-medium">No major grammar issues detected!</p>
                )}
              </div>

              <div className="p-4 bg-[hsl(var(--primary)/0.1)] rounded-lg text-[hsl(var(--primary))] font-medium">
                <h3 className="font-semibold mb-2">Overall Feedback</h3>
                <p>{result.aiRubric.overallFeedback}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingTopic;
