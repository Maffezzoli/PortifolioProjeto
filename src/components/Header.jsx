import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Header() {
  const { profile } = useProfile();
  const { projects, loading, error } = useProjects();
  const { user, logout, isAdmin } = useAuth();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const { theme } = useTheme();

  // Limpa o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsProjectsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProjectsOpen(false);
    }, 300); // 300ms de delay antes de fechar
  };

  return (
    <header 
      className="shadow-lg sticky top-0 z-50"
      style={{ backgroundColor: theme.header }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo e Informações do Perfil */}
          <div className="flex items-center space-x-4">
            {profile?.photoUrl && (
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover border-2"
                style={{ borderColor: theme.secondary }}
              />
            )}
            <div>
              <Link 
                to="/" 
                className="text-2xl font-bold hover:opacity-80 transition-opacity"
                style={{ color: theme.secondary }}
              >
                {profile?.name || 'Portfólio Artístico'}
              </Link>
              {profile?.bio && (
                <p className="text-sm text-gray-500 max-w-md line-clamp-1">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Navegação e Links Sociais */}
          <div className="flex items-center space-x-6">
            {/* Links de Navegação */}
            <nav className="flex items-center space-x-4">
              <div 
                ref={dropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className="header-link text-gray-700"
                  style={{ color: isProjectsOpen ? theme.primary : undefined }}
                >
                  Projetos
                </button>
                
                {/* Dropdown de Projetos */}
                {isProjectsOpen && (
                  <div 
                    className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg py-2 mt-1"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {loading ? (
                      <p className="px-4 py-2 text-gray-500">Carregando projetos...</p>
                    ) : error ? (
                      <p className="px-4 py-2 text-red-500">Erro ao carregar projetos</p>
                    ) : projects.length === 0 ? (
                      <p className="px-4 py-2 text-gray-500">Nenhum projeto encontrado</p>
                    ) : (
                      projects.map((project) => (
                        <Link
                          key={project.id}
                          to={`/projeto/${project.id}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          style={{
                            '&:hover': {
                              color: theme.primary,
                              backgroundColor: `${theme.primary}10`
                            }
                          }}
                        >
                          <div className="font-medium">{project.title}</div>
                          {project.description && (
                            <div className="text-sm text-gray-500 truncate">
                              {project.description}
                            </div>
                          )}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              <Link 
                to="/galeria" 
                className="header-link text-gray-700"
              >
                Galeria
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/admin" 
                    className="header-link text-gray-700"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={logout}
                    className="header-link text-gray-700"
                  >
                    Sair
                  </button>
                </>
              )}

              {!user && (
                <Link 
                  to="/login"
                  className="header-link text-gray-700"
                >
                  Login
                </Link>
              )}
            </nav>

            {/* Links Sociais */}
            <div className="hidden md:flex items-center space-x-4">
              {profile?.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {profile?.behance && (
                <a
                  href={profile.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {isAdmin && (
        <span className="ml-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
          Admin
        </span>
      )}
    </header>
  );
}

export default Header; 