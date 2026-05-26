import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const IntranetLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b bg-blue-600 text-white">
          <h1 className="font-bold text-2xl">Intranet</h1>
          <p className="text-blue-100 text-sm">Jardín Monserrat</p>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          <div className="mb-6 px-4 py-3 bg-blue-50 rounded-2xl">
            <p className="text-xs text-gray-500">Apoderado</p>
            <p className="font-semibold text-gray-800">{user?.full_name}</p>
          </div>

          <nav className="space-y-1">
            <Link
              to="/intranet"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                location.pathname === '/intranet' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              💰 Seguimiento de Pagos
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t mt-auto">
          <button
            onClick={() => { logout(); navigate('/login-parent'); }}
            className="w-full py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default IntranetLayout;