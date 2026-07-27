import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import Home from './pages/Home';
import ReadAloud from './pages/ReadAloud';
import Listening from './pages/Listening';
import SpeakingTopic from './pages/SpeakingTopic';
import Grammar from './pages/Grammar';
import Reading from './pages/Reading';
import Email from './pages/Email';
import Vocabulary from './pages/Vocabulary';
import Dashboard from './pages/Dashboard';
import MockTest from './pages/MockTest';

const Navbar = ({ darkMode, toggleDarkMode }) => (
  <nav className="flex justify-between items-center p-4 bg-[hsl(var(--card))] border-b border-[hsl(var(--foreground))/10] mb-8">
    <div className="flex gap-4 items-center">
      <Link to="/" className="text-xl font-bold text-[hsl(var(--primary))]">CogniSpeak AI</Link>
      <Link to="/dashboard" className="hover:text-[hsl(var(--primary))] transition-colors">Dashboard</Link>
      <Link to="/mocktest" className="hover:text-[hsl(var(--primary))] transition-colors border border-[hsl(var(--primary))] text-[hsl(var(--primary))] px-3 py-1 rounded hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]">Mock Test</Link>
    </div>
    <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-[hsl(var(--foreground))/10] transition-colors">
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  </nav>
);

const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center p-12">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-lg opacity-70">This module is under construction.</p>
  </div>
);

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] transition-colors duration-200">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/read-aloud" element={<ReadAloud />} />
            <Route path="/listening" element={<Listening />} />
            <Route path="/speaking-topic" element={<SpeakingTopic />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/email" element={<Email />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mocktest" element={<MockTest />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
