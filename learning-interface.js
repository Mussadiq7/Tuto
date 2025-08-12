// Learning Interface JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeThemeToggle();
    initializeLearningInterface();
    initializeEventListeners();
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

// Learning Interface State
let currentPlan = null;
let currentLessonIndex = 0;
let lessons = [];
let userProgress = {};
let isLoading = false;
let error = null;

// Initialize Learning Interface
async function initializeLearningInterface() {
    try {
        // Get plan ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const planId = urlParams.get('planId');
        
        if (!planId) {
            showErrorState('No study plan ID provided. Please select a study plan first.');
            return;
        }
        
        // Load plan data and lessons
        await loadPlanData(planId);
        await loadUserProgress(planId);
    } catch (error) {
        console.error('Failed to initialize learning interface:', error);
        showErrorState('Failed to initialize learning interface. Please try again later.');
    }
}

// Load Plan Data
async function loadPlanData(planId) {
    try {
        isLoading = true;
        showLoadingState();
        
        // Load study plan details from API
        const plan = await apiService.getStudyPlanById(planId);
        currentPlan = plan;
        
        // Load lessons for this plan from API
        const planLessons = await apiService.getStudyPlanLessons(planId);
        lessons = planLessons;
        
        // Update UI
        updatePlanHeader();
        renderLessonList();
        loadLesson(0);
        
        hideLoadingState();
    } catch (error) {
        console.error('Failed to load plan data:', error);
        showErrorState('Failed to load study plan. Please try again later.');
        hideLoadingState();
    }
}

// Get Mock Plan Data
function getMockPlanData(planId) {
    const plans = {
        '1': {
            id: 1,
            title: "JavaScript Fundamentals",
            description: "Master the basics of JavaScript programming language",
            lessons: [
                                        {
                            id: 1,
                            title: "Introduction to JavaScript",
                            content: `
                                <h2 class="text-2xl font-bold text-white mb-4">Introduction to JavaScript</h2>
                                <p class="text-gray-300 mb-4">JavaScript is a powerful programming language that runs in web browsers and allows you to create interactive websites.</p>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">What is JavaScript?</h3>
                                <p class="text-gray-300 mb-4">JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It was originally created to make web pages interactive.</p>
                                
                                <div class="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                                    <h4 class="text-lg font-medium text-white mb-2">Key Features:</h4>
                                    <ul class="text-gray-300 space-y-2">
                                        <li>• Dynamic typing</li>
                                        <li>• Object-oriented programming support</li>
                                        <li>• Functional programming support</li>
                                        <li>• Event-driven programming</li>
                                        <li>• Asynchronous programming</li>
                                    </ul>
                                </div>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">Your First JavaScript Code</h3>
                                <p class="text-gray-300 mb-4">Let's start with a simple example:</p>
                                
                                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                                    <pre class="text-green-400"><code>console.log("Hello, World!");</code></pre>
                                </div>
                                
                                <p class="text-gray-300 mb-4">This simple line of code will output "Hello, World!" to the browser's console.</p>
                                
                                <!-- Resources Section -->
                                <div class="mt-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg">
                                    <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                        <svg class="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        Resources
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                </svg>
                                                Video Tutorials
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Crash Course by Traversy Media</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Learn JavaScript in 1 Hour by Programming with Mosh</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Modern JavaScript Tutorial by Net Ninja</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                </svg>
                                                Articles & Documentation
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• MDN Web Docs - JavaScript Guide</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript.info - Modern JavaScript Tutorial</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Eloquent JavaScript (Free Book)</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Practice Exercises
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Codecademy JavaScript Course</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• freeCodeCamp JavaScript Algorithms</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• HackerRank JavaScript Track</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Interactive Tools
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JSFiddle - Code Playground</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• CodePen - Live Code Editor</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Replit - Online IDE</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            `,
                            duration: "15 min",
                            type: "video"
                        },
                                        {
                            id: 2,
                            title: "Variables and Data Types",
                            content: `
                                <h2 class="text-2xl font-bold text-white mb-4">Variables and Data Types</h2>
                                <p class="text-gray-300 mb-4">Variables are containers for storing data values. In JavaScript, you can declare variables using <code class="bg-gray-700 px-1 rounded">let</code>, <code class="bg-gray-700 px-1 rounded">const</code>, or <code class="bg-gray-700 px-1 rounded">var</code>.</p>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">Variable Declaration</h3>
                                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                                    <pre class="text-green-400"><code>let name = "John";
 const age = 25;
 var city = "New York";</code></pre>
                                </div>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">Data Types</h3>
                                <p class="text-gray-300 mb-4">JavaScript has several primitive data types:</p>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                                        <h4 class="text-white font-medium mb-2">Primitive Types:</h4>
                                        <ul class="text-gray-300 text-sm space-y-1">
                                            <li>• String: "Hello"</li>
                                            <li>• Number: 42, 3.14</li>
                                            <li>• Boolean: true, false</li>
                                            <li>• Undefined: undefined</li>
                                            <li>• Null: null</li>
                                        </ul>
                                    </div>
                                    <div class="bg-white/5 border border-white/10 rounded-lg p-4">
                                        <h4 class="text-white font-medium mb-2">Reference Types:</h4>
                                        <ul class="text-gray-300 text-sm space-y-1">
                                            <li>• Object: {}</li>
                                            <li>• Array: []</li>
                                            <li>• Function: function() {}</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <!-- Resources Section -->
                                <div class="mt-8 p-6 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg">
                                    <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                        <svg class="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        Resources
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                </svg>
                                                Video Tutorials
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Variables & Data Types by Net Ninja</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Understanding JavaScript Types by Fun Fun Function</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Fundamentals by Traversy Media</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                </svg>
                                                Articles & Documentation
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• MDN - JavaScript Data Types</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript.info - Variables & Data Types</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Understanding JavaScript Variables by 2ality</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Practice Exercises
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Variables Quiz on Codecademy</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Data Types Practice on freeCodeCamp</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Variable Declaration Exercises</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Interactive Tools
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• TypeScript Playground (for type checking)</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Console in Browser DevTools</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Node.js REPL for testing</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            `,
                            duration: "20 min",
                            type: "interactive"
                        },
                                        {
                            id: 3,
                            title: "Functions and Scope",
                            content: `
                                <h2 class="text-2xl font-bold text-white mb-4">Functions and Scope</h2>
                                <p class="text-gray-300 mb-4">Functions are reusable blocks of code that can be called to perform specific tasks.</p>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">Function Declaration</h3>
                                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                                    <pre class="text-green-400"><code>function greet(name) {
    return "Hello, " + name + "!";
}

// Function call
console.log(greet("Alice")); // Output: Hello, Alice!</code></pre>
                                </div>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">Arrow Functions</h3>
                                <p class="text-gray-300 mb-4">Modern JavaScript supports arrow functions for more concise syntax:</p>
                                
                                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                                    <pre class="text-green-400"><code>const greet = (name) => {
    return "Hello, " + name + "!";
};

// Or even more concise:
const greet = name => "Hello, " + name + "!";</code></pre>
                                </div>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">Scope</h3>
                                <p class="text-gray-300 mb-4">Scope determines the accessibility of variables in different parts of your code:</p>
                                
                                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                                    <pre class="text-green-400"><code>let globalVar = "I'm global";

function example() {
    let localVar = "I'm local";
    console.log(globalVar); // Accessible
    console.log(localVar);  // Accessible
}

console.log(globalVar); // Accessible
console.log(localVar);  // Error: localVar is not defined</code></pre>
                                </div>
                                
                                <!-- Resources Section -->
                                <div class="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg">
                                    <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                        <svg class="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        Resources
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                </svg>
                                                Video Tutorials
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Functions Tutorial by Net Ninja</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Understanding Scope & Closures by Fun Fun Function</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Arrow Functions Explained by Traversy Media</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                </svg>
                                                Articles & Documentation
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• MDN - JavaScript Functions</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript.info - Functions & Scope</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Understanding JavaScript Closures by 2ality</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Practice Exercises
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Function Writing Exercises on Codecademy</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Scope & Closures Practice on freeCodeCamp</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Arrow Functions Challenges</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Interactive Tools
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Function Visualizer</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Scope Chain Debugger</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Function Testing Playground</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            `,
                            duration: "25 min",
                            type: "practice"
                        },
                                        {
                            id: 4,
                            title: "Control Flow",
                            content: `
                                <h2 class="text-2xl font-bold text-white mb-4">Control Flow</h2>
                                <p class="text-gray-300 mb-4">Control flow statements allow you to control the execution of your code based on conditions.</p>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">If Statements</h3>
                                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                                    <pre class="text-green-400"><code>let age = 18;

if (age >= 18) {
    console.log("You are an adult");
} else if (age >= 13) {
    console.log("You are a teenager");
} else {
    console.log("You are a child");
}</code></pre>
                                </div>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">Loops</h3>
                                <p class="text-gray-300 mb-4">Loops allow you to execute code multiple times:</p>
                                
                                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                                    <pre class="text-green-400"><code>// For loop
for (let i = 0; i < 5; i++) {
    console.log("Count: " + i);
}

// While loop
let count = 0;
while (count < 3) {
    console.log("Count: " + count);
    count++;
}</code></pre>
                                </div>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">Switch Statement</h3>
                                <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
                                    <pre class="text-green-400"><code>let day = "Monday";

switch (day) {
    case "Monday":
        console.log("Start of the week");
        break;
    case "Friday":
        console.log("End of the week");
        break;
    default:
        console.log("Middle of the week");
}</code></pre>
                                </div>
                                
                                <!-- Resources Section -->
                                <div class="mt-8 p-6 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg">
                                    <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                        <svg class="w-6 h-6 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        Resources
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                </svg>
                                                Video Tutorials
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Control Flow by Net Ninja</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Loops & Conditionals by Traversy Media</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Switch Statements Explained by Fun Fun Function</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                </svg>
                                                Articles & Documentation
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• MDN - JavaScript Control Flow</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript.info - Loops & Conditionals</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Understanding JavaScript Loops by 2ality</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Practice Exercises
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Control Flow Exercises on Codecademy</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Loop Practice on freeCodeCamp</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Conditional Logic Challenges</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Interactive Tools
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• JavaScript Flow Control Visualizer</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Loop Execution Simulator</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Conditional Logic Tester</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            `,
                            duration: "30 min",
                            type: "quiz"
                        }
            ]
        },
        '2': {
            id: 2,
            title: "React Development",
            description: "Build modern web applications with React",
            lessons: [
                                        {
                            id: 1,
                            title: "Introduction to React",
                            content: `
                                <h2 class="text-2xl font-bold text-white mb-4">Introduction to React</h2>
                                <p class="text-gray-300 mb-4">React is a JavaScript library for building user interfaces, particularly single-page applications.</p>
                                
                                <h3 class="text-xl font-semibold text-white mb-3">What is React?</h3>
                                <p class="text-gray-300 mb-4">React was developed by Facebook and is used to create interactive UIs with a component-based architecture.</p>
                                
                                <div class="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                                    <h4 class="text-lg font-medium text-white mb-2">Key Features:</h4>
                                    <ul class="text-gray-300 space-y-2">
                                        <li>• Component-based architecture</li>
                                        <li>• Virtual DOM for performance</li>
                                        <li>• JSX syntax</li>
                                        <li>• Unidirectional data flow</li>
                                        <li>• Large ecosystem</li>
                                    </ul>
                                </div>
                                
                                <!-- Resources Section -->
                                <div class="mt-8 p-6 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg">
                                    <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                        <svg class="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                        </svg>
                                        Resources
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                </svg>
                                                Video Tutorials
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React Tutorial for Beginners by Net Ninja</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Learn React in 1 Hour by Programming with Mosh</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React Crash Course by Traversy Media</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                                </svg>
                                                Articles & Documentation
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React Official Documentation</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React Tutorial on React.dev</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React Patterns by Michael Chan</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Practice Exercises
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React Tutorial on Codecademy</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React Projects on freeCodeCamp</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React Challenges on Frontend Mentor</a></li>
                                            </ul>
                                        </div>
                                        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                            <h4 class="text-white font-medium mb-2 flex items-center">
                                                <svg class="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                Interactive Tools
                                            </h4>
                                            <ul class="text-gray-300 text-sm space-y-2">
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• CodeSandbox - React Playground</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• React DevTools Browser Extension</a></li>
                                                <li><a href="#" class="hover:text-blue-400 transition-colors">• Create React App Starter</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            `,
                            duration: "20 min",
                            type: "video"
                        }
            ]
        }
    };
    
    return plans[planId] || plans['1'];
}

// Load User Progress
function loadUserProgress(planId) {
    const savedProgress = localStorage.getItem(`progress_${planId}`);
    userProgress = savedProgress ? JSON.parse(savedProgress) : {};
}

// Save User Progress
function saveUserProgress() {
    if (currentPlan) {
        localStorage.setItem(`progress_${currentPlan.id}`, JSON.stringify(userProgress));
    }
}

// Update Plan Header
function updatePlanHeader() {
    if (!currentPlan) return;
    
    document.getElementById('planTitle').textContent = currentPlan.title;
    document.getElementById('planDescription').textContent = currentPlan.description;
    updateOverallProgress();
}

// Update Overall Progress
function updateOverallProgress() {
    if (!currentPlan || !lessons.length) return;
    
    const completedLessons = Object.values(userProgress).filter(completed => completed).length;
    const progressPercentage = Math.round((completedLessons / lessons.length) * 100);
    
    document.getElementById('overallProgress').textContent = `${progressPercentage}%`;
    
    // Update progress icon
    const progressIcon = document.getElementById('progressIcon');
    if (progressPercentage === 100) {
        progressIcon.textContent = '🎉';
    } else if (progressPercentage >= 75) {
        progressIcon.textContent = '🚀';
    } else if (progressPercentage >= 50) {
        progressIcon.textContent = '📈';
    } else if (progressPercentage >= 25) {
        progressIcon.textContent = '📚';
    } else {
        progressIcon.textContent = '📖';
    }
}

// Render Lesson List
function renderLessonList() {
    const lessonList = document.getElementById('lessonList');
    lessonList.innerHTML = '';
    
    lessons.forEach((lesson, index) => {
        const isCompleted = userProgress[lesson.id] || false;
        const isCurrent = index === currentLessonIndex;
        
        const lessonElement = document.createElement('div');
        lessonElement.className = `p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            isCurrent 
                ? 'bg-blue-600/20 border border-blue-500/30' 
                : isCompleted 
                    ? 'bg-green-600/20 border border-green-500/30' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
        }`;
        
        lessonElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white/10 text-gray-300'
                    }">
                        ${isCompleted ? '✓' : index + 1}
                    </div>
                    <div>
                        <h3 class="font-medium text-white">${lesson.title}</h3>
                        <p class="text-sm text-gray-400">${lesson.duration}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2 py-1 rounded-full ${
                        lesson.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
                        lesson.type === 'interactive' ? 'bg-purple-500/20 text-purple-400' :
                        lesson.type === 'practice' ? 'bg-green-500/20 text-green-400' :
                        'bg-orange-500/20 text-orange-400'
                    }">${lesson.type}</span>
                    ${isCompleted ? '<span class="text-green-400">✓</span>' : ''}
                </div>
            </div>
        `;
        
        lessonElement.addEventListener('click', () => {
            currentLessonIndex = index;
            loadLesson(index);
            renderLessonList(); // Re-render to update current lesson highlighting
        });
        
        lessonList.appendChild(lessonElement);
    });
}

// Load Lesson
function loadLesson(index) {
    if (index < 0 || index >= lessons.length) return;
    
    currentLessonIndex = index;
    const lesson = lessons[index];
    
    // Update lesson content
    document.getElementById('lessonContent').innerHTML = lesson.content;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Re-render lesson list to update highlighting
    renderLessonList();
    
    // Clear chatbot messages when switching lessons
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="text-center text-gray-400 text-sm">
                <svg class="w-12 h-12 mx-auto mb-2 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p>Ask me anything about this lesson!</p>
            </div>
        `;
    }
}

// Update Navigation Buttons
function updateNavigationButtons() {
    const prevButton = document.getElementById('prevLesson');
    const nextButton = document.getElementById('nextLesson');
    const markCompleteButton = document.getElementById('markComplete');
    
    // Previous button
    prevButton.disabled = currentLessonIndex === 0;
    
    // Next button
    nextButton.disabled = currentLessonIndex === lessons.length - 1;
    
    // Mark complete button
    const currentLesson = lessons[currentLessonIndex];
    const isCompleted = userProgress[currentLesson.id] || false;
    
    if (isCompleted) {
        markCompleteButton.textContent = 'Completed ✓';
        markCompleteButton.disabled = true;
        markCompleteButton.className = 'px-6 py-3 bg-green-700 text-white rounded-lg font-medium opacity-50 cursor-not-allowed';
    } else {
        markCompleteButton.textContent = 'Mark Complete';
        markCompleteButton.disabled = false;
        markCompleteButton.className = 'px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200';
    }
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Navigation buttons
    document.getElementById('prevLesson').addEventListener('click', () => {
        if (currentLessonIndex > 0) {
            loadLesson(currentLessonIndex - 1);
        }
    });
    
    document.getElementById('nextLesson').addEventListener('click', () => {
        if (currentLessonIndex < lessons.length - 1) {
            loadLesson(currentLessonIndex + 1);
        }
    });
    
    // Mark complete button
    document.getElementById('markComplete').addEventListener('click', () => {
        markLessonComplete();
    });
    
    // Take quiz button
    document.getElementById('takeQuiz').addEventListener('click', () => {
        showQuiz();
    });
    
    // Quiz modal
    document.getElementById('closeQuiz').addEventListener('click', () => {
        hideQuiz();
    });
    
    document.getElementById('submitQuiz').addEventListener('click', () => {
        submitQuiz();
    });
    
    // Close quiz modal when clicking outside
    document.getElementById('quizModal').addEventListener('click', (e) => {
        if (e.target.id === 'quizModal') {
            hideQuiz();
        }
    });

    // AI Chatbot functionality
    document.getElementById('openChatbot').addEventListener('click', () => {
        showChatbot();
    });
    
    document.getElementById('floatingChatbot').addEventListener('click', () => {
        showChatbot();
    });
    
    document.getElementById('closeChatbot').addEventListener('click', () => {
        hideChatbot();
    });
    
    document.getElementById('sendMessage').addEventListener('click', () => {
        sendChatMessage();
    });
    
    // Send message on Enter key
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Quick question buttons
    document.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-question')) {
            const question = e.target.getAttribute('data-question');
            askQuickQuestion(question);
        }
    });
    
    // Close chatbot modal when clicking outside
    document.getElementById('chatbotModal').addEventListener('click', (e) => {
        if (e.target.id === 'chatbotModal') {
            hideChatbot();
        }
    });
}

// Mark Lesson Complete
function markLessonComplete() {
    const currentLesson = lessons[currentLessonIndex];
    userProgress[currentLesson.id] = true;
    
    saveUserProgress();
    updateOverallProgress();
    updateNavigationButtons();
    renderLessonList();
    
    showNotification('Lesson completed!', 'Great job! You can now move to the next lesson.', 'success');
    
    // Auto-advance to next lesson if available
    if (currentLessonIndex < lessons.length - 1) {
        setTimeout(() => {
            loadLesson(currentLessonIndex + 1);
        }, 1500);
    }
}

// Show Quiz
function showQuiz() {
    const currentLesson = lessons[currentLessonIndex];
    const quizData = getQuizData(currentLesson.id);
    
    document.getElementById('quizContent').innerHTML = createQuizHTML(quizData);
    document.getElementById('quizModal').classList.remove('hidden');
}

// Hide Quiz
function hideQuiz() {
    document.getElementById('quizModal').classList.add('hidden');
}

// Get Quiz Data
function getQuizData(lessonId) {
    // Mock quiz data - in a real app, this would come from an API
    const quizzes = {
        1: {
            title: "JavaScript Basics Quiz",
            questions: [
                {
                    question: "What is JavaScript?",
                    type: "multiple-choice",
                    options: [
                        "A markup language",
                        "A programming language",
                        "A styling language",
                        "A database language"
                    ],
                    correct: 1
                },
                {
                    question: "Which keyword is used to declare a variable in JavaScript?",
                    type: "multiple-choice",
                    options: ["var", "let", "const", "All of the above"],
                    correct: 3
                },
                {
                    question: "What does console.log() do?",
                    type: "multiple-choice",
                    options: [
                        "Creates a new file",
                        "Outputs text to the console",
                        "Deletes a variable",
                        "Stops the program"
                    ],
                    correct: 1
                }
            ]
        },
        2: {
            title: "Variables and Data Types Quiz",
            questions: [
                {
                    question: "Which data type represents whole numbers?",
                    type: "multiple-choice",
                    options: ["String", "Number", "Boolean", "Array"],
                    correct: 1
                },
                {
                    question: "What is the value of typeof null?",
                    type: "multiple-choice",
                    options: ["null", "undefined", "object", "number"],
                    correct: 2
                }
            ]
        }
    };
    
    return quizzes[lessonId] || quizzes[1];
}

// Create Quiz HTML
function createQuizHTML(quizData) {
    let html = `<h3 class="text-xl font-semibold text-white mb-6">${quizData.title}</h3>`;
    
    quizData.questions.forEach((question, qIndex) => {
        html += `
            <div class="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                <h4 class="text-white font-medium mb-3">${qIndex + 1}. ${question.question}</h4>
                <div class="space-y-2">
                    ${question.options.map((option, oIndex) => `
                        <label class="flex items-center cursor-pointer">
                            <input type="radio" name="q${qIndex}" value="${oIndex}" class="mr-3">
                            <span class="text-gray-300">${option}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    return html;
}

// Submit Quiz
function submitQuiz() {
    const quizData = getQuizData(lessons[currentLessonIndex].id);
    let score = 0;
    let totalQuestions = quizData.questions.length;
    
    // Check answers
    quizData.questions.forEach((question, qIndex) => {
        const selectedAnswer = document.querySelector(`input[name="q${qIndex}"]:checked`);
        if (selectedAnswer && parseInt(selectedAnswer.value) === question.correct) {
            score++;
        }
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Show results
    document.getElementById('quizContent').innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-bold text-white mb-4">Quiz Results</h3>
            <div class="text-6xl font-bold text-green-400 mb-4">${percentage}%</div>
            <p class="text-gray-300 mb-6">You got ${score} out of ${totalQuestions} questions correct!</p>
            ${percentage >= 70 ? 
                '<p class="text-green-400 font-medium">Great job! You passed the quiz!</p>' : 
                '<p class="text-orange-400 font-medium">Keep studying and try again!</p>'
            }
        </div>
    `;
    
    // Update submit button
    const submitButton = document.getElementById('submitQuiz');
    submitButton.textContent = 'Close Quiz';
    submitButton.onclick = hideQuiz;
    
    // If passed, mark lesson as complete
    if (percentage >= 70 && !userProgress[lessons[currentLessonIndex].id]) {
        markLessonComplete();
    }
}

// Show Notification
function showNotification(message, description = '', type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationDescription = document.getElementById('notificationDescription');
    const notificationIcon = document.getElementById('notificationIcon');
    
    notificationMessage.textContent = message;
    notificationDescription.textContent = description;
    
    // Set icon based on type
    notificationIcon.innerHTML = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
    notification.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// AI Chatbot Functions
function showChatbot() {
    document.getElementById('chatbotModal').classList.remove('hidden');
    document.getElementById('chatInput').focus();
    
    // Add welcome message if this is the first time opening
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages.children.length === 1) { // Only the initial placeholder message
        // Clear the placeholder
        chatMessages.innerHTML = '';
        
        // Add welcome message
        addChatMessage(`Hello! I'm your AI learning assistant for "${lessons[currentLessonIndex].title}". I'm here to help you understand this lesson better. Feel free to ask me any questions!`, 'ai');
    }
}

function hideChatbot() {
    document.getElementById('chatbotModal').classList.add('hidden');
    // Clear chat input
    document.getElementById('chatInput').value = '';
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    
    // Clear input
    chatInput.value = '';
    
    // Generate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addChatMessage(aiResponse, 'ai');
    }, 1000);
}

function askQuickQuestion(question) {
    // Add the quick question to chat
    addChatMessage(question, 'user');
    
    // Generate AI response
    setTimeout(() => {
        const aiResponse = generateAIResponse(question);
        addChatMessage(aiResponse, 'ai');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-4 ${sender === 'user' ? 'text-right' : 'text-left'}`;
    
    const messageBubble = document.createElement('div');
    messageBubble.className = `inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        sender === 'user' 
            ? 'bg-blue-600 text-white ml-auto' 
            : 'bg-white/10 text-white border border-white/20'
    }`;
    
    messageBubble.textContent = message;
    messageDiv.appendChild(messageBubble);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
    const currentLesson = lessons[currentLessonIndex];
    const lessonTitle = currentLesson.title.toLowerCase();
    
    // Simple AI response logic based on keywords and lesson context
    const message = userMessage.toLowerCase();
    
    // Lesson-specific responses
    if (lessonTitle.includes('javascript')) {
        if (message.includes('variable') || message.includes('var') || message.includes('let') || message.includes('const')) {
            return "Variables in JavaScript are containers for storing data values. You can declare them using 'var', 'let', or 'const'. 'let' and 'const' are block-scoped, while 'var' is function-scoped. 'const' creates read-only references.";
        }
        if (message.includes('function') || message.includes('method')) {
            return "Functions in JavaScript are reusable blocks of code. You can define them using the 'function' keyword, arrow functions (=>), or function expressions. They can accept parameters and return values.";
        }
        if (message.includes('array') || message.includes('list')) {
            return "Arrays in JavaScript are ordered collections of values. You can access elements by index, add/remove items with methods like push(), pop(), shift(), and unshift(). Arrays are zero-indexed.";
        }
        if (message.includes('object') || message.includes('json')) {
            return "Objects in JavaScript are collections of key-value pairs. They're used to represent real-world entities and can contain properties and methods. You can access properties using dot notation or bracket notation.";
        }
    }
    
    if (lessonTitle.includes('html')) {
        if (message.includes('tag') || message.includes('element')) {
            return "HTML tags are the building blocks of web pages. They define the structure and content. Common tags include <div>, <p>, <h1>-<h6>, <img>, <a>, and <form>. Tags usually come in pairs with opening and closing tags.";
        }
        if (message.includes('semantic') || message.includes('meaning')) {
            return "Semantic HTML uses meaningful tags that clearly describe their content and purpose. Examples include <header>, <nav>, <main>, <article>, <section>, <footer>. This improves accessibility and SEO.";
        }
    }
    
    if (lessonTitle.includes('css')) {
        if (message.includes('selector') || message.includes('class') || message.includes('id')) {
            return "CSS selectors target HTML elements for styling. Class selectors (.) target elements with specific classes, ID selectors (#) target unique elements, and element selectors target all instances of a tag.";
        }
        if (message.includes('flexbox') || message.includes('grid')) {
            return "Flexbox and Grid are CSS layout systems. Flexbox is great for one-dimensional layouts (rows or columns), while Grid excels at two-dimensional layouts. Both make responsive design much easier.";
        }
    }
    
    // General learning responses
    if (message.includes('key concept') || message.includes('important')) {
        return `The key concepts in "${currentLesson.title}" are fundamental to understanding this topic. Focus on mastering these basics before moving to advanced concepts. Practice regularly and don't hesitate to review previous lessons if needed.`;
    }
    
    if (message.includes('example') || message.includes('demonstrate')) {
        return `Great question! Examples help solidify understanding. For "${currentLesson.title}", I recommend practicing with real code examples. Try modifying the examples in your code editor to see how changes affect the output.`;
    }
    
    if (message.includes('mistake') || message.includes('error') || message.includes('common')) {
        return `Common mistakes in "${currentLesson.title}" often involve syntax errors, logical errors, or conceptual misunderstandings. Pay attention to error messages, use console.log for debugging, and practice regularly to avoid these pitfalls.`;
    }
    
    if (message.includes('relate') || message.includes('connect') || message.includes('other topic')) {
        return `"${currentLesson.title}" connects to several other topics in web development. Understanding this lesson will make learning related concepts much easier. The knowledge builds upon itself, so take your time to master each concept.`;
    }
    
    if (message.includes('practice') || message.includes('next') || message.includes('exercise')) {
        return `After mastering "${currentLesson.title}", I recommend practicing with coding challenges, building small projects, and exploring related topics. The resources section in this lesson has great practice materials to reinforce your learning.`;
    }
    
    // Default response
    const defaultResponses = [
        `That's a great question about "${currentLesson.title}"! Let me help you understand this better.`,
        `I'm here to help you with "${currentLesson.title}". Could you be more specific about what you'd like to know?`,
        `Great question! For "${currentLesson.title}", the answer depends on the specific context. Let me break this down for you.`,
        `I'd be happy to help you with "${currentLesson.title}"! This is an important concept to master.`,
        `That's an interesting question about "${currentLesson.title}". Let me explain this step by step.`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Left arrow - previous lesson
    if (e.key === 'ArrowLeft' && currentLessonIndex > 0) {
        loadLesson(currentLessonIndex - 1);
    }
    
    // Right arrow - next lesson
    if (e.key === 'ArrowRight' && currentLessonIndex < lessons.length - 1) {
        loadLesson(currentLessonIndex + 1);
    }
    
    // Space bar - mark complete
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        const markCompleteButton = document.getElementById('markComplete');
        if (!markCompleteButton.disabled) {
            markLessonComplete();
        }
    }
    
    // Escape - close quiz modal
    if (e.key === 'Escape') {
        hideQuiz();
    }
    
    // C key - open chatbot
    if (e.key === 'c' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        showChatbot();
    }
});

// Export functions for potential external use
window.LearningInterface = {
    loadLesson,
    markLessonComplete,
    showQuiz,
    hideQuiz
};
