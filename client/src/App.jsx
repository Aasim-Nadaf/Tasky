import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

function Gate({ children, requireUser }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (requireUser && !user) return <Navigate to="/login" replace />;
  if (!requireUser && user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gate requireUser><Dashboard /></Gate>} />
      <Route path="/login" element={<Gate><AuthPage mode="login" /></Gate>} />
      <Route path="/register" element={<Gate><AuthPage mode="register" /></Gate>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
