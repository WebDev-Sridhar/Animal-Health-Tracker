import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-semibold text-slate-800">
            Animal Health Tracker
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-600 hover:text-slate-900">Home</Link>
            <Link to="/report" className="text-slate-600 hover:text-slate-900">Report</Link>
            {user?.role === 'volunteer' && (
              <Link to="/volunteer" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-slate-600 hover:text-slate-900">Admin</Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900">Login</Link>
                <Link to="/register" className="text-slate-600 hover:text-slate-900">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
