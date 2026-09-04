import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  AlertCircle, 
  Check, 
  ArrowDownRight, 
  Plus, 
  PieChart, 
  Sparkles,
  Receipt
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { budgetService } from '../services/api';

const BudgetOptimizer = () => {
  const { activeTrip, budgetSummary, loadTripDetails } = useTrip();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!budgetSummary) return null;

  const {
    totalBudget = 0,
    totalPlanned = 0,
    totalActual = 0,
    remainingBudget = 0,
    projectedCost = 0,
    isOverBudget = false,
    overBudgetAmount = 0,
    categorySpending = {},
    optimizationSuggestions = []
  } = budgetSummary;

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount || !activeTrip?.id) return;
    try {
      setLoading(true);
      await budgetService.addExpense(activeTrip.id, {
        title,
        category,
        amount: parseFloat(amount),
        notes,
        isPlanned: false,
      });
      setTitle('');
      setAmount('');
      setNotes('');
      setShowAddExpense(false);
      await loadTripDetails(activeTrip.id);
    } catch (err) {
      console.error('Failed to log expense', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['HOTEL', 'FOOD', 'TRANSPORT', 'TICKETS', 'EMERGENCY', 'OTHER'];

  return (
    <div className="bg-white rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
      {/* Header */}
      <div className="bg-sand-50 border-b border-sand-200 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-sm">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-charcoal-800">
                AI Budget Optimizer
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sand-200 text-charcoal-700">
                Real Ledger
              </span>
            </div>
            <p className="text-xs text-charcoal-500">
              Live tracking against ₹{totalBudget.toLocaleString()} allocation
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddExpense(!showAddExpense)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* Financial Overview Metrics */}
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
            <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider block">Total Budget</span>
            <span className="text-lg font-bold text-charcoal-900 mt-1 block">₹{totalBudget.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
            <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider block">Spent Actual</span>
            <span className="text-lg font-bold text-terracotta-600 mt-1 block">₹{totalActual.toLocaleString()}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
            <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider block">Remaining</span>
            <span className={`text-lg font-bold mt-1 block ${remainingBudget < 0 ? 'text-red-600' : 'text-sage-700'}`}>
              ₹{remainingBudget.toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200">
            <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider block">Projected Total</span>
            <span className={`text-lg font-bold mt-1 block ${isOverBudget ? 'text-red-600' : 'text-charcoal-800'}`}>
              ₹{projectedCost.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Add Expense Form Modal/Inline */}
        {showAddExpense && (
          <form onSubmit={handleAddExpense} className="mb-5 p-4 rounded-xl bg-ivory-50 border border-terracotta-200/80 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-terracotta-600" />
                Record Transaction
              </h4>
              <button
                type="button"
                onClick={() => setShowAddExpense(false)}
                className="text-xs text-charcoal-400 hover:text-charcoal-700"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[11px] font-semibold text-charcoal-600 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lunch at LMB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-charcoal-600 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-charcoal-600 block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="250"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold transition-all"
            >
              {loading ? 'Saving...' : 'Confirm & Recalculate'}
            </button>
          </form>
        )}

        {/* Over-budget Alert & AI Optimization Suggestions */}
        {isOverBudget && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Projected spending exceeds budget by ₹{Math.round(overBudgetAmount).toLocaleString()}</span>
            </div>
            <p className="text-xs text-charcoal-600 mb-3">
              The AI companion has analyzed cheaper alternatives to pull the total trip cost back under your ₹{totalBudget.toLocaleString()} target:
            </p>
            <div className="space-y-2">
              {optimizationSuggestions.map((opt, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-red-100 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-charcoal-800">{opt.suggestedItem}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sage-100 text-sage-800">
                        Save ₹{opt.potentialSavings}
                      </span>
                    </div>
                    <p className="text-charcoal-500 text-[11px] leading-relaxed">{opt.reason}</p>
                  </div>
                  <span className="line-through text-charcoal-400 font-medium shrink-0">₹{opt.originalCost}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Breakdown Progress */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-charcoal-700 uppercase tracking-wider flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-terracotta-600" />
            Category-wise Allocation
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(categorySpending).map(([cat, val]) => {
              const pct = totalBudget > 0 ? Math.min(100, Math.round((val / totalBudget) * 100)) : 0;
              return (
                <div key={cat} className="p-2.5 rounded-lg bg-sand-50/60 border border-sand-200">
                  <div className="flex justify-between font-semibold text-charcoal-700 mb-1 text-[11px]">
                    <span>{cat}</span>
                    <span>₹{Math.round(val)}</span>
                  </div>
                  <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-terracotta-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOptimizer;
