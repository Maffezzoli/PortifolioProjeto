import { useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';

function DynamicFavicon() {
  const { profile } = useProfile();

  useEffect(() => {
    if (profile?.photoUrl) {
      // Cria um link para o favicon
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = profile.photoUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [profile?.photoUrl]);

  return null; // Este componente não renderiza nada visualmente
}

export default DynamicFavicon; 