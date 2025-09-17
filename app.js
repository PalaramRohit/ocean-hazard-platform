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
// Remove ES module import for compatibility
// import { authAPI, reportsAPI, alertsAPI } from './api.js';

// Global State
let currentUser = null;
let currentView = 'dashboard';
let allReports = [];

// Global DOM element variables
let loginScreen, mainApp, loginForm, currentRoleSpan, navButtons, views;

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
  
  // Responsive UI enhancements for navigation and main content
  // Add event listeners for navigation to highlight active tab and animate transitions
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      navButtons.forEach(b => b.classList.remove('active-tab'));
      btn.classList.add('active-tab');
      // Animate main content fade out/in
      if (mainApp) {
        mainApp.classList.add('fade-out');
        setTimeout(() => {
          switchView(btn.dataset.view);
          mainApp.classList.remove('fade-out');
          mainApp.classList.add('fade-in');
          setTimeout(() => mainApp.classList.remove('fade-in'), 400);
        }, 200);
      } else {
        switchView(btn.dataset.view);
      }
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
    
    // Show main UI after login (SPA logic)
    handleSuccessfulLogin(data.user);
    
  } catch (error) {
    console.error('Login error:', error);
    showNotification(error.message || 'Login failed. Please try again.', 'error');
  } finally {
    showLoading(false);
  }
}

function handleSuccessfulLogin(user) {
  console.log('Handling successful login for user:', user.username, 'with role:', user.role);
  try {
    currentUser = user;
    console.log('loginScreen:', loginScreen);
    console.log('mainApp:', mainApp);
    if (loginScreen) {
      loginScreen.style.display = 'none';
      loginScreen.classList.add('hidden');
    }
    if (mainApp) {
      mainApp.style.display = 'block';
      mainApp.classList.remove('hidden');
      mainApp.style.visibility = 'visible';
      mainApp.style.opacity = '1';
      mainApp.style.position = '';
      mainApp.style.zIndex = '';
      // Remove any inline style that could hide it
      mainApp.style.removeProperty('display');
      mainApp.style.removeProperty('visibility');
      mainApp.style.removeProperty('opacity');
      mainApp.style.removeProperty('position');
      mainApp.style.removeProperty('z-index');
      // Log all classes and computed style
      console.log('mainApp classes:', mainApp.className);
      console.log('mainApp computed style:', window.getComputedStyle(mainApp));
      console.log('mainApp should now be visible');
    } else {
      console.error('mainApp not found in DOM');
    }
    if (currentRoleSpan) {
      currentRoleSpan.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
    updateUIForRole(user.role);
    renderRecentReports();
    showReportHazardOptions();
    initializeMap();
    initializeCharts();
    updateStatistics();
    Promise.all([
      loadUserData(),
      initializeMap(),
      initializeCharts()
    ]).then(() => {
      switchView('dashboard');
      showAlert(`Welcome back, ${user.name || user.username}!`, 'success');
    }).catch(error => {
      console.error('Error initializing application:', error);
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
    // Store logout time in database
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      await fetch(API_CONFIG.getUrl('/auth/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username: user.username, logoutTime: new Date().toISOString() })
      });
    }
    await authAPI.logout();
    // Remove user info from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Redirect to sign-in page (index.html)
    window.location.href = 'index.html';
  }
}

function switchView(viewName) {
  console.log('Switching to view:', viewName);
  // Update navigation
  navButtons.forEach(btn => {
    const isActive = btn.dataset.view === viewName;
    btn.classList.toggle('active', isActive);
  });
  // Update views
  views.forEach(view => {
    const isTargetView = view.id === `${viewName}-view`;
    view.classList.toggle('active', isTargetView);
    view.style.display = isTargetView ? 'block' : 'none'; // Ensure only active view is visible
  });
  currentView = viewName;
  // Initialize specific view functionality
  if (viewName === 'map') {
    setTimeout(() => initializeMap(), 100);
  } else if (viewName === 'verify') {
    setTimeout(() => renderReportsList(), 100); // Ensure verify view is visible before rendering
  } else if (viewName === 'analytics') {
    setTimeout(() => initializeAnalyticsCharts(), 100);
  } else if (viewName === 'dashboard') {
    updateDashboard();
  } else if (viewName === 'report') {
    showReportHazardOptions();
  }
}

function showReportHazardOptions() {
  const reportView = document.getElementById('report-view');
  if (!reportView) return;
  reportView.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'Report a Hazard in My Area';
  reportView.appendChild(title);
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'hazard-options';
  appData.hazardTypes.forEach(function(type) {
    var option = document.createElement('button');
    option.className = 'hazard-option';
    option.innerHTML = type.icon + ' <span>' + type.name + '</span>';
    option.style.backgroundColor = type.color;
    option.onclick = function() { showHazardReportForm(type); };
    optionsContainer.appendChild(option);
  });
  reportView.appendChild(optionsContainer);
}

function showHazardReportForm(type) {
  var reportView = document.getElementById('report-view');
  if (!reportView) return;
  reportView.innerHTML = '';
  var title = document.createElement('h2');
  title.textContent = 'Report: ' + type.name;
  reportView.appendChild(title);
  var formCard = document.createElement('div');
  formCard.className = 'hazard-report-card';
  var form = document.createElement('form');
  form.className = 'hazard-report-form';
  form.innerHTML = `
    <input type="hidden" name="hazard-type" value="${type.id}">
    <label>Location:</label>
    <input type='text' name='location-name' placeholder='Enter your location' required class='input-interactive'><br>
    <label>Severity:</label>
    <select name="severity" required class="input-interactive">
      ${appData.severityLevels.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
    </select><br>
    <label>Description:</label>
    <textarea name='description' placeholder='Describe the situation' required class='input-interactive'></textarea><br>
    <button type='submit' class='btn-interactive'>Submit Report</button>
    <button type='button' id='cancel-report-btn' class='btn-interactive btn-cancel'>Cancel</button>
    <div id='report-success' class='report-success hidden'>✅ Report submitted!</div>
  `;
  // Use your actual handler for submission
  form.addEventListener('submit', async function(e) {
    await handleReportSubmit(e);
  });
  formCard.appendChild(form);
  reportView.appendChild(formCard);
  document.getElementById('cancel-report-btn').onclick = function() { switchView('dashboard'); };
  // Add input focus/blur effects
  form.querySelectorAll('.input-interactive').forEach(input => {
    input.addEventListener('focus', function() {
      input.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      input.classList.remove('focused');
    });
  });
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
  // Only initialize Leaflet map in leaflet-map container
  // Initialize Leaflet map
  try {
    if (window.L) {
      const leafletMap = document.getElementById('leaflet-map');
      if (!leafletMap) return;
      if (window._leafletMapInstance) {
        window._leafletMapInstance.remove();
      }
      const map = window._leafletMapInstance = L.map('leaflet-map').setView([22.9734, 78.6569], 5); // Center India
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      // Demo region data (expand as needed)
      const regionData = [
        { name: 'Maharashtra', lat: 19.7515, lng: 75.7139, floodProne: true, droughtProne: true, details: 'High risk for both flood and drought.' },
        { name: 'Gujarat', lat: 22.2587, lng: 71.1924, floodProne: false, droughtProne: true, details: 'Mainly drought prone.' },
        { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, floodProne: true, droughtProne: false, details: 'Flood prone coastal areas.' },
        { name: 'West Bengal', lat: 22.9868, lng: 87.8550, floodProne: true, droughtProne: false, details: 'Flood prone due to rivers.' },
        { name: 'Kerala', lat: 10.8505, lng: 76.2711, floodProne: true, droughtProne: false, details: 'Frequent floods in monsoon.' },
        { name: 'Punjab', lat: 31.1471, lng: 75.3412, floodProne: false, droughtProne: false, details: 'Moderate risk.' },
        { name: 'Rajasthan', lat: 27.0238, lng: 74.2179, floodProne: false, droughtProne: true, details: 'Desert region, drought prone.' }
      ];

      // Add click handler to map
      map.on('click', function(e) {
        // Find nearest region (simple demo: closest by lat/lng)
        let nearest = null;
        let minDist = Infinity;
        regionData.forEach(region => {
          const dist = Math.sqrt(Math.pow(region.lat - e.latlng.lat, 2) + Math.pow(region.lng - e.latlng.lng, 2));
          if (dist < minDist) {
            minDist = dist;
            nearest = region;
          }
        });
        if (nearest) {
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`
              <b>${nearest.name}</b><br>
              <b>Flood Prone:</b> ${nearest.floodProne ? 'Yes' : 'No'}<br>
              <b>Drought Prone:</b> ${nearest.droughtProne ? 'Yes' : 'No'}<br>
              <b>Details:</b> ${nearest.details}
            `)
            .openOn(map);
        } else {
          L.popup()
            .setLatLng(e.latlng)
            .setContent('No region data available for this location.')
            .openOn(map);
        }
      });

      console.log('Leaflet map initialized');
    } else {
      // Dynamically load Leaflet if not present
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      script.onload = () => {
        console.log('Leaflet.js loaded');
        initializeMap();
      };
      script.onerror = () => {
        console.error('Failed to load Leaflet.js');
        const leafletMap = document.getElementById('leaflet-map');
        if (leafletMap) leafletMap.innerHTML = '<div style="color:red;padding:24px;">Failed to load map library.</div>';
      };
      document.body.appendChild(script);
    }
  } catch (err) {
    console.error('Error initializing Leaflet map:', err);
    const leafletMap = document.getElementById('leaflet-map');
    if (leafletMap) leafletMap.innerHTML = '<div style="color:red;padding:24px;">Map failed to load. Check console for details.</div>';
  }
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
  // Use sampleReports if allReports is empty
  const recentReports = (allReports.length > 0 ? allReports : appData.sampleReports).slice(0, 5);
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
  const fallback = document.getElementById('verify-fallback');
  if (!container) return;
  container.innerHTML = '';
  const filteredReports = getFilteredReports();
  if (filteredReports.length === 0) {
    if (fallback) fallback.style.display = 'block';
    return;
  } else {
    if (fallback) fallback.style.display = 'none';
  }
  filteredReports.forEach(report => {
    const hazardType = appData.hazardTypes.find(t => t.id === report.type);
    const hazardIcon = hazardType && hazardType.icon ? hazardType.icon : '';
    const hazardName = hazardType && hazardType.name ? hazardType.name : 'Unknown';
    const locationName = report.location && report.location.name ? report.location.name : 'Unknown';
    const reportCard = document.createElement('div');
    reportCard.className = 'report-card';
    reportCard.innerHTML = `
      <div class="report-card-header">
        <span class="report-id">${report.id}</span>
        <span class="report-status ${report.status}">${report.status ? report.status.toUpperCase() : 'UNKNOWN'}</span>
      </div>
      <div class="report-meta">
        <span class="report-meta-item">${hazardIcon} ${hazardName}</span>
        <span class="report-meta-item">📍 ${locationName}</span>
        <span class="report-meta-item">⚠️ ${report.severity ? report.severity.toUpperCase() : 'UNKNOWN'}</span>
        <span class="report-meta-item">🕒 ${formatTime(report.timestamp)}</span>
      </div>
      <div class="report-description">${report.description || ''}</div>
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
        <div>👤 ${reporter.reporter}</div>
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
    verifyBtn.onclick = async () => {
      try {
        // Save verification status to backend
        const response = await fetch(`/api/reports/${report.id}/verify`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ status: 'verified' })
        });
        if (!response.ok) throw new Error('Failed to verify report');
        report.status = 'verified';
        updateStatistics();
        renderReportsList();
        renderRecentReports();
        modal.classList.add('hidden');
        showAlert('Report verified successfully!', 'success');
      } catch (error) {
        showAlert('Error verifying report: ' + error.message, 'error');
      }
    };
  }
  
  if (rejectBtn) {
    rejectBtn.onclick = async () => {
      try {
        // Save rejection status to backend
        const response = await fetch(`/api/reports/${report.id}/verify`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ status: 'rejected' })
        });
        if (!response.ok) throw new Error('Failed to reject report');
        report.status = 'rejected';
        updateStatistics();
        renderReportsList();
        renderRecentReports();
        modal.classList.add('hidden');
        showAlert('Report rejected.', 'success');
      } catch (error) {
        showAlert('Error rejecting report: ' + error.message, 'error');
      }
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
  // Update user info card
  const user = currentUser || JSON.parse(localStorage.getItem('user'));
  if (user) {
    const usernameEl = document.getElementById('dashboard-username');
    const roleEl = document.getElementById('dashboard-role');
    const emailEl = document.getElementById('dashboard-email');
    if (usernameEl) usernameEl.textContent = user.name || user.username || '';
    if (roleEl) roleEl.textContent = user.role || '';
    if (emailEl) emailEl.textContent = user.email || '';
  }
  // Analytics gist
  const analyticsGist = document.getElementById('dashboard-analytics-gist');
  if (analyticsGist) {
    const totalReports = allReports.length;
    const highSeverity = allReports.filter(r => r.severity === 'high' || r.severity === 'critical').length;
    analyticsGist.innerHTML = `<b>Total Reports:</b> ${totalReports}<br><b>High Severity:</b> ${highSeverity}`;
  }
  // Recent hazards gist
  const hazardsGist = document.getElementById('dashboard-hazards-gist');
  if (hazardsGist) {
    const recent = (allReports.length > 0 ? allReports : appData.sampleReports).slice(0, 3);
    hazardsGist.innerHTML = recent.map(r => {
      const locName = r.location && r.location.name ? r.location.name : 'Unknown';
      const typeName = r.type || 'Unknown';
      const severity = r.severity || 'Unknown';
      return `<div><b>${typeName}</b> - ${locName} (${severity})</div>`;
    }).join('');
  }
  // Verify reports gist
  const verifyGist = document.getElementById('dashboard-verify-gist');
  if (verifyGist) {
    const pending = allReports.filter(r => r.status === 'pending').slice(0, 3);
    if (pending.length === 0) {
      verifyGist.innerHTML = 'No pending reports.';
    } else {
      verifyGist.innerHTML = pending.map(r => {
        const locName = r.location && r.location.name ? r.location.name : 'Unknown';
        const typeName = r.type || 'Unknown';
        return `<div><b>${r.id}</b> - ${locName} (${typeName})</div>`;
      }).join('');
    }
  }
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
  const analyticsCtx = document.getElementById('analytics-chart');
  if (!analyticsCtx) return;
  // Aggregate disaster counts from allReports or sampleReports
  const reports = allReports.length > 0 ? allReports : appData.sampleReports;
  const typeCounts = {};
  appData.hazardTypes.forEach(type => { typeCounts[type.name] = 0; });
  reports.forEach(report => {
    const type = appData.hazardTypes.find(t => t.id === report.type);
    if (type) typeCounts[type.name]++;
  });
  const labels = Object.keys(typeCounts);
  const data = Object.values(typeCounts);
  const backgroundColors = appData.hazardTypes.map(t => t.color);
  if (window.analyticsChart) {
    window.analyticsChart.destroy();
  }
  window.analyticsChart = new Chart(analyticsCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Disaster Reports in India',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Disaster Frequency Analytics (India)'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Reports' }
        },
        x: {
          title: { display: true, text: 'Disaster Type' }
        }
      }
    }
  });
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
    dashboardTitle.textContent = `Dashboard - ${role.charAt(0).toUpperCase() + role.slice(1)}`;
  }
  // Additional role-based dashboard updates can be implemented here
}

