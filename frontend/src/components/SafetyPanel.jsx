import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Building2, 
  HeartPulse, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';
import { discoveryService } from '../services/api';

const SafetyPanel = ({ destination = 'Jaipur', travelProfile = 'SOLO' }) => {
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('emergency'); // 'emergency', 'police', 'medical'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSafety = async () => {
      try {
        setLoading(true);
        const res = await discoveryService.getSafetyReport(destination, travelProfile);
        if (res && res.data) {
          setReport(res.data);
        }
      } catch (err) {
        console.error('Failed to load safety report', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSafety();
  }, [destination, travelProfile]);

  if (loading) {
    return <div className="p-4 text-xs text-charcoal-400">Loading safety signals...</div>;
  }

  if (!report) return null;

  return (
    <div className="bg-white rounded-2xl border border-sand-300 shadow-warm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sage-100 text-sage-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-charcoal-800">
              AI Safety Score & Dispatch
            </h3>
            <span className="text-[10px] text-charcoal-400 font-medium">
              Geofenced for solo, female & night exploration
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xl font-extrabold text-sage-700 block leading-tight">
            {report.overallScore}/100
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600">
            {report.safetyLevel} SAFE
          </span>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs text-charcoal-700 leading-relaxed mb-4">
        {report.primaryAdvice}
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-sand-100/70 p-1 rounded-xl mb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'emergency' ? 'bg-white text-terracotta-700 shadow-sm font-bold' : 'text-charcoal-600'
          }`}
        >
          Helplines
        </button>
        <button
          onClick={() => setActiveTab('police')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'police' ? 'bg-white text-terracotta-700 shadow-sm font-bold' : 'text-charcoal-600'
          }`}
        >
          Police
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'medical' ? 'bg-white text-terracotta-700 shadow-sm font-bold' : 'text-charcoal-600'
          }`}
        >
          Hospitals
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-2 text-xs">
        {activeTab === 'emergency' &&
          report.emergencyContacts.map((c, idx) => (
            <a
              key={idx}
              href={`tel:${c.phone}`}
              className="p-2.5 rounded-xl bg-ivory-50 border border-sand-200 flex items-center justify-between hover:border-terracotta-300 transition-all group"
            >
              <div>
                <span className="font-bold text-charcoal-800 block">{c.name}</span>
                <span className="text-[11px] text-charcoal-500">{c.description}</span>
              </div>
              <div className="flex items-center gap-1 text-terracotta-600 font-bold bg-terracotta-50 px-2 py-1 rounded-lg">
                <Phone className="w-3 h-3" />
                <span>{c.phone}</span>
              </div>
            </a>
          ))}

        {activeTab === 'police' &&
          report.nearbyPoliceStations.map((p, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-ivory-50 border border-sand-200 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-charcoal-800 block truncate max-w-[200px]">{p.name}</span>
                <span className="text-[11px] text-sage-700 font-medium">Distance: {p.distance}</span>
              </div>
              <a
                href={`tel:${p.contact}`}
                className="text-charcoal-600 hover:text-terracotta-600 font-semibold text-[11px] flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </a>
            </div>
          ))}

        {activeTab === 'medical' &&
          report.nearbyHospitals.map((h, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-ivory-50 border border-sand-200 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-charcoal-800 block truncate max-w-[200px]">{h.name}</span>
                <span className="text-[11px] text-terracotta-700 font-medium">Distance: {h.distance}</span>
              </div>
              <a
                href={`tel:${h.contact}`}
                className="text-charcoal-600 hover:text-terracotta-600 font-semibold text-[11px] flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </a>
            </div>
          ))}
      </div>

      {/* Disclaimers */}
      <p className="text-[10px] text-charcoal-400 mt-3 pt-2 border-t border-sand-200 italic">
        * Safety scores are computed from neighborhood lighting, municipal police presence, and tourist footfall indices.
      </p>
    </div>
  );
};

export default SafetyPanel;
