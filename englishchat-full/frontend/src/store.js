import { create } from 'zustand';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// =====================
// AUTH STORE
// =====================
export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  token: localStorage.getItem('authToken') || null,

  checkAuth: async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        set({ user, isAuthenticated: true, token });
      } catch {
        set({ isAuthenticated: false, token: null });
      }
    }
  },

  signUp: async (email, password, firstName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        firstName
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        isLoading: false,
        isAuthenticated: true,
        user,
        token,
        error: null
      });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Signup failed';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        isLoading: false,
        isAuthenticated: true,
        user,
        token,
        error: null
      });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    set({
      user: null,
      isAuthenticated: false,
      token: null,
      error: null
    });
  },

  clearError: () => set({ error: null })
}));

// =====================
// LESSON STORE
// =====================
export const useLessonStore = create((set, get) => ({
  lessons: [],
  selectedLevel: 'A1',
  currentLesson: null,
  userProgress: {},
  isLoading: false,
  error: null,

  fetchLessons: async (level = 'A1') => {
    set({ isLoading: true, error: null, selectedLevel: level });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/lessons?level=${level}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ lessons: response.data, isLoading: false });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch lessons';
      set({ error: msg, isLoading: false });
      return { success: false };
    }
  },

  fetchLessonDetail: async (lessonId) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ currentLesson: response.data, isLoading: false });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to fetch lesson';
      set({ error: msg, isLoading: false });
      return { success: false };
    }
  },

  completeLesson: async (lessonId, score = 100) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/lessons/${lessonId}/complete`,
        { score },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        userProgress: {
          ...state.userProgress,
          [lessonId]: { completed: true, xpEarned: response.data.xpEarned }
        }
      }));

      return { success: true, xpEarned: response.data.xpEarned };
    } catch (error) {
      return { success: false };
    }
  },

  clearError: () => set({ error: null })
}));

// =====================
// CALL STORE
// =====================
export const useCallStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  isSearching: false,
  matchFound: null,
  inCall: false,
  callDuration: 0,
  callHistory: [],
  error: null,

  initializeSocket: () => {
    const token = localStorage.getItem('authToken');
    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true
    });

    socket.on('connect', () => {
      set({ socket, isConnected: true });
    });

    socket.on('match_found', (data) => {
      set({ matchFound: data, isSearching: false });
    });

    socket.on('waiting_for_partner', (data) => {
      set({ isSearching: true });
    });

    return socket;
  },

  searchPartner: async (level) => {
    const state = get();
    if (!state.socket) {
      const socket = state.initializeSocket();
      set({ socket });
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    state.socket?.emit('search_partner', {
      userId: user.id,
      level
    });

    set({ isSearching: true, error: null });
  },

  cancelSearch: () => {
    const state = get();
    if (state.socket) {
      state.socket.emit('leave_matchmaking');
    }
    set({ isSearching: false, matchFound: null });
  },

  startCall: () => {
    set({ inCall: true, matchFound: null });
  },

  endCall: async (duration, rating, feedback) => {
    const state = get();
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/calls/end`,
        { duration, rating, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      state.socket?.emit('call_ended');
      set({
        inCall: false,
        callDuration: 0,
        callHistory: [response.data, ...state.callHistory]
      });

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  fetchCallHistory: async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/calls/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ callHistory: response.data });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  clearError: () => set({ error: null })
}));

// =====================
// USER STATS STORE
// =====================
export const useUserStatsStore = create((set) => ({
  stats: {
    xpTotal: 0,
    lessonsCompleted: 0,
    callsTotal: 0,
    streak: 0,
    badges: []
  },
  isLoading: false,

  fetchUserStats: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/users/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ stats: response.data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false };
    }
  }
}));
