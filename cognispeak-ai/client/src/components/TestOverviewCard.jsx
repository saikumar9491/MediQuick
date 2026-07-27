import { Link } from 'react-router-dom';

const TestOverviewCard = ({ title, description, icon: Icon, path }) => {
  return (
    <Link 
      to={path} 
      className="block p-6 bg-[hsl(var(--card))] border border-[hsl(var(--foreground))/10] rounded-xl hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] rounded-lg">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-[hsl(var(--foreground))/70]">{description}</p>
    </Link>
  );
};

export default TestOverviewCard;
