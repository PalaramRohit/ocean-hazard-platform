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

// Global State
let currentUser = null;
let currentView = 'dashboard';
let allReports = [...appData.sampleReports];
let charts = {};

// DOM Elements
let loginScreen, mainApp, loginForm, currentRoleSpan, navButtons, views;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeDOM();
  initializeApp();
  setupEventListeners();
  populateFormOptions();
  updateStatistics();
});

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

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const role = document.getElementById('user-role').value;
  
  if (username && role) {
    currentUser = { username, role };
    
    // Hide login screen and show main app
    if (loginScreen && mainApp) {
      loginScreen.style.display = 'none';
      mainApp.style.display = 'flex';
      loginScreen.classList.add('hidden');
      mainApp.classList.remove('hidden');
    }
    
    // Set role-based styling
    document.body.dataset.role = role;
    if (currentRoleSpan) {
      currentRoleSpan.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    }
    
    // Initialize dashboard
    setTimeout(() => {
      switchView('dashboard');
      updateDashboard();
      renderRecentReports();
      initializeCharts();
      showAlert(`Welcome, ${username}! Logged in as ${role}.`, 'success');
    }, 100);
  }
}

function handleLogout() {
  currentUser = null;
  document.body.removeAttribute('data-role');
  
  // Show login screen and hide main app
  if (loginScreen && mainApp) {
    loginScreen.style.display = 'flex';
    mainApp.style.display = 'none';
    loginScreen.classList.remove('hidden');
    mainApp.classList.add('hidden');
  }
  
  // Reset form
  if (loginForm) {
    loginForm.reset();
  }
  
  showAlert('Logged out successfully!', 'success');
}

function switchView(viewName) {
  // Update navigation
  navButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.view === viewName) {
      btn.classList.add('active');
    }
  });
  
  // Update views
  views.forEach(view => {
    view.classList.remove('active');
    if (view.id === `${viewName}-view`) {
      view.classList.add('active');
    }
  });
  
  currentView = viewName;
  
  // Initialize specific view functionality
  if (viewName === 'map') {
    setTimeout(() => initializeMap(), 100);
  } else if (viewName === 'verify') {
    setTimeout(() => renderReportsList(), 100);
  } else if (viewName === 'analytics') {
    setTimeout(() => initializeAnalyticsCharts(), 100);
  }
}

function populateFormOptions() {
  // Populate hazard types
  const hazardSelect = document.getElementById('hazard-type');
  const hazardFilter = document.getElementById('hazard-filter');
  
  if (hazardSelect) {
    appData.hazardTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = `${type.icon} ${type.name}`;
      hazardSelect.appendChild(option);
    });
  }
  
  if (hazardFilter) {
    appData.hazardTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = `${type.icon} ${type.name}`;
      hazardFilter.appendChild(option);
    });
  }
  
  // Populate severity levels
  const severitySelect = document.getElementById('severity-level');
  const severityFilter = document.getElementById('severity-filter');
  
  if (severitySelect) {
    appData.severityLevels.forEach(level => {
      const option = document.createElement('option');
      option.value = level.id;
      option.textContent = level.name;
      severitySelect.appendChild(option);
    });
  }
  
  if (severityFilter) {
    appData.severityLevels.forEach(level => {
      const option = document.createElement('option');
      option.value = level.id;
      option.textContent = level.name;
      severityFilter.appendChild(option);
    });
  }
}

function handleReportSubmit(e) {
  e.preventDefault();
  
  const hazardType = document.getElementById('hazard-type')?.value;
  const severityLevel = document.getElementById('severity-level')?.value;
  const location = document.getElementById('location-input')?.value;
  const description = document.getElementById('hazard-description')?.value;
  const files = document.getElementById('hazard-media')?.files;
  
  if (!hazardType || !severityLevel || !location || !description) {
    showAlert('Please fill all required fields!', 'error');
    return;
  }
  
  // Create new report
  const newReport = {
    id: `R${String(allReports.length + 1).padStart(3, '0')}`,
    type: hazardType,
    severity: severityLevel,
    location: { name: location, lat: Math.random() * 30 + 8, lng: Math.random() * 30 + 68 },
    description: description,
    timestamp: new Date().toISOString(),
    reporter: currentUser?.username || 'Anonymous',
    status: 'pending',
    images: files ? Array.from(files).map(file => file.name) : []
  };
  
  allReports.unshift(newReport);
  
  // Reset form
  e.target.reset();
  const filePreview = document.getElementById('file-preview');
  if (filePreview) {
    filePreview.innerHTML = '';
  }
  
  // Update UI
  updateStatistics();
  renderRecentReports();
  
  showAlert('Hazard report submitted successfully!', 'success');
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

// Start real-time updates simulation
setTimeout(simulateRealTimeUpdates, 5000); // Start after 5 seconds
