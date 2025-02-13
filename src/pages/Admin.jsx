import { useState } from 'react';
import ArtworkForm from '../components/ArtworkForm';
import { artworkService } from '../firebase/artworkService';

function Admin() {
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSuccess = () => {
    setMessage({
      type: 'success',
      text: 'Arte adicionada com sucesso!'
    });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleError = (error) => {
    setMessage({
      type: 'error',
      text: 'Erro ao adicionar arte. Tente novamente.'
    });
    console.error(error);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Administração</h1>
      
      {message.text && (
        <div className={`p-4 rounded-md mb-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Nova Arte</h2>
        <ArtworkForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  );
}

export default Admin;