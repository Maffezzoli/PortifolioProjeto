import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import GalleryProvider from './contexts/GalleryContext';
import Header from './components/Header';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ProjectDetails from './pages/ProjectDetails';
import Gallery from './pages/Gallery';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <GalleryProvider>
          <Router>
            <div className="min-h-screen" style={{ 
              background: `linear-gradient(to bottom, ${getComputedStyle(document.documentElement).getPropertyValue('--color-background')}, ${getComputedStyle(document.documentElement).getPropertyValue('--color-accent')}10)`
            }}>
              <Header />
              <main className="page-container py-8">
                <Routes>
                  <Route path="/" element={<Navigate to="/galeria" replace />} />
                  <Route path="/galeria" element={<Gallery />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/projeto/:id" element={<ProjectDetails />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </GalleryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 