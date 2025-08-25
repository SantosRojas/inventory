import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks';

const ThemeSelector = () => {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    { key: 'light' as const, label: 'Claro', icon: Sun },
    { key: 'dark' as const, label: 'Oscuro', icon: Moon },
    { key: 'system' as const, label: 'Sistema', icon: Monitor },
  ];

  return (
    <div 
      className="flex items-center space-x-1 p-1 rounded-lg border"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)'
      }}
    >
      {themes.map(({ key, label, icon: Icon }) => {
        const isActive = theme === key;
        
        return (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
              isActive
                ? 'shadow-sm'
                : 'hover:shadow-sm'
            }`}
            style={{
              backgroundColor: isActive ? 'var(--color-bg-card)' : 'transparent',
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent'
            }}
            title={`${label}${key === 'system' ? ` (actualmente ${isDark ? 'oscuro' : 'claro'})` : ''}`}
          >
            <Icon className={`h-4 w-4`} style={{ color: isActive ? 'var(--color-primary)' : undefined }} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSelector;
