import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  RotateCw, 
  Luggage, 
  Sparkles 
} from 'lucide-react';
import { packingService } from '../services/api';

const PackingChecklist = ({ tripId }) => {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('GEAR');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchItems = async () => {
    if (!tripId) return;
    try {
      setLoading(true);
      const res = await packingService.getPackingList(tripId);
      if (res && res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Failed to load packing list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [tripId]);

  const handleToggle = async (id) => {
    try {
      const res = await packingService.toggleItem(id);
      if (res && res.data) {
        setItems((prev) => prev.map((item) => (item.id === id ? res.data : item)));
      }
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !tripId) return;
    try {
      const res = await packingService.addItem(tripId, {
        itemName: newItemName,
        category: newCategory,
        weatherTrigger: 'Custom traveler addition',
      });
      if (res && res.data) {
        setItems((prev) => [...prev, res.data]);
        setNewItemName('');
      }
    } catch (err) {
      console.error('Add item failed', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await packingService.deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleRegenerate = async () => {
    if (!tripId) return;
    try {
      setRegenerating(true);
      const res = await packingService.regenerateList(tripId);
      if (res && res.data) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Regenerate failed', err);
    } finally {
      setRegenerating(false);
    }
  };

  const packedCount = items.filter((i) => i.isPacked).length;
  const progressPct = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  // Group by category
  const categories = ['CLOTHING', 'DOCUMENTS', 'ELECTRONICS', 'HEALTH', 'GEAR'];

  return (
    <div className="bg-white rounded-2xl border border-sand-300 shadow-warm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center">
            <Luggage className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-charcoal-800">
              Smart Weather Packing List
            </h3>
            <span className="text-[10px] text-charcoal-400 font-medium">
              Auto-tailored to duration & destination climate
            </span>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          title="Regenerate from weather forecast"
          className="p-1.5 rounded-lg text-charcoal-500 hover:text-terracotta-600 hover:bg-sand-100 transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin text-terracotta-500' : ''}`} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 bg-sand-50 p-3 rounded-xl border border-sand-200">
        <div className="flex justify-between text-xs font-semibold text-charcoal-700 mb-1.5">
          <span>Packing Readiness</span>
          <span>{packedCount} / {items.length} items ({progressPct}%)</span>
        </div>
        <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-sage-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add custom item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-2 py-1.5 rounded-lg border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Checklist items by category */}
      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div key={cat}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 mb-1.5">
                {cat}
              </h4>
              <div className="space-y-1">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs transition-all ${
                      item.isPacked
                        ? 'bg-sand-50/50 border-sand-200 text-charcoal-400 line-through'
                        : 'bg-white border-sand-200 text-charcoal-800'
                    }`}
                  >
                    <div
                      onClick={() => handleToggle(item.id)}
                      className="flex items-center gap-2 cursor-pointer flex-1"
                    >
                      {item.isPacked ? (
                        <CheckSquare className="w-4 h-4 text-sage-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-sand-400 shrink-0" />
                      )}
                      <span>{item.itemName}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.weatherTrigger && (
                        <span className="text-[10px] text-terracotta-600 hidden sm:inline">
                          {item.weatherTrigger}
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-charcoal-300 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackingChecklist;
