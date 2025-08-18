// All Study Plans Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
    loadStudyPlans();
    setupFilters();
    setupSearch();
});

// Global variables
let allStudyPlans = [];
let filteredPlans = [];

// Load study plans from localStorage
function loadStudyPlans() {
    const savedPlans = localStorage.getItem('tutoStudyPlans');
    if (savedPlans) {
        allStudyPlans = JSON.parse(savedPlans);
        filteredPlans = [...allStudyPlans];
        renderStudyPlans();
    } else {
        showEmptyState();
    }
}

// Render study plans in the grid
function renderStudyPlans() {
    const grid = document.getElementById('studyPlansGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    if (filteredPlans.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    grid.innerHTML = filteredPlans.map(plan => `
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <h3 class="text-xl font-bold text-white mb-2">${plan.topic}</h3>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="px-2 py-1 text-xs rounded-full ${getStatusColor(plan.status)}">${plan.status}</span>
                        <span class="text-gray-400 text-sm">${plan.duration}</span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold ${getProgressColor(plan.progress)}">${plan.progress}%</div>
                    <div class="text-gray-400 text-xs">Complete</div>
                </div>
            </div>
            
            <div class="space-y-3 mb-6">
                <div class="flex items-center gap-2 text-sm">
                    <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-gray-300">${plan.timePerDay}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="text-gray-300">${plan.difficulty}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-gray-300">Created ${formatDate(plan.createdAt)}</span>
                </div>
            </div>
            
            <div class="space-y-3">
                <div class="w-full bg-white/10 rounded-full h-2">
                    <div class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000" style="width: ${plan.progress}%"></div>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="viewPlan(${plan.id})" class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                        Continue Learning
                    </button>
                    <button onclick="viewPlanDetails(${plan.id})" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get status color classes
function getStatusColor(status) {
    switch (status) {
        case 'active':
            return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
        case 'completed':
            return 'bg-green-500/20 text-green-400 border border-green-500/30';
        case 'planning':
            return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        default:
            return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
}

// Get progress color classes
function getProgressColor(progress) {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 50) return 'text-yellow-400';
    if (progress >= 20) return 'text-blue-400';
    return 'text-gray-400';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// Setup filters
function setupFilters() {
    const filterButtons = {
        'filterAll': document.getElementById('filterAll'),
        'filterActive': document.getElementById('filterActive'),
        'filterCompleted': document.getElementById('filterCompleted'),
        'filterPlanning': document.getElementById('filterPlanning')
    };
    
    Object.entries(filterButtons).forEach(([id, button]) => {
        if (button) {
            button.addEventListener('click', () => {
                // Update active filter button
                Object.values(filterButtons).forEach(btn => {
                    btn.classList.remove('bg-green-600');
                    btn.classList.add('bg-white/10', 'hover:bg-white/20');
                });
                button.classList.remove('bg-white/10', 'hover:bg-white/20');
                button.classList.add('bg-green-600');
                
                // Apply filter
                applyFilter(id);
            });
        }
    });
}

// Apply filter
function applyFilter(filterId) {
    switch (filterId) {
        case 'filterAll':
            filteredPlans = [...allStudyPlans];
            break;
        case 'filterActive':
            filteredPlans = allStudyPlans.filter(plan => plan.status === 'active');
            break;
        case 'filterCompleted':
            filteredPlans = allStudyPlans.filter(plan => plan.status === 'completed');
            break;
        case 'filterPlanning':
            filteredPlans = allStudyPlans.filter(plan => plan.status === 'planning');
            break;
    }
    renderStudyPlans();
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm === '') {
                filteredPlans = [...allStudyPlans];
            } else {
                filteredPlans = allStudyPlans.filter(plan => 
                    plan.topic.toLowerCase().includes(searchTerm) ||
                    plan.difficulty.toLowerCase().includes(searchTerm) ||
                    plan.status.toLowerCase().includes(searchTerm)
                );
            }
            renderStudyPlans();
        });
    }
}

// Show empty state
function showEmptyState() {
    const grid = document.getElementById('studyPlansGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (grid) grid.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
}

// View plan (continue learning)
function viewPlan(planId) {
    const plan = allStudyPlans.find(p => p.id === planId);
    if (plan) {
        localStorage.setItem('currentStudyPlan', JSON.stringify(plan));
        window.location.href = `learning-interface.html?planId=${planId}`;
    }
}

// View plan details
function viewPlanDetails(planId) {
    const plan = allStudyPlans.find(p => p.id === planId);
    if (plan) {
        localStorage.setItem('currentStudyPlan', JSON.stringify(plan));
        window.location.href = `plan-details.html?planId=${planId}`;
    }
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
window.AllStudyPlans = {
    viewPlan,
    viewPlanDetails
};
