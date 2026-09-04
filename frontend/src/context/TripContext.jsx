import React, { createContext, useState, useEffect, useContext } from 'react';
import { tripService, companionService, budgetService, discoveryService } from '../services/api';
import { useAuth } from './AuthContext';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [companionAlerts, setCompanionAlerts] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await tripService.getUserTrips();
      if (res && res.data) {
        setTrips(res.data);
        if (res.data.length > 0 && !activeTrip) {
          setActiveTrip(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load trips', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTripDetails = async (tripId) => {
    if (!tripId) return;
    try {
      setLoading(true);
      const [itineraryRes, alertsRes, budgetRes] = await Promise.allSettled([
        tripService.getItinerary(tripId),
        companionService.getAlerts(tripId),
        budgetService.getBudgetSummary(tripId),
      ]);

      if (itineraryRes.status === 'fulfilled' && itineraryRes.value?.data) {
        setItinerary(itineraryRes.value.data);
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value?.data) {
        setCompanionAlerts(alertsRes.value.data);
      }
      if (budgetRes.status === 'fulfilled' && budgetRes.value?.data) {
        setBudgetSummary(budgetRes.value.data);
      }

      // Load destination weather
      if (activeTrip?.destination) {
        try {
          const wRes = await discoveryService.getWeather(activeTrip.destination);
          if (wRes && wRes.data) {
            setWeather(wRes.data);
          }
        } catch (we) {
          console.warn('Weather load fallback');
        }
      }
    } catch (err) {
      console.error('Error loading trip details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setTrips([]);
      setActiveTrip(null);
      setItinerary([]);
      setCompanionAlerts([]);
      setBudgetSummary(null);
      setWeather(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeTrip?.id) {
      loadTripDetails(activeTrip.id);
    }
  }, [activeTrip?.id]);

  const selectTrip = (trip) => {
    setActiveTrip(trip);
  };

  const handleToggleItem = async (itemId) => {
    try {
      const res = await tripService.toggleItineraryItem(itemId);
      if (res && res.data) {
        setItinerary((prev) =>
          prev.map((item) => (item.id === itemId ? res.data : item))
        );
      }
    } catch (err) {
      console.error('Toggle error', err);
    }
  };

  const handleAcceptAlert = async (alertId) => {
    try {
      const res = await companionService.acceptAlert(alertId);
      if (res && res.data) {
        setCompanionAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? res.data : a))
        );
        // Refresh itinerary to show replacement
        if (activeTrip?.id) {
          const itRes = await tripService.getItinerary(activeTrip.id);
          if (itRes && itRes.data) setItinerary(itRes.data);
        }
      }
    } catch (err) {
      console.error('Accept alert error', err);
    }
  };

  const handleRejectAlert = async (alertId) => {
    try {
      const res = await companionService.rejectAlert(alertId);
      if (res && res.data) {
        setCompanionAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? res.data : a))
        );
      }
    } catch (err) {
      console.error('Reject alert error', err);
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        setActiveTrip,
        selectTrip,
        itinerary,
        setItinerary,
        companionAlerts,
        budgetSummary,
        weather,
        loading,
        fetchTrips,
        loadTripDetails,
        handleToggleItem,
        handleAcceptAlert,
        handleRejectAlert,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
