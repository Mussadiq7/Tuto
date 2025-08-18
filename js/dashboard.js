// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeThemeToggle();
  initializeStreakGrid();
  initializeInteractiveElements();
  loadDashboardData();
  loadStudyPlans();
});

// Global variables
let isLoading = false;
let studyPlans = [];

// Load study plans from localStorage
function loadStudyPlans() {
  const savedPlans = localStorage.getItem('tutoStudyPlans');
  if (savedPlans) {
    studyPlans = JSON.parse(savedPlans);
    renderStudyPlans();
  }
}

// Save study plans to localStorage
function saveStudyPlans() {
  localStorage.setItem('tutoStudyPlans', JSON.stringify(studyPlans));
}

// Add a new study plan
function addStudyPlan(plan) {
  const newPlan = {
    id: Date.now(),
    topic: plan.topic || 'Unknown Topic',
    duration: plan.duration || '14 days',
    difficulty: plan.difficulty || 'Intermediate',
    timePerDay: plan.timePerDay || '30 min/day',
    overview: plan.overview || 'Study plan overview',
    schedule: plan.schedule || [],
    createdAt: new Date().toISOString(),
    status: 'active',
    progress: 0
  };
  
  studyPlans.unshift(newPlan);
  saveStudyPlans();
  renderStudyPlans();
}

// Render study plans in the dashboard
function renderStudyPlans() {
  const container = document.getElementById('studyPlansContainer');
  if (!container) return;
  
  if (studyPlans.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-lg font-medium">No study plans yet</p>
        <p class="text-sm">Create your first study plan to get started!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = studyPlans.map(plan => `
    <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors duration-200">
      <div class="flex items-center space-x-3">
        <div class="w-3 h-3 ${plan.status === 'completed' ? 'bg-green-400' : plan.status === 'active' ? 'bg-blue-400' : 'bg-yellow-400'} rounded-full"></div>
        <div>
          <h4 class="text-white font-medium">${plan.topic}</h4>
          <p class="text-gray-400 text-sm">${plan.duration} • ${plan.difficulty} • ${plan.timePerDay}</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm font-medium ${plan.status === 'completed' ? 'text-green-400' : plan.status === 'active' ? 'text-blue-400' : 'text-yellow-400'}">
          ${plan.status === 'completed' ? '100%' : plan.status === 'active' ? `${plan.progress}%` : '0%'}
        </span>
        <button onclick="viewPlan(${plan.id})" class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
          View
        </button>
      </div>
    </div>
  `).join('');
}

// View a specific study plan
function viewPlan(planId) {
  const plan = studyPlans.find(p => p.id === planId);
  if (plan) {
    // Store the plan in localStorage for the view page
    localStorage.setItem('currentViewPlan', JSON.stringify(plan));
    // Redirect to a view page or show modal
    window.location.href = `view-plan.html?id=${planId}`;
  }
}

function initializeThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.toggle('light', savedTheme === 'light');
  updateThemeIcon(savedTheme === 'light');
  
  themeToggle.addEventListener('click', function() {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
  });
  
  function updateThemeIcon(isLight) {
    if (isLight) {
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>';
    } else {
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
    }
  }
}

function initializeStreakGrid() {
  const streakGrid = document.getElementById('streakGrid');
  
  // Generate GitHub-like streak grid for the last 365 days
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid grid-cols-53 gap-1';
  
  // Get current date and calculate dates for the grid
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364); // 365 days total
  
  // Generate mock activity data (you can replace this with real data)
  const activityData = generateMockActivityData(startDate, today);
  
  // Create grid cells
  for (let i = 0; i < 365; i++) {
    const cell = document.createElement('div');
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const activityLevel = activityData[i] || 0;
    const cellClasses = getCellClasses(activityLevel);
    
    cell.className = `w-3 h-3 rounded-sm ${cellClasses}`;
    cell.title = `${currentDate.toLocaleDateString()}: ${getActivityDescription(activityLevel)}`;
    
    gridContainer.appendChild(cell);
  }
  
  streakGrid.appendChild(gridContainer);
  
  // Add legend
  const legend = document.createElement('div');
  legend.className = 'flex items-center justify-center space-x-4 mt-4 text-sm text-gray-400';
  legend.innerHTML = `
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded-sm bg-gray-600"></div>
      <span>Less</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded-sm bg-green-400"></div>
      <span>More</span>
    </div>
  `;
  streakGrid.appendChild(legend);
}

function generateMockActivityData(startDate, endDate) {
  const data = {};
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    
    // Generate random activity level (0-4)
    // 0: no activity, 1: low, 2: medium, 3: high, 4: very high
    let activityLevel = 0;
    
    // Simulate some patterns
    if (Math.random() > 0.3) { // 70% chance of some activity
      activityLevel = Math.floor(Math.random() * 4) + 1;
    }
    
    // Simulate weekends having less activity
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      activityLevel = Math.max(0, activityLevel - 1);
    }
    
    data[dateKey] = activityLevel;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

function getCellClasses(activityLevel) {
  switch (activityLevel) {
    case 0: return 'bg-gray-800 border border-gray-700';
    case 1: return 'bg-green-900';
    case 2: return 'bg-green-700';
    case 3: return 'bg-green-500';
    case 4: return 'bg-green-300';
    default: return 'bg-gray-800 border border-gray-700';
  }
}

function getActivityDescription(activityLevel) {
  switch (activityLevel) {
    case 0: return 'No activity';
    case 1: return 'Low activity';
    case 2: return 'Medium activity';
    case 3: return 'High activity';
    case 4: return 'Very high activity';
    default: return 'No activity';
  }
}

function initializeInteractiveElements() {
  // Quick action buttons
  const quickActionButtons = document.querySelectorAll('[data-action]');
  quickActionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.getAttribute('data-action');
      handleQuickAction(action);
      
      // Add click animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });
  
  // Time period selector for streaks
  const timeButtons = document.querySelectorAll('[data-period]');
  timeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active state from all buttons
      timeButtons.forEach(btn => {
        btn.classList.remove('bg-white/20', 'text-white');
        btn.classList.add('bg-white/10', 'text-gray-300');
      });
      
      // Add active state to clicked button
      this.classList.remove('bg-white/10', 'text-gray-300');
      this.classList.add('bg-white/20', 'text-white');
      
      // Update streak display based on period
      const period = this.getAttribute('data-period');
      updateStreakDisplay(period);
    });
  });
  

}

function handleQuickAction(action) {
  switch (action) {
    case 'start-topic':
      showNotification('Starting new topic...', 'success');
      break;
    case 'take-quiz':
      showNotification('Loading quiz...', 'info');
      break;
    case 'review-notes':
      showNotification('Opening notes...', 'info');
      break;
    case 'schedule-session':
      showNotification('Opening scheduler...', 'info');
      break;
    default:
      showNotification('Action not implemented yet', 'warning');
  }
}

function updateStreakDisplay(period = 'month') {
  // Update streak information based on selected period
  const streakInfo = {
    week: { current: 7, longest: 7, total: 7 },
    month: { current: 12, longest: 28, total: 156 },
    year: { current: 12, longest: 28, total: 156 }
  };
  
  const info = streakInfo[period];
  const currentStreakEl = document.querySelector('.text-green-400');
  const longestStreakEl = document.querySelector('.text-xl.font-semibold.text-white');
  const totalActiveEl = document.querySelectorAll('.text-xl.font-semibold.text-white')[1];
  
  if (currentStreakEl) currentStreakEl.textContent = `🔥 ${info.current} days`;
  if (longestStreakEl) longestStreakEl.textContent = `${info.longest} days`;
  if (totalActiveEl) totalActiveEl.textContent = `${info.total} days`;
}

function loadDashboardData() {
  // Simulate loading data
  setTimeout(() => {
    updateProgressBars();
  }, 500);
}

function updateProgressBars() {
  const progressBars = document.querySelectorAll('.bg-gradient-to-r');
  progressBars.forEach(bar => {
    const width = bar.style.width;
    if (width) {
      // Animate the progress bar
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, 100);
    }
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transform transition-all duration-300 translate-x-full`;
  
  // Set background color based on type
  switch (type) {
    case 'success':
      notification.className += ' bg-green-500';
      break;
    case 'warning':
      notification.className += ' bg-yellow-500';
      break;
    case 'error':
      notification.className += ' bg-red-500';
      break;
    default:
      notification.className += ' bg-blue-500';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    handleQuickAction('start-topic');
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
    e.preventDefault();
    handleQuickAction('take-quiz');
  }
});

// Export functions for global access
window.Dashboard = {
  showNotification,
  handleQuickAction,
  updateStreakDisplay
};
