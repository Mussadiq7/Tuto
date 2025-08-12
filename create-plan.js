document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('themeToggle');
  const preferencesForm = document.getElementById('preferencesForm');
  const loadingState = document.getElementById('loadingState');
  const studyPlanContent = document.getElementById('studyPlanContent');
  const errorState = document.getElementById('errorState');
  const topicDisplay = document.getElementById('topicDisplay');
  const startPlanBtn = document.getElementById('startPlanBtn');
  const customizeBtn = document.getElementById('customizeBtn');
  const retryBtn = document.getElementById('retryBtn');
  const planPreferencesForm = document.getElementById('planPreferencesForm');
  const durationSlider = document.getElementById('duration');
  const durationValue = document.getElementById('durationValue');
  const generatePlanBtn = document.getElementById('generatePlanBtn');
  const customTimeRadio = document.getElementById('customTimeRadio');
  const customTimeInput = document.getElementById('customTimeInput');

  let currentTopic = '';
  let userPreferences = {};
  let generatedPlan = null;

  // Get AI configuration
  function getAIConfig() {
    try {
      return getActiveAIConfig();
    } catch (error) {
      console.error('AI Configuration Error:', error);
      return null;
    }
  }

  // Theme management (same as main page)
  function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    if (html.classList.contains('light')) {
      // Switch to dark theme
      html.classList.remove('light');
      themeToggle.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
        </svg>
      `;
      localStorage.setItem('theme', 'dark');
    } else {
      // Switch to light theme
      html.classList.add('light');
      themeToggle.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      `;
      localStorage.setItem('theme', 'light');
    }
  }

  function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      html.classList.add('light');
      themeToggle.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      `;
    } else {
      themeToggle.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
        </svg>
      `;
    }
  }

  // Get topic from URL parameters
  function getTopicFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('topic');
  }

  // Setup form interactions
  function setupFormInteractions() {
    // Duration slider
    if (durationSlider && durationValue) {
      durationSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        durationValue.textContent = `${value} days`;
      });
    }

    // Time per day radio buttons
    const timePerDayRadios = document.querySelectorAll('input[name="timePerDay"]');
    timePerDayRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        // Remove active class from all labels
        timePerDayRadios.forEach(r => {
          r.closest('label').classList.remove('border-green-500', 'bg-green-500/10');
        });
        // Add active class to selected label
        e.target.closest('label').classList.add('border-green-500', 'bg-green-500/10');
      });
    });

    // Learning style checkboxes
    const learningStyleCheckboxes = document.querySelectorAll('input[name="learningStyle"]');
    learningStyleCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const label = e.target.closest('label');
        if (e.target.checked) {
          label.classList.add('border-green-500', 'bg-green-500/10');
        } else {
          label.classList.remove('border-green-500', 'bg-green-500/10');
        }
      });
    });

    // Custom time input handling
    if (customTimeRadio && customTimeInput) {
      // Handle custom time radio selection
      customTimeRadio.addEventListener('change', (e) => {
        if (e.target.checked) {
          customTimeInput.disabled = false;
          customTimeInput.focus();
          customTimeInput.closest('div').classList.add('border-green-500', 'bg-green-500/10');
        } else {
          customTimeInput.disabled = true;
          customTimeInput.closest('div').classList.remove('border-green-500', 'bg-green-500/10');
        }
      });

      // Handle custom time input changes
      customTimeInput.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        if (value < 5) {
          e.target.value = 5;
        } else if (value > 480) {
          e.target.value = 480;
        }
      });

      // Handle other radio button selections
      const timePerDayRadios = document.querySelectorAll('input[name="timePerDay"]');
      timePerDayRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.value !== 'custom') {
            customTimeInput.disabled = true;
            customTimeInput.closest('div').classList.remove('border-green-500', 'bg-green-500/10');
          }
        });
      });
    }
  }

  // Get user preferences from form
  function getUserPreferences() {
    const formData = new FormData(planPreferencesForm);
    const timePerDayValue = formData.get('timePerDay');
    
    let timePerDay;
    if (timePerDayValue === 'custom') {
      timePerDay = parseInt(customTimeInput.value) || 30;
    } else {
      timePerDay = parseInt(timePerDayValue);
    }

    const preferences = {
      duration: parseInt(durationSlider.value),
      difficulty: document.getElementById('difficulty').value,
      timePerDay: timePerDay,
      learningStyles: []
    };

    // Get selected learning styles
    const learningStyleCheckboxes = document.querySelectorAll('input[name="learningStyle"]:checked');
    learningStyleCheckboxes.forEach(checkbox => {
      preferences.learningStyles.push(checkbox.value);
    });

    return preferences;
  }

  // Generate AI prompt for study plan
  function generateAIPrompt(topic, preferences) {
    const { duration, difficulty, timePerDay, learningStyles } = preferences;
    
    const learningStyleText = learningStyles.length > 0 
      ? `Learning styles: ${learningStyles.join(', ')}. ` 
      : '';

    return `Create a comprehensive ${duration}-day study plan for learning ${topic}. 

Requirements:
- Duration: ${duration} days
- Difficulty level: ${difficulty}
- Time per day: ${timePerDay} minutes
- ${learningStyleText}

Please provide a JSON response with the following structure:
{
  "duration": "${duration} days",
  "difficulty": "${difficulty}",
  "timePerDay": "${timePerDay} min/day",
  "overview": "A detailed overview of the study plan",
  "schedule": [
    {
      "title": "Week 1",
      "days": [
        {
          "day": 1,
          "title": "Day 1",
          "topics": ["Topic 1", "Topic 2"],
          "activities": ["Activity 1", "Activity 2"],
          "timeRequired": ${timePerDay}
        }
      ]
    }
  ],
  "learningStyles": ${JSON.stringify(learningStyles)}
}

Make the plan realistic, engaging, and tailored to the specified difficulty level and learning styles. Include specific topics, activities, and time allocations for each day.`;
  }

  // Call AI API to generate study plan
  async function callAIAPI(prompt) {
    const config = getAIConfig();
    if (!config) {
      throw new Error('No AI configuration found. Please check config.js');
    }

    try {
      // For OpenAI
      if (config.provider === 'openai') {
        const response = await fetch(`${config.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational planner specializing in creating personalized study plans. Always respond with valid JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: config.temperature,
            max_tokens: config.maxTokens
          })
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      }
      
      // For Anthropic Claude
      else if (config.provider === 'anthropic') {
        const response = await fetch(`${config.baseURL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: config.model,
            max_tokens: config.maxTokens,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.content[0].text;
        
        // Extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      }
      
      // For Azure OpenAI
      else if (config.provider === 'azure') {
        const response = await fetch(`${config.baseURL}/chat/completions?api-version=2023-05-15`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': config.apiKey
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational planner specializing in creating personalized study plans. Always respond with valid JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: config.temperature,
            max_tokens: config.maxTokens
          })
        });

        if (!response.ok) {
          throw new Error(`Azure OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      }
      
      // For Groq (Fast AI API)
      else if (config.provider === 'groq') {
        const response = await fetch(`${config.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert educational planner specializing in creating personalized study plans. Always respond with valid JSON.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: config.temperature,
            max_tokens: config.maxTokens
          })
        });

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      }
      
      // For local AI service
      else if (config.provider === 'local') {
        const response = await fetch(`${config.baseURL}/generate-plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            prompt: prompt,
            model: config.model
          })
        });

        if (!response.ok) {
          throw new Error(`Local AI API error: ${response.status}`);
        }

        const data = await response.json();
        return data.plan;
      }
      
      else {
        throw new Error(`Unsupported AI provider: ${config.provider}`);
      }
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  }

  // Generate study plan using AI
  async function generateStudyPlanWithAI(topic, preferences) {
    const prompt = generateAIPrompt(topic, preferences);
    const plan = await callAIAPI(prompt);
    
    // Validate the plan structure
    if (!plan.duration || !plan.schedule) {
      throw new Error('Invalid plan structure received from AI');
    }
    
    return plan;
  }

  // Render schedule breakdown
  function renderSchedule(schedule) {
    const container = document.getElementById('weeklyBreakdown');
    container.innerHTML = '';

    schedule.forEach((week, weekIndex) => {
      const weekCard = document.createElement('div');
      weekCard.className = 'bg-white/10 rounded-lg p-6 border border-white/20 hover:border-green-500/30 transition-all duration-200 mb-4';
      
      weekCard.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-white">${week.title}</h3>
          <span class="text-green-500 font-medium">${week.days.length} days</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${week.days.map(day => `
            <div class="bg-white/5 rounded-lg p-4 border border-white/10">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-green-400 font-medium">${day.title}</h4>
                <span class="text-gray-400 text-sm">${day.timeRequired} min</span>
              </div>
              <div class="space-y-2">
                <div>
                  <h5 class="text-white text-sm font-medium mb-1">Focus Areas:</h5>
                  <ul class="space-y-1">
                    ${day.topics.slice(0, 2).map(topic => `<li class="text-gray-300 text-xs">• ${topic}</li>`).join('')}
                  </ul>
                </div>
                <div>
                  <h5 class="text-white text-sm font-medium mb-1">Activities:</h5>
                  <ul class="space-y-1">
                    ${day.activities.slice(0, 2).map(activity => `<li class="text-gray-300 text-xs">• ${activity}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      
      container.appendChild(weekCard);
    });
  }

  // Show study plan content
  function showStudyPlan(plan) {
    // Update overview section
    document.getElementById('duration').textContent = plan.duration;
    document.getElementById('difficulty').textContent = plan.difficulty;
    document.getElementById('timePerDay').textContent = plan.timePerDay;
    document.getElementById('overview').textContent = plan.overview;

    // Render schedule
    renderSchedule(plan.schedule);

    // Show content with animation
    preferencesForm.classList.add('hidden');
    loadingState.classList.add('hidden');
    studyPlanContent.classList.remove('hidden');
    
    // Add entrance animation
    const sections = studyPlanContent.querySelectorAll('section');
    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  // Show loading state
  function showLoading() {
    preferencesForm.classList.add('hidden');
    loadingState.classList.remove('hidden');
  }

  // Show error state
  function showError() {
    preferencesForm.classList.add('hidden');
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
  }

  // Generate plan using AI
  async function generatePlan(topic, preferences) {
    try {
      const plan = await generateStudyPlanWithAI(topic, preferences);
      return plan;
    } catch (error) {
      console.error('Error generating plan with AI:', error);
      throw error;
    }
  }

  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get user preferences
    userPreferences = getUserPreferences();
    
    // Validate preferences
    if (!userPreferences.timePerDay) {
      showNotification('Please select a time per day.', 'error');
      return;
    }

    // Check if AI is configured
    const config = getAIConfig();
    if (!config) {
      showNotification('Please configure your AI API in config.js file.', 'error');
      return;
    }
    
    if (config.apiKey.includes('your-') || config.apiKey.includes('api-key-here')) {
      showNotification(`Please configure your ${config.provider} API key in config.js file.`, 'error');
      return;
    }

    // Show loading state
    showLoading();
    
    // Generate plan with AI
    generatePlan(currentTopic, userPreferences)
      .then(plan => {
        generatedPlan = plan;
        showStudyPlan(plan);
      })
      .catch(error => {
        console.error('Error generating plan:', error);
        showNotification('Failed to generate plan. Please check your API key and try again.', 'error');
        showError();
      });
  }

  // Handle start plan button
  function handleStartPlan() {
    showNotification('Redirecting to your learning dashboard...', 'success');
    setTimeout(() => {
      // In a real app, this would redirect to the learning dashboard
      window.location.href = 'dashboard.html';
    }, 1500);
  }

  // Handle customize plan button
  function handleCustomizePlan() {
    // Go back to preferences form
    studyPlanContent.classList.add('hidden');
    preferencesForm.classList.remove('hidden');
    
    // Pre-fill form with current preferences
    if (userPreferences) {
      durationSlider.value = userPreferences.duration;
      durationValue.textContent = `${userPreferences.duration} days`;
      
      document.getElementById('difficulty').value = userPreferences.difficulty;
      
      // Set time per day
      const timePerDayRadio = document.querySelector(`input[name="timePerDay"][value="${userPreferences.timePerDay}"]`);
      if (timePerDayRadio) {
        timePerDayRadio.checked = true;
        timePerDayRadio.closest('label').classList.add('border-green-500', 'bg-green-500/10');
      } else {
        // If the time doesn't match predefined options, set to custom
        customTimeRadio.checked = true;
        customTimeInput.value = userPreferences.timePerDay;
        customTimeInput.disabled = false;
        customTimeInput.closest('div').classList.add('border-green-500', 'bg-green-500/10');
      }
      
      // Set learning styles
      userPreferences.learningStyles.forEach(style => {
        const checkbox = document.querySelector(`input[name="learningStyle"][value="${style}"]`);
        if (checkbox) {
          checkbox.checked = true;
          checkbox.closest('label').classList.add('border-green-500', 'bg-green-500/10');
        }
      });
    }
  }

  // Handle retry button
  function handleRetry() {
    errorState.classList.add('hidden');
    preferencesForm.classList.remove('hidden');
  }

  // Notification system
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
      type === 'error' ? 'bg-red-500 text-white' : 
      type === 'success' ? 'bg-green-500 text-white' : 
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

  // Initialize the page
  function init() {
    loadThemePreference();
    setupFormInteractions();
    
    // Get topic from URL
    currentTopic = getTopicFromURL();
    
    if (!currentTopic) {
      showError();
      return;
    }

    // Update topic display
    topicDisplay.textContent = `Topic: ${currentTopic}`;
    
    // Event listeners
    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
    if (planPreferencesForm) planPreferencesForm.addEventListener('submit', handleFormSubmit);
    if (startPlanBtn) startPlanBtn.addEventListener('click', handleStartPlan);
    if (customizeBtn) customizeBtn.addEventListener('click', handleCustomizePlan);
    if (retryBtn) retryBtn.addEventListener('click', handleRetry);
  }

  // Initialize the app
  init();
});
