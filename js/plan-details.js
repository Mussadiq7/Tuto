// Plan Details JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
    loadPlanDetails();
});

// Global variables
let currentPlan = null;
let allDays = [];

// Load plan details from localStorage
function loadPlanDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('planId');
    
    if (!planId) {
        showError('No study plan ID provided');
        return;
    }
    
    const savedPlans = localStorage.getItem('tutoStudyPlans');
    if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        currentPlan = plans.find(p => p.id == planId);
        
        if (currentPlan) {
            initializePlanDetails();
        } else {
            showError('Study plan not found');
        }
    } else {
        showError('No study plans found');
    }
}

// Initialize plan details
function initializePlanDetails() {
    // Extract all days from the schedule
    allDays = [];
    currentPlan.schedule.forEach((week, weekIndex) => {
        week.days.forEach((day, dayIndex) => {
            allDays.push({
                ...day,
                globalDayIndex: allDays.length + 1,
                weekIndex: weekIndex,
                dayIndex: dayIndex
            });
        });
    });
    
    // Update UI
    updatePlanHeader();
    updatePlanStats();
    updatePlanInformation();
    renderDailySchedule();
    
    // Setup event listeners
    setupEventListeners();
}

// Update plan header
function updatePlanHeader() {
    document.getElementById('planTitle').textContent = currentPlan.topic;
    document.getElementById('planSubtitle').textContent = `${currentPlan.duration} • ${currentPlan.difficulty} • ${currentPlan.timePerDay}`;
}

// Update plan statistics
function updatePlanStats() {
    const completedDays = allDays.filter(day => day.completed).length;
    const totalDays = allDays.length;
    const progress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    document.getElementById('overallProgress').textContent = `${progress}%`;
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('completedDays').textContent = completedDays;
    document.getElementById('timePerDay').textContent = currentPlan.timePerDay;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Update plan information
function updatePlanInformation() {
    document.getElementById('planTopic').textContent = currentPlan.topic;
    document.getElementById('planDuration').textContent = currentPlan.duration;
    document.getElementById('planDifficulty').textContent = currentPlan.difficulty;
    document.getElementById('planTimePerDay').textContent = `${currentPlan.timePerDay} minutes`;
    document.getElementById('planCreated').textContent = formatDate(currentPlan.createdAt);
    document.getElementById('planStatus').textContent = currentPlan.status;
    
    // Update plan overview
    const overview = currentPlan.overview || 'This comprehensive study plan will guide you through the fundamentals and advanced concepts, with practical exercises and real-world applications to reinforce your learning.';
    document.getElementById('planOverview').textContent = overview;
    
    // Update learning styles
    renderLearningStyles();
}

// Render learning styles
function renderLearningStyles() {
    const container = document.getElementById('learningStyles');
    const styles = currentPlan.learningStyles || [];
    
    if (styles.length === 0) {
        container.innerHTML = '<span class="text-gray-400 text-sm">No specific learning styles selected</span>';
        return;
    }
    
    const styleLabels = {
        'visual': 'Visual Learner',
        'hands-on': 'Hands-on Practice',
        'theory': 'Theory Focused',
        'projects': 'Project Based'
    };
    
    container.innerHTML = styles.map(style => `
        <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
            ${styleLabels[style] || style}
        </span>
    `).join('');
}

// Render daily schedule
function renderDailySchedule() {
    const container = document.getElementById('dailySchedule');
    
    if (allDays.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-gray-400">No daily schedule available</div>';
        return;
    }
    
    // Show first 5 days by default
    const daysToShow = allDays.slice(0, 5);
    
    container.innerHTML = daysToShow.map((day, index) => `
        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 ${day.completed ? 'bg-green-500' : 'bg-white/20'} rounded-full flex items-center justify-center">
                        ${day.completed ? 
                            '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : 
                            '<span class="text-white text-sm font-bold">' + day.globalDayIndex + '</span>'
                        }
                    </div>
                    <div>
                        <h4 class="text-white font-medium">${day.title}</h4>
                        <p class="text-gray-400 text-sm">${day.timeRequired} minutes</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-sm ${day.completed ? 'text-green-400' : 'text-gray-400'}">
                        ${day.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <h5 class="text-white text-sm font-medium mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Focus Areas
                    </h5>
                    <div class="space-y-1">
                        ${day.topics.slice(0, 3).map(topic => `
                            <div class="text-gray-300 text-sm flex items-start gap-2">
                                <span class="text-green-400 mt-1">•</span>
                                <span>${topic}</span>
                            </div>
                        `).join('')}
                        ${day.topics.length > 3 ? `<div class="text-gray-500 text-sm ml-4">+${day.topics.length - 3} more</div>` : ''}
                    </div>
                </div>
                
                <div>
                    <h5 class="text-white text-sm font-medium mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        Activities
                    </h5>
                    <div class="space-y-1">
                        ${day.activities.slice(0, 2).map(activity => `
                            <div class="text-gray-300 text-sm flex items-start gap-2">
                                <span class="text-blue-400 mt-1">•</span>
                                <span>${activity}</span>
                            </div>
                        `).join('')}
                        ${day.activities.length > 2 ? `<div class="text-gray-500 text-sm ml-4">+${day.activities.length - 2} more</div>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="flex justify-between items-center">
                <span class="text-xs text-gray-400">Day ${day.globalDayIndex}</span>
                ${!day.completed ? `
                    <button onclick="startDay(${day.globalDayIndex - 1})" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                        Start Day
                    </button>
                ` : `
                    <button onclick="reviewDay(${day.globalDayIndex - 1})" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                        Review
                    </button>
                `}
            </div>
        </div>
    `).join('');
    
    // Add "View All Days" functionality
    if (allDays.length > 5) {
        const viewAllBtn = document.getElementById('viewAllDays');
        if (viewAllBtn) {
            viewAllBtn.onclick = () => {
                if (viewAllBtn.textContent === 'View All Days') {
                    renderAllDays();
                    viewAllBtn.textContent = 'Show Less';
                } else {
                    renderDailySchedule();
                    viewAllBtn.textContent = 'View All Days';
                }
            };
        }
    }
}

// Render all days
function renderAllDays() {
    const container = document.getElementById('dailySchedule');
    
    container.innerHTML = allDays.map((day, index) => `
        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 ${day.completed ? 'bg-green-500' : 'bg-white/20'} rounded-full flex items-center justify-center">
                        ${day.completed ? 
                            '<svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : 
                            '<span class="text-white text-sm font-bold">' + day.globalDayIndex + '</span>'
                        }
                    </div>
                    <div>
                        <h4 class="text-white font-medium">${day.title}</h4>
                        <p class="text-gray-400 text-sm">${day.timeRequired} minutes</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-sm ${day.completed ? 'text-green-400' : 'text-gray-400'}">
                        ${day.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <h5 class="text-white text-sm font-medium mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Focus Areas
                    </h5>
                    <div class="space-y-1">
                        ${day.topics.slice(0, 3).map(topic => `
                            <div class="text-gray-300 text-sm flex items-start gap-2">
                                <span class="text-green-400 mt-1">•</span>
                                <span>${topic}</span>
                            </div>
                        `).join('')}
                        ${day.topics.length > 3 ? `<div class="text-gray-500 text-sm ml-4">+${day.topics.length - 3} more</div>` : ''}
                    </div>
                </div>
                
                <div>
                    <h5 class="text-white text-sm font-medium mb-2 flex items-center gap-2">
                        <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        Activities
                    </h5>
                    <div class="space-y-1">
                        ${day.activities.slice(0, 2).map(activity => `
                            <div class="text-gray-300 text-sm flex items-start gap-2">
                                <span class="text-blue-400 mt-1">•</span>
                                <span>${activity}</span>
                            </div>
                        `).join('')}
                        ${day.activities.length > 2 ? `<div class="text-gray-500 text-sm ml-4">+${day.activities.length - 2} more</div>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="flex justify-between items-center">
                <span class="text-xs text-gray-400">Day ${day.globalDayIndex}</span>
                ${!day.completed ? `
                    <button onclick="startDay(${day.globalDayIndex - 1})" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                        Start Day
                    </button>
                ` : `
                    <button onclick="reviewDay(${day.globalDayIndex - 1})" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                        Review
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    const startLearningBtn = document.getElementById('startLearningBtn');
    const editPlanBtn = document.getElementById('editPlanBtn');
    
    if (startLearningBtn) {
        startLearningBtn.onclick = () => {
            // Find first incomplete day or start from first day
            const firstIncompleteDay = allDays.findIndex(day => !day.completed);
            const startDay = firstIncompleteDay >= 0 ? firstIncompleteDay : 0;
            
            // Redirect to learning interface
            window.location.href = `learning-interface.html?planId=${currentPlan.id}&startDay=${startDay}`;
        };
    }
    
    if (editPlanBtn) {
        editPlanBtn.onclick = () => {
            // For now, redirect to create-plan with the current plan data
            localStorage.setItem('editPlanData', JSON.stringify(currentPlan));
            window.location.href = 'create-plan.html';
        };
    }
}

// Start a specific day
function startDay(dayIndex) {
    window.location.href = `learning-interface.html?planId=${currentPlan.id}&startDay=${dayIndex}`;
}

// Review a specific day
function reviewDay(dayIndex) {
    window.location.href = `learning-interface.html?planId=${currentPlan.id}&startDay=${dayIndex}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Show error
function showError(message) {
    const container = document.querySelector('main');
    container.innerHTML = `
        <div class="text-center py-16">
            <div class="w-16 h-16 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-red-400 mb-2">Error</h3>
            <p class="text-gray-400 mb-6">${message}</p>
            <a href="all-study-plans.html" class="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Study Plans
            </a>
        </div>
    `;
}

// Theme toggle functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    if (!themeToggle || !themeIcon) return;
    
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

// Export functions for global access
window.PlanDetails = {
    startDay,
    reviewDay
};
