// Application Data
const appData = {
  hazardTypes: [
    {id: "tsunami", name: "Tsunami", color: "#ff4444", icon: "🌊"},
    {id: "storm_surge", name: "Storm Surge", color: "#ff8800", icon: "🌪️"},
    {id: "high_waves", name: "High Waves", color: "#ffaa00", icon: "🌊"},
    {id: "coastal_current", name: "Coastal Current", color: "#0088ff", icon: "🌀"},
    {id: "abnormal_sea", name: "Abnormal Sea Behavior", color: "#8800ff", icon: "⚠️"}
  ],
  severityLevels: [
    {id: "low", name: "Low", color: "#ffdd00"},
    {id: "medium", name: "Medium", color: "#ff8800"},
    {id: "high", name: "High", color: "#ff4444"},
    {id: "critical", name: "Critical", color: "#cc0000"}
  ],
  sampleReports: [
    {
      id: "R001",
      type: "tsunami",
      severity: "high",
      location: {lat: 13.0827, lng: 80.2707, name: "Chennai Coast"},
      description: "Unusual wave patterns observed, water receding rapidly",
      timestamp: "2025-09-13T15:30:00Z",
      reporter: "Citizen001",
      status: "verified",
      images: ["wave1.jpg", "coastline1.jpg"]
    },
    {
      id: "R002", 
      type: "storm_surge",
      severity: "medium",
      location: {lat: 15.2993, lng: 74.1240, name: "Goa Beach"},
      description: "Storm surge affecting coastal roads, minor flooding",
      timestamp: "2025-09-13T14:15:00Z",
      reporter: "Official002",
      status: "pending",
      images: ["surge1.jpg"]
    },
    {
      id: "R003",
      type: "high_waves",
      severity: "medium", 
      location: {lat: 19.0760, lng: 72.8777, name: "Mumbai Coast"},
      description: "Waves reaching 4-5 meters height, fishing banned",
      timestamp: "2025-09-13T13:45:00Z",
      reporter: "Citizen003",
      status: "verified",
      images: ["waves1.jpg", "waves2.jpg"]
    }
  ],
  socialMediaData: [
    {platform: "Twitter", mentions: 1247, sentiment: "negative", trending_hashtags: ["#TsunamiAlert", "#ChennaiCoast", "#OceanHazard"]},
    {platform: "Facebook", posts: 892, sentiment: "concerned", engagement: "high"},
    {platform: "YouTube", videos: 156, sentiment: "informational", views: 45600}
  ],
  languages: [
    {code: "en", name: "English"},
    {code: "hi", name: "हिंदी"},
    {code: "ta", name: "தமிழ்"},
    {code: "te", name: "తెలుగు"}
  ]
};

// Import API Service
import { authAPI, reportsAPI, alertsAPI } from './api.js';

// Global State
let currentUser = null;
let currentView = 'dashboard';
let allReports = [];

// Start the application
function init() {
  console.log('Initializing application...');
  
  // Initialize DOM elements
  initializeDOM();
  
  // Set up the initial app state
  initializeApp();
  
  // Set up event listeners
  setupEventListeners();
  
  // Check for active session
  checkSession();
  
  // Initialize any UI components
  initializeUI();
  
  console.log('Application initialized');
}

// Check for active session
async function checkSession() {
  try {
    console.log('Checking for active session...');
    const user = await authAPI.getCurrentUser();
    if (user) {
      console.log('Active session found:', user);
      currentUser = user;
      handleSuccessfulLogin(user);
    } else {
      console.log('No active session found');
      showLoginScreen();
    }
  } catch (error) {
    console.error('Error checking session:', error);
    showLoginScreen();
  }
}

// Show login screen
function showLoginScreen() {
  console.log('Showing login screen');
  if (loginScreen && mainApp) {
    loginScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    loginScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
  }
}

// Initialize UI components
function initializeUI() {
  console.log('Initializing UI components...');
  
  // Initialize any charts or other UI components
  initializeCharts();
  
  // Set up any initial data
  updateStatistics();
  
  console.log('UI components initialized');
}

// Start the application when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function initializeDOM() {
  loginScreen = document.getElementById('login-screen');
  mainApp = document.getElementById('main-app');
  loginForm = document.getElementById('login-form');
  currentRoleSpan = document.getElementById('current-role');
  navButtons = document.querySelectorAll('.nav-btn');
  views = document.querySelectorAll('.view');
}

function initializeApp() {
  // Ensure proper initial state
  if (loginScreen && mainApp) {
    loginScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    loginScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
  }
}

function setupEventListeners() {
  // Login Form
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Navigation
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.target.dataset.view;
      if (view) switchView(view);
    });
  });
  
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Report Form
  const reportForm = document.getElementById('hazard-report-form');
  if (reportForm) {
    reportForm.addEventListener('submit', handleReportSubmit);
  }
  
  // Get Location
  const getLocationBtn = document.getElementById('get-location-btn');
  if (getLocationBtn) {
    getLocationBtn.addEventListener('click', getCurrentLocation);
  }
  
  // File Upload
  const fileInput = document.getElementById('hazard-media');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
  
  // Save Offline
  const saveOfflineBtn = document.getElementById('save-offline-btn');
  if (saveOfflineBtn) {
    saveOfflineBtn.addEventListener('click', saveReportOffline);
  }
  
  // Filters
  setupFilters();
  
  // Modal functionality
  setupModalHandlers();
  
  // Alert Broadcasting
  const broadcastBtn = document.getElementById('broadcast-alert-btn');
  if (broadcastBtn) {
    broadcastBtn.addEventListener('click', () => showAlert('Alert broadcast to all registered users!', 'success'));
  }
  
  const smsBtn = document.getElementById('send-sms-btn');
  if (smsBtn) {
    smsBtn.addEventListener('click', () => showAlert('SMS alerts sent to emergency contacts!', 'success'));
  }
  
  // Language Selector
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.addEventListener('change', handleLanguageChange);
  }
  
  // Search Reports
  const searchInput = document.getElementById('search-reports');
  if (searchInput) {
    searchInput.addEventListener('input', filterReports);
  }
  
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', filterReports);
  }
}

// Show notification function
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Handle login form submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('user-role').value;
    
    // Basic validation
    if (!username || !password || !role) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    try {
      // Show loading state
      const loginBtn = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = loginBtn.textContent;
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<span class="spinner"></span> Signing in...';
      
      // Prepare the login data
      const loginData = { 
        username: username.toLowerCase().trim(),
        password: password,
        role: role
      };

      console.log('Attempting login with:', { username: loginData.username, role: loginData.role });
      
      try {
        // Call login API
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(loginData)
        });
        
        const data = await response.json();
        console.log('Login response:', { status: response.status, data });
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed. Please check your credentials.');
        }
        
        if (!data.user) {
          throw new Error('Invalid response from server. Please try again.');
        }
        
        // Store user data in localStorage
        const userData = {
          id: data.user._id || data.user.id,
          name: data.user.name || data.user.username,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role,
          token: data.token
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update UI with user information
        updateUserUI(userData);
        
        // Show success message
        showNotification(`Welcome, ${userData.name || userData.username}!`, 'success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
        
      } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Login failed. Please try again.', 'error');
        throw error; // Re-throw to be caught by the outer catch
      }
      
    } catch (error) {
      console.error('Login error:', error);
      showNotification(error.message || 'Login failed. Please check your credentials and try again.', 'error');
    } finally {
      // Reset button state
      const loginBtn = loginForm.querySelector('button[type="submit"]');
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
      }
    }
  });
}

// Update UI with user information
function updateUserUI(user) {
  const usernameElement = document.getElementById('current-username');
  const roleElement = document.getElementById('current-role');
  
  if (usernameElement) {
    usernameElement.textContent = user.name || user.username;
  }
  
  if (roleElement) {
    roleElement.textContent = user.role;
    // Add role-specific class for styling
    roleElement.className = 'role-badge';
    roleElement.classList.add(`role-${user.role}`);
  }
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const loginScreen = document.getElementById('login-screen');
  const mainApp = document.getElementById('main-app');
  
  if (user && loginScreen && mainApp) {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'block';
    
    // Update UI with user information
    updateUserUI(user);
    
    // Update UI based on user role
    updateUIForRole(user.role);
  }
});

// Show notification message
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  // Add to notification container
  const container = document.getElementById('notification-container') || createNotificationContainer();
  container.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
  
  // Close button handler
  const closeBtn = notification.querySelector('.notification-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    });
  }
}

// Create notification container if it doesn't exist
function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notification-container';
  document.body.appendChild(container);
  return container;
}

// Show/hide loading state
function showLoading(isLoading) {
  const loginBtn = document.querySelector('#login-form button[type="submit"]');
  if (!loginBtn) return;
  
  if (isLoading) {
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner"></span> Signing in...';
  } else {
    loginBtn.disabled = false;
    loginBtn.innerHTML = 'Sign In';
  }
}

// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me'
    }
  },
  getUrl(endpoint) {
    return `${this.BASE_URL}${endpoint}`;
  }
};

async function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const role = document.getElementById('user-role').value;
  
  if (!username || !password || !role) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  try {
    showLoading(true);
    
    // Call login API
    const response = await fetch(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ 
        username: username.toLowerCase(), 
        password: password,
        role: role
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    
    // Update UI
    updateUserUI(data.user);
    showNotification('Login successful!', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
    
  } catch (error) {
    console.error('Login error:', error);
    showNotification(error.message || 'Login failed. Please try again.', 'error');
  } finally {
    showLoading(false);
  }
}

function updateUserUI(user) {
  if (!user) return;
  
  // Update username in header
  const usernameElement = document.getElementById('current-username');
  if (usernameElement) {
    usernameElement.textContent = user.name || user.username;
  }
  
  // Update role badge
  const roleElement = document.getElementById('current-role');
  if (roleElement) {
    roleElement.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    roleElement.className = 'role-badge';
    roleElement.classList.add(`role-${user.role}`);
  }
  
  // Show user info section
  const userInfoElement = document.querySelector('.user-info');
  if (userInfoElement) {
    userInfoElement.style.display = 'flex';
  }
}

function handleSuccessfulLogin(user) {
  console.log('Handling successful login for user:', user.username, 'with role:', user.role);
  
  try {
    // Update current user in memory
    currentUser = user;
    
    // Update UI state
    console.log('Updating UI state after login');
    if (loginScreen) {
      loginScreen.style.display = 'none';
      loginScreen.classList.add('hidden');
    }
    
    if (mainApp) {
      mainApp.style.display = 'block';
      mainApp.classList.remove('hidden');
    }
    
    // Update user info in header
    if (currentRoleSpan) {
      currentRoleSpan.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
    
    // Update UI based on user role
    console.log('Updating UI for role:', user.role);
    updateUIForRole(user.role);
    
    // Initialize application data
    console.log('Initializing application data...');
    Promise.all([
      loadUserData(),
      initializeMap(),
      initializeCharts()
    ]).then(() => {
      console.log('Application data loaded, switching to dashboard');
      switchView('dashboard');
      
      // Show welcome message
      showAlert(`Welcome back, ${user.name || user.username}!`, 'success');
      
    }).catch(error => {
      console.error('Error initializing application:', error);
      // Still switch to dashboard even if some data fails to load
      switchView('dashboard');
      showAlert('Welcome! Some features may be limited due to loading issues.', 'warning');
    });
    
  } catch (error) {
    console.error('Error in handleSuccessfulLogin:', error);
    showAlert('An error occurred while initializing your session. Please refresh the page and try again.', 'error');
  }
}

async function loadUserData() {
  try {
    // Load reports
    const reports = await reportsAPI.getReports();
    allReports = reports;
    renderRecentReports();
    updateStatistics();
    
    // Load alerts if user is official
    if (currentUser.role === 'official' || currentUser.role === 'analyst') {
      const alerts = await alertsAPI.getAlerts();
      // Update alerts in the UI
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    showAlert('Error loading data. Please refresh the page.', 'error');
  }
}

async function handleLogout() {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Reset user state
    currentUser = null;
    allReports = [];
    
    // Reset UI
    document.getElementById('login-form').reset();
    
    // Show login screen
    loginScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
    
    // Reset any active views
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show logout message
    showAlert('You have been logged out', 'info');
  }
}

function switchView(viewName) {
  console.log('Switching to view:', viewName);
  
  // Update navigation
  console.log('Updating navigation buttons');
  navButtons.forEach(btn => {
    const isActive = btn.dataset.view === viewName;
    console.log(`Button ${btn.dataset.view}: ${isActive ? 'active' : 'inactive'}`);
    btn.classList.toggle('active', isActive);
  });
  
  // Update views
  console.log('Updating view visibility');
  views.forEach(view => {
    const isTargetView = view.id === `${viewName}-view`;
    console.log(`View ${view.id}: ${isTargetView ? 'showing' : 'hiding'}`);
    view.classList.toggle('active', isTargetView);
  });
  
  currentView = viewName;
  console.log('Current view set to:', currentView);
  
  // Initialize specific view functionality
  console.log('Initializing view-specific functionality');
  if (viewName === 'map') {
    console.log('Initializing map...');
    setTimeout(() => initializeMap(), 100);
  } else if (viewName === 'verify') {
    console.log('Rendering reports list...');
    setTimeout(() => renderReportsList(), 100);
  } else if (viewName === 'analytics') {
    console.log('Initializing analytics charts...');
    setTimeout(() => initializeAnalyticsCharts(), 100);
  } else if (viewName === 'dashboard') {
    console.log('Initializing dashboard...');
    updateDashboard();
  }
  
  console.log('View switch complete');
}

async function handleReportSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const reportData = {
    type: formData.get('hazard-type'),
    severity: formData.get('severity'),
    location: {
      name: formData.get('location-name'),
      lat: parseFloat(formData.get('latitude')),
      lng: parseFloat(formData.get('longitude'))
    },
    description: formData.get('description'),
    status: 'pending',
    // Files would need to be handled separately with FormData
  };
  
  try {
    showLoading(true);
    const newReport = await reportsAPI.createReport(reportData);
    
    // Add to local state
    allReports.unshift(newReport);
    
    // Update UI
    renderRecentReports();
    updateStatistics();
    
    // Reset form
    e.target.reset();
    
    // Show success message
    showAlert('Hazard report submitted successfully!', 'success');
    
    // Switch back to dashboard
    switchView('dashboard');
  } catch (error) {
    console.error('Error submitting report:', error);
    showAlert(error.message || 'Failed to submit report. Please try again.', 'error');
  } finally {
    showLoading(false);
  }
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    showAlert('Getting your location...', 'success');
    
    // Simulate location retrieval
    setTimeout(() => {
      const simulatedLocations = [
        'Chennai Coast, Tamil Nadu',
        'Mumbai Coast, Maharashtra', 
        'Goa Beach, Goa',
        'Visakhapatnam Coast, Andhra Pradesh',
        'Kochi Coast, Kerala'
      ];
      
      const randomLocation = simulatedLocations[Math.floor(Math.random() * simulatedLocations.length)];
      const locationInput = document.getElementById('location-input');
      if (locationInput) {
        locationInput.value = randomLocation;
      }
      showAlert('Location retrieved successfully!', 'success');
    }, 1500);
  } else {
    showAlert('Geolocation is not supported by this browser.', 'error');
  }
}

function handleFileUpload(e) {
  const files = e.target.files;
  const preview = document.getElementById('file-preview');
  if (!preview) return;
  
  preview.innerHTML = '';
  
  Array.from(files).forEach(file => {
    const previewItem = document.createElement('div');
    previewItem.className = 'file-preview-item';
    previewItem.textContent = `📎 ${file.name}`;
    preview.appendChild(previewItem);
  });
}

function saveReportOffline() {
  const hazardType = document.getElementById('hazard-type')?.value;
  const severityLevel = document.getElementById('severity-level')?.value;
  const location = document.getElementById('location-input')?.value;
  const description = document.getElementById('hazard-description')?.value;
  
  if (hazardType && severityLevel && location && description) {
    // Simulate offline storage
    showAlert('Report saved offline. Will sync when connection is available.', 'success');
  } else {
    showAlert('Please fill all required fields before saving offline.', 'error');
  }
}

function initializeMap() {
  const mapMarkers = document.getElementById('map-markers');
  const legendItems = document.getElementById('legend-items');
  
  if (!mapMarkers || !legendItems) return;
  
  // Clear existing content
  mapMarkers.innerHTML = '';
  legendItems.innerHTML = '';
  
  // Create legend
  appData.hazardTypes.forEach(type => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <div class="legend-color" style="background-color: ${type.color}"></div>
      <span>${type.icon} ${type.name}</span>
    `;
    legendItems.appendChild(legendItem);
  });
  
  // Create markers for reports
  allReports.forEach((report, index) => {
    const hazardType = appData.hazardTypes.find(t => t.id === report.type);
    if (!hazardType) return;
    
    const marker = document.createElement('div');
    marker.className = `map-marker ${report.type}`;
    marker.style.left = `${20 + (index * 15) % 80}%`;
    marker.style.top = `${30 + (index * 10) % 40}%`;
    marker.textContent = hazardType.icon;
    marker.title = `${hazardType.name} - ${report.location.name}`;
    
    marker.addEventListener('click', () => {
      showReportModal(report);
    });
    
    mapMarkers.appendChild(marker);
  });
}

function setupFilters() {
  const hazardFilter = document.getElementById('hazard-filter');
  const severityFilter = document.getElementById('severity-filter');
  const dateFilter = document.getElementById('date-filter');
  
  [hazardFilter, severityFilter, dateFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', applyMapFilters);
    }
  });
}

function applyMapFilters() {
  // In a real implementation, this would filter the map markers
  showAlert('Map filters applied!', 'success');
  if (currentView === 'map') {
    initializeMap();
  }
}

function renderRecentReports() {
  const container = document.getElementById('recent-reports');
  if (!container) return;
  
  container.innerHTML = '';
  
  const recentReports = allReports.slice(0, 5);
  
  recentReports.forEach(report => {
    const hazardType = appData.hazardTypes.find(t => t.id === report.type);
    const reportItem = document.createElement('div');
    reportItem.className = `report-item severity-${report.severity}`;
    reportItem.innerHTML = `
      <div class="report-header">
        <span class="report-type">${hazardType ? hazardType.icon : ''} ${hazardType ? hazardType.name : 'Unknown'}</span>
        <span class="report-time">${formatTime(report.timestamp)}</span>
      </div>
      <div class="report-location">📍 ${report.location.name}</div>
    `;
    reportItem.addEventListener('click', () => showReportModal(report));
    container.appendChild(reportItem);
  });
}

function renderReportsList() {
  const container = document.getElementById('reports-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  const filteredReports = getFilteredReports();
  
  filteredReports.forEach(report => {
    const hazardType = appData.hazardTypes.find(t => t.id === report.type);
    const reportCard = document.createElement('div');
    reportCard.className = 'report-card';
    reportCard.innerHTML = `
      <div class="report-card-header">
        <span class="report-id">${report.id}</span>
        <span class="report-status ${report.status}">${report.status.toUpperCase()}</span>
      </div>
      <div class="report-meta">
        <span class="report-meta-item">${hazardType ? hazardType.icon : ''} ${hazardType ? hazardType.name : 'Unknown'}</span>
        <span class="report-meta-item">📍 ${report.location.name}</span>
        <span class="report-meta-item">⚠️ ${report.severity.toUpperCase()}</span>
        <span class="report-meta-item">🕒 ${formatTime(report.timestamp)}</span>
      </div>
      <div class="report-description">${report.description}</div>
    `;
    reportCard.addEventListener('click', () => showReportModal(report));
    container.appendChild(reportCard);
  });
}

function getFilteredReports() {
  const searchTerm = document.getElementById('search-reports')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('status-filter')?.value || '';
  
  return allReports.filter(report => {
    const matchesSearch = !searchTerm || 
      report.description.toLowerCase().includes(searchTerm) ||
      report.location.name.toLowerCase().includes(searchTerm) ||
      report.id.toLowerCase().includes(searchTerm);
    
    const matchesStatus = !statusFilter || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
}

function filterReports() {
  if (currentView === 'verify') {
    renderReportsList();
  }
}

function showReportModal(report) {
  const modal = document.getElementById('report-modal');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalBody) return;
  
  const hazardType = appData.hazardTypes.find(t => t.id === report.type);
  
  modalBody.innerHTML = `
    <div class="report-details">
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Report ID</label>
          <div>${report.id}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <span class="report-status ${report.status}">${report.status.toUpperCase()}</span>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Hazard Type</label>
          <div>${hazardType ? hazardType.icon : ''} ${hazardType ? hazardType.name : 'Unknown'}</div>
        </div>
        <div class="form-group">
          <label class="form-label">Severity</label>
          <div>${report.severity.toUpperCase()}</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <div>📍 ${report.location.name}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Time Reported</label>
        <div>🕒 ${formatDateTime(report.timestamp)}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Reporter</label>
        <div>👤 ${report.reporter}</div>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <div>${report.description}</div>
      </div>
      ${report.images && report.images.length > 0 ? `
        <div class="form-group">
          <label class="form-label">Attachments</label>
          <div>${report.images.map(img => `📎 ${img}`).join('<br>')}</div>
        </div>
      ` : ''}
    </div>
  `;
  
  modal.classList.remove('hidden');
  
  // Setup verify/reject buttons
  const verifyBtn = document.getElementById('verify-report-btn');
  const rejectBtn = document.getElementById('reject-report-btn');
  
  if (verifyBtn) {
    verifyBtn.onclick = () => {
      report.status = 'verified';
      updateStatistics();
      renderReportsList();
      renderRecentReports();
      modal.classList.add('hidden');
      showAlert('Report verified successfully!', 'success');
    };
  }
  
  if (rejectBtn) {
    rejectBtn.onclick = () => {
      report.status = 'rejected';
      updateStatistics();
      renderReportsList();
      renderRecentReports();
      modal.classList.add('hidden');
      showAlert('Report rejected.', 'success');
    };
  }
}

function setupModalHandlers() {
  const modal = document.getElementById('report-modal');
  if (!modal) return;
  
  const closeButtons = modal.querySelectorAll('.modal-close');
  
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
  
  // Alert close handlers
  document.querySelectorAll('.alert-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const alertElement = e.target.closest('.alert');
      if (alertElement) {
        alertElement.classList.add('hidden');
      }
    });
  });
}

function updateStatistics() {
  const totalReports = allReports.length;
  const verifiedReports = allReports.filter(r => r.status === 'verified').length;
  const highSeverity = allReports.filter(r => r.severity === 'high' || r.severity === 'critical').length;
  
  const totalElement = document.getElementById('total-reports');
  const verifiedElement = document.getElementById('verified-reports');
  const highSeverityElement = document.getElementById('high-severity');
  const socialElement = document.getElementById('social-mentions');
  
  if (totalElement) totalElement.textContent = totalReports;
  if (verifiedElement) verifiedElement.textContent = verifiedReports;
  if (highSeverityElement) highSeverityElement.textContent = highSeverity;
  if (socialElement) socialElement.textContent = '2.1k';
}

function updateDashboard() {
  updateStatistics();
  renderRecentReports();
}

function initializeCharts() {
  // Trend Chart
  const trendCtx = document.getElementById('trend-chart');
  if (trendCtx && !charts.trend) {
    charts.trend = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Reports',
          data: [2, 4, 3, 5, 2, 3, 6],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}

function initializeAnalyticsCharts() {
  // Platform Chart
  const platformCtx = document.getElementById('platform-chart');
  if (platformCtx && !charts.platform) {
    charts.platform = new Chart(platformCtx, {
      type: 'doughnut',
      data: {
        labels: ['Twitter', 'Facebook', 'YouTube'],
        datasets: [{
          data: [1247, 892, 156],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  // Sentiment Chart
  const sentimentCtx = document.getElementById('sentiment-chart');
  if (sentimentCtx && !charts.sentiment) {
    charts.sentiment = new Chart(sentimentCtx, {
      type: 'bar',
      data: {
        labels: ['Negative', 'Concerned', 'Neutral', 'Informational'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: ['#DB4545', '#D2BA4C', '#5D878F', '#1FB8CD'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}

function handleLanguageChange(e) {
  const selectedLanguage = e.target.value;
  const languageNames = {
    'en': 'English',
    'hi': 'हिंदी',
    'ta': 'தமிழ்',
    'te': 'తెలుగు'
  };
  showAlert(`Language changed to ${languageNames[selectedLanguage] || selectedLanguage}`, 'success');
}

function showAlert(message, type = 'success') {
  const alertElement = document.getElementById(`${type}-alert`);
  const messageElement = document.getElementById(`${type}-message`);
  
  if (alertElement && messageElement) {
    messageElement.textContent = message;
    alertElement.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      alertElement.classList.add('hidden');
    }, 5000);
  }
}

function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Simulate real-time updates
function simulateRealTimeUpdates() {
  setInterval(() => {
    if (currentUser && Math.random() < 0.1) { // 10% chance every 30 seconds
      // Simulate new report
      const randomHazard = appData.hazardTypes[Math.floor(Math.random() * appData.hazardTypes.length)];
      const randomSeverity = appData.severityLevels[Math.floor(Math.random() * appData.severityLevels.length)];
      
      const newReport = {
        id: `R${String(allReports.length + 1).padStart(3, '0')}`,
        type: randomHazard.id,
        severity: randomSeverity.id,
        location: { name: 'Auto-generated Location', lat: Math.random() * 30 + 8, lng: Math.random() * 30 + 68 },
        description: 'Automatically generated report for demonstration',
        timestamp: new Date().toISOString(),
        reporter: 'System',
        status: 'pending',
        images: []
      };
      
      allReports.unshift(newReport);
      updateStatistics();
      renderRecentReports();
      
      if (currentView === 'verify') {
        renderReportsList();
      }
      
      if (currentView === 'map') {
        initializeMap();
      }
      
      showAlert('New hazard report received!', 'success');
    }
  }, 30000); // Every 30 seconds
}

function updateUIForRole(role) {
  console.log('Updating UI for role:', role);
  
  if (!role) {
    console.error('No role provided to updateUIForRole');
    return;
  }
  
  // Update navigation buttons based on role
  document.querySelectorAll('.nav-item').forEach(item => {
    try {
      const requiredRoles = item.dataset.requiredRole?.split(' ') || [];
      const shouldShow = requiredRoles.includes(role) || requiredRoles.includes('all');
      item.style.display = shouldShow ? 'block' : 'none';
      
      // Enable/disable buttons based on role
      const button = item.querySelector('button');
      if (button) {
        button.disabled = !shouldShow;
        button.classList.toggle('disabled', !shouldShow);
      }
    } catch (error) {
      console.error('Error updating nav item:', item, error);
    }
  });
  
  // Update views based on role
  document.querySelectorAll('.view').forEach(view => {
    try {
      const viewRoles = view.dataset.role?.split(' ') || [];
      const isActive = view.classList.contains('active');
      const shouldShow = viewRoles.includes(role) || viewRoles.includes('all');
      
      view.style.display = shouldShow && isActive ? 'block' : 'none';
      
      // If current view is not accessible, switch to dashboard
      if (isActive && !shouldShow) {
        console.log(`Current view not accessible for role ${role}, switching to dashboard`);
        switchView('dashboard');
      }
    } catch (error) {
      console.error('Error updating view:', view, error);
    }
  });
  
  // Update role-specific UI elements
  updateRoleSpecificUI(role);
  
  // Update any role-based dashboard elements
  updateDashboardForRole(role);
  
  console.log('UI updated for role:', role);
}

function updateRoleSpecificUI(role) {
  // Update elements with data-role attributes
  document.querySelectorAll('[data-role]').forEach(element => {
    const elementRoles = element.dataset.role.split(' ');
    const shouldShow = elementRoles.includes(role) || elementRoles.includes('all');
    element.style.display = shouldShow ? '' : 'none';
  });
  
  // Update elements with data-required-role attributes
  document.querySelectorAll('[data-required-role]').forEach(element => {
    const requiredRoles = element.dataset.requiredRole.split(' ');
    const hasAccess = requiredRoles.includes(role) || requiredRoles.includes('all');
    
    if (element.tagName === 'BUTTON') {
      element.disabled = !hasAccess;
      element.classList.toggle('disabled', !hasAccess);
    } else if (element.tagName === 'A') {
      if (hasAccess) {
        element.removeAttribute('disabled');
        element.style.pointerEvents = 'auto';
        element.style.opacity = '1';
      } else {
        element.setAttribute('disabled', 'true');
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.5';
      }
    } else {
      element.style.display = hasAccess ? '' : 'none';
    }
  });
}

function updateDashboardForRole(role) {
  const dashboardTitle = document.querySelector('#dashboard-view h2');
  if (dashboardTitle) {
    const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);
    dashboardTitle.textContent = `${roleDisplay} Dashboard`;
  }
  
  // Update any role-specific dashboard widgets
  const roleWidgets = document.querySelectorAll(`[data-role-widget]`);
  roleWidgets.forEach(widget => {
    const widgetRoles = widget.dataset.roleWidget.split(' ');
    const shouldShow = widgetRoles.includes(role) || widgetRoles.includes('all');
    widget.style.display = shouldShow ? 'block' : 'none';
  });
}

// Start real-time updates simulation
setTimeout(simulateRealTimeUpdates, 5000); // Start after 5 seconds
