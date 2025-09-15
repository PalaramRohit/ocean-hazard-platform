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
  ]
};

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Authentication State
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let currentSection = 'dashboard';
let offlineReports = JSON.parse(localStorage.getItem('offlineReports') || '[]');

// DOM Elements
let loginScreen, mainApp, loginForm, signupForm, showSignupBtn, showLoginBtn, logoutBtn, roleDisplay;
let sidebarLinks, contentSections;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔵 DOM Content Loaded');
    
    // Initialize DOM elements
    initializeDOMElements();
    
    // Test backend connection
    testBackendConnection();
    
    // Initialize components
    initializeAuth();
    initializeEventListeners();
    setTimeout(setupCharts, 500); // Delay charts to ensure DOM is ready
});

// Initialize DOM Elements
function initializeDOMElements() {
    console.log('🔵 Initializing DOM elements...');
    
    loginScreen = document.getElementById('login-screen');
    mainApp = document.getElementById('main-app');
    loginForm = document.getElementById('login-form');
    signupForm = document.getElementById('signup-form');
    showSignupBtn = document.getElementById('show-signup');
    showLoginBtn = document.getElementById('show-login');
    logoutBtn = document.getElementById('logout-btn');
    roleDisplay = document.getElementById('role-display');
    sidebarLinks = document.querySelectorAll('.sidebar__link');
    contentSections = document.querySelectorAll('.content-section');
    
    console.log('✅ DOM elements initialized:', {
        loginScreen: !!loginScreen,
        mainApp: !!mainApp,
        loginForm: !!loginForm,
        signupForm: !!signupForm
    });
}

// Test Backend Connection
async function testBackendConnection() {
    try {
        console.log('🔵 Testing backend connection...');
        const response = await fetch('http://localhost:5000/test');
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend connection successful:', data);
            return true;
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        showNotification('Cannot connect to backend server! Make sure it\'s running on port 5000.', 'error');
        return false;
    }
}

// Authentication Initialization - FIXED
function initializeAuth() {
    console.log('🔵 Initializing authentication...');
    
    // Check if user is already logged in
    if (authToken) {
        verifyToken();
    }
    
    // Show login form by default
    if (loginForm) {
        loginForm.classList.add('active');
        console.log('✅ Login form made active');
    }
    
    // Authentication event listeners with proper error handling
    if (loginForm) {
        console.log('🔵 Adding login form event listener');
        loginForm.addEventListener('submit', function(e) {
            console.log('🔵 Login form submitted');
            e.preventDefault(); // Prevent default form submission
            handleLogin(e);
        });
    } else {
        console.log('❌ Login form not found');
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup(e);
        });
    }
    
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSignupForm(e);
        });
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm(e);
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    console.log('✅ Authentication initialized');
}

// Show/Hide Authentication Forms
function showSignupForm(e) {
    e.preventDefault();
    console.log('🔵 Showing signup form');
    if (loginForm) loginForm.classList.remove('active');
    if (signupForm) signupForm.classList.add('active');
}

function showLoginForm(e) {
    e.preventDefault();
    console.log('🔵 Showing login form');
    if (signupForm) signupForm.classList.remove('active');
    if (loginForm) loginForm.classList.add('active');
}

// Signup Handler - Updates Database
async function handleSignup(e) {
    e.preventDefault();
    console.log('🔵 Signup form submitted');
    
    const username = document.getElementById('signup-username')?.value;
    const email = document.getElementById('signup-email')?.value;
    const password = document.getElementById('signup-password')?.value;
    const confirmPassword = document.getElementById('signup-confirm-password')?.value;
    const role = document.getElementById('signup-role')?.value;
    
    console.log('🔵 Signup data:', { username, email, role, passwordLength: password?.length });
    
    // Clear previous errors
    clearFormErrors();
    
    // Validation
    if (!validateSignup(username, password, confirmPassword, role)) {
        return;
    }
    
    // Set loading state
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
    }
    
    try {
        console.log('🔵 Sending signup request...');
        
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.trim(),
                email: email ? email.trim() : undefined,
                password,
                role
            })
        });
        
        const data = await response.json();
        console.log('🔵 Signup response:', data);
        
        if (response.ok) {
            console.log('✅ Signup successful');
            showNotification('Account created successfully! Please login.', 'success');
            signupForm.reset();
            showLoginForm({ preventDefault: () => {} });
            
            // Pre-fill login form with username
            if (document.getElementById('login-username')) {
                document.getElementById('login-username').value = username;
            }
        } else {
            console.log('❌ Signup failed:', data.error);
            showFormError('signup-username', data.error);
            showNotification(data.error, 'error');
        }
    } catch (error) {
        console.error('❌ Signup network error:', error);
        showNotification('Network error. Check your internet connection.', 'error');
        showFormError('signup-username', 'Unable to create account. Please try again.');
    } finally {
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
        }
    }
}

// Fixed Login Handler
async function handleLogin(e) {
    e.preventDefault(); // Prevent form submission
    console.log('🔵 handleLogin called');
    
    const username = document.getElementById('login-username')?.value;
    const password = document.getElementById('login-password')?.value;
    
    console.log('🔵 Login attempt:', { username, passwordLength: password?.length });
    console.log('🔵 API URL:', `${API_BASE_URL}/auth/login`);
    
    if (!username || !password) {
        console.log('❌ Missing credentials');
        showNotification('Please enter both username and password', 'error');
        showFormError('login-username', 'Please fill in all fields');
        return false;
    }
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;
    }
    
    try {
        console.log('🔵 Making API request...');
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: username.trim(), 
                password 
            })
        });
        
        console.log('🔵 Response status:', response.status);
        console.log('🔵 Response ok:', response.ok);
        
        const data = await response.json();
        console.log('🔵 Response data:', data);
        
        if (response.ok) {
            console.log('✅ Login successful!');
            
            // Store authentication data
            authToken = data.token;
            currentUser = { username: data.username, role: data.role };
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            document.body.setAttribute('data-role', data.role);
            
            if (roleDisplay) {
                roleDisplay.textContent = `${data.role.charAt(0).toUpperCase() + data.role.slice(1)} Dashboard`;
            }
            
            // Hide login, show main app
            if (loginScreen) loginScreen.classList.add('hidden');
            if (mainApp) mainApp.classList.remove('hidden');
            
            showNotification(`Welcome back, ${data.username}!`, 'success');
            loadDashboardData();
            renderReports();
            
        } else {
            console.log('❌ Login failed:', data.error);
            showFormError('login-username', data.error);
            showNotification(data.error || 'Login failed', 'error');
            
            if (data.error && data.error.includes('not found')) {
                setTimeout(() => {
                    if (confirm('Account not found. Would you like to create a new account?')) {
                        showSignupForm({ preventDefault: () => {} });
                        if (document.getElementById('signup-username')) {
                            document.getElementById('signup-username').value = username;
                        }
                    }
                }, 2000);
            }
        }
        
    } catch (error) {
        console.error('❌ Network error:', error);
        showNotification('Cannot connect to server. Make sure backend is running on port 5000.', 'error');
        showFormError('login-username', 'Server connection failed');
    } finally {
        if (submitBtn) {
            submitBtn.textContent = 'Login';
            submitBtn.disabled = false;
        }
    }
    
    return false; // Prevent any further form submission
}

// Logout Handler
function handleLogout() {
    console.log('🔵 Logging out...');
    
    authToken = null;
    currentUser = null;
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    document.body.removeAttribute('data-role');
    
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (mainApp) mainApp.classList.add('hidden');
    
    // Reset forms
    if (loginForm) loginForm.reset();
    if (signupForm) signupForm.reset();
    showLoginForm({ preventDefault: () => {} });
    
    showNotification('Logged out successfully', 'info');
}

// Verify Token
async function verifyToken() {
    try {
        console.log('🔵 Verifying token...');
        const response = await authenticatedFetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET'
        });
        
        if (response.ok) {
            const userData = JSON.parse(localStorage.getItem('currentUser'));
            if (userData) {
                currentUser = userData;
                document.body.setAttribute('data-role', userData.role);
                if (roleDisplay) {
                    roleDisplay.textContent = `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} Dashboard`;
                }
                
                if (loginScreen) loginScreen.classList.add('hidden');
                if (mainApp) mainApp.classList.remove('hidden');
                loadDashboardData();
                renderReports();
                console.log('✅ Token verified, user logged in');
            }
        } else {
            // Token invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            authToken = null;
            console.log('❌ Token invalid, cleared storage');
        }
    } catch (error) {
        console.log('❌ Token verification failed:', error);
    }
}

// Enhanced Form Validation
function validateSignup(username, password, confirmPassword, role) {
    let isValid = true;
    
    // Username validation
    if (!username || username.trim().length < 3 || username.trim().length > 20) {
        showFormError('signup-username', 'Username must be 3-20 characters long');
        isValid = false;
    }
    
    // Check for valid username characters
    if (username && !/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        showFormError('signup-username', 'Username can only contain letters, numbers, and underscores');
        isValid = false;
    }
    
    // Password validation
    if (!password || password.length < 6) {
        showFormError('signup-password', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
        showFormError('signup-confirm-password', 'Passwords do not match');
        isValid = false;
    }
    
    // Role validation
    if (!role) {
        showFormError('signup-role', 'Please select a role');
        isValid = false;
    }
    
    return isValid;
}

// Enhanced Form Error Handling
function showFormError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.classList.add('error');
    field.focus();
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('small');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontWeight = 'bold';
    field.parentNode.appendChild(errorElement);
}

function clearFormErrors() {
    const errorFields = document.querySelectorAll('.form-control.error');
    const errorMessages = document.querySelectorAll('.error-message');
    
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
}

// Authenticated Requests
async function authenticatedFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, { ...options, headers });
    
    // Handle token expiration
    if (response.status === 401) {
        handleLogout();
        showNotification('Session expired. Please login again.', 'warning');
    }
    
    return response;
}

// Event Listeners
function initializeEventListeners() {
    console.log('🔵 Initializing event listeners...');
    
    // Navigation
    if (sidebarLinks) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', handleNavigation);
        });
    }
    
    // Hazard report form
    const reportForm = document.getElementById('hazard-report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmission);
    }
    
    // Location detection
    const getLocationBtn = document.getElementById('get-location');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    // Media upload
    const mediaUpload = document.getElementById('media-upload');
    if (mediaUpload) {
        mediaUpload.addEventListener('change', handleMediaUpload);
    }
    
    // Save offline
    const saveOfflineBtn = document.getElementById('save-offline');
    if (saveOfflineBtn) {
        saveOfflineBtn.addEventListener('click', saveReportOffline);
    }
    
    // Alert form
    const alertForm = document.getElementById('alert-form');
    if (alertForm) {
        alertForm.addEventListener('submit', handleAlertBroadcast);
    }
    
    // Search and filters
    const searchReports = document.getElementById('search-reports');
    if (searchReports) {
        searchReports.addEventListener('input', filterReports);
    }
    
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterReports);
    }
    
    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Export reports
    const exportBtn = document.getElementById('export-reports');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReports);
    }
    
    console.log('✅ Event listeners initialized');
}

// Navigation
function handleNavigation(e) {
    e.preventDefault();
    const section = e.target.getAttribute('data-section');
    
    if (section) {
        // Update active link
        sidebarLinks.forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show corresponding section
        contentSections.forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = section;
        }
        
        // Load section-specific data
        loadSectionData(section);
    }
}

// Section Data Loading
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'map':
            loadMapData();
            break;
        case 'reports':
            renderReports();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        case 'verify':
            loadVerificationQueue();
            break;
        case 'alerts':
            loadActiveAlerts();
            break;
    }
}

function loadDashboardData() {
    renderRecentReports();
    updateStatistics();
}

function renderRecentReports() {
    const container = document.getElementById('recent-reports');
    if (!container) return;
    
    container.innerHTML = appData.sampleReports.map(report => {
        const hazardType = appData.hazardTypes.find(h => h.id === report.type);
        const timeAgo = getTimeAgo(report.timestamp);
        
        return `
            <div class="report-item" onclick="showReportDetails('${report.id}')">
                <div class="report-info">
                    <h4>${hazardType?.icon} ${hazardType?.name}</h4>
                    <p>${report.location.name} • ${timeAgo}</p>
                </div>
                <span class="report-status report-status--${report.status}">${report.status}</span>
            </div>
        `;
    }).join('');
}

function updateStatistics() {
    // Statistics are already in HTML, would be dynamic in real implementation
}

// Report Management
async function handleReportSubmission(e) {
    e.preventDefault();
    
    if (!authToken) {
        showNotification('Please login to submit reports', 'error');
        return;
    }
    
    const report = {
        type: document.getElementById('hazard-type')?.value,
        severity: document.getElementById('severity')?.value,
        location: {
            name: document.getElementById('location')?.value,
            lat: null,
            lng: null
        },
        description: document.getElementById('description')?.value
    };
    
    if (!report.type || !report.severity || !report.location.name || !report.description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/reports`, {
            method: 'POST',
            body: JSON.stringify(report)
        });
        
        if (response.ok) {
            const newReport = await response.json();
            
            // Add to local data for immediate UI update
            appData.sampleReports.unshift({
                ...newReport,
                id: newReport._id || 'R' + String(Date.now()).slice(-6),
                timestamp: newReport.createdAt || new Date().toISOString(),
                reporter: currentUser.username
            });
            
            showNotification('Report submitted successfully!', 'success');
            e.target.reset();
            
            const mediaPreview = document.getElementById('media-preview');
            if (mediaPreview) mediaPreview.innerHTML = '';
            
            const locationCoords = document.getElementById('location-coordinates');
            if (locationCoords) locationCoords.classList.add('hidden');
            
            // Refresh dashboard
            renderRecentReports();
        } else {
            const error = await response.json();
            showNotification(error.error || 'Failed to submit report', 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locationCoords = document.getElementById('location-coordinates');
                if (locationCoords) {
                    locationCoords.innerHTML = `📍 Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    locationCoords.classList.remove('hidden');
                }
                showNotification('Location captured!', 'success');
            },
            () => {
                showNotification('Unable to get location', 'error');
            }
        );
    } else {
        showNotification('Geolocation not supported', 'error');
    }
}

function handleMediaUpload(e) {
    const files = Array.from(e.target.files);
    const preview = document.getElementById('media-preview');
    
    if (preview) {
        preview.innerHTML = files.map(file => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const icon = isImage ? '🖼️' : isVideo ? '🎥' : '📄';
            
            return `<div class="media-item">${icon} ${file.name}</div>`;
        }).join('');
    }
}

function saveReportOffline() {
    const report = {
        type: document.getElementById('hazard-type')?.value,
        severity: document.getElementById('severity')?.value,
        location: document.getElementById('location')?.value,
        description: document.getElementById('description')?.value,
        timestamp: new Date().toISOString(),
        offline: true
    };
    
    if (report.type && report.severity && report.location && report.description) {
        offlineReports.push(report);
        localStorage.setItem('offlineReports', JSON.stringify(offlineReports));
        showNotification('Report saved offline!', 'success');
    } else {
        showNotification('Please fill all required fields', 'error');
    }
}

// Chart Setup
function setupCharts() {
    console.log('🔵 Setting up charts...');
    
    try {
        setupHazardChart();
        setupSeverityChart();
        setupPlatformChart();
        setupSentimentChart();
        setupTimelineChart();
        console.log('✅ Charts setup completed');
    } catch (error) {
        console.error('❌ Chart setup error:', error);
    }
}

function setupHazardChart() {
    const ctx = document.getElementById('hazard-chart');
    if (!ctx) return;
    
    const hazardCounts = appData.hazardTypes.map(type => 
        appData.sampleReports.filter(report => report.type === type.id).length
    );
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: appData.hazardTypes.map(h => h.name),
            datasets: [{
                data: hazardCounts,
                backgroundColor: appData.hazardTypes.map(h => h.color),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function setupSeverityChart() {
    const ctx = document.getElementById('severity-chart');
    if (!ctx) return;
    
    const severityCounts = appData.severityLevels.map(level => 
        appData.sampleReports.filter(report => report.severity === level.id).length
    );
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: appData.severityLevels.map(s => s.name),
            datasets: [{
                label: 'Reports',
                data: severityCounts,
                backgroundColor: appData.severityLevels.map(s => s.color),
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function setupPlatformChart() {
    const ctx = document.getElementById('platform-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: appData.socialMediaData.map(p => p.platform),
            datasets: [{
                label: 'Mentions',
                data: [1247, 892, 156],
                backgroundColor: ['#1da1f2', '#4267b2', '#ff0000'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function setupSentimentChart() {
    const ctx = document.getElementById('sentiment-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Negative', 'Neutral', 'Positive'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: ['#ff4444', '#ffaa00', '#44ff44'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function setupTimelineChart() {
    const ctx = document.getElementById('timeline-chart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
            datasets: [{
                label: 'Mentions',
                data: [120, 150, 180, 220, 280, 350, 400],
                borderColor: '#33808d',
                backgroundColor: 'rgba(51, 128, 141, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Map Functions
function loadMapData() {
    const mapContainer = document.getElementById('hazard-map');
    if (!mapContainer) return;
    
    mapContainer.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);">
            <div style="text-align: center;">
                <h3>🗺️ Interactive Map</h3>
                <p>Showing ${appData.sampleReports.length} hazard reports</p>
                <div style="margin-top: 20px;">
                    ${appData.sampleReports.map(report => {
                        const hazardType = appData.hazardTypes.find(h => h.id === report.type);
                        return `<div style="display: inline-block; margin: 5px; padding: 5px 10px; background: ${hazardType?.color}; color: white; border-radius: 20px; font-size: 12px;">${hazardType?.icon} ${report.location.name}</div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// Reports List
function renderReports() {
    const container = document.getElementById('reports-list');
    if (!container) return;
    
    container.innerHTML = appData.sampleReports.map(report => {
        const hazardType = appData.hazardTypes.find(h => h.id === report.type);
        const timeAgo = getTimeAgo(report.timestamp);
        
        return `
            <div class="report-item" onclick="showReportDetails('${report.id}')">
                <div class="report-info">
                    <h4>${hazardType?.icon} ${hazardType?.name} - ${report.severity}</h4>
                    <p><strong>Location:</strong> ${report.location.name}</p>
                    <p><strong>Description:</strong> ${report.description}</p>
                    <p><strong>Reporter:</strong> ${report.reporter} • ${timeAgo}</p>
                </div>
                <span class="report-status report-status--${report.status}">${report.status}</span>
            </div>
        `;
    }).join('');
}

function filterReports() {
    const searchTerm = document.getElementById('search-reports')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || 'all';
    
    let filteredReports = appData.sampleReports;
    
    if (searchTerm) {
        filteredReports = filteredReports.filter(report => 
            report.description.toLowerCase().includes(searchTerm) ||
            report.location.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === statusFilter);
    }
    
    const container = document.getElementById('reports-list');
    if (container) {
        container.innerHTML = filteredReports.map(report => {
            const hazardType = appData.hazardTypes.find(h => h.id === report.type);
            const timeAgo = getTimeAgo(report.timestamp);
            
            return `
                <div class="report-item" onclick="showReportDetails('${report.id}')">
                    <div class="report-info">
                        <h4>${hazardType?.icon} ${hazardType?.name} - ${report.severity}</h4>
                        <p><strong>Location:</strong> ${report.location.name}</p>
                        <p><strong>Description:</strong> ${report.description}</p>
                        <p><strong>Reporter:</strong> ${report.reporter} • ${timeAgo}</p>
                    </div>
                    <span class="report-status report-status--${report.status}">${report.status}</span>
                </div>
            `;
        }).join('');
    }
}

// Analytics
function loadAnalyticsData() {
    showNotification('Analytics data refreshed', 'info');
}

// Verification Queue
function loadVerificationQueue() {
    const container = document.getElementById('pending-reports');
    if (!container) return;
    
    const pendingReports = appData.sampleReports.filter(report => report.status === 'pending');
    
    container.innerHTML = pendingReports.map(report => {
        const hazardType = appData.hazardTypes.find(h => h.id === report.type);
        
        return `
            <div class="verification-item">
                <h4>${hazardType?.icon} ${hazardType?.name}</h4>
                <p><strong>Location:</strong> ${report.location.name}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p><strong>Severity:</strong> ${report.severity}</p>
                <p><strong>Reporter:</strong> ${report.reporter}</p>
                <div class="verification-actions">
                    <button class="btn btn--primary" onclick="verifyReport('${report.id}', 'verified')">✅ Verify</button>
                    <button class="btn btn--danger" onclick="verifyReport('${report.id}', 'dismissed')">❌ Dismiss</button>
                </div>
            </div>
        `;
    }).join('');
}

function verifyReport(reportId, status) {
    const report = appData.sampleReports.find(r => r.id === reportId);
    if (report) {
        report.status = status;
        showNotification(`Report ${status}!`, 'success');
        loadVerificationQueue();
        renderRecentReports();
    }
}

// Alert Management
async function handleAlertBroadcast(e) {
    e.preventDefault();
    
    if (!authToken) {
        showNotification('Please login to broadcast alerts', 'error');
        return;
    }
    
    const alertData = {
        type: document.getElementById('alert-type')?.value,
        message: document.getElementById('alert-message')?.value,
        regions: Array.from(document.getElementById('alert-regions')?.selectedOptions || []).map(o => o.value)
    };
    
    if (!alertData.type || !alertData.message) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/alerts`, {
            method: 'POST',
            body: JSON.stringify(alertData)
        });
        
        if (response.ok) {
            showNotification('Alert broadcasted successfully!', 'success');
            e.target.reset();
            loadActiveAlerts();
        } else {
            const error = await response.json();
            showNotification(error.error || 'Failed to broadcast alert', 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    }
}

function loadActiveAlerts() {
    const container = document.getElementById('alerts-list');
    if (!container) return;
    
    const sampleAlerts = [
        {
            id: 'A001',
            type: 'warning',
            message: 'High waves expected along Chennai coast. Avoid beach activities.',
            regions: ['chennai'],
            timestamp: '2025-09-13T14:00:00Z',
            active: true
        }
    ];
    
    container.innerHTML = sampleAlerts.map(alert => `
        <div class="alert-broadcast alert-broadcast--${alert.type}">
            <h4>${alert.type.toUpperCase()}: ${alert.message}</h4>
            <p><strong>Regions:</strong> ${alert.regions.join(', ')}</p>
            <p><strong>Issued:</strong> ${getTimeAgo(alert.timestamp)}</p>
            <button class="btn btn--secondary" onclick="deactivateAlert('${alert.id}')">Deactivate</button>
        </div>
    `).join('');
}

function deactivateAlert(alertId) {
    showNotification('Alert deactivated', 'info');
    loadActiveAlerts();
}

// Modal Functions
function showReportDetails(reportId) {
    const report = appData.sampleReports.find(r => r.id === reportId);
    if (!report) return;
    
    const hazardType = appData.hazardTypes.find(h => h.id === report.type);
    const modal = document.getElementById('report-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (modalBody) {
        modalBody.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4>${hazardType?.icon} ${hazardType?.name}</h4>
                <p><strong>Severity:</strong> <span style="color: ${appData.severityLevels.find(s => s.id === report.severity)?.color}">${report.severity.toUpperCase()}</span></p>
                <p><strong>Location:</strong> ${report.location.name}</p>
                <p><strong>Coordinates:</strong> ${report.location.lat}, ${report.location.lng}</p>
                <p><strong>Description:</strong> ${report.description}</p>
                <p><strong>Reporter:</strong> ${report.reporter}</p>
                <p><strong>Status:</strong> ${report.status}</p>
                <p><strong>Submitted:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
            </div>
            ${report.images && report.images.length > 0 ? `
                <div>
                    <h5>Attachments:</h5>
                    <div style="display: flex; gap: 10px;">
                        ${report.images.map(img => `<div style="width: 60px; height: 60px; background: #e0f2fe; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🖼️</div>`).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }
    
    if (modal) modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('report-modal');
    if (modal) modal.classList.add('hidden');
}

// Export Functions
function exportReports() {
    const csv = generateCSV(appData.sampleReports);
    downloadCSV(csv, 'hazard_reports.csv');
    showNotification('Reports exported successfully!', 'success');
}

function generateCSV(reports) {
    const headers = ['ID', 'Type', 'Severity', 'Location', 'Description', 'Reporter', 'Status', 'Timestamp'];
    const rows = reports.map(report => [
        report.id,
        report.type,
        report.severity,
        report.location.name,
        report.description,
        report.reporter,
        report.status,
        report.timestamp
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Utility Functions
function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

function showNotification(message, type = 'info') {
    console.log(`📢 Notification (${type}):`, message);
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Sync offline reports when online
function syncOfflineReports() {
    if (offlineReports.length > 0 && navigator.onLine && authToken) {
        console.log('🔵 Syncing offline reports...');
        
        offlineReports.forEach(async (report) => {
            try {
                const response = await authenticatedFetch(`${API_BASE_URL}/reports`, {
                    method: 'POST',
                    body: JSON.stringify(report)
                });
                
                if (response.ok) {
                    const syncedReport = await response.json();
                    appData.sampleReports.unshift({
                        ...syncedReport,
                        id: syncedReport._id || 'R' + String(Date.now()).slice(-6),
                        timestamp: syncedReport.createdAt || new Date().toISOString(),
                        reporter: currentUser?.username || 'Unknown',
                        offline: false
                    });
                }
            } catch (error) {
                console.log('Failed to sync offline report:', error);
            }
        });
        
        offlineReports = [];
        localStorage.setItem('offlineReports', JSON.stringify(offlineReports));
        showNotification(`Offline reports synced!`, 'success');
        renderRecentReports();
        renderReports();
    }
}

// Online/Offline Status
window.addEventListener('online', syncOfflineReports);
window.addEventListener('offline', () => {
    showNotification('You are offline. Reports will be saved locally.', 'warning');
});

// Auto-sync on login
if (authToken && navigator.onLine) {
    setTimeout(syncOfflineReports, 1000);
}

// Global debug function for testing
window.testBackendDirectly = async function() {
    try {
        console.log('🔍 Testing backend directly...');
        const response = await fetch('http://localhost:5000/test');
        const data = await response.json();
        console.log('✅ Direct backend test successful:', data);
        alert('Backend is working! ' + JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Direct backend test failed:', error);
        alert('Backend test failed: ' + error.message);
    }
};

// Debug info on console
console.log('🚀 Ocean Hazard Platform - Frontend Loaded');
console.log('📍 API Base URL:', API_BASE_URL);
console.log('🔧 Debug mode enabled - Use testBackendDirectly() to test backend');
