
import { 
  Mic as MicIcon, 
  Headphones as HeadphonesIcon, 
  MessageSquare as SpeakingIcon, 
  BookOpen as GrammarIcon, 
  BookText as ReadingIcon, 
  PenTool as EmailIcon,
  Play
} from 'lucide-react';
import TestOverviewCard from '../components/TestOverviewCard';
import CountdownTimer from '../components/CountdownTimer';
import ProgressSummary from '../components/ProgressSummary';
import { Link } from 'react-router-dom';

const modules = [
  { title: 'Read Aloud', description: 'Read sentences out loud to practice pronunciation and pace.', icon: MicIcon, path: '/read-aloud' },
  { title: 'Listen & Repeat', description: 'Listen to an audio clip and repeat it exactly.', icon: HeadphonesIcon, path: '/listening' },
  { title: 'Speaking Topic', description: 'Speak for 90 seconds on a given topic with prep time.', icon: SpeakingIcon, path: '/speaking-topic' },
  { title: 'Grammar', description: 'Practice tenses, prepositions, and sentence correction.', icon: GrammarIcon, path: '/grammar' },
  { title: 'Reading Comprehension', description: 'Read passages and answer multiple-choice questions.', icon: ReadingIcon, path: '/reading' },
  { title: 'Email Writing', description: 'Write professional emails based on scenarios.', icon: EmailIcon, path: '/email' },
];

const Home = () => {
  // Dummy exam date for preview
  const dummyExamDate = new Date();
  dummyExamDate.setDate(dummyExamDate.getDate() + 14);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-full">
          <CountdownTimer examDate={dummyExamDate} />
        </div>
        <div className="lg:col-span-2 h-full">
          <ProgressSummary />
        </div>
      </section>

      <section className="flex flex-col md:flex-row gap-6">
        {/* Daily Challenge */}
        <div className="flex-1 p-6 bg-gradient-to-br from-[hsl(var(--primary)/0.2)] to-transparent border border-[hsl(var(--primary)/0.3)] rounded-xl relative overflow-hidden">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <span className="text-[hsl(var(--primary))]">Daily Challenge</span>
          </h3>
          <p className="opacity-80 mb-4">Complete today's mixed grammar and vocabulary question to maintain your streak!</p>
          <Link to="/vocabulary" className="inline-block bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Start Challenge
          </Link>
        </div>

        {/* CTA */}
        <div className="flex-1 p-6 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl flex flex-col justify-center items-center text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to test yourself?</h3>
          <p className="opacity-80 mb-6">Take a full mock test simulating the real Cognizant assessment.</p>
          <Link to="/mocktest" className="flex items-center gap-2 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-lg">
            <Play size={20} fill="currentColor" />
            Start Mock Test
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Practice Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => (
            <TestOverviewCard key={index} {...mod} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
