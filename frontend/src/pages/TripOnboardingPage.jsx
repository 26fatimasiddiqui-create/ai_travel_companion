import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { tripService } from '../services/api';
import { 
  MapPin, 
  Calendar, 
  Wallet, 
  Users, 
  Heart, 
  Sparkles, 
  Accessibility, 
  ArrowRight, 
  ArrowLeft,
  Coffee,
  Flame,
  Camera,
  UtensilsCrossed,
  Baby,
  Smile,
  Check
} from 'lucide-react';

const TripOnboardingPage = () => {
  const navigate = useNavigate();
  const { fetchTrips, selectTrip } = useTrip();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [destination, setDestination] = useState('Jaipur');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [budget, setBudget] = useState(6000);
  const [travelersCount, setTravelersCount] = useState(1);
  const [travelType, setTravelType] = useState('SOLO');
  const [mood, setMood] = useState('RELAXED');
  const [accessibilityProfile, setAccessibilityProfile] = useState('NONE');
  const [interests, setInterests] = useState('Heritage, Photography, Street Food');
  const [accommodationPreference, setAccommodationPreference] = useState('Heritage Haveli');

  const moods = [
    { id: 'RELAXED', label: 'Relaxed', icon: Coffee, desc: 'Slow strolls, quiet courtyards, calm cafes' },
    { id: 'ROMANTIC', label: 'Romantic', icon: Heart, desc: 'Scenic sunset terraces, intimate dining' },
    { id: 'ADVENTURE', label: 'Adventure', icon: Flame, desc: 'Fort hikes, outdoor exploration, active pacing' },
    { id: 'PHOTOGRAPHY', label: 'Photography', icon: Camera, desc: 'Golden hour vantage points, architectural details' },
    { id: 'FOOD_LOVER', label: 'Food Lover', icon: UtensilsCrossed, desc: 'Artisan sweet shops, local spice markets, street thalis' },
    { id: 'FAMILY', label: 'Family', icon: Smile, desc: 'Kid-friendly pacing, shaded stops, easy walking' },
    { id: 'SOLO', label: 'Solo', icon: Users, desc: 'Safe verified corridors, friendly cafes, social hubs' },
  ];

  const travelTypes = [
    { id: 'SOLO', label: 'Solo Traveler', count: 1 },
    { id: 'COUPLE', label: 'Couple', count: 2 },
    { id: 'FAMILY', label: 'Family Trip', count: 4 },
    { id: 'GROUP', label: 'Friends Group', count: 5 },
  ];

  const accessProfiles = [
    { id: 'NONE', label: 'Standard Route', desc: 'Typical walking paths and monument stairways' },
    { id: 'WHEELCHAIR', label: 'Wheelchair Accessible', desc: 'Ramps, step-free corridors, elevator-equipped monuments' },
    { id: 'SENIOR', label: 'Senior Travelers', desc: 'Gentle walking distances, frequent benches, jeep transit up to forts' },
    { id: 'YOUNG_FAMILY', label: 'Family with Strollers', desc: 'Stroller-friendly avenues, shaded rest zones, easy access' },
  ];

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await tripService.createTrip({
        destination,
        startDate,
        endDate,
        budget: parseFloat(budget),
        travelersCount: parseInt(travelersCount),
        travelType,
        mood,
        accessibilityProfile,
        interests,
        accommodationPreference,
      });

      if (res && res.data) {
        await fetchTrips();
        selectTrip(res.data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err?.message || 'Failed to create trip. Please verify dates and details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl border border-sand-300 shadow-warm-lg overflow-hidden">
        
        {/* Progress Header */}
        <div className="bg-sand-50/80 border-b border-sand-200 px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta-600 block">
              Step {step} of 4
            </span>
            <h2 className="font-display font-bold text-base text-charcoal-800">
              {step === 1 && 'Where & When Are You Traveling?'}
              {step === 2 && 'Budget & Group Dynamics'}
              {step === 3 && 'How Do You Feel Today? (Mood)'}
              {step === 4 && 'Accessibility & Preferences'}
            </h2>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  step >= s ? 'bg-terracotta-500' : 'bg-sand-200'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="m-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Step Body */}
        <div className="p-6 sm:p-8">
          
          {/* STEP 1: Destination & Dates */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
                  Destination City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-terracotta-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sand-300 text-xs font-medium focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-charcoal-400 mt-1">
                  Try "Jaipur" for our full rich benchmark experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Budget & Travelers */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
                  Total Trip Budget (₹ INR)
                </label>
                <div className="relative">
                  <Wallet className="w-4 h-4 text-terracotta-500 absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-sand-300 text-xs font-bold text-charcoal-800 focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-charcoal-400 mt-1">
                  The AI Budget Optimizer will balance tickets, food, and transit within this exact amount.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-2">
                  Travel Dynamic
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {travelTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTravelType(t.id);
                        setTravelersCount(t.count);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        travelType === t.id
                          ? 'bg-terracotta-50 border-terracotta-500 text-terracotta-900 shadow-sm'
                          : 'bg-white border-sand-200 text-charcoal-700 hover:border-sand-300'
                      }`}
                    >
                      <span className="font-bold text-xs block">{t.label}</span>
                      <span className="text-[11px] text-charcoal-400">{t.count} Traveler{t.count > 1 ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Mood Selection */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-xs text-charcoal-500">
                Instead of rigid cookie-cutter checklists, our AI customizes pace, stops, and activities to your state of mind.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {moods.map((m) => {
                  const Icon = m.icon;
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-terracotta-50 border-terracotta-500 shadow-sm'
                          : 'bg-white border-sand-200 hover:border-sand-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-terracotta-500 text-white' : 'bg-sand-100 text-charcoal-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-charcoal-800">{m.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-terracotta-600" />}
                        </div>
                        <p className="text-[11px] text-charcoal-500 leading-snug mt-0.5">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Accessibility & Interests */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1.5">
                  Accessibility Mode
                </label>
                <div className="space-y-2">
                  {accessProfiles.map((ap) => (
                    <button
                      key={ap.id}
                      type="button"
                      onClick={() => setAccessibilityProfile(ap.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        accessibilityProfile === ap.id
                          ? 'bg-sage-50 border-sage-500 text-sage-900 shadow-sm'
                          : 'bg-white border-sand-200 text-charcoal-700 hover:border-sand-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs block">{ap.label}</span>
                        <span className="text-[11px] text-charcoal-500">{ap.desc}</span>
                      </div>
                      {accessibilityProfile === ap.id && (
                        <Check className="w-4 h-4 text-sage-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">
                  Specific Interests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Architecture, textiles, street cuisine"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Step Buttons */}
          <div className="mt-8 pt-5 border-t border-sand-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:bg-sand-100 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm flex items-center gap-1.5 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm flex items-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'AI Architect Generating Itinerary...' : 'Generate AI Companion Trip'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripOnboardingPage;
