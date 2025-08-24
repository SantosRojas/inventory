import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light' as const, label: 'Claro', icon: Sun },
    { key: 'dark' as const, label: 'Oscuro', icon: Moon },
    { key: 'system' as const, label: 'Sistema', icon: Monitor },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
      {themes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === key
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
