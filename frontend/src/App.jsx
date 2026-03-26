import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './features/auth/slices/authSlice';
import Layout from './pages/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Settings from './pages/Settings.jsx';
import Explore from './pages/Explore.jsx';
import Discovery from './pages/Discovery.jsx';
import CollectionDetails from './pages/CollectionDetails.jsx';
import LoginForm from './features/auth/components/LoginForm.jsx';
import RegisterForm from './features/auth/components/RegisterForm.jsx';
import ForgotPassword from './features/auth/components/ForgotPassword.jsx';
import ResetPassword from './features/auth/components/ResetPassword.jsx';
import VerifyEmail from './features/auth/components/VerifyEmail.jsx';
import { useAuth } from './features/auth/hooks/useAuth';
import { Loader2, Brain } from 'lucide-react';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const { status } = useSelector((state) => state.auth);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0F1A] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200 animate-pulse">
            <Brain size={40} />
          </div>
          <div className="absolute -bottom-2 -right-2">
            <Loader2 className="animate-spin text-indigo-600" size={24} />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tighter">BRAIN</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Synchronizing Neurons...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          !isAuthenticated ? (
            <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center p-4">
              <LoginForm />
            </div>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/register" element={
          !isAuthenticated ? (
            <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center p-4">
              <RegisterForm />
            </div>
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/forgot-password" element={
          <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center p-4">
            <ForgotPassword />
          </div>
        } />
        <Route path="/reset-password/:token" element={
          <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center p-4">
            <ResetPassword />
          </div>
        } />
        <Route path="/verify-email/:token" element={
          <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center p-4">
            <VerifyEmail />
          </div>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        }>
          <Route index element={<Dashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="discovery" element={<Discovery />} />
          <Route path="settings" element={<Settings />} />
          <Route path="collections/:id" element={<CollectionDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
