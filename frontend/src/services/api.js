import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travel_companion_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent unwrapping
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional auto-logout on unauthorized
      // localStorage.removeItem('travel_companion_token');
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const tripService = {
  createTrip: (tripData) => api.post('/trips', tripData),
  getUserTrips: () => api.get('/trips'),
  getTripById: (id) => api.get(`/trips/${id}`),
  updateTrip: (id, tripData) => api.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  generateItinerary: (tripId) => api.post(`/trips/${tripId}/generate-itinerary`),
  getItinerary: (tripId) => api.get(`/trips/${tripId}/itinerary`),
  toggleItineraryItem: (itemId) => api.patch(`/trips/itinerary/${itemId}/toggle`),
  updateItineraryItem: (itemId, data) => api.put(`/trips/itinerary/${itemId}`, data),
};

export const budgetService = {
  getExpenses: (tripId) => api.get(`/trips/${tripId}/expenses`),
  addExpense: (tripId, expense) => api.post(`/trips/${tripId}/expenses`, expense),
  deleteExpense: (expenseId) => api.delete(`/expenses/${expenseId}`),
  getBudgetSummary: (tripId) => api.get(`/trips/${tripId}/budget/summary`),
};

export const companionService = {
  getAlerts: (tripId) => api.get(`/trips/${tripId}/companion/alerts`),
  acceptAlert: (alertId) => api.post(`/companion/alerts/${alertId}/accept`),
  rejectAlert: (alertId) => api.post(`/companion/alerts/${alertId}/reject`),
  askWhy: (alertId) => api.get(`/companion/alerts/${alertId}/why`),
};

export const simulationService = {
  getTripSimulation: (tripId) => api.get(`/trips/${tripId}/simulation`),
};

export const discoveryService = {
  getHiddenGems: (destination, mood) => api.get('/places/hidden-gems', { params: { destination, mood } }),
  getCrowdForecasts: (destination) => api.get('/places/crowds', { params: { destination } }),
  getSafetyReport: (destination, profile) => api.get('/places/safety', { params: { destination, profile } }),
  getPlaces: (destination) => api.get('/places', { params: { destination } }),
  getWeather: (destination) => api.get('/weather', { params: { destination } }),
  getHotels: (destination) => api.get('/hotels', { params: { destination } }),
};

export const groupService = {
  getGroup: (tripId) => api.get(`/trips/${tripId}/group`),
  createGroup: (tripId, groupName) => api.post(`/trips/${tripId}/group`, null, { params: { groupName } }),
  submitVote: (groupId, vote) => api.post(`/groups/${groupId}/vote`, vote),
};

export const packingService = {
  getPackingList: (tripId) => api.get(`/trips/${tripId}/packing-list`),
  toggleItem: (itemId) => api.patch(`/packing-list/${itemId}/toggle`),
  addItem: (tripId, item) => api.post(`/trips/${tripId}/packing-list`, item),
  deleteItem: (itemId) => api.delete(`/packing-list/${itemId}`),
  regenerateList: (tripId) => api.post(`/trips/${tripId}/packing-list/regenerate`),
};

export const memoryService = {
  getMemories: (tripId) => api.get(`/trips/${tripId}/memories`),
  createMemory: (tripId, memory) => api.post(`/trips/${tripId}/memories`, memory),
  deleteMemory: (memoryId) => api.delete(`/memories/${memoryId}`),
};

export default api;
