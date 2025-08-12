// All Study Plans Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
    initializeStudyPlans();
    initializeFilters();
    initializeSearch();
});

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const html = document.documentElement;
    
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        html.classList.add('light');
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }
    
    themeToggle.addEventListener('click', function() {
        const isLight = html.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateThemeIcon(isLight);
    });
    
    function updateThemeIcon(isLight) {
        const themeIcon = document.getElementById('themeIcon');
        if (isLight) {
            themeIcon.innerHTML = `
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            `;
        } else {
            themeIcon.innerHTML = `
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            `;
        }
    }
}

// Initialize Study Plans
async function initializeStudyPlans() {
    try {
        isLoading = true;
        showLoadingState();
        
        // Load study plans from API
        const plans = await apiService.getAllStudyPlans();
        studyPlans = plans;
        
        renderStudyPlans(plans);
        hideLoadingState();
    } catch (error) {
        console.error('Failed to load study plans:', error);
        showErrorState('Failed to load study plans. Please try again later.');
        hideLoadingState();
    }
}

// Show loading state
function showLoadingState() {
    const lessonList = document.getElementById('lessonList');
    lessonList.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-gray-400">Loading study plans...</span>
        </div>
    `;
}

// Hide loading state
function hideLoadingState() {
    isLoading = false;
}

// Show error state
function showErrorState(message) {
    const lessonList = document.getElementById('lessonList');
    lessonList.innerHTML = `
        <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="text-red-400 text-lg font-medium mb-2">Error</p>
            <p class="text-gray-400">${message}</p>
            <button onclick="initializeStudyPlans()" class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                Try Again
            </button>
        </div>
    `;
}

// Render Study Plans
function renderStudyPlans(plans) {
    const grid = document.getElementById('studyPlansGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (plans.length === 0) {
        grid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    grid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    grid.innerHTML = plans.map(plan => createStudyPlanCard(plan)).join('');
    
    // Add event listeners to start learning buttons
    document.querySelectorAll('[data-plan-id]').forEach(button => {
        button.addEventListener('click', function() {
            const planId = this.getAttribute('data-plan-id');
            startLearning(planId);
        });
    });
}

// Create Study Plan Card
function createStudyPlanCard(plan) {
    const statusColors = {
        completed: 'bg-green-500',
        active: 'bg-blue-500',
        planning: 'bg-yellow-500'
    };
    
    const statusText = {
        completed: 'Completed',
        active: 'In Progress',
        planning: 'Planning'
    };
    
    const progressColor = plan.progress === 100 ? 'bg-green-500' : 
                         plan.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500';
    
    return `
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="w-3 h-3 ${statusColors[plan.status]} rounded-full"></span>
                        <span class="text-sm font-medium text-gray-300">${statusText[plan.status]}</span>
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">${plan.title}</h3>
                    <p class="text-gray-400 text-sm mb-4">${plan.description}</p>
                </div>
            </div>
            
            <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-400">Progress</span>
                    <span class="text-white font-medium">${plan.progress}%</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2">
                    <div class="h-2 ${progressColor} rounded-full transition-all duration-300" style="width: ${plan.progress}%"></div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-gray-400">Topics:</span>
                        <span class="text-white ml-1">${plan.topics}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Duration:</span>
                        <span class="text-white ml-1">${plan.duration}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Difficulty:</span>
                        <span class="text-white ml-1">${plan.difficulty}</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Category:</span>
                        <span class="text-white ml-1">${plan.category}</span>
                    </div>
                </div>
                
                <div class="text-xs text-gray-500">
                    Last active: ${plan.lastActive}
                </div>
            </div>
            
            <div class="flex space-x-3">
                <button data-plan-id="${plan.id}" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Start Learning
                </button>
                <button class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Initialize Filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('#filterAll, #filterActive, #filterCompleted, #filterPlanning');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600');
                btn.classList.add('bg-white/10', 'hover:bg-white/20');
            });
            this.classList.remove('bg-white/10', 'hover:bg-white/20');
            this.classList.add('bg-blue-600');
            
            // Apply filter
            const filterType = this.id.replace('filter', '').toLowerCase();
            applyFilter(filterType);
        });
    });
}

// Apply Filter
function applyFilter(filterType) {
    const allPlans = generateMockStudyPlans();
    let filteredPlans;
    
    if (filterType === 'all') {
        filteredPlans = allPlans;
    } else {
        filteredPlans = allPlans.filter(plan => plan.status === filterType);
    }
    
    renderStudyPlans(filteredPlans);
}

// Initialize Search
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase().trim();
            applySearch(searchTerm);
        }, 300);
    });
}

// Apply Search
function applySearch(searchTerm) {
    const allPlans = generateMockStudyPlans();
    
    if (!searchTerm) {
        renderStudyPlans(allPlans);
        return;
    }
    
    const filteredPlans = allPlans.filter(plan => 
        plan.title.toLowerCase().includes(searchTerm) ||
        plan.description.toLowerCase().includes(searchTerm) ||
        plan.category.toLowerCase().includes(searchTerm) ||
        plan.difficulty.toLowerCase().includes(searchTerm)
    );
    
    renderStudyPlans(filteredPlans);
}

// Start Learning Function
function startLearning(planId) {
    const plan = generateMockStudyPlans().find(p => p.id == planId);
    if (plan) {
        showNotification(`Starting ${plan.title}`, `Redirecting to learning interface...`, 'success');
        // Redirect to the learning interface with the plan ID
        setTimeout(() => {
            window.location.href = `learning-interface.html?planId=${planId}`;
        }, 1000);
    }
}

// Show Notification
function showNotification(message, description = '', type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationDescription = document.getElementById('notificationDescription');
    const notificationIcon = document.getElementById('notificationIcon');
    
    // Set message and description
    notificationMessage.textContent = message;
    notificationDescription.textContent = description;
    
    // Set icon based on type
    const iconMap = {
        success: `<svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        error: `<svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`,
        info: `<svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`
    };
    
    notificationIcon.innerHTML = iconMap[type] || iconMap.info;
    
    // Show notification
    notification.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput === document.activeElement) {
            searchInput.value = '';
            applySearch('');
        }
    }
});

// Export functions for global access
window.AllStudyPlans = {
    startLearning,
    showNotification,
    applyFilter,
    applySearch
};
