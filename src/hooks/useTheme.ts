import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export const useTheme = () => {
  const { theme, setTheme, isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    // Inicializar tema al cargar
    setTheme(theme);

    // Escuchar cambios en las preferencias del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setTheme]);

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
};

export default useTheme;
