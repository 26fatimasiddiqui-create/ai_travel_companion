import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { discoveryService, tripService } from '../services/api';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Clock, 
  Plus, 
  Check, 
  Tag, 
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

const HiddenGemsPage = () => {
  const { activeTrip, loadTripDetails } = useTrip();
  const [gems, setGems] = useState([]);
  const [moodFilter, setMoodFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState(new Set());

  const destination = activeTrip?.destination || 'Jaipur';

  const fetchGems = async () => {
    try {
      setLoading(true);
      const res = await discoveryService.getHiddenGems(destination, moodFilter);
      if (res && res.data) {
        setGems(res.data);
      }
    } catch (err) {
      console.error('Failed to load hidden gems', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGems();
  }, [destination, moodFilter]);

  const handleAddToItinerary = async (gem) => {
    if (!activeTrip?.id) return;
    try {
      // Create expense or note
      setAddedIds((prev) => new Set(prev).add(gem.id));
      await loadTripDetails(activeTrip.id);
    } catch (err) {
      console.error('Failed to add gem to trip', err);
    }
  };

  const moods = [
    { label: 'All Curated Gems', value: '' },
    { label: 'Relaxed & Quiet', value: 'RELAXED' },
    { label: 'Photography', value: 'PHOTOGRAPHY' },
    { label: 'Romantic', value: 'ROMANTIC' },
    { label: 'Adventure', value: 'ADVENTURE' },
    { label: 'Food Lover', value: 'FOOD_LOVER' },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-xs font-bold text-charcoal-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Off-The-Beaten-Path Secrets</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900">
            Hidden Gems of {destination}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-2">
            "Skip the guidebook — find what the guidebook missed." Local cafes, tranquil stepwells, and artisan courtyards.
          </p>
        </div>

        {/* Mood Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setMoodFilter(m.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                moodFilter === m.value
                  ? 'bg-terracotta-500 text-white shadow-warm'
                  : 'bg-white text-charcoal-700 border border-sand-300 hover:bg-sand-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Gems Grid */}
        {loading ? (
          <div className="text-center py-16 text-xs text-charcoal-400">
            Discovering local sanctuaries...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gems.map((gem) => (
              <div
                key={gem.id}
                className="bg-white rounded-2xl border border-sand-300 shadow-soft hover:shadow-warm transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-sand-200">
                    <img
                      src={gem.imageUrl || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'}
                      alt={gem.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 backdrop-blur-md text-terracotta-700 shadow-sm">
                      {gem.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sage-600 text-white shadow-sm">
                      Quiet Hours
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display font-bold text-base text-charcoal-800 mb-1">
                      {gem.name}
                    </h3>
                    <p className="text-[11px] text-terracotta-600 font-semibold flex items-center gap-1 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{gem.address}</span>
                    </p>
                    <p className="text-xs text-charcoal-500 leading-relaxed line-clamp-3 mb-4">
                      {gem.description}
                    </p>

                    <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-[11px] text-charcoal-600">
                      <span>Quiet: <strong>{gem.crowdQuietHours}</strong></span>
                      <span className="font-bold text-charcoal-800">
                        {gem.estimatedCost ? `₹${gem.estimatedCost}` : 'Free'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleAddToItinerary(gem)}
                    disabled={addedIds.has(gem.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      addedIds.has(gem.id)
                        ? 'bg-sage-100 text-sage-800'
                        : 'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm active:scale-95'
                    }`}
                  >
                    {addedIds.has(gem.id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved to Trip</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Itinerary</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default HiddenGemsPage;
