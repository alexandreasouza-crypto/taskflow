import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CheckSquare2 } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-glow flex items-center justify-center animate-bounce mb-4">
          <CheckSquare2 className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-teal-400 animate-pulse">Carregando TaskFlow...</p>
      </div>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
};

export default App;
