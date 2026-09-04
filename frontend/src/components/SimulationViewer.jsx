import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  MapPin, 
  Footprints, 
  Car, 
  Utensils, 
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  CloudSun
} from 'lucide-react';
import { simulationService } from '../services/api';

const SimulationViewer = ({ tripId }) => {
  const [simulationDays, setSimulationDays] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const playTimerRef = useRef(null);

  useEffect(() => {
    const fetchSimulation = async () => {
      if (!tripId) return;
      try {
        setLoading(true);
        const res = await simulationService.getTripSimulation(tripId);
        if (res && res.data) {
          setSimulationDays(res.data);
          setSelectedDayIndex(0);
          setCurrentStepIndex(0);
        }
      } catch (err) {
        console.error('Failed to load simulation', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, [tripId]);

  const activeDay = simulationDays[selectedDayIndex];
  const steps = activeDay?.steps || [];

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500); // 2.5 seconds per step
    } else {
      clearInterval(playTimerRef.current);
    }
    return () => clearInterval(playTimerRef.current);
  }, [isPlaying, steps.length]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const getStepIcon = (type) => {
    switch (type) {
      case 'DEPARTURE':
      case 'RETURN':
        return <MapPin className="w-4 h-4 text-terracotta-600" />;
      case 'WALK':
        return <Footprints className="w-4 h-4 text-sage-600" />;
      case 'TRANSIT':
        return <Car className="w-4 h-4 text-charcoal-600" />;
      case 'MEAL':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-terracotta-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-sand-200 text-center animate-pulse">
        <Clock className="w-8 h-8 text-terracotta-400 mx-auto mb-2 animate-spin" />
        <p className="text-sm font-semibold text-charcoal-700">Simulating your trip minute-by-minute...</p>
      </div>
    );
  }

  if (!activeDay) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-sand-200 text-center text-charcoal-500">
        Simulation data is being generated.
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <div className="bg-white rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
      {/* Simulation Header */}
      <div className="bg-sand-50 border-b border-sand-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-terracotta-500 text-white">
                Signature Feature
              </span>
              <h2 className="font-display font-bold text-lg text-charcoal-800">
                AI Trip Simulation
              </h2>
            </div>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Live minute-by-minute preview — turn anxiety about "what if" into confidence about "what next"
            </p>
          </div>

          {/* Day Selector */}
          <div className="flex items-center gap-1.5 bg-sand-200/70 p-1 rounded-xl">
            {simulationDays.map((day, idx) => (
              <button
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDayIndex(idx);
                  setCurrentStepIndex(0);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDayIndex === idx
                    ? 'bg-terracotta-500 text-white shadow-sm'
                    : 'text-charcoal-700 hover:text-charcoal-900'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Playback Controls & Progress Bar */}
        <div className="mt-5 pt-4 border-t border-sand-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Play Simulation'}</span>
            </button>
            <button
              onClick={handleReset}
              title="Reset Timeline"
              className="p-2 rounded-xl text-charcoal-600 hover:bg-sand-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-charcoal-600">
            <span>Step {currentStepIndex + 1} of {steps.length}</span>
            <span className="text-sand-400">•</span>
            <span>Total Est. Cost: ₹{activeDay.totalEstimatedCost}</span>
            <span className="text-sand-400">•</span>
            <span>Duration: ~{Math.round(activeDay.totalDurationMinutes / 60)} hrs</span>
          </div>
        </div>

        {/* Timeline Progress Track */}
        <div className="mt-3 w-full bg-sand-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-terracotta-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Live Stage Highlight (The Active Simulated Moment) */}
      {currentStep && (
        <div className="bg-ivory-100/70 border-b border-sand-200 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl p-5 border border-terracotta-200/80 shadow-warm">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-terracotta-600" />
                {currentStep.time}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-400">
                {currentStep.stepType}
              </span>
            </div>

            <h3 className="font-display font-bold text-lg text-charcoal-800 mb-1">
              {currentStep.activityTitle}
            </h3>
            <p className="text-xs font-medium text-terracotta-700 flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentStep.placeName}</span>
            </p>

            <p className="text-xs text-charcoal-600 leading-relaxed mb-4 bg-sand-50 p-3 rounded-lg border border-sand-200">
              {currentStep.instruction}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-sand-200 text-[11px]">
              <div>
                <span className="text-charcoal-400 block font-medium">Duration</span>
                <span className="font-bold text-charcoal-700">{currentStep.durationMinutes} mins</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Est. Cost</span>
                <span className="font-bold text-charcoal-700">₹{currentStep.cost || 0}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Crowd Level</span>
                <span className="font-bold text-sage-700">{currentStep.crowdLevel || 'Quiet'}</span>
              </div>
              <div>
                <span className="text-charcoal-400 block font-medium">Atmosphere</span>
                <span className="font-bold text-charcoal-700 truncate">{currentStep.weatherNote || 'Comfortable'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step Sequence Scrubber */}
      <div className="p-5 max-h-80 overflow-y-auto space-y-2">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;

          return (
            <div
              key={idx}
              onClick={() => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
              className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isCurrent
                  ? 'bg-terracotta-50/80 border-terracotta-400 shadow-sm'
                  : isPassed
                  ? 'bg-sand-50/40 border-sand-200 opacity-70 hover:opacity-100'
                  : 'bg-white border-sand-200 hover:border-sand-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCurrent
                    ? 'bg-terracotta-500 text-white'
                    : isPassed
                    ? 'bg-sage-500 text-white'
                    : 'bg-sand-200 text-charcoal-600'
                }`}>
                  {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-terracotta-700">{step.time}</span>
                    <span className="text-xs font-semibold text-charcoal-800">{step.activityTitle}</span>
                  </div>
                  <span className="text-[11px] text-charcoal-500">{step.placeName}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-charcoal-700 block">
                  {step.cost ? `₹${step.cost}` : 'Free'}
                </span>
                <span className="text-[10px] text-charcoal-400 font-medium">
                  {step.durationMinutes}m
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimulationViewer;
