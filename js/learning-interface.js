// Learning Interface JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
    loadStudyPlan();
});

// Global variables
let currentStudyPlan = null;
let currentDayIndex = 0;
let allDays = [];

// Load study plan from localStorage
function loadStudyPlan() {
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get('planId');
    
    if (!planId) {
        showError('No study plan ID provided');
        return;
    }
    
    const savedPlans = localStorage.getItem('tutoStudyPlans');
    if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        currentStudyPlan = plans.find(p => p.id == planId);
        
        if (currentStudyPlan) {
            initializeLearningInterface();
        } else {
            showError('Study plan not found');
        }
    } else {
        showError('No study plans found');
    }
}

// Initialize the learning interface
function initializeLearningInterface() {
    // Extract all days from the schedule
    allDays = [];
    currentStudyPlan.schedule.forEach((week, weekIndex) => {
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
    updateProgress();
    renderDayNavigation();
    
    // Set current day to first incomplete day or first day
    const firstIncompleteDay = allDays.findIndex(day => !day.completed);
    currentDayIndex = firstIncompleteDay >= 0 ? firstIncompleteDay : 0;
    
    // Load current day content
    loadDayContent(currentDayIndex);
    
    // Setup navigation buttons
    setupNavigationButtons();
    
    // Setup interactive learning elements
    addInteractiveElements();
}

// Update plan header
function updatePlanHeader() {
    document.getElementById('planTitle').textContent = currentStudyPlan.topic;
    document.getElementById('planSubtitle').textContent = `${currentStudyPlan.duration} • ${currentStudyPlan.difficulty} • ${currentStudyPlan.timePerDay}`;
}

// Update progress
function updateProgress() {
    const completedDays = allDays.filter(day => day.completed).length;
    const totalDays = allDays.length;
    const progress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    const progressElement = document.getElementById('overallProgress');
    const progressBar = document.getElementById('progressBar');
    const currentDayElement = document.getElementById('currentDay');
    const totalDaysElement = document.getElementById('totalDays');
    
    if (progressElement && progressBar && currentDayElement && totalDaysElement) {
        // Animate progress number
        const currentProgress = parseInt(progressElement.textContent) || 0;
        animateNumber(currentProgress, progress, 1000, (value) => {
            progressElement.textContent = `${value}%`;
        });
        
        // Animate progress bar
        progressBar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
        progressBar.style.width = `${progress}%`;
        
        // Update day indicators
        currentDayElement.textContent = `Day ${currentDayIndex + 1}`;
        totalDaysElement.textContent = `of ${totalDays} days`;
    }
}

// Animate number changes
function animateNumber(start, end, duration, callback) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(start + (difference * easeOutQuart));
        
        callback(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Render day navigation
function renderDayNavigation() {
    const container = document.getElementById('dayNavigation');
    
    container.innerHTML = allDays.map((day, index) => `
        <div class="day-nav-item ${index === currentDayIndex ? 'bg-green-500/20 border-green-500/50' : 'bg-white/5 border-white/10'} border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-white/10" onclick="selectDay(${index})">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 ${day.completed ? 'bg-green-500' : 'bg-white/20'} rounded-full flex items-center justify-center">
                        ${day.completed ? 
                            '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : 
                            '<span class="text-white text-xs font-bold">' + day.globalDayIndex + '</span>'
                        }
                    </div>
                    <span class="text-white font-medium text-sm">${day.title}</span>
                </div>
                <div class="text-right">
                    <span class="text-gray-400 text-xs">${day.timeRequired} min</span>
                </div>
            </div>
            
            <div class="space-y-2">
                <div class="text-xs text-gray-400">
                    <div class="flex items-center gap-1 mb-1">
                        <svg class="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <span>Focus Areas</span>
                    </div>
                    <div class="text-gray-300">
                        ${day.topics.slice(0, 2).map(topic => `<div class="ml-4">• ${topic}</div>`).join('')}
                        ${day.topics.length > 2 ? `<div class="ml-4 text-gray-500">+${day.topics.length - 2} more</div>` : ''}
                    </div>
                </div>
                
                <div class="text-xs text-gray-400">
                    <div class="flex items-center gap-1 mb-1">
                        <svg class="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <span>Activities</span>
                    </div>
                    <div class="text-gray-300">
                        ${day.activities.slice(0, 1).map(activity => `<div class="ml-4">• ${activity}</div>`).join('')}
                        ${day.activities.length > 1 ? `<div class="ml-4 text-gray-500">+${day.activities.length - 1} more</div>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Select a day
function selectDay(dayIndex) {
    if (dayIndex < 0 || dayIndex >= allDays.length) return;
    
    // Add transition effect
    const contentContainer = document.getElementById('learningContent');
    contentContainer.style.opacity = '0';
    contentContainer.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        currentDayIndex = dayIndex;
        loadDayContent(dayIndex);
        renderDayNavigation();
        updateProgress();
        setupNavigationButtons();
        
        // Restore visibility with animation
        contentContainer.style.transition = 'all 0.3s ease-out';
        contentContainer.style.opacity = '1';
        contentContainer.style.transform = 'translateY(0)';
        
        // Scroll to top of content
        contentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
}

// Load day content
function loadDayContent(dayIndex) {
    const day = allDays[dayIndex];
    const container = document.getElementById('learningContent');
    
    if (!day) {
        container.innerHTML = '<div class="text-center py-12 text-gray-400">Day not found</div>';
        return;
    }
    
    // Generate detailed learning content based on the day's topics
    const learningContent = generateLearningContent(day);
    
    container.innerHTML = `
        <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-white">${day.title}</h2>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">${day.timeRequired} minutes</span>
                    ${day.completed ? 
                        '<span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Completed</span>' : 
                        '<span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">In Progress</span>'
                    }
                </div>
            </div>
            
            <div class="text-gray-300 mb-6">
                <p class="text-lg leading-relaxed">${day.description || 'Ready to start learning! This day focuses on building your knowledge and skills.'}</p>
            </div>
        </div>
        
        <!-- Learning Progress Bar -->
        <div class="mb-8 bg-white/5 rounded-lg p-4 border border-white/10">
            <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-gray-300">Today's Progress</span>
                <span class="text-sm font-medium text-green-400" id="dayProgress">0%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
                <div class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000" id="dayProgressBar" style="width: 0%"></div>
            </div>
        </div>
        
        <!-- Main Learning Content -->
        <div class="mb-8">
            ${learningContent}
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Focus Areas -->
            <div class="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Focus Areas
                </h3>
                <div class="space-y-3">
                    ${day.topics.map(topic => `
                        <div class="flex items-start gap-3">
                            <div class="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div class="text-gray-300">${topic}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Activities -->
            <div class="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Learning Activities
                </h3>
                <div class="space-y-3">
                    ${day.activities.map(activity => `
                        <div class="flex items-start gap-3">
                            <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div class="text-gray-300">${activity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Learning Resources -->
        <div class="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Learning Resources
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onclick="openPracticeExercises(${dayIndex})" class="p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-200 text-left">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-medium">Practice Exercises</h4>
                            <p class="text-gray-400 text-sm">Hands-on practice</p>
                        </div>
                    </div>
                </button>
                
                <button onclick="openQuiz(${dayIndex})" class="p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-200 text-left">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-medium">Take Quiz</h4>
                            <p class="text-gray-400 text-sm">Test your knowledge</p>
                        </div>
                    </div>
                </button>
                
                <button onclick="openAIAssistant(${dayIndex})" class="p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-200 text-left">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-medium">AI Assistant</h4>
                            <p class="text-gray-400 text-sm">Get help & answers</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-center gap-4">
            ${!day.completed ? `
                <button onclick="markDayComplete(${dayIndex})" class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Mark Complete
                </button>
            ` : `
                <button onclick="reviewDay(${dayIndex})" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                    Review Day
                </button>
            `}
        </div>
    `;
    
    // Initialize day progress tracking
    initializeDayProgress(dayIndex);
    
    // Initialize interactive learning elements
    setTimeout(() => {
        initializeInteractiveLearning();
    }, 100);
}

// Generate detailed learning content based on day topics
function generateLearningContent(day) {
    const topic = day.topics[0] || 'Learning Topic';
    const difficulty = currentStudyPlan.difficulty;
    
    // Generate content based on the topic and difficulty
    let content = '';
    
    if (topic.toLowerCase().includes('javascript') || topic.toLowerCase().includes('js')) {
        content = generateJavaScriptContent(topic, difficulty);
    } else if (topic.toLowerCase().includes('python')) {
        content = generatePythonContent(topic, difficulty);
    } else if (topic.toLowerCase().includes('html') || topic.toLowerCase().includes('css')) {
        content = generateWebDevContent(topic, difficulty);
    } else if (topic.toLowerCase().includes('react') || topic.toLowerCase().includes('vue') || topic.toLowerCase().includes('angular')) {
        content = generateFrameworkContent(topic, difficulty);
    } else {
        content = generateGenericContent(topic, difficulty);
    }
    
    return content;
}

// Generate JavaScript-specific learning content
function generateJavaScriptContent(topic, difficulty) {
    const isBeginner = difficulty.toLowerCase().includes('beginner');
    const isIntermediate = difficulty.toLowerCase().includes('intermediate');
    
    if (topic.toLowerCase().includes('variables') || topic.toLowerCase().includes('data types')) {
        return `
            <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Understanding Variables and Data Types</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold text-blue-400 mb-3">What are Variables?</h4>
                        <p class="text-gray-300 mb-4">Variables are containers that store data values. Think of them as labeled boxes where you can put different types of information.</p>
                        
                        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h5 class="text-white font-medium mb-2">Basic Variable Declaration:</h5>
                            <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                <div class="text-green-400">let</div>
                                <div class="text-blue-400">name</div>
                                <div class="text-yellow-400">=</div>
                                <div class="text-orange-400">"John Doe"</div>
                                <div class="text-gray-400">;</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold text-green-400 mb-3">Data Types in JavaScript</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Primitive Types:</h5>
                                <ul class="text-gray-300 text-sm space-y-1">
                                    <li>• <span class="text-blue-400">String</span> - Text data</li>
                                    <li>• <span class="text-green-400">Number</span> - Numbers (integers & decimals)</li>
                                    <li>• <span class="text-yellow-400">Boolean</span> - true/false values</li>
                                    <li>• <span class="text-purple-400">Undefined</span> - Variable declared but no value</li>
                                    <li>• <span class="text-red-400">Null</span> - Intentional absence of value</li>
                                </ul>
                            </div>
                            
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Examples:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                    <div><span class="text-green-400">let</span> <span class="text-blue-400">name</span> = <span class="text-orange-400">"Alice"</span>;</div>
                                    <div><span class="text-green-400">let</span> <span class="text-blue-400">age</span> = <span class="text-yellow-400">25</span>;</div>
                                    <div><span class="text-green-400">let</span> <span class="text-blue-400">isStudent</span> = <span class="text-purple-400">true</span>;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${isIntermediate ? `
                        <div>
                            <h4 class="text-lg font-semibold text-purple-400 mb-3">Advanced Concepts</h4>
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Template Literals:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                    <div class="text-green-400">let</div>
                                    <div class="text-blue-400">message</div>
                                    <div class="text-yellow-400">=</div>
                                    <div class="text-orange-400">\`Hello, \${name}! You are \${age} years old.\`</div>
                                    <div class="text-gray-400">;</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    } else if (topic.toLowerCase().includes('functions')) {
        return `
            <div class="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Functions: The Building Blocks of Code</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold text-green-400 mb-3">What are Functions?</h4>
                        <p class="text-gray-300 mb-4">Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.</p>
                        
                        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h5 class="text-white font-medium mb-2">Function Declaration:</h5>
                            <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                <div class="text-green-400">function</div>
                                <div class="text-blue-400">greet</div>
                                <div class="text-yellow-400">(</div>
                                <div class="text-orange-400">name</div>
                                <div class="text-yellow-400">)</div>
                                <div class="text-yellow-400">{</div>
                                <div class="text-gray-400 ml-4">return \`Hello, \${name}!\`;</div>
                                <div class="text-yellow-400">}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold text-blue-400 mb-3">Function Types</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Function Expression:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                    <div class="text-green-400">const</div>
                                    <div class="text-blue-400">add</div>
                                    <div class="text-yellow-400">=</div>
                                    <div class="text-green-400">function</div>
                                    <div class="text-yellow-400">(</div>
                                    <div class="text-orange-400">a, b</div>
                                    <div class="text-yellow-400">)</div>
                                    <div class="text-yellow-400">{</div>
                                    <div class="text-gray-400 ml-4">return a + b;</div>
                                    <div class="text-yellow-400">}</div>
                                    <div class="text-gray-400">;</div>
                                </div>
                            </div>
                            
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Arrow Function:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                    <div class="text-green-400">const</div>
                                    <div class="text-blue-400">multiply</div>
                                    <div class="text-yellow-400">=</div>
                                    <div class="text-yellow-400">(</div>
                                    <div class="text-orange-400">x, y</div>
                                    <div class="text-yellow-400">)</div>
                                    <div class="text-yellow-400">=></div>
                                    <div class="text-yellow-400">{</div>
                                    <div class="text-gray-400 ml-4">return x * y;</div>
                                    <div class="text-yellow-400">}</div>
                                    <div class="text-gray-400">;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (topic.toLowerCase().includes('array') || topic.toLowerCase().includes('arrays')) {
        return `
            <div class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Arrays: Collections of Data</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold text-yellow-400 mb-3">What are Arrays?</h4>
                        <p class="text-gray-300 mb-4">Arrays are ordered collections of values. They allow you to store multiple items in a single variable.</p>
                        
                        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h5 class="text-white font-medium mb-2">Creating Arrays:</h5>
                            <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                <div><span class="text-green-400">let</span> <span class="text-blue-400">fruits</span> = [<span class="text-orange-400">"apple"</span>, <span class="text-orange-400">"banana"</span>, <span class="text-orange-400">"orange"</span>];</div>
                                <div><span class="text-green-400">let</span> <span class="text-blue-400">numbers</span> = [<span class="text-yellow-400">1</span>, <span class="text-yellow-400">2</span>, <span class="text-yellow-400">3</span>, <span class="text-yellow-400">4</span>, <span class="text-yellow-400">5</span>];</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold text-orange-400 mb-3">Array Methods</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Common Methods:</h5>
                                <ul class="text-gray-300 text-sm space-y-1">
                                    <li>• <span class="text-blue-400">push()</span> - Add to end</li>
                                    <li>• <span class="text-green-400">pop()</span> - Remove from end</li>
                                    <li>• <span class="text-yellow-400">shift()</span> - Remove from start</li>
                                    <li>• <span class="text-purple-400">unshift()</span> - Add to start</li>
                                    <li>• <span class="text-red-400">slice()</span> - Extract portion</li>
                                </ul>
                            </div>
                            
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Examples:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                    <div><span class="text-blue-400">fruits</span>.<span class="text-green-400">push</span>(<span class="text-orange-400">"grape"</span>);</div>
                                    <div><span class="text-blue-400">fruits</span>.<span class="text-green-400">pop</span>();</div>
                                    <div><span class="text-blue-400">fruits</span>.<span class="text-green-400">length</span>;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (topic.toLowerCase().includes('object') || topic.toLowerCase().includes('objects')) {
        return `
            <div class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Objects: Key-Value Collections</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold text-purple-400 mb-3">What are Objects?</h4>
                        <p class="text-gray-300 mb-4">Objects are collections of key-value pairs. They represent real-world entities and organize related data.</p>
                        
                        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h5 class="text-white font-medium mb-2">Creating Objects:</h5>
                            <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                <div class="text-green-400">let</div>
                                <div class="text-blue-400">person</div>
                                <div class="text-yellow-400">=</div>
                                <div class="text-yellow-400">{</div>
                                <div class="text-gray-400 ml-4"><span class="text-orange-400">name</span>: <span class="text-orange-400">"John"</span>,</div>
                                <div class="text-gray-400 ml-4"><span class="text-orange-400">age</span>: <span class="text-yellow-400">30</span>,</div>
                                <div class="text-gray-400 ml-4"><span class="text-orange-400">city</span>: <span class="text-orange-400">"New York"</span></div>
                                <div class="text-yellow-400">};</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold text-pink-400 mb-3">Accessing Object Properties</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Dot Notation:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                    <div><span class="text-blue-400">person</span>.<span class="text-orange-400">name</span>;</div>
                                    <div><span class="text-blue-400">person</span>.<span class="text-orange-400">age</span>;</div>
                                </div>
                            </div>
                            
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Bracket Notation:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                    <div><span class="text-blue-400">person</span>[<span class="text-orange-400">"name"</span>];</div>
                                    <div><span class="text-blue-400">person</span>[<span class="text-orange-400">"city"</span>];</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (topic.toLowerCase().includes('loop') || topic.toLowerCase().includes('loops') || topic.toLowerCase().includes('iteration')) {
        return `
            <div class="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl p-6 border border-indigo-500/20 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Loops: Repeating Actions</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold text-indigo-400 mb-3">What are Loops?</h4>
                        <p class="text-gray-300 mb-4">Loops allow you to execute code multiple times. They're essential for processing collections of data.</p>
                        
                        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h5 class="text-white font-medium mb-2">For Loop:</h5>
                            <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                <div class="text-green-400">for</div>
                                <div class="text-yellow-400">(</div>
                                <div class="text-green-400">let</div>
                                <div class="text-blue-400">i</div>
                                <div class="text-yellow-400">=</div>
                                <div class="text-yellow-400">0</div>
                                <div class="text-yellow-400">;</div>
                                <div class="text-blue-400">i</div>
                                <div class="text-yellow-400"><</div>
                                <div class="text-yellow-400">5</div>
                                <div class="text-yellow-400">;</div>
                                <div class="text-blue-400">i</div>
                                <div class="text-yellow-400">++</div>
                                <div class="text-yellow-400">)</div>
                                <div class="text-yellow-400">{</div>
                                <div class="text-gray-400 ml-4">console.log(<span class="text-blue-400">i</span>);</div>
                                <div class="text-yellow-400">}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold text-blue-400 mb-3">Loop Types</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">For...of Loop:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                    <div class="text-green-400">for</div>
                                    <div class="text-yellow-400">(</div>
                                    <div class="text-green-400">let</div>
                                    <div class="text-blue-400">fruit</div>
                                    <div class="text-green-400">of</div>
                                    <div class="text-blue-400">fruits</div>
                                    <div class="text-yellow-400">)</div>
                                    <div class="text-yellow-400">{</div>
                                    <div class="text-gray-400 ml-4">console.log(<span class="text-blue-400">fruit</span>);</div>
                                    <div class="text-yellow-400">}</div>
                                </div>
                            </div>
                            
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">forEach Method:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                    <div class="text-blue-400">fruits</div>
                                    <div class="text-yellow-400">.</div>
                                    <div class="text-green-400">forEach</div>
                                    <div class="text-yellow-400">(</div>
                                    <div class="text-yellow-400">(</div>
                                    <div class="text-blue-400">fruit</div>
                                    <div class="text-yellow-400">)</div>
                                    <div class="text-yellow-400">=></div>
                                    <div class="text-yellow-400">{</div>
                                    <div class="text-gray-400 ml-4">console.log(<span class="text-blue-400">fruit</span>);</div>
                                    <div class="text-yellow-400">}</div>
                                    <div class="text-yellow-400">);</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Default JavaScript content
    return `
        <div class="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 mb-6">
            <h3 class="text-xl font-bold text-white mb-4">${topic}</h3>
            <p class="text-gray-300 mb-4">Today we'll explore ${topic.toLowerCase()} in JavaScript. This fundamental concept will help you build more powerful and flexible applications.</p>
            
            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 class="text-white font-medium mb-2">Key Learning Objectives:</h4>
                <ul class="text-gray-300 space-y-2">
                    <li>• Understand the core concepts of ${topic}</li>
                    <li>• Practice with real examples</li>
                    <li>• Apply knowledge through exercises</li>
                    <li>• Build confidence with hands-on practice</li>
                </ul>
            </div>
        </div>
    `;
}

// Generate Python-specific learning content
function generatePythonContent(topic, difficulty) {
    const isBeginner = difficulty.toLowerCase().includes('beginner');
    const isIntermediate = difficulty.toLowerCase().includes('intermediate');
    
    if (topic.toLowerCase().includes('variable') || topic.toLowerCase().includes('data type')) {
        return `
            <div class="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Python Variables and Data Types</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold text-green-400 mb-3">Python Variables</h4>
                        <p class="text-gray-300 mb-4">In Python, variables are created when you assign a value. No need to declare the type explicitly!</p>
                        
                        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h5 class="text-white font-medium mb-2">Variable Assignment:</h5>
                            <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                <div><span class="text-blue-400">name</span> = <span class="text-orange-400">"Alice"</span></div>
                                <div><span class="text-blue-400">age</span> = <span class="text-yellow-400">25</span></div>
                                <div><span class="text-blue-400">height</span> = <span class="text-yellow-400">5.6</span></div>
                                <div><span class="text-blue-400">is_student</span> = <span class="text-purple-400">True</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold text-blue-400 mb-3">Data Types</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Built-in Types:</h5>
                                <ul class="text-gray-300 text-sm space-y-1">
                                    <li>• <span class="text-blue-400">str</span> - Text strings</li>
                                    <li>• <span class="text-green-400">int</span> - Whole numbers</li>
                                    <li>• <span class="text-yellow-400">float</span> - Decimal numbers</li>
                                    <li>• <span class="text-purple-400">bool</span> - True/False</li>
                                    <li>• <span class="text-red-400">list</span> - Ordered collections</li>
                                </ul>
                            </div>
                            
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Type Checking:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                    <div><span class="text-green-400">type</span>(<span class="text-blue-400">name</span>)</div>
                                    <div><span class="text-green-400">isinstance</span>(<span class="text-blue-400">age</span>, <span class="text-green-400">int</span>)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (topic.toLowerCase().includes('function') || topic.toLowerCase().includes('def')) {
        return `
            <div class="bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-xl p-6 border border-blue-500/20 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Python Functions</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold text-blue-400 mb-3">Function Definition</h4>
                        <p class="text-gray-300 mb-4">Functions in Python are defined using the <code>def</code> keyword and can accept parameters and return values.</p>
                        
                        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h5 class="text-white font-medium mb-2">Basic Function:</h5>
                            <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                                <div class="text-green-400">def</div>
                                <div class="text-blue-400">greet</div>
                                <div class="text-yellow-400">(</div>
                                <div class="text-orange-400">name</div>
                                <div class="text-yellow-400">):</div>
                                <div class="text-gray-400 ml-4"><span class="text-green-400">return</span> <span class="text-orange-400">f"Hello, {name}!"</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold text-green-400 mb-3">Function Examples</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">With Parameters:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                    <div><span class="text-green-400">def</span> <span class="text-blue-400">add</span>(<span class="text-orange-400">a, b</span>):</div>
                                    <div class="text-gray-400 ml-4"><span class="text-green-400">return</span> <span class="text-blue-400">a</span> + <span class="text-blue-400">b</span></div>
                                </div>
                            </div>
                            
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Default Values:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                    <div><span class="text-green-400">def</span> <span class="text-blue-400">power</span>(<span class="text-orange-400">base, exp=2</span>):</div>
                                    <div class="text-gray-400 ml-4"><span class="text-green-400">return</span> <span class="text-blue-400">base</span> ** <span class="text-blue-400">exp</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (topic.toLowerCase().includes('list') || topic.toLowerCase().includes('array')) {
        return `
            <div class="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Python Lists</h3>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="text-lg font-semibold text-yellow-400 mb-3">Creating Lists</h4>
                        <p class="text-gray-300 mb-4">Lists are ordered, mutable collections that can store different types of data.</p>
                        
                        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h5 class="text-white font-medium mb-2">List Creation:</h5>
                            <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                <div><span class="text-blue-400">fruits</span> = [<span class="text-orange-400">"apple"</span>, <span class="text-orange-400">"banana"</span>, <span class="text-orange-400">"orange"</span>]</div>
                                <div><span class="text-blue-400">numbers</span> = [<span class="text-yellow-400">1</span>, <span class="text-yellow-400">2</span>, <span class="text-yellow-400">3</span>, <span class="text-yellow-400">4</span>]</div>
                                <div><span class="text-blue-400">mixed</span> = [<span class="text-orange-400">"hello"</span>, <span class="text-yellow-400">42</span>, <span class="text-purple-400">True</span>]</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-lg font-semibold text-orange-400 mb-3">List Operations</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Common Methods:</h5>
                                <ul class="text-gray-300 text-sm space-y-1">
                                    <li>• <span class="text-blue-400">append()</span> - Add to end</li>
                                    <li>• <span class="text-green-400">insert()</span> - Insert at position</li>
                                    <li>• <span class="text-yellow-400">remove()</span> - Remove item</li>
                                    <li>• <span class="text-purple-400">pop()</span> - Remove and return</li>
                                    <li>• <span class="text-red-400">sort()</span> - Sort in place</li>
                                </ul>
                            </div>
                            
                            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                                <h5 class="text-white font-medium mb-2">Examples:</h5>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm space-y-2">
                                    <div><span class="text-blue-400">fruits</span>.<span class="text-green-400">append</span>(<span class="text-orange-400">"grape"</span>)</div>
                                    <div><span class="text-blue-400">fruits</span>.<span class="text-green-400">insert</span>(<span class="text-yellow-400">1</span>, <span class="text-orange-400">"mango"</span>)</div>
                                    <div><span class="text-blue-400">len</span>(<span class="text-blue-400">fruits</span>)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Default Python content
    return `
        <div class="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/20 mb-6">
            <h3 class="text-xl font-bold text-white mb-4">${topic} in Python</h3>
            <p class="text-gray-300 mb-4">Python is a powerful and beginner-friendly programming language. Today we'll explore ${topic.toLowerCase()} to build your Python skills.</p>
            
            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 class="text-white font-medium mb-2">Python Syntax Example:</h4>
                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm">
                    <div class="text-green-400">def</div>
                    <div class="text-blue-400">hello_world</div>
                    <div class="text-yellow-400">():</div>
                    <div class="text-gray-400 ml-4">print(<span class="text-orange-400">"Hello, World!"</span>)</div>
                </div>
            </div>
            
            <div class="bg-white/5 rounded-lg p-4 border border-white/10 mt-4">
                <h4 class="text-white font-medium mb-2">Key Learning Objectives:</h4>
                <ul class="text-gray-300 space-y-2">
                    <li>• Understand Python syntax and structure</li>
                    <li>• Learn ${topic.toLowerCase()} concepts</li>
                    <li>• Practice with Python examples</li>
                    <li>• Build practical Python skills</li>
                </ul>
            </div>
        </div>
    `;
}

// Generate Web Development content
function generateWebDevContent(topic, difficulty) {
    return `
        <div class="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/20 mb-6">
            <h3 class="text-xl font-bold text-white mb-4">${topic} for Web Development</h3>
            <p class="text-gray-300 mb-4">Web development combines multiple technologies to create interactive websites. Today we'll focus on ${topic.toLowerCase()}.</p>
            
            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 class="text-white font-medium mb-2">Web Development Stack:</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div class="text-center p-3 bg-white/5 rounded-lg">
                        <div class="text-orange-400 font-medium">HTML</div>
                        <div class="text-gray-400">Structure</div>
                    </div>
                    <div class="text-center p-3 bg-white/5 rounded-lg">
                        <div class="text-blue-400 font-medium">CSS</div>
                        <div class="text-gray-400">Styling</div>
                    </div>
                    <div class="text-center p-3 bg-white/5 rounded-lg">
                        <div class="text-yellow-400 font-medium">JavaScript</div>
                        <div class="text-gray-400">Interactivity</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Generate Framework content
function generateFrameworkContent(topic, difficulty) {
    return `
        <div class="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 mb-6">
            <h3 class="text-xl font-bold text-white mb-4">${topic} Framework</h3>
            <p class="text-gray-300 mb-4">Modern web development relies on powerful frameworks. Today we'll explore ${topic.toLowerCase()} to build scalable applications.</p>
            
            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 class="text-white font-medium mb-2">Framework Benefits:</h4>
                <ul class="text-gray-300 space-y-2">
                    <li>• Rapid development</li>
                    <li>• Built-in best practices</li>
                    <li>• Large community support</li>
                    <li>• Extensive documentation</li>
                </ul>
            </div>
        </div>
    `;
}

// Generate generic learning content
function generateGenericContent(topic, difficulty) {
    return `
        <div class="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20 mb-6">
            <h3 class="text-xl font-bold text-white mb-4">${topic}</h3>
            <p class="text-gray-300 mb-4">Today we'll dive deep into ${topic.toLowerCase()}. This topic is essential for building a strong foundation in your learning journey.</p>
            
            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 class="text-white font-medium mb-2">Learning Approach:</h4>
                <ul class="text-gray-300 space-y-2">
                    <li>• Start with fundamentals</li>
                    <li>• Practice with examples</li>
                    <li>• Apply concepts practically</li>
                    <li>• Review and reinforce</li>
                </ul>
            </div>
        </div>
    `;
}

// Initialize day progress tracking
function initializeDayProgress(dayIndex) {
    const day = allDays[dayIndex];
    if (!day) return;
    
    // Load saved progress for this day
    const savedProgress = localStorage.getItem(`dayProgress_${currentStudyPlan.id}_${dayIndex}`) || 0;
    updateDayProgress(parseInt(savedProgress));
}

// Update day progress
function updateDayProgress(progress) {
    const progressElement = document.getElementById('dayProgress');
    const progressBar = document.getElementById('dayProgressBar');
    
    if (progressElement && progressBar) {
        progressElement.textContent = `${progress}%`;
        progressBar.style.width = `${progress}%`;
    }
}

// Save day progress
function saveDayProgress(dayIndex, progress) {
    localStorage.setItem(`dayProgress_${currentStudyPlan.id}_${dayIndex}`, progress.toString());
}

// Open practice exercises
function openPracticeExercises(dayIndex) {
    const day = allDays[dayIndex];
    if (!day) return;
    
    // Generate practice exercises based on the day's topics
    const exercises = generatePracticeExercises(day);
    
    // Create and show modal
    showPracticeModal(exercises, dayIndex);
}

// Generate practice exercises based on day content
function generatePracticeExercises(day) {
    const topic = day.topics[0] || 'Programming';
    const exercises = [];
    
    if (topic.toLowerCase().includes('javascript') || topic.toLowerCase().includes('js')) {
        if (topic.toLowerCase().includes('variable') || topic.toLowerCase().includes('data type')) {
            exercises.push({
                type: 'coding',
                title: 'Variable Declaration Practice',
                description: 'Create variables for different data types',
                task: 'Declare variables for: name (string), age (number), isStudent (boolean), and skills (array)',
                solution: `let name = "Your Name";
let age = 25;
let isStudent = true;
let skills = ["JavaScript", "HTML", "CSS"];`,
                hints: ['Use let or const for declaration', 'Strings need quotes', 'Numbers don\'t need quotes', 'Arrays use square brackets']
            });
            
            exercises.push({
                type: 'multiple-choice',
                title: 'Data Type Identification',
                description: 'Identify the correct data type for each value',
                question: 'What is the data type of the value: 42?',
                options: ['String', 'Number', 'Boolean', 'Undefined'],
                correct: 1,
                explanation: '42 is a number (integer) in JavaScript'
            });
        } else if (topic.toLowerCase().includes('function')) {
            exercises.push({
                type: 'coding',
                title: 'Function Creation',
                description: 'Create a function that calculates the area of a rectangle',
                task: 'Write a function called calculateArea that takes width and height as parameters and returns the area',
                solution: `function calculateArea(width, height) {
    return width * height;
}`,
                hints: ['Use the function keyword', 'Parameters go in parentheses', 'Use return statement', 'Area = width × height']
            });
        }
    } else if (topic.toLowerCase().includes('python')) {
        if (topic.toLowerCase().includes('variable') || topic.toLowerCase().includes('data type')) {
            exercises.push({
                type: 'coding',
                title: 'Python Variable Assignment',
                description: 'Create variables with different data types in Python',
                task: 'Assign values to variables: name (string), age (integer), height (float), and is_student (boolean)',
                solution: `name = "Your Name"
age = 25
height = 5.8
is_student = True`,
                hints: ['No need to declare types in Python', 'Strings use quotes', 'Integers are whole numbers', 'Floats have decimals', 'Booleans are True/False']
            });
        }
    }
    
    // Add generic exercises if no specific ones were generated
    if (exercises.length === 0) {
        exercises.push({
            type: 'reflection',
            title: 'Concept Understanding',
            description: 'Reflect on what you\'ve learned',
            task: 'Write down 3 key points you learned about ' + topic.toLowerCase(),
            hints: ['Think about the main concepts', 'Consider practical applications', 'Note any questions you have']
        });
    }
    
    return exercises;
}

// Show practice exercises modal
function showPracticeModal(exercises, dayIndex) {
    // Remove existing modal if any
    const existingModal = document.getElementById('practiceModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'practiceModal';
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    
    modal.innerHTML = `
        <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-white">Practice Exercises</h2>
                <button onclick="closePracticeModal()" class="text-gray-400 hover:text-white transition-colors duration-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="space-y-6">
                ${exercises.map((exercise, index) => `
                    <div class="bg-white/5 rounded-lg p-6 border border-white/10">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <span class="text-blue-400 font-bold">${index + 1}</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-white">${exercise.title}</h3>
                                <p class="text-gray-400 text-sm">${exercise.description}</p>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <h4 class="text-white font-medium mb-2">Task:</h4>
                            <p class="text-gray-300">${exercise.task}</p>
                        </div>
                        
                        ${exercise.type === 'coding' ? `
                            <div class="mb-4">
                                <h4 class="text-white font-medium mb-2">Hints:</h4>
                                <ul class="text-gray-300 text-sm space-y-1">
                                    ${exercise.hints.map(hint => `<li>• ${hint}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="mb-4">
                                <h4 class="text-white font-medium mb-2">Your Solution:</h4>
                                <textarea class="w-full h-32 bg-gray-900 border border-white/20 rounded-lg p-3 text-white font-mono text-sm resize-none" placeholder="Write your code here..."></textarea>
                            </div>
                            
                            <button onclick="showSolution(${index})" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                                Show Solution
                            </button>
                            
                            <div id="solution-${index}" class="hidden mt-4">
                                <h4 class="text-white font-medium mb-2">Solution:</h4>
                                <div class="bg-gray-900 rounded-lg p-3 font-mono text-sm text-green-400">
                                    ${exercise.solution}
                                </div>
                            </div>
                        ` : exercise.type === 'multiple-choice' ? `
                            <div class="mb-4">
                                <h4 class="text-white font-medium mb-2">Question:</h4>
                                <p class="text-gray-300 mb-3">${exercise.question}</p>
                                <div class="space-y-2">
                                    ${exercise.options.map((option, optIndex) => `
                                        <label class="flex items-center gap-3 cursor-pointer">
                                            <input type="radio" name="exercise-${index}" value="${optIndex}" class="text-blue-500">
                                            <span class="text-gray-300">${option}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <button onclick="checkAnswer(${index})" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                                Check Answer
                            </button>
                            
                            <div id="answer-${index}" class="hidden mt-4">
                                <div class="p-3 rounded-lg text-sm"></div>
                            </div>
                        ` : `
                            <div class="mb-4">
                                <h4 class="text-white font-medium mb-2">Reflection:</h4>
                                <textarea class="w-full h-24 bg-gray-900 border border-white/20 rounded-lg p-3 text-white resize-none" placeholder="Write your thoughts here..."></textarea>
                            </div>
                        `}
                    </div>
                `).join('')}
            </div>
            
            <div class="flex justify-end mt-6">
                <button onclick="closePracticeModal()" class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for solution and answer buttons
    exercises.forEach((exercise, index) => {
        if (exercise.type === 'coding') {
            window[`showSolution${index}`] = () => showSolution(index);
        } else if (exercise.type === 'multiple-choice') {
            window[`checkAnswer${index}`] = () => checkAnswer(index);
        }
    });
}

// Close practice modal
function closePracticeModal() {
    const modal = document.getElementById('practiceModal');
    if (modal) modal.remove();
}

// Show solution for coding exercise
function showSolution(index) {
    const solutionDiv = document.getElementById(`solution-${index}`);
    if (solutionDiv) {
        solutionDiv.classList.toggle('hidden');
    }
}

// Check answer for multiple choice exercise
function checkAnswer(index) {
    const selectedOption = document.querySelector(`input[name="exercise-${index}"]:checked`);
    if (!selectedOption) {
        showNotification('Please select an answer first!', 'error');
        return;
    }
    
    const selectedAnswer = parseInt(selectedOption.value);
    const exercises = generatePracticeExercises(allDays[currentDayIndex]);
    const exercise = exercises[index];
    
    const answerDiv = document.getElementById(`answer-${index}`);
    if (answerDiv) {
        answerDiv.classList.remove('hidden');
        
        if (selectedAnswer === exercise.correct) {
            answerDiv.innerHTML = `
                <div class="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-sm">
                    <div class="text-green-400 font-medium">Correct! 🎉</div>
                    <div class="text-gray-300 mt-1">${exercise.explanation}</div>
                </div>
            `;
            
            // Update progress for correct answer
            updateDayProgressIncrementally(currentDayIndex);
        } else {
            answerDiv.innerHTML = `
                <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-sm">
                    <div class="text-red-400 font-medium">Incorrect</div>
                    <div class="text-gray-300 mt-1">${exercise.explanation}</div>
                </div>
            `;
        }
    }
}

// Open quiz
function openQuiz(dayIndex) {
    showNotification('Quiz feature coming soon!', 'info');
    // TODO: Implement quiz functionality
}

// Cache for current quiz questions
let currentQuizQuestions = [];

// Open quiz modal for selected day (AI-generated)
async function openQuiz(dayIndex) {
    const day = allDays[dayIndex];
    if (!day) return;

    // Remove existing modal if any
    const existing = document.getElementById('quizModal');
    if (existing) existing.remove();

    // Create modal with loading state
    const modal = document.createElement('div');
    modal.id = 'quizModal';
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white">Quick Quiz</h3>
                <button class="p-2 hover:bg-white/10 rounded-lg" aria-label="Close quiz" onclick="closeQuizModal()">
                    <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <p class="text-gray-300 mb-4">Topic: <span class="text-white font-medium">${(day.topics && day.topics[0]) || 'Today\'s Lesson'}</span></p>
            <div id="quizQuestions" class="space-y-6">
                <div class=\"flex items-center justify-center py-16\">
                    <svg class=\"animate-spin h-6 w-6 mr-2 text-green-400\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\"><circle class=\"opacity-25\" cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" stroke-width=\"4\"></circle><path class=\"opacity-75\" fill=\"currentColor\" d=\"M4 12a8 8 0 018-8v8H4z\"></path></svg>
                    <span class=\"text-gray-300\">Generating quiz with AI...</span>
                </div>
            </div>
            <div class="mt-6 flex items-center justify-between">
                <div id="quizMeta" class="text-sm text-gray-400"></div>
                <div class="flex gap-3">
                    <button class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg" onclick="closeQuizModal()">Cancel</button>
                    <button id="submitQuizBtn" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50" onclick="gradeQuiz(${dayIndex})" disabled>Submit Quiz</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    try {
        currentQuizQuestions = await generateAIQuizQuestions(day);
    } catch (e) {
        console.warn('AI quiz generation failed, falling back to local set.', e);
        currentQuizQuestions = generateQuizQuestions(day);
        showNotification('AI quiz generation failed. Using a fallback quiz.', 'info');
    }

    renderQuizQuestions(currentQuizQuestions);
}

function renderQuizQuestions(questions) {
    const container = document.getElementById('quizQuestions');
    const submitBtn = document.getElementById('submitQuizBtn');
    const meta = document.getElementById('quizMeta');
    if (!container) return;
    container.innerHTML = questions.map((q, qi) => `
        <div class="bg-white/5 rounded-lg p-4 border border-white/10">
            <div class="flex items-start gap-3">
                <div class="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300">Q${qi + 1}</div>
                <div class="flex-1">
                    <p class="text-white font-medium mb-3">${escapeHtml(q.question)}</p>
                    <div class="space-y-2">
                        ${q.options.map((opt, oi) => `
                            <label class="flex items-center gap-2 p-2 rounded hover:bg-white/5 cursor-pointer">
                                <input type="radio" name="quiz-${qi}" value="${oi}" class="accent-blue-500" />
                                <span class="text-gray-300">${escapeHtml(opt)}</span>
                            </label>
                        `).join('')}
                    </div>
                    <div id="quiz-feedback-${qi}" class="mt-3 hidden"></div>
                </div>
            </div>
        </div>
    `).join('');
    if (submitBtn) submitBtn.disabled = false;
    if (meta) meta.textContent = `${questions.length} questions`;
}

function closeQuizModal() {
    const el = document.getElementById('quizModal');
    if (el) el.remove();
}

function gradeQuiz(dayIndex) {
    const day = allDays[dayIndex];
    if (!day) return;
    const questions = currentQuizQuestions && currentQuizQuestions.length ? currentQuizQuestions : generateQuizQuestions(day);
    let correct = 0;
    questions.forEach((q, qi) => {
        const selected = document.querySelector(`input[name="quiz-${qi}"]:checked`);
        const feedback = document.getElementById(`quiz-feedback-${qi}`);
        if (!feedback) return;
        if (selected && parseInt(selected.value) === q.answer) {
            correct += 1;
            feedback.className = 'mt-3 block text-sm bg-green-500/20 border border-green-500/30 rounded p-3 text-green-300';
            feedback.innerHTML = 'Correct! ' + (q.explanation || '');
        } else {
            feedback.className = 'mt-3 block text-sm bg-red-500/20 border border-red-500/30 rounded p-3 text-red-300';
            feedback.innerHTML = 'Incorrect. ' + (q.explanation || '');
        }
    });
    const score = Math.round((correct / questions.length) * 100);
    showNotification(`Quiz submitted: ${correct}/${questions.length} correct (${score}%)`, correct / questions.length >= 0.6 ? 'success' : 'info');
    // Nudge progress
    updateDayProgressIncrementally(dayIndex);
}

// Use configured AI provider to generate quiz questions
async function generateAIQuizQuestions(day) {
    const topic = (day.topics && day.topics[0]) || day.title || 'Current Lesson';
    const lessonContent = collectLessonContextText();
    const message = `Create a multiple-choice quiz for the lesson."""
Topic: ${topic}
"""
Return STRICT JSON only with the following shape (no markdown, no commentary):
{
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": <index_of_correct_option_0_to_3>,
      "explanation": "why the correct option is right in one sentence"
    }
  ]
}
Constraints:
- 3 questions, 4 options each.
- Keep questions concise and based on the given lesson context below.
- If context is insufficient, ask about core fundamentals of the topic.

Lesson context (may be truncated):\n${lessonContent.slice(0, 1200)}\n`;

    const context = {
        lessonTitle: topic,
        lessonContent: lessonContent.slice(0, 4000),
        planTitle: (window.currentPlan && window.currentPlan.title) || 'Study Plan',
        userLevel: (window.currentPlan && window.currentPlan.difficulty) || 'Intermediate'
    };

    const raw = await window.apiService.sendChatMessage(message, context);
    const json = extractJsonObject(raw);
    const questions = Array.isArray(json.questions) ? json.questions : [];
    const normalized = questions.map(q => ({
        question: String(q.question || ''),
        options: (q.options || []).slice(0, 4).map(String),
        answer: Number.isInteger(q.answer) ? q.answer : 0,
        explanation: String(q.explanation || '')
    })).filter(q => q.question && q.options.length === 4);

    if (normalized.length === 0) throw new Error('AI returned no valid questions');
    return normalized;
}

function extractJsonObject(text) {
    // Try to parse direct JSON first
    try { return JSON.parse(text); } catch (e) {}
    // Extract JSON from fenced code blocks or inline text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
        try { return JSON.parse(match[0]); } catch (e) {}
    }
    return { questions: [] };
}

function collectLessonContextText() {
    // Attempt to collect visible lesson content text from the page
    const candidates = [
        document.getElementById('learningContent'),
        document.getElementById('contentArea'),
        document.querySelector('[data-lesson-content]'),
    ];
    for (const el of candidates) {
        if (el && el.textContent && el.textContent.trim().length > 50) {
            return el.textContent.trim();
        }
    }
    // Fallback: derive from day object if available
    try {
        return JSON.stringify({ summary: day.summary, topics: day.topics, objectives: day.objectives });
    } catch { return ''; }
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function generateQuizQuestions(day) {
    const topic = (day.topics && day.topics[0]) ? day.topics[0] : 'General Knowledge';
    const t = topic.toLowerCase();
    const qs = [];

    if (t.includes('javascript') || t.includes('js')) {
        qs.push({
            question: 'Which keyword declares a block-scoped variable in JavaScript?',
            options: ['var', 'let', 'function', 'const'],
            answer: 1,
            explanation: 'let (and const) are block-scoped; var is function-scoped.'
        });
        qs.push({
            question: 'What does typeof null evaluate to?',
            options: ['null', 'object', 'undefined', 'number'],
            answer: 1,
            explanation: 'Historically, typeof null returns "object".'
        });
        qs.push({
            question: 'Which method converts a JSON string into an object?',
            options: ['JSON.parse()', 'JSON.stringify()', 'Object.assign()', 'toString()'],
            answer: 0,
            explanation: 'JSON.parse parses a JSON string to an object.'
        });
    } else if (t.includes('python')) {
        qs.push({
            question: 'Which data type is immutable in Python?',
            options: ['list', 'dict', 'set', 'tuple'],
            answer: 3,
            explanation: 'Tuples are immutable.'
        });
        qs.push({
            question: 'What is the output of len("hello")?',
            options: ['4', '5', '6', 'Error'],
            answer: 1,
            explanation: 'There are 5 characters.'
        });
        qs.push({
            question: 'Which keyword defines a function?',
            options: ['func', 'def', 'function', 'lambda'],
            answer: 1,
            explanation: 'def defines a named function; lambda defines anonymous functions.'
        });
    } else if (t.includes('html') || t.includes('css')) {
        qs.push({
            question: 'Which HTML tag is used to create a hyperlink?',
            options: ['<p>', '<a>', '<link>', '<href>'],
            answer: 1,
            explanation: 'The <a> tag defines a hyperlink.'
        });
        qs.push({
            question: 'Which CSS property changes text color?',
            options: ['background-color', 'color', 'text-color', 'font-color'],
            answer: 1,
            explanation: 'The color property sets the text color.'
        });
        qs.push({
            question: 'Which is a valid CSS selector for an element with id="main"?',
            options: ['.main', '#main', 'main[]', 'id(main)'],
            answer: 1,
            explanation: '#main selects by id.'
        });
    } else {
        qs.push({
            question: `Which approach helps you learn ${topic} effectively?`,
            options: ['Skim only', 'Practice with examples', 'Avoid feedback', 'Memorize blindly'],
            answer: 1,
            explanation: 'Active practice with examples accelerates learning.'
        });
        qs.push({
            question: 'What is a good strategy for long-term retention?',
            options: ['Cram once', 'Spaced repetition', 'Never review', 'Disable practice'],
            answer: 1,
            explanation: 'Spaced repetition improves retention.'
        });
        qs.push({
            question: 'How should you handle mistakes during practice?',
            options: ['Ignore them', 'Analyze and correct', 'Quit immediately', 'Blame the tool'],
            answer: 1,
            explanation: 'Analyzing and correcting mistakes builds understanding.'
        });
    }

    return qs;
}

// Open AI assistant drawer
function openAIAssistant(dayIndex) {
    const day = allDays[dayIndex];
    // Toggle if already open
    const existing = document.getElementById('aiAssistantDrawer');
    if (existing) { existing.remove(); return; }

    const drawer = document.createElement('div');
    drawer.id = 'aiAssistantDrawer';
    drawer.className = 'fixed inset-y-0 right-0 w-full sm:w-[420px] bg-[#11131a]/95 backdrop-blur border-l border-white/10 z-50 shadow-xl flex flex-col';

    drawer.innerHTML = `
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
                <h3 class="text-white font-semibold">AI Assistant</h3>
                <p class="text-xs text-gray-400">Ask me about today\'s lesson</p>
            </div>
            <button class="p-2 hover:bg-white/10 rounded" onclick="closeAIAssistant()" aria-label="Close assistant">
                <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <div id="aiMessages" class="flex-1 overflow-y-auto p-4 space-y-3">
            <div class="bg-white/5 border border-white/10 rounded-lg p-3">
                <p class="text-gray-200 text-sm">Hi! I can help with <span class="text-white font-medium">${(day && day.topics && day.topics[0]) || 'your topic'}</span>. Ask me to explain a concept, give hints, or quiz you.</p>
            </div>
        </div>
        <form id="aiForm" class="p-3 border-t border-white/10 flex items-center gap-2" onsubmit="sendAssistantMessage(event, ${dayIndex})">
            <input id="aiInput" type="text" placeholder="Type your question..." class="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Send</button>
        </form>
    `;

    document.body.appendChild(drawer);
}

function closeAIAssistant() {
    const el = document.getElementById('aiAssistantDrawer');
    if (el) el.remove();
}

async function sendAssistantMessage(e, dayIndex) {
    e.preventDefault();
    const input = document.getElementById('aiInput');
    const form = document.getElementById('aiForm');
    const messages = document.getElementById('aiMessages');
    if (!input || !messages) return;
    const text = (input.value || '').trim();
    if (!text) return;

    // Append user message
    const userBubble = document.createElement('div');
    userBubble.className = 'ml-auto max-w-[85%] bg-blue-600/30 border border-blue-500/30 rounded-lg p-3 text-sm text-white';
    userBubble.textContent = text;
    messages.appendChild(userBubble);

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'max-w-[85%] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-400 italic';
    typing.textContent = 'Thinking…';
    messages.appendChild(typing);

    // Disable input while waiting
    input.disabled = true;
    if (form) form.querySelector('button')?.setAttribute('disabled', 'true');

    messages.scrollTop = messages.scrollHeight;
    
    let replyHtml = '';
    try {
        const day = allDays[dayIndex];
        const topic = (day && day.topics && day.topics[0]) ? day.topics[0] : (day?.title || 'Current Lesson');
        const context = {
            lessonTitle: topic,
            lessonContent: collectLessonContextText().slice(0, 4000),
            planTitle: (window.currentPlan && window.currentPlan.title) || (window.currentStudyPlan?.topic) || 'Study Plan',
            userLevel: (window.currentPlan && window.currentPlan.difficulty) || (window.currentStudyPlan?.difficulty) || 'Intermediate'
        };
        const raw = await window.apiService.sendChatMessage(text, context);
        replyHtml = formatAssistantText(raw);
    } catch (err) {
        console.warn('AI assistant API failed, using heuristic reply.', err);
        showNotification('AI assistant response failed. Showing a basic hint instead.', 'info');
        replyHtml = generateAssistantReply(text, allDays[dayIndex]);
    }

    // Replace typing with actual reply
    const aiBubble = document.createElement('div');
    aiBubble.className = 'max-w-[85%] bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-200';
    aiBubble.innerHTML = replyHtml;
    messages.replaceChild(aiBubble, typing);

    // Re-enable input
    input.disabled = false;
    if (form) form.querySelector('button')?.removeAttribute('disabled');
    input.value = '';
    input.focus();
    messages.scrollTop = messages.scrollHeight;
}

function formatAssistantText(text) {
    // Basic safe formatting: escape HTML, preserve line breaks
    const safe = escapeHtml(String(text || ''));
    return safe.replace(/\n/g, '<br>');
}

function generateAssistantReply(text, day) {
    const topic = (day && day.topics && day.topics[0]) ? day.topics[0] : 'the topic';
    const q = text.toLowerCase();

    // Simple routes
    if (q.includes('hint') || q.includes('help')) {
        return `<div><div class="text-white font-medium mb-1">Hint</div><ul class="list-disc pl-5 space-y-1 text-gray-300"><li>Break the problem into smaller steps.</li><li>Relate it to examples from today\'s lesson on <span class="text-white">${topic}</span>.</li><li>Try a minimal example and inspect the output.</li></ul></div>`;
    }
    if (q.includes('example') || q.includes('code')) {
        if ((topic.toLowerCase().includes('javascript') || topic.toLowerCase().includes('js'))) {
            return `<div><div class="text-white font-medium mb-1">Example (JavaScript)</div><pre class="bg-gray-900 rounded p-3 text-xs overflow-auto"><code>const greet = (name) => ` + "`Hello, ${name}!`" + `;\nconsole.log(greet('Tuto'));</code></pre></div>`;
        }
        if (topic.toLowerCase().includes('python')) {
            return `<div><div class="text-white font-medium mb-1">Example (Python)</div><pre class="bg-gray-900 rounded p-3 text-xs overflow-auto"><code>def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet('Tuto'))</code></pre></div>`;
        }
        return `<div><div class="text-white font-medium mb-1">Example</div><p class="text-gray-300">Consider a simple, minimal example related to <span class="text-white">${topic}</span> and build up incrementally.</p></div>`;
    }
    if (q.startsWith('what is') || q.startsWith('define') || q.includes('explain')) {
        return `<div><div class="text-white font-medium mb-1">Explanation</div><p class="text-gray-300">${capitalizeFirst(text)}. In the context of <span class="text-white">${topic}</span>, focus on core concepts, common pitfalls, and a small practical application.</p></div>`;
    }

    // Default guidance
    return `<div><p class="text-gray-300">I\'m here to help with <span class="text-white">${topic}</span>. Try asking for a hint, an example, or a concept explanation.</p></div>`;
}

function capitalizeFirst(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

// Setup navigation buttons
function setupNavigationButtons() {
    const prevBtn = document.getElementById('prevDayBtn');
    const nextBtn = document.getElementById('nextDayBtn');
    
    prevBtn.disabled = currentDayIndex === 0;
    nextBtn.disabled = currentDayIndex === allDays.length - 1;
    
    prevBtn.onclick = () => {
        if (currentDayIndex > 0) {
            selectDay(currentDayIndex - 1);
        }
    };
    
    nextBtn.onclick = () => {
        if (currentDayIndex < allDays.length - 1) {
            selectDay(currentDayIndex + 1);
        }
    };
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return; // Don't interfere with form inputs
    }
    
    switch(e.key) {
        case 'ArrowLeft':
            if (currentDayIndex > 0) {
                e.preventDefault();
                selectDay(currentDayIndex - 1);
            }
            break;
        case 'ArrowRight':
            if (currentDayIndex < allDays.length - 1) {
                e.preventDefault();
                selectDay(currentDayIndex + 1);
            }
            break;
        case ' ':
            e.preventDefault();
            // Toggle day completion
            const day = allDays[currentDayIndex];
            if (day && !day.completed) {
                markDayComplete(currentDayIndex);
            }
            break;
    }
}

// Mark day as complete
function markDayComplete(dayIndex) {
    const day = allDays[dayIndex];
    if (day) {
        day.completed = true;
        day.completedAt = new Date().toISOString();
        
        // Set day progress to 100%
        saveDayProgress(dayIndex, 100);
        updateDayProgress(100);
        
        // Update localStorage
        updateStudyPlanProgress();
        
        // Update UI
        renderDayNavigation();
        updateProgress();
        loadDayContent(dayIndex);
        
        // Show success message
        showNotification('Day completed successfully! 🎉', 'success');
        
        // Auto-advance to next day if available
        if (dayIndex < allDays.length - 1) {
            setTimeout(() => {
                selectDay(dayIndex + 1);
            }, 1500);
        }
    }
}

// Review day
function reviewDay(dayIndex) {
    // For now, just reload the day content
    loadDayContent(dayIndex);
    showNotification('Reviewing day content', 'info');
}

// Update study plan progress in localStorage
function updateStudyPlanProgress() {
    const completedDays = allDays.filter(day => day.completed).length;
    const totalDays = allDays.length;
    const progress = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    
    // Update the current study plan
    currentStudyPlan.progress = progress;
    
    // Update in localStorage
    const savedPlans = JSON.parse(localStorage.getItem('tutoStudyPlans') || '[]');
    const planIndex = savedPlans.findIndex(p => p.id == currentStudyPlan.id);
    
    if (planIndex >= 0) {
        savedPlans[planIndex] = currentStudyPlan;
        localStorage.setItem('tutoStudyPlans', JSON.stringify(savedPlans));
    }
}

// Add interactive learning elements
function addInteractiveElements() {
    // Add click handlers for learning content sections
    document.addEventListener('click', function(e) {
        if (e.target.closest('.learning-content-section')) {
            const section = e.target.closest('.learning-content-section');
            const dayIndex = currentDayIndex;
            
            // Mark section as completed and update progress
            if (!section.classList.contains('completed')) {
                section.classList.add('completed');
                section.classList.add('bg-green-500/10');
                section.classList.add('border-green-500/30');
                
                // Update progress
                updateDayProgressIncrementally(dayIndex);
            }
        }
        
        // Handle code example interactions
        if (e.target.closest('.code-example')) {
            const codeBlock = e.target.closest('.code-example');
            if (!codeBlock.classList.contains('interacted')) {
                codeBlock.classList.add('interacted');
                codeBlock.classList.add('ring-2');
                codeBlock.classList.add('ring-blue-500/50');
                
                // Update progress for code interaction
                updateDayProgressIncrementally(currentDayIndex);
            }
        }
    });
}

// Update day progress incrementally
function updateDayProgressIncrementally(dayIndex) {
    const day = allDays[dayIndex];
    if (!day) return;
    
    // Calculate progress based on completed sections
    const totalSections = 4; // Focus areas, activities, learning content, resources
    const completedSections = document.querySelectorAll('.learning-content-section.completed').length;
    const interactedCode = document.querySelectorAll('.code-example.interacted').length;
    
    // Progress calculation: 60% for content sections + 40% for code interactions
    const contentProgress = (completedSections / totalSections) * 60;
    const codeProgress = Math.min((interactedCode / 3) * 40, 40); // Max 3 code examples
    const totalProgress = Math.min(contentProgress + codeProgress, 100);
    
    // Update progress with animation
    const currentProgress = parseInt(document.getElementById('dayProgress').textContent) || 0;
    animateNumber(currentProgress, Math.round(totalProgress), 800, (value) => {
        updateDayProgress(value);
        saveDayProgress(dayIndex, value);
    });
    
    // Show progress notification
    if (totalProgress >= 100) {
        showNotification('Great job! You\'ve completed all learning activities for today! 🎯', 'success');
        // Add celebration effect
        addCelebrationEffect();
    } else if (totalProgress >= 50) {
        showNotification('Keep going! You\'re making excellent progress! 💪', 'info');
    } else if (totalProgress >= 25) {
        showNotification('Good start! Keep exploring the content! 🌟', 'info');
    }
}

// Add celebration effect when day is completed
function addCelebrationEffect() {
    const container = document.getElementById('learningContent');
    if (!container) return;
    
    // Create confetti effect
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'fixed w-2 h-2 rounded-full z-50 pointer-events-none';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = ['#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f87171'][Math.floor(Math.random() * 5)];
            confetti.style.animation = 'confetti-fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => confetti.remove(), 3000);
        }, i * 100);
    }
    
    // Add CSS animation
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize interactive learning elements
function initializeInteractiveLearning() {
    // Add interactive classes to learning content
    const learningContent = document.querySelector('#learningContent');
    if (learningContent) {
        // Add interactive classes to sections
        const sections = learningContent.querySelectorAll('.bg-white\\/5');
        sections.forEach(section => {
            section.classList.add('learning-content-section', 'cursor-pointer', 'transition-all', 'duration-200');
            section.addEventListener('mouseenter', function() {
                if (!this.classList.contains('completed')) {
                    this.classList.add('bg-white/10', 'border-white/20');
                }
            });
            section.addEventListener('mouseleave', function() {
                if (!this.classList.contains('completed')) {
                    this.classList.remove('bg-white/10', 'border-white/20');
                }
            });
        });
        
        // Add interactive classes to code examples
        const codeExamples = learningContent.querySelectorAll('.bg-gray-900');
        codeExamples.forEach(code => {
            code.classList.add('code-example', 'cursor-pointer', 'transition-all', 'duration-200');
            code.addEventListener('mouseenter', function() {
                if (!this.classList.contains('interacted')) {
                    this.classList.add('bg-gray-800');
                }
            });
            code.addEventListener('mouseleave', function() {
                if (!this.classList.contains('interacted')) {
                    this.classList.remove('bg-gray-800');
                }
            });
        });
    }
}

// Enhanced day content loading with interactive elements
function loadDayContent(dayIndex) {
    const day = allDays[dayIndex];
    const container = document.getElementById('learningContent');
    
    if (!day) {
        container.innerHTML = '<div class="text-center py-12 text-gray-400">Day not found</div>';
        return;
    }
    
    // Generate detailed learning content based on the day's topics
    const learningContent = generateLearningContent(day);
    
    container.innerHTML = `
        <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-2xl font-bold text-white">${day.title}</h2>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">${day.timeRequired} minutes</span>
                    ${day.completed ? 
                        '<span class="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Completed</span>' : 
                        '<span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">In Progress</span>'
                    }
                </div>
            </div>
            
            <div class="text-gray-300 mb-6">
                <p class="text-lg leading-relaxed">${day.description || 'Ready to start learning! This day focuses on building your knowledge and skills.'}</p>
            </div>
        </div>
        
        <!-- Learning Progress Bar -->
        <div class="mb-8 bg-white/5 rounded-lg p-4 border border-white/10">
            <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-gray-300">Today's Progress</span>
                <span class="text-sm font-medium text-green-400" id="dayProgress">0%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
                <div class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000" id="dayProgressBar" style="width: 0%"></div>
            </div>
            <div class="mt-2 text-xs text-gray-400">
                <span>💡 Click on learning sections and code examples to track your progress!</span>
            </div>
        </div>
        
        <!-- Main Learning Content -->
        <div class="mb-8">
            ${learningContent}
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Focus Areas -->
            <div class="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Focus Areas
                </h3>
                <div class="space-y-3">
                    ${day.topics.map(topic => `
                        <div class="flex items-start gap-3">
                            <div class="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div class="text-gray-300">${topic}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Activities -->
            <div class="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Learning Activities
                </h3>
                <div class="space-y-3">
                    ${day.activities.map(activity => `
                        <div class="flex items-start gap-3">
                            <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div class="text-gray-300">${activity}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Learning Resources -->
        <div class="bg-white/5 rounded-lg p-6 border border-white/10 mb-6">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Learning Resources
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onclick="openPracticeExercises(${dayIndex})" class="p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-200 text-left">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-medium">Practice Exercises</h4>
                            <p class="text-gray-400 text-sm">Hands-on practice</p>
                        </div>
                    </div>
                </button>
                
                <button onclick="openQuiz(${dayIndex})" class="p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-200 text-left">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-medium">Take Quiz</h4>
                            <p class="text-gray-400 text-sm">Test your knowledge</p>
                        </div>
                    </div>
                </button>
                
                <button onclick="openAIAssistant(${dayIndex})" class="p-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-200 text-left">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 class="text-white font-medium">AI Assistant</h4>
                            <p class="text-gray-400 text-sm">Get help & answers</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-center gap-4">
            ${!day.completed ? `
                <button onclick="markDayComplete(${dayIndex})" class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Mark Complete
                </button>
            ` : `
                <button onclick="reviewDay(${dayIndex})" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                    Review Day
                </button>
            `}
        </div>
    `;
    
    // Initialize day progress tracking
    initializeDayProgress(dayIndex);
    
    // Initialize interactive learning elements
    setTimeout(() => {
        initializeInteractiveLearning();
    }, 100);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Show error
function showError(message) {
    const container = document.getElementById('learningContent');
    container.innerHTML = `
        <div class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
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
            themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>';
        }
    }
}

// Export functions for global access
window.LearningInterface = {
    selectDay,
    markDayComplete,
    reviewDay
};
