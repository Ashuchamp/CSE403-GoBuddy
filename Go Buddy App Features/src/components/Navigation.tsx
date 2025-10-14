import { Search, Sparkles, Plus, Users, User } from 'lucide-react';
import { AppView } from './MainApp';

type NavigationProps = {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
};

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems: { view: AppView; icon: React.ReactNode; label: string }[] = [
    { view: 'browse', icon: <Search className="w-6 h-6" />, label: 'Browse' },
    { view: 'recommendations', icon: <Sparkles className="w-6 h-6" />, label: 'For You' },
    { view: 'create', icon: <Plus className="w-6 h-6" />, label: 'Create' },
    { view: 'connections', icon: <Users className="w-6 h-6" />, label: 'Connections' },
    { view: 'profile', icon: <User className="w-6 h-6" />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`flex items-center justify-center p-3 rounded-md transition-colors ${
              currentView === item.view
                ? 'text-purple-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            title={item.label}
            aria-label={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </nav>
  );
}
