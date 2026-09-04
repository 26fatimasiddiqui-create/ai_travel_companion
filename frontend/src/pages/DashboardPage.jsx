import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import CompanionCard from '../components/CompanionCard';
import BudgetOptimizer from '../components/BudgetOptimizer';
import InteractiveMap from '../components/InteractiveMap';
import WeatherWidget from '../components/WeatherWidget';
import CrowdIndicator from '../components/CrowdIndicator';
import SafetyPanel from '../components/SafetyPanel';
import PackingChecklist from '../components/PackingChecklist';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Footprints, 
  Utensils, 
  Tag, 
  Plus, 
  RotateCw, 
  Compass, 
  Shield, 
  Luggage,
  Users,
  Camera
} from 'lucide-react';
import { tripService } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const { 
    activeTrip, 
    itinerary, 
    handleToggleItem, 
    loadTripDetails, 
    loading 
  } = useTrip();

  const [selectedDay, setSelectedDay] = useState(1);
  const [regenerating, setRegenerating] = useState(false);

  // Group itinerary items by day
  const dayItems = itinerary.filter((item) => item.dayNumber === selectedDay);
  const totalDays = Math.max(1, ...itinerary.map((i) => i.dayNumber || 1));

  const handleRegenerateItinerary = async () => {
    if (!activeTrip?.id) return;
    try {
      setRegenerating(true);
      await tripService.generateItinerary(activeTrip.id);
      await loadTripDetails(activeTrip.id);
    } catch (err) {
      console.error('Failed to regenerate itinerary', err);
    } finally {
      setRegenerating(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!activeTrip && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Compass className="w-12 h-12 text-terracotta-500 mx-auto mb-4 animate-bounce" />
        <h2 className="font-display text-2xl font-bold text-charcoal-800 mb-2">No Active Trip Found</h2>
        <p className="text-xs text-charcoal-500 mb-6">Plan your first personalized trip with the AI Companion.</p>
        <Link
          to="/onboarding"
          className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Journey</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Greeting & Trip Metadata Banner */}
        <div className="bg-white rounded-3xl border border-sand-300 p-6 mb-8 shadow-soft flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sage-700">
                Companion Active & Synchronized
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-charcoal-900 tracking-tight">
              {getGreeting()}, {user?.fullName || 'Explorer'} — ready for {activeTrip?.destination}?
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-500 mt-2 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                {activeTrip?.destination}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                {activeTrip?.startDate} to {activeTrip?.endDate}
              </span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-sand-100 text-charcoal-700 font-bold">
                Mood: {activeTrip?.mood}
              </span>
              {activeTrip?.accessibilityProfile !== 'NONE' && (
                <span className="px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-800 font-bold">
                  {activeTrip?.accessibilityProfile}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions Button Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerateItinerary}
              disabled={regenerating}
              className="px-3.5 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-700 text-xs font-semibold border border-sand-300 flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin text-terracotta-600' : ''}`} />
              <span>Regenerate Plan</span>
            </button>
            <Link
              to="/simulation"
              className="px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm flex items-center gap-1.5 transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Live Day Simulation</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Main Grid: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Main Itinerary & Live AI Companion (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Flagship Live AI Companion Alerts Card */}
            <CompanionCard />

            {/* 2. Today's Plan / Sequenced Itinerary Card */}
            <div className="bg-white rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
              
              {/* Day Selector Navigation */}
              <div className="bg-sand-50 border-b border-sand-200 p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-base text-charcoal-800">
                    Sequenced Day Itinerary
                  </h2>
                  <p className="text-xs text-charcoal-500">
                    Optimized for walkable sequencing, entry timings & crowd evasion
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-sand-200/70 p-1 rounded-xl">
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDay(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedDay === d
                          ? 'bg-terracotta-500 text-white shadow-sm'
                          : 'text-charcoal-700 hover:text-charcoal-900'
                      }`}
                    >
                      Day {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Items List */}
              <div className="p-6 space-y-4">
                {dayItems.length === 0 ? (
                  <p className="text-xs text-charcoal-500 text-center py-6">
                    No items scheduled for Day {selectedDay}. Click Regenerate Plan to synthesize recommendations.
                  </p>
                ) : (
                  dayItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        item.isCompleted
                          ? 'bg-sand-50/60 border-sand-200 opacity-60'
                          : 'bg-white border-sand-200 hover:border-terracotta-300 shadow-soft'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleItem(item.id)}
                            className="mt-0.5 text-charcoal-400 hover:text-sage-600 transition-colors"
                          >
                            {item.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-sage-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-sand-400" />
                            )}
                          </button>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-terracotta-600">
                                {item.startTime} – {item.endTime}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sand-100 text-charcoal-600">
                                {item.category}
                              </span>
                              {item.crowdLevel && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sage-50 text-sage-700 border border-sage-200">
                                  {item.crowdLevel}
                                </span>
                              )}
                            </div>

                            <h3 className={`font-bold text-sm text-charcoal-900 ${item.isCompleted ? 'line-through' : ''}`}>
                              {item.placeName}
                            </h3>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-charcoal-800 block">
                            ₹{item.estimatedCost || 0}
                          </span>
                          <span className="text-[10px] text-charcoal-400 font-medium">
                            {item.durationMinutes} mins
                          </span>
                        </div>
                      </div>

                      {/* Reason & Contextual signals */}
                      <p className="text-xs text-charcoal-600 pl-8 mb-3 leading-relaxed">
                        {item.recommendationReason}
                      </p>

                      <div className="pl-8 pt-2 border-t border-sand-200/80 flex flex-wrap gap-4 text-[11px] text-charcoal-500">
                        {item.weatherConsideration && (
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                            {item.weatherConsideration}
                          </span>
                        )}
                        {item.accessibilityNote && (
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sage-500 inline-block"></span>
                            {item.accessibilityNote}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. AI Budget Optimizer */}
            <BudgetOptimizer />
          </div>

          {/* RIGHT COLUMN: Map, Weather, Crowd, Safety, Packing (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Route Map */}
            <InteractiveMap items={dayItems} />

            {/* Live Weather Forecast */}
            <WeatherWidget />

            {/* Crowd Predictions */}
            <CrowdIndicator destination={activeTrip?.destination} />

            {/* AI Safety Score & Dispatch */}
            <SafetyPanel 
              destination={activeTrip?.destination} 
              travelProfile={activeTrip?.travelType} 
            />

            {/* Packing List Checkpoints */}
            {activeTrip?.id && <PackingChecklist tripId={activeTrip.id} />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
