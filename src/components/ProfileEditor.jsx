import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

function ProfileEditor() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    photoUrl: '',
    instagram: '',
    behance: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileService.updateProfile(profile, image);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setImage(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h2>
      
      {message.text && (
        <div className={`p-4 rounded-lg mb-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Nome</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Biografia</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Foto de Perfil</label>
          {profile.photoUrl && (
            <img
              src={profile.photoUrl}
              alt="Foto de perfil atual"
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
          )}
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Instagram</label>
          <input
            type="url"
            value={profile.instagram}
            onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
            placeholder="https://instagram.com/seu-perfil"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Behance</label>
          <input
            type="url"
            value={profile.behance}
            onChange={(e) => setProfile({ ...profile, behance: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
            placeholder="https://behance.net/seu-perfil"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </form>
    </div>
  );
}

export default ProfileEditor; 