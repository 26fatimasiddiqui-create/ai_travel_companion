import React, { useState, useEffect } from 'react';
import { Users, Clock, Info } from 'lucide-react';
import { discoveryService } from '../services/api';

const CrowdIndicator = ({ destination = 'Jaipur' }) => {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrowds = async () => {
      try {
        setLoading(true);
        const res = await discoveryService.getCrowdForecasts(destination);
        if (res && res.data) {
          setForecasts(res.data);
        }
      } catch (err) {
        console.error('Failed to load crowd data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrowds();
  }, [destination]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'QUIET':
        return 'bg-sage-100 text-sage-800 border-sage-300';
      case 'MODERATE':
        return 'bg-sand-200 text-charcoal-800 border-sand-300';
      case 'CROWDED':
        return 'bg-terracotta-100 text-terracotta-800 border-terracotta-300';
      default:
        return 'bg-sand-100 text-charcoal-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sand-300 shadow-warm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-terracotta-600" />
          <h3 className="font-display font-bold text-sm text-charcoal-800">
            Crowd Predictions & Timing
          </h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-charcoal-500 bg-sand-100 px-2 py-0.5 rounded-md">
          <Info className="w-3 h-3 text-terracotta-500" />
          <span>Estimated Peak Windows</span>
        </div>
      </div>

      <p className="text-xs text-charcoal-500 mb-4">
        AI schedules your monument entries around quiet windows to avoid ticket queues.
      </p>

      {loading ? (
        <div className="text-xs text-charcoal-400 py-3 text-center">Loading crowd estimates...</div>
      ) : (
        <div className="space-y-2.5">
          {forecasts.slice(0, 4).map((f, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-sand-50/70 border border-sand-200 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-charcoal-800 block truncate max-w-[180px]">
                  {f.placeName}
                </span>
                <span className="text-[11px] text-charcoal-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-sage-600" />
                  Best time: <strong className="text-charcoal-700">{f.bestTimeToVisit}</strong>
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(f.currentStatus)}`}>
                  {f.currentStatus}
                </span>
                <span className="text-[10px] text-charcoal-400 block mt-0.5">
                  ~{f.estimatedWaitMinutes}m queue
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CrowdIndicator;
