import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import { groupService } from '../services/api';
import { 
  Users, 
  Share2, 
  Vote, 
  Sparkles, 
  Split, 
  CheckCircle2, 
  Copy, 
  Plus, 
  Check 
} from 'lucide-react';

const GroupPlannerPage = () => {
  const { activeTrip } = useTrip();
  const [group, setGroup] = useState(null);
  const [voterName, setVoterName] = useState('');
  const [places, setPlaces] = useState('');
  const [activities, setActivities] = useState('');
  const [budgetCap, setBudgetCap] = useState(4500);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchGroup = async () => {
    if (!activeTrip?.id) return;
    try {
      setLoading(true);
      const res = await groupService.getGroup(activeTrip.id);
      if (res && res.data) {
        setGroup(res.data);
      }
    } catch (err) {
      console.error('Failed to load group planner', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [activeTrip?.id]);

  const handleCopyCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVoteSubmit = async (e) => {
    e.preventDefault();
    if (!group?.id || !voterName.trim()) return;
    try {
      setSubmitting(true);
      const res = await groupService.submitVote(group.id, {
        voterName,
        preferredPlaces: places,
        preferredActivities: activities,
        budgetCap: parseFloat(budgetCap),
      });
      if (res && res.data) {
        setGroup(res.data);
        setVoterName('');
        setPlaces('');
        setActivities('');
      }
    } catch (err) {
      console.error('Vote submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-200 text-xs font-bold text-charcoal-700 mb-3">
            <Users className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Travel Together Planner</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-charcoal-900">
            Group Consensus & Split Engine
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-2">
            Built for groups who can never agree on a plan. Everyone votes — AI reconciles preferences into a compromise itinerary and divides expenses automatically.
          </p>
        </div>

        {/* Group Stats & Invite Code Card */}
        {group && (
          <div className="bg-white rounded-3xl border border-sand-300 p-6 shadow-warm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                  Active Group
                </span>
                <h2 className="font-display font-bold text-xl text-charcoal-800">
                  {group.groupName}
                </h2>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  {group.members.length} Confirmed Travelers: {group.members.join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-sand-100 px-4 py-2 rounded-xl border border-sand-300 text-xs">
                  <span className="text-charcoal-500 block text-[10px] font-bold uppercase">Invite Code</span>
                  <span className="font-mono font-bold text-charcoal-900">{group.inviteCode}</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Share Code'}</span>
                </button>
              </div>
            </div>

            {/* Split Expense Gauge */}
            <div className="mt-6 pt-5 border-t border-sand-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-charcoal-400 text-[11px] block font-semibold">Total Trip Cost</span>
                <span className="text-base font-bold text-charcoal-800">₹{(activeTrip?.budget || 5000).toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
                <span className="text-charcoal-400 text-[11px] block font-semibold">Number of Members</span>
                <span className="text-base font-bold text-charcoal-800">{group.members.length} Travelers</span>
              </div>
              <div className="p-3 rounded-xl bg-sage-50 border border-sage-200">
                <span className="text-sage-700 text-[11px] block font-bold">Split Per Person</span>
                <span className="text-base font-extrabold text-sage-800">
                  ₹{Math.round(group.totalSplitPerPerson).toLocaleString()} / person
                </span>
              </div>
            </div>
          </div>
        )}

        {/* AI Compromise Resolution Card */}
        {group?.compromiseSummary && (
          <div className="bg-white rounded-3xl border border-sand-300 p-6 shadow-warm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-terracotta-500 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-base text-charcoal-800">
                AI Compromise Consensus
              </h3>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed bg-sand-50 p-4 rounded-xl border border-sand-200">
              {group.compromiseSummary}
            </p>
          </div>
        )}

        {/* Member Votes Grid & Submission Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left: Voting Form (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-3xl border border-sand-300 p-6 shadow-warm">
            <div className="flex items-center gap-2 mb-4">
              <Vote className="w-4 h-4 text-terracotta-600" />
              <h3 className="font-display font-bold text-sm text-charcoal-800">
                Submit Your Preferences
              </h3>
            </div>

            <form onSubmit={handleVoteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samira Khan"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">
                  Must-See Places
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amber Fort, Nahargarh sunset"
                  value={places}
                  onChange={(e) => setPlaces(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">
                  Preferred Activities
                </label>
                <input
                  type="text"
                  placeholder="e.g. Street food tasting, photography"
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-700 block mb-1">
                  Comfortable Budget Cap (₹)
                </label>
                <input
                  type="number"
                  placeholder="4000"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-300 text-xs focus:ring-1 focus:ring-terracotta-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-warm transition-all"
              >
                {submitting ? 'Calculating Consensus...' : 'Submit Vote to Group'}
              </button>
            </form>
          </div>

          {/* Right: Existing Group Votes (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-sand-300 p-6 shadow-warm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-sm text-charcoal-800">
                Registered Traveler Preferences ({group?.votes?.length || 0})
              </h3>
              <span className="text-[10px] font-bold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-md border border-sage-200">
                All Votes Factored
              </span>
            </div>

            <div className="space-y-3">
              {group?.votes?.map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 rounded-2xl bg-sand-50/70 border border-sand-200 text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-charcoal-900">{v.voterName}</span>
                    <span className="text-[11px] font-semibold text-terracotta-700 bg-sand-100 px-2 py-0.5 rounded">
                      Budget Cap: ₹{v.budgetCap}
                    </span>
                  </div>
                  <div className="space-y-1 text-charcoal-600">
                    <p>
                      <strong className="text-charcoal-700">Favorites:</strong> {v.preferredPlaces || 'Open to recommendations'}
                    </p>
                    <p>
                      <strong className="text-charcoal-700">Activities:</strong> {v.preferredActivities || 'General exploration'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GroupPlannerPage;
