import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Sparkles, 
  Users, 
  Camera, 
  LogOut, 
  PlusCircle, 
  Sliders,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loginAsDemo } = useAuth();
  const { trips, activeTrip, selectTrip } = useTrip();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Compass },
    { path: '/simulation', label: 'Trip Simulation', icon: Clock },
    { path: '/hidden-gems', label: 'Hidden Gems', icon: Sparkles },
    { path: '/group-planner', label: 'Travel Together', icon: Users },
    { path: '/memories', label: 'Memories', icon: Camera },
  ];

  const handleDemoClick = async () => {
    await loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur-md border-b border-sand-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-warm group-hover:bg-terracotta-600 transition-colors">
              <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-charcoal-800 tracking-tight block leading-tight">
                AI Travel Companion
              </span>
              <span className="text-[11px] font-medium text-terracotta-600 tracking-wider uppercase block">
                Live Intelligent Travel
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-terracotta-100/70 text-terracotta-700 font-semibold'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-sand-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-terracotta-600' : 'text-charcoal-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Action & Profile Area */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Trip Switcher Dropdown */}
                {trips && trips.length > 0 && (
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sand-100 hover:bg-sand-200 text-charcoal-700 text-xs font-semibold border border-sand-300 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
                      <span className="max-w-[110px] truncate">{activeTrip?.destination || 'Select Trip'}</span>
                      <ChevronDown className="w-3 h-3 text-charcoal-400" />
                    </button>
                    <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-warm-lg border border-sand-200 py-1 hidden group-hover:block transition-all">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                        Switch Active Trip
                      </div>
                      {trips.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => selectTrip(t)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-sand-50 ${
                            activeTrip?.id === t.id ? 'bg-terracotta-50 text-terracotta-700 font-bold' : 'text-charcoal-700'
                          }`}
                        >
                          <span className="truncate">{t.destination}</span>
                          <span className="text-[10px] text-charcoal-400">{t.travelType}</span>
                        </button>
                      ))}
                      <div className="border-t border-sand-200 mt-1 pt-1">
                        <Link
                          to="/onboarding"
                          className="w-full text-left px-3 py-1.5 text-xs text-terracotta-600 font-semibold flex items-center gap-2 hover:bg-sand-50"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Plan New Trip</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  to="/onboarding"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Trip</span>
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-sand-300">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-charcoal-800 block leading-tight">
                      {user?.fullName || 'Traveler'}
                    </span>
                    <span className="text-[10px] text-sage-600 font-medium block">
                      Active Journey
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-charcoal-500 hover:text-terracotta-600 hover:bg-sand-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDemoClick}
                  className="px-3.5 py-2 rounded-lg bg-sand-200 hover:bg-sand-300 text-charcoal-800 text-xs font-bold tracking-wide transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Explore Demo</span>
                </button>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-charcoal-700 hover:text-charcoal-900 text-xs font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-warm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
