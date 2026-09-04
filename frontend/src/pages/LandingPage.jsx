import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  Sparkles, 
  Clock, 
  Wallet, 
  ShieldCheck, 
  Heart, 
  Users, 
  MapPin, 
  ArrowRight,
  Sun,
  Camera,
  CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const { loginAsDemo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDemoClick = async () => {
    await loginAsDemo();
    navigate('/dashboard');
  };

  const featureCards = [
    {
      title: 'Live AI Companion',
      badge: 'Flagship',
      icon: Sparkles,
      desc: 'Watches the clock, oncoming weather, and your wallet in real time. Detects rain and automatically reroutes you to covered havelis.',
      color: 'bg-terracotta-500 text-white',
    },
    {
      title: 'AI Trip Simulation',
      badge: 'Signature',
      icon: Clock,
      desc: 'Simulate your entire day minute-by-minute before stepping out. Experience realistic walking buffers, ticket lines, and sunset timing.',
      color: 'bg-sage-600 text-white',
    },
    {
      title: 'Mood-Based Planning',
      badge: 'Personalized',
      icon: Heart,
      desc: 'Tell the assistant how you feel — Romantic, Adventure, Photography, Food Lover, or Relaxed. Every single stop recalibrates with your mood.',
      color: 'bg-terracotta-600 text-white',
    },
    {
      title: 'AI Budget Optimizer',
      badge: 'Finances',
      icon: Wallet,
      desc: 'Live ledger calculating spent vs projected costs. Instantly swaps expensive stops with local artisan alternatives if budget gets tight.',
      color: 'bg-charcoal-700 text-white',
    },
    {
      title: 'Hidden Gems Discovery',
      badge: 'Curated',
      icon: MapPin,
      desc: 'Look past tourist crowds to secluded 16th-century stepwells, quiet royal cenotaphs, and organic block-printing workshops.',
      color: 'bg-sand-500 text-white',
    },
    {
      title: 'Safety & Accessibility',
      badge: 'Confidence',
      icon: ShieldCheck,
      desc: 'First-class wheelchair/senior transit routing, well-lit nighttime pathways, and 1-tap emergency dispatch for solo and women travelers.',
      color: 'bg-sage-700 text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col selection:bg-terracotta-100 selection:text-terracotta-800">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/80 border border-sand-300 text-xs font-bold text-charcoal-700 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>The future of travel isn’t a plan — it’s a companion</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-charcoal-900 tracking-tight leading-[1.15] mb-6">
            A live, intelligent travel assistant that thinks <span className="text-terracotta-500 italic font-serif">with you.</span>
          </h1>

          <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
            Most travel apps stop working the moment your trip begins. AI Travel Companion monitors the clock, the weather, and your budget in real time — proactively recommending indoor detours when it rains and quieter hours when crowds peak.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? '/dashboard' : '/onboarding'}
              className="px-6 py-3.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm shadow-warm hover:shadow-warm-lg transition-all flex items-center gap-2 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Plan My Trip</span>
            </Link>

            <button
              onClick={handleDemoClick}
              className="px-6 py-3.5 rounded-xl bg-sand-200/90 hover:bg-sand-300 text-charcoal-800 font-bold text-sm border border-sand-300 transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              <span>Explore Jaipur Demo</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-charcoal-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sage-600" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sage-600" /> Real-time situational awareness
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sage-600" /> Grounded travel intelligence
            </span>
          </div>
        </div>

        {/* Hero Travel Imagery / Mock Visual */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-warm-lg border border-sand-300 aspect-video max-h-[460px]">
            <img
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85"
              alt="Hawa Mahal Jaipur"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
            
            {/* Live Interactive Companion Teaser Overlay */}
            <div className="absolute bottom-6 left-6 right-6 sm:left-10 sm:right-auto max-w-md bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-sand-200 shadow-warm">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta-700">
                  Live Companion Active • Jaipur
                </span>
              </div>
              <p className="text-xs font-bold text-charcoal-800 mb-1">
                "It's raining near Hawa Mahal. Swapping your outdoor walk for Albert Hall Museum galleries nearby."
              </p>
              <div className="flex items-center justify-between text-[11px] text-charcoal-500 pt-1 border-t border-sand-200 mt-2">
                <span>Rain probability: 80%</span>
                <span className="font-semibold text-sage-700">Indoor Sanctuary Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Static Itinerary vs Live Companion */}
      <section className="py-16 bg-sand-50/70 border-y border-sand-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal-800">
              Why Static Travel Plans Fail
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
              Traditional apps give you a PDF checklist and vanish. We journey with you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm opacity-80">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block mb-2">
                Traditional Itinerary Apps
              </span>
              <h3 className="font-display font-bold text-base text-charcoal-800 mb-3">
                Rigid, Unforgiving Checklists
              </h3>
              <ul className="space-y-3 text-xs text-charcoal-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  "Visit museum at 2:00 PM" — even if it started pouring rain outside.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  Zero awareness of road bottlenecks, surge pricing, or closing times.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  One-size-fits-all tourist lists that ignore how tired or energetic you feel.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white border-2 border-terracotta-400 shadow-warm">
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block mb-2">
                AI Travel Companion
              </span>
              <h3 className="font-display font-bold text-base text-charcoal-800 mb-3">
                Live, Real-Time Situational Reactivity
              </h3>
              <ul className="space-y-3 text-xs text-charcoal-700 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-sage-600 font-bold shrink-0">✓</span>
                  "City Palace closes ticket booths in 45 mins. Enter now before your cafe break."
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-600 font-bold shrink-0">✓</span>
                  "Heavy evening traffic on MI Road. Pink Metro Line 1 saves 22 minutes."
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sage-600 font-bold shrink-0">✓</span>
                  "You have ₹800 remaining today. Here are high-rated local thali alternatives."
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600">
            Engineered For Real Journeys
          </span>
          <h2 className="font-display text-3xl font-bold text-charcoal-800 mt-1">
            Everything You Need For Frictionless Travel
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-2">
            Built from the ground up to solve real-world travel dilemmas before and during the trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-sand-200/90 shadow-soft hover:shadow-warm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${f.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sand-100 text-charcoal-700">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-charcoal-800 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-charcoal-500 leading-relaxed font-normal">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-sand-200/80 border-t border-sand-300 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal-900 mb-3">
            Ready to experience a true travel companion?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600 mb-6">
            Step into the demo and preview a complete 3-day cultural odyssey in Jaipur.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleDemoClick}
              className="px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-warm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Live Jaipur Demo</span>
            </button>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-white hover:bg-sand-50 text-charcoal-800 font-bold text-xs border border-sand-300 transition-all"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ivory-50 border-t border-sand-200 py-8 px-4 text-center text-xs text-charcoal-400">
        <p>© 2026 AI Travel Companion • Built with Spring Boot, React & Tailored Travel Intelligence</p>
      </footer>
    </div>
  );
};

export default LandingPage;
