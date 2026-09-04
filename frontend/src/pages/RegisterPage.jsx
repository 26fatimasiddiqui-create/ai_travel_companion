import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState('Heritage sites, photography, calm cafes');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, fullName, preferences);
      navigate('/onboarding');
    } catch (err) {
      setError(err?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-sand-300 shadow-warm-lg p-8">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center mx-auto mb-3 shadow-warm">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-2xl text-charcoal-900">
            Create Your Account
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Personalize your AI Travel Companion profile
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Aarav Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="aarav@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">
              Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 block mb-1">
              Travel Preferences & Interests
            </label>
            <input
              type="text"
              placeholder="e.g. Architecture, local markets, food walks"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{loading ? 'Creating Profile...' : 'Begin Journey'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-charcoal-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-terracotta-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
