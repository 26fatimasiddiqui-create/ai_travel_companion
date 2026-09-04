import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@travelcompanion.ai');
    setPassword('password123');
  };

  const handleInstantDemo = async () => {
    setLoading(true);
    try {
      await loginAsDemo();
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-sand-300 shadow-warm-lg p-8">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center mx-auto mb-3 shadow-warm">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-2xl text-charcoal-900">
            Welcome Back
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Access your AI companion and saved travel journals
          </p>
        </div>

        {/* Quick Demo Login Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-sand-100/80 border border-sand-300 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-charcoal-800 block">Judge / Demo Access</span>
            <span className="text-[11px] text-charcoal-500">Instant login with Jaipur trip</span>
          </div>
          <button
            type="button"
            onClick={handleInstantDemo}
            className="px-3 py-1.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-sm transition-all shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Demo</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="traveler@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-charcoal-700">Password</label>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] font-semibold text-terracotta-600 hover:underline"
              >
                Auto-fill credentials
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-charcoal-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-terracotta-600 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
