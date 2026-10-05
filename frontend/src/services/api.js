const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('nowaste_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE}/auth/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  },

  // Food
  getFoods: async (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== '' && params[k] !== null) {
        query.append(k, params[k]);
      }
    });
    const url = `${API_BASE}/food${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch food items');
    return data;
  },

  getFoodById: async (id) => {
    const res = await fetch(`${API_BASE}/food/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Food item not found');
    return data;
  },

  createFood: async (foodData) => {
    const res = await fetch(`${API_BASE}/food`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(foodData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to post food');
    return data;
  },

  updateFood: async (id, foodData) => {
    const res = await fetch(`${API_BASE}/food/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(foodData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update food');
    return data;
  },

  deleteFood: async (id) => {
    const res = await fetch(`${API_BASE}/food/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete food');
    return data;
  },

  getMetadata: async () => {
    const res = await fetch(`${API_BASE}/food/meta/categories-canteens`);
    if (!res.ok) return { canteens: [], categories: [] };
    return res.json();
  },

  // Claims
  claimFood: async (foodId, quantity) => {
    const res = await fetch(`${API_BASE}/claims`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ foodId, quantity })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to claim food');
    return data;
  },

  getMyClaims: async () => {
    const res = await fetch(`${API_BASE}/claims/my`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to retrieve your claims');
    return data;
  },

  getAllClaims: async () => {
    const res = await fetch(`${API_BASE}/claims`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to retrieve all claims');
    return data;
  },

  updateClaimStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/claims/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update claim status');
    return data;
  },

  // Dashboards
  getAdminDashboard: async () => {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to retrieve admin dashboard');
    return data;
  },

  getImpactMetrics: async () => {
    const res = await fetch(`${API_BASE}/impact`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to retrieve impact metrics');
    return data;
  },

  resetDemo: async () => {
    const res = await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
    return res.json();
  }
};
