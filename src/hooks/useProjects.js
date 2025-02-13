import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAllProjects();
      console.log('Dados dos projetos:', data); // Log para debug
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return { 
    projects, 
    loading, 
    error, 
    reloadProjects: loadProjects 
  };
} 