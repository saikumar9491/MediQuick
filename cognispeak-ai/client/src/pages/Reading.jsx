import { useState, useEffect } from 'react';
import { BookText, CheckCircle2, XCircle, Clock } from 'lucide-react';

const Reading = () => {
  const [phase, setPhase] = useState('setup'); // setup, reading, results
  const [passage, setPassage] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval;
    if (phase === 'reading' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (phase === 'reading' && timeLeft === 0) {
      submitQuiz(); // Auto submit when time runs out
    }
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const startReading = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reading/passage');
      const data = await res.json();
      if (data.success) {
        setPassage(data.data);
        setAnswers({});
        // Total time: 2 mins (120s) for passage + 1 min (60s) per question
        const totalTime = 120 + (data.data.questions.length * 60);
        setTimeLeft(totalTime);
        setPhase('reading');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const submitQuiz = async () => {
    setLoading(true);
    // Format answers for backend
    const submission = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption
    }));

    try {
      const res = await fetch('/api/reading/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          passageId: passage.id,
          answers: submission 
        })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setPhase('results');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (phase === 'setup') {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-8 text-center animate-in fade-in">
        <header>
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BookText className="text-[hsl(var(--primary))]" size={36} />
            Reading Comprehension
          </h1>
          <p className="opacity-70 text-lg max-w-2xl mx-auto">
            You will be given a passage to read and a set of questions to answer. 
            You have a strict time limit combining 2 minutes for reading plus 1 minute per question.
          </p>
        </header>

        <div className="p-12 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-2xl shadow-sm">
          <button 
            onClick={startReading}
            disabled={loading}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
          >
            {loading ? 'Loading Passage...' : 'Start Reading Module'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'reading' && passage) {
    return (
      <div className="flex flex-col h-[80vh]">
        {/* Sticky Header with Timer */}
        <header className="flex justify-between items-center mb-6 bg-[hsl(var(--background))] sticky top-0 z-10 py-4 border-b border-[hsl(var(--foreground))/10]">
          <div>
            <h1 className="text-xl font-bold">{passage.title}</h1>
            <p className="opacity-70 text-sm">Answer all {passage.questions.length} questions before time runs out.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 font-bold text-2xl tabular-nums ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-[hsl(var(--primary))]'}`}>
              <Clock />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={submitQuiz}
              disabled={loading || Object.keys(answers).length !== passage.questions.length}
              className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Answers'}
            </button>
          </div>
        </header>

        {/* Split Pane */}
        <div className="flex-1 flex flex-col md:flex-row gap-8 overflow-hidden">
          {/* Left: Passage */}
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-8 rounded-xl leading-relaxed text-lg shadow-sm">
              {passage.content}
            </div>
          </div>

          {/* Right: Questions */}
          <div className="flex-1 overflow-y-auto pl-4 custom-scrollbar">
            <div className="flex flex-col gap-8 pb-12">
              {passage.questions.map((q, idx) => (
                <div key={q.id} className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm">
                  <div className="text-sm font-bold opacity-50 uppercase tracking-wider mb-2">Question {idx + 1}</div>
                  <p className="text-lg font-medium mb-4">{q.questionText}</p>
                  
                  <div className="flex flex-col gap-3">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`p-3 rounded-lg border text-left font-medium transition-all ${
                          answers[q.id] === opt 
                            ? 'bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary))] text-[hsl(var(--primary))]' 
                            : 'border-[hsl(var(--foreground))/10] hover:border-[hsl(var(--primary)/0.5)]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results' && result) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in slide-in-from-bottom-4">
        <header className="text-center bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-12 rounded-2xl">
          <h1 className="text-3xl font-bold mb-2">Reading Complete!</h1>
          <div className="text-6xl font-black text-[hsl(var(--primary))] my-6">{result.score}%</div>
          <p className="opacity-70 text-lg">You got {result.correctCount} out of {result.total} correct.</p>
          <button 
            onClick={() => setPhase('setup')}
            className="mt-8 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Read Another Passage
          </button>
        </header>

        <section>
          <h2 className="text-2xl font-bold mb-6">Review Answers</h2>
          <div className="flex flex-col gap-6">
            {result.review.map((item, idx) => (
              <div key={item.questionId} className={`p-6 rounded-xl border-l-4 bg-[hsl(var(--card))] ${item.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {item.isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium mb-4">{idx + 1}. {item.questionText}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm opacity-50 font-bold uppercase">Your Answer</div>
                        <div className={`font-medium ${item.isCorrect ? 'text-green-500' : 'text-red-500'}`}>{item.selected || 'No answer'}</div>
                      </div>
                      {!item.isCorrect && (
                        <div>
                          <div className="text-sm opacity-50 font-bold uppercase">Correct Answer</div>
                          <div className="font-medium text-green-500">{item.correct}</div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-[hsl(var(--primary)/0.05)] rounded-lg text-sm text-[hsl(var(--foreground))/80]">
                      <span className="font-bold">Explanation:</span> {item.explanation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return null;
};

export default Reading;
