import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, ChevronRight, Play } from 'lucide-react';

const Grammar = () => {
  const [phase, setPhase] = useState('setup'); // setup, quiz, results
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ["Tenses", "Prepositions", "Articles", "Error Detection"];

  const startQuiz = async (category = null, quickMode = false) => {
    setLoading(true);
    try {
      let url = '/api/grammar/questions';
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (quickMode) params.append('mode', quickMode ? 'quick' : '');
      
      const res = await fetch(`${url}?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
        setAnswers({});
        setPhase('quiz');
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
      const res = await fetch('/api/grammar/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: submission })
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

  if (phase === 'setup') {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BookOpen className="text-[hsl(var(--primary))]" size={36} />
            Grammar Practice
          </h1>
          <p className="opacity-70 text-lg max-w-2xl mx-auto">Master the rules of English grammar through targeted practice or a mixed quick quiz.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold mb-4">Quick Practice</h2>
            <p className="opacity-80 mb-8">A randomized mix of 10 grammar questions from all categories.</p>
            <button 
              onClick={() => startQuiz(null, true)}
              disabled={loading}
              className="flex items-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
            >
              <Play fill="currentColor" size={20} />
              {loading ? 'Loading...' : 'Start Quick Quiz'}
            </button>
          </div>

          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Targeted Practice</h2>
            <div className="flex flex-col gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => startQuiz(cat)}
                  disabled={loading}
                  className="flex items-center justify-between w-full p-4 rounded-xl border border-[hsl(var(--foreground))/10] hover:bg-[hsl(var(--foreground))/5] transition-colors group text-left disabled:opacity-50"
                >
                  <span className="font-semibold">{cat}</span>
                  <ChevronRight className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (phase === 'quiz') {
    return (
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Grammar Quiz</h1>
            <p className="opacity-70">Answer all {questions.length} questions below.</p>
          </div>
          <button 
            onClick={submitQuiz}
            disabled={loading || Object.keys(answers).length !== questions.length}
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </header>

        <div className="flex flex-col gap-8">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-6 rounded-xl shadow-sm">
              <div className="text-sm font-bold opacity-50 uppercase tracking-wider mb-2">Question {idx + 1} • {q.category}</div>
              <p className="text-xl mb-6">{q.questionText}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(q.id, opt)}
                    className={`p-4 rounded-lg border text-left font-medium transition-all ${
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
    );
  }

  if (phase === 'results' && result) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-in slide-in-from-bottom-4">
        <header className="text-center bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] p-12 rounded-2xl">
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <div className="text-6xl font-black text-[hsl(var(--primary))] my-6">{result.score}%</div>
          <p className="opacity-70 text-lg">You got {result.correctCount} out of {result.total} correct.</p>
          <button 
            onClick={() => setPhase('setup')}
            className="mt-8 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Try Another Quiz
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

export default Grammar;
