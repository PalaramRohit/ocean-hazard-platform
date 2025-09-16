// API Service for handling all backend communication
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new Error('Invalid response from server');
  }
  
  if (!response.ok) {
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      data
    });
    const error = data?.message || `Request failed with status ${response.status}`;
    return Promise.reject(error);
  }
  return data;
}

// Common headers for all requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// Auth API
export const authAPI = {
  async login(username, password, role) {
    console.log('Attempting login with:', { username, role });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password, role }),
        credentials: 'include'
      });
      const data = await handleResponse(response);
      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  },
  
  async getCurrentUser() {
    try {
      console.log('Fetching current user...');
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });
      const user = await handleResponse(response);
      console.log('Current user:', user);
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
};

// Reports API
export const reportsAPI = {
  async createReport(reportData) {
    try {
      console.log('Creating report:', reportData);
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reportData),
        credentials: 'include'
      });
      const data = await handleResponse(response);
      console.log('Report created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },
  
  async getReports() {
    try {
      console.log('Fetching reports...');
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });
      const data = await handleResponse(response);
      console.log('Fetched reports:', data);
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },
  
  async updateReportStatus(reportId, status) {
    try {
      console.log(`Updating report ${reportId} status to:`, status);
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      const data = await handleResponse(response);
      console.log('Report status updated:', data);
      return data;
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  }
};

// Alerts API
export const alertsAPI = {
  async getAlerts() {
    try {
      console.log('Fetching alerts...');
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
      });
      const data = await handleResponse(response);
      console.log('Fetched alerts:', data);
      return data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  },
  
  async createAlert(alertData) {
    try {
      console.log('Creating alert:', alertData);
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(alertData),
        credentials: 'include'
      });
      const data = await handleResponse(response);
      console.log('Alert created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }
};
