import { useState } from 'react';
import { themeService } from '../services/themeService';
import ProjectCard from './ProjectCard';
import { useTheme } from '../contexts/ThemeContext';

function ThemeEditor() {
  const { theme, updateTheme, defaultTheme, restoreDefaultTheme } = useTheme();
  const [colors, setColors] = useState(theme);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleColorChange = (colorKey, value) => {
    setColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleRestoreDefaults = async () => {
    try {
      setSaving(true);
      setMessage('');
      await restoreDefaultTheme();
      setColors(defaultTheme);
      setMessage('Cores padrão restauradas com sucesso!');
    } catch (error) {
      console.error('Erro ao restaurar cores padrão:', error);
      setMessage('Erro ao restaurar cores padrão. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateTheme(colors);
      setMessage('Cores atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cores:', error);
      setMessage('Erro ao salvar as cores. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProjectCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Personalização de Cores</h2>
          <button
            type="button"
            onClick={handleRestoreDefaults}
            disabled={saving}
            className="px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            Restaurar Padrão
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded ${
            message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Cor Primária</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Cor Secundária</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Cor de Destaque</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Cor de Fundo</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Cor do Texto</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={colors.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={colors.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Cor do Header</label>
            <div className="flex gap-4">
              <input
                type="color"
                value={colors.header}
                onChange={(e) => handleColorChange('header', e.target.value)}
                className="h-10 w-20"
              />
              <input
                type="text"
                value={colors.header}
                onChange={(e) => handleColorChange('header', e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {saving ? 'Salvando...' : 'Salvar Cores'}
          </button>
        </div>
      </form>

      {/* Preview das cores */}
      <div className="mt-8 p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">Preview das Cores</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="text-center">
              <div 
                className="w-full h-20 rounded-lg mb-2"
                style={{ backgroundColor: value }}
              />
              <span className="text-sm text-gray-600 capitalize">{key}</span>
            </div>
          ))}
        </div>
      </div>
    </ProjectCard>
  );
}

export default ThemeEditor; 