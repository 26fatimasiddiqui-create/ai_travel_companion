import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { memoryService } from '../services/api';
import { 
  Camera, 
  Plus, 
  Calendar, 
  MapPin, 
  Heart, 
  Trash2, 
  Sparkles,
  Smile,
  BookOpen
} from 'lucide-react';

const MemoriesPage = () => {
  const { activeTrip } = useTrip();
  const [memories, setMemories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [emotionTag, setEmotionTag] = useState('JOYFUL');
  const [loading, setLoading] = useState(true);

  const fetchMemories = async () => {
    if (!activeTrip?.id) return;
    try {
      setLoading(true);
      const res = await memoryService.getMemories(activeTrip.id);
      if (res && res.data) {
        setMemories(res.data);
      }
    } catch (err) {
      console.error('Failed to load memories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [activeTrip?.id]);

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!placeName || !activeTrip?.id) return;
    try {
      const res = await memoryService.createMemory(activeTrip.id, {
        placeName,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        visitDate,
        notes,
        expenseAmount: expenseAmount ? parseFloat(expenseAmount) : 0.0,
        emotionTag,
      });
      if (res && res.data) {
        setMemories([res.data, ...memories]);
        setPlaceName('');
        setPhotoUrl('');
        setNotes('');
        setExpenseAmount('');
        setShowAdd(false);
      }
    } catch (err) {
      console.error('Failed to create memory', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await memoryService.deleteMemory(id);
      setMemories(memories.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const emotions = [
    { id: 'JOYFUL', label: 'Joyful & Uplifting', color: 'bg-amber-100 text-amber-800' },
    { id: 'PEACEFUL', label: 'Peaceful & Serene', color: 'bg-sage-100 text-sage-800' },
    { id: 'ADVENTUROUS', label: 'Adventurous', color: 'bg-terracotta-100 text-terracotta-800' },
    { id: 'DELICIOUS', label: 'Delicious Food', color: 'bg-sand-200 text-charcoal-800' },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-xs font-bold text-charcoal-700 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Digital Travel Journal</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl text-charcoal-900">
              Memory Timeline & Stories
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Turn your trip into a lasting chronicle of moments, photos, and reflections.
            </p>
          </div>

          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
        </div>

        {/* Add Memory Form */}
        {showAdd && (
          <form onSubmit={handleAddMemory} className="bg-white rounded-3xl border border-sand-300 p-6 shadow-warm animate-fadeIn space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-charcoal-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-terracotta-600" />
                Capture New Travel Memory
              </h3>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="text-xs text-charcoal-400 hover:text-charcoal-700"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Place Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hawa Mahal Courtyard"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Photo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Visit Date</label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">Emotion Tag</label>
                <select
                  value={emotionTag}
                  onChange={(e) => setEmotionTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none bg-white"
                >
                  {emotions.map((em) => (
                    <option key={em.id} value={em.id}>{em.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 block mb-1">Notes & Reflection</label>
              <textarea
                rows={3}
                placeholder="What was the weather like? What did you discover? What made this moment unforgettable?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm transition-all"
            >
              Save to Journal
            </button>
          </form>
        )}

        {/* Memories Timeline Feed */}
        {loading ? (
          <div className="text-center py-16 text-xs text-charcoal-400">Loading journal memories...</div>
        ) : memories.length === 0 ? (
          <div className="bg-white rounded-3xl border border-sand-300 p-12 text-center">
            <BookOpen className="w-10 h-10 text-sand-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-charcoal-800">Your journal awaits</h3>
            <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
              Capture your first memory from the trip — upload a photo, describe the sunset, and record the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="bg-white rounded-3xl border border-sand-300 shadow-soft hover:shadow-warm transition-all overflow-hidden"
              >
                {mem.photoUrl && (
                  <div className="h-64 sm:h-80 w-full overflow-hidden bg-sand-200">
                    <img
                      src={mem.photoUrl}
                      alt={mem.placeName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-terracotta-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {mem.placeName}
                      </span>
                      <span className="text-charcoal-300">•</span>
                      <span className="text-xs text-charcoal-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {mem.visitDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sand-100 text-charcoal-700">
                        {mem.emotionTag}
                      </span>
                      <button
                        onClick={() => handleDelete(mem.id)}
                        className="text-charcoal-300 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-charcoal-700 leading-relaxed font-normal mt-2">
                    {mem.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MemoriesPage;
