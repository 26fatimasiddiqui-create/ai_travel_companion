import React from 'react';
import { useTrip } from '../context/TripContext';
import SimulationViewer from '../components/SimulationViewer';
import { Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SimulationPage = () => {
  const { activeTrip } = useTrip();

  return (
    <div className="min-h-screen bg-ivory-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 hover:text-terracotta-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <span className="text-xs text-charcoal-400">
            Destination: <strong className="text-charcoal-700">{activeTrip?.destination || 'Jaipur'}</strong>
          </span>
        </div>

        {/* Simulation Component */}
        <SimulationViewer tripId={activeTrip?.id} />

        {/* Explanatory notes */}
        <div className="bg-sand-50 rounded-2xl border border-sand-200 p-5 text-xs text-charcoal-600 leading-relaxed">
          <h4 className="font-bold text-charcoal-800 mb-1">How AI Trip Simulation Works:</h4>
          <p>
            Unlike conventional static apps that only list stops, the AI Simulation calculates realistic door-to-door transit times, footstep walking paths, ticket queues, and midday sun exposure. You can step forward minute-by-minute or press <strong>Play</strong> to visualize the pacing of your entire journey.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SimulationPage;
