import React, { useState } from 'react';
import { 
  Sparkles, 
  CloudRain, 
  Clock, 
  Navigation, 
  AlertTriangle, 
  Check, 
  X, 
  HelpCircle, 
  ArrowRight,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { companionService } from '../services/api';

const CompanionCard = () => {
  const { companionAlerts, handleAcceptAlert, handleRejectAlert, activeTrip, loadTripDetails } = useTrip();
  const [whyExplanation, setWhyExplanation] = useState(null);
  const [loadingWhyId, setLoadingWhyId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const pendingAlerts = companionAlerts.filter((a) => a.status === 'PENDING');

  const handleAskWhy = async (alertId) => {
    try {
      setLoadingWhyId(alertId);
      const res = await companionService.askWhy(alertId);
      if (res && res.data) {
        setWhyExplanation({ alertId, text: res.data.reasoning });
      }
    } catch (err) {
      setWhyExplanation({
        alertId,
        text: 'This proactive advice was calculated using real-time atmospheric readings, historic visitor influx metrics, and your selected travel pace.'
      });
    } finally {
      setLoadingWhyId(null);
    }
  };

  const handleRegenerate = async () => {
    if (!activeTrip?.id) return;
    setRefreshing(true);
    await loadTripDetails(activeTrip.id);
    setTimeout(() => setRefreshing(false), 600);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'WEATHER':
        return <CloudRain className="w-5 h-5 text-terracotta-500" />;
      case 'CLOSING_SOON':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'TRAFFIC':
        return <Navigation className="w-5 h-5 text-sage-600" />;
      case 'BUDGET':
        return <AlertTriangle className="w-5 h-5 text-terracotta-600" />;
      case 'SAFETY':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-terracotta-500" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'WEATHER':
        return 'bg-terracotta-100 text-terracotta-800 border-terracotta-200';
      case 'CLOSING_SOON':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'TRAFFIC':
        return 'bg-sage-100 text-sage-800 border-sage-200';
      case 'BUDGET':
        return 'bg-sand-200 text-charcoal-800 border-sand-300';
      default:
        return 'bg-sand-100 text-charcoal-700 border-sand-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sand-300/80 shadow-warm overflow-hidden transition-all">
      {/* Card Header */}
      <div className="bg-sand-50/80 border-b border-sand-200 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-charcoal-800">
                Live AI Travel Companion
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-terracotta-100 text-terracotta-700">
                Flagship
              </span>
            </div>
            <p className="text-xs text-charcoal-500">
              Watching your schedule, weather & wallet in real-time
            </p>
          </div>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={refreshing}
          title="Refresh Live Companion Alerts"
          className="p-2 rounded-lg text-charcoal-500 hover:text-terracotta-600 hover:bg-sand-100 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-terracotta-500' : ''}`} />
        </button>
      </div>

      {/* Card Body: Active Alerts */}
      <div className="p-5 space-y-4">
        {pendingAlerts.length === 0 ? (
          <div className="text-center py-6 px-4 rounded-xl bg-sand-50/60 border border-sand-200">
            <Sparkles className="w-8 h-8 text-sage-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-charcoal-800">
              All signals clear!
            </p>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto mt-1">
              Your itinerary is smoothly synced with current weather, monument timings, and budget caps.
            </p>
          </div>
        ) : (
          pendingAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-sand-200/90 bg-ivory-50/60 p-4 transition-all hover:border-terracotta-300"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white shadow-soft border border-sand-200">
                    {getAlertIcon(alert.alertType)}
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border mb-1 ${getBadgeStyle(alert.alertType)}`}>
                      {alert.alertType.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-charcoal-800 leading-tight">
                      {alert.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Message */}
              <p className="text-xs text-charcoal-600 leading-relaxed mb-3">
                {alert.message}
              </p>

              {/* Action Proposal */}
              {alert.suggestedAction && (
                <div className="mb-3.5 p-2.5 rounded-lg bg-white border border-sand-200 flex items-center gap-2 text-xs">
                  <span className="font-semibold text-terracotta-700 shrink-0">Recommendation:</span>
                  <span className="text-charcoal-700">{alert.suggestedAction}</span>
                </div>
              )}

              {/* Original -> Replacement swap preview if present */}
              {alert.originalItem && alert.replacementItem && (
                <div className="mb-3.5 flex items-center gap-2 text-xs text-charcoal-500 bg-sand-100/60 p-2 rounded-lg">
                  <span className="line-through truncate max-w-[45%]">{alert.originalItem}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                  <span className="font-semibold text-charcoal-800 truncate">{alert.replacementItem}</span>
                </div>
              )}

              {/* Transparent "Why" explanation if opened */}
              {whyExplanation?.alertId === alert.id && (
                <div className="mb-3.5 p-3 rounded-lg bg-sage-50 border border-sage-200 text-xs text-charcoal-700 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-sage-700 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Reasoning</span>
                  </div>
                  <p className="leading-relaxed">{whyExplanation.text}</p>
                </div>
              )}

              {/* User Action Controls */}
              <div className="flex items-center justify-between pt-1 border-t border-sand-200/60">
                <button
                  onClick={() => handleAskWhy(alert.id)}
                  disabled={loadingWhyId === alert.id}
                  className="text-xs font-semibold text-charcoal-500 hover:text-terracotta-600 flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{loadingWhyId === alert.id ? 'Analyzing...' : 'Ask AI Why'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRejectAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-charcoal-600 hover:bg-sand-200/70 flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Keep Current</span>
                  </button>
                  <button
                    onClick={() => handleAcceptAlert(alert.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Recommendation</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanionCard;
