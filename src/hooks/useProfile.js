import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { profile, loading };
} 