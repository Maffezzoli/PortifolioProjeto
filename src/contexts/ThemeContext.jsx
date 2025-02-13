import { createContext, useContext, useState, useEffect } from 'react';
import { themeService } from '../services/themeService';

const ThemeContext = createContext();

// Definindo as cores padrão em uma constante
const defaultTheme = {
  primary: '#9333EA',
  secondary: '#4F46E5',
  accent: '#EC4899',
  background: '#F9FAFB',
  text: '#111827',
  header: '#FFFFFF',
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);

  // Aplica as cores padrão imediatamente
  useEffect(() => {
    updateCssVariables(theme);
  }, []);

  // Carrega as cores salvas
  useEffect(() => {
    loadTheme();
  }, []);

  // Atualiza as variáveis CSS quando o tema mudar
  useEffect(() => {
    updateCssVariables(theme);
  }, [theme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await themeService.getTheme();
      setTheme(savedTheme);
      updateCssVariables(savedTheme);
    } catch (error) {
      console.error('Erro ao carregar tema:', error);
    }
  };

  const updateCssVariables = (colors) => {
    if (!colors) return;
    
    Object.entries(colors).forEach(([key, value]) => {
      if (value) {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      }
    });
  };

  const updateTheme = async (newColors) => {
    try {
      await themeService.updateTheme(newColors);
      setTheme(newColors);
      updateCssVariables(newColors);
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      throw error;
    }
  };

  // Função para restaurar as cores padrão
  const restoreDefaultTheme = async () => {
    try {
      await updateTheme(defaultTheme);
    } catch (error) {
      console.error('Erro ao restaurar cores padrão:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, defaultTheme, restoreDefaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}; 