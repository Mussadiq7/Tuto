document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('themeToggle');
  const submitBtn = document.getElementById('submitBtn');
  const topicInput = document.getElementById('topicInput');
  const loadingIndicator = document.getElementById('loadingIndicator');

  // Theme management
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
      // Switch to PNG for dark theme (light colored)
      const svgElement = document.querySelector('.hero-svg img');
      if (svgElement) {
        svgElement.src = 'tuntle.png';
      }
    } else {
      // Switch to light theme
      html.classList.add('light');
      themeToggle.innerHTML = `
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
      `;
      localStorage.setItem('theme', 'light');
      // Switch to SVG for light theme (dark colored)
      const svgElement = document.querySelector('.hero-svg img');
      if (svgElement) {
        svgElement.src = 'tuntle.svg';
      }
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
    // Set SVG for light theme on load (dark colored)
    const svgElement = document.querySelector('.hero-svg img');
    if (svgElement) {
      svgElement.src = 'tuntle.svg';
    }
  } else {
    themeToggle.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
      </svg>
    `;
    // Set PNG for dark theme on load (light colored)
    const svgElement = document.querySelector('.hero-svg img');
    if (svgElement) {
      svgElement.src = 'tuntle.png';
    }
  }
}

  // Simple form submission
  async function handleSubmit() {
    const topic = topicInput.value.trim();

    if (!topic) {
      showNotification('Please enter a topic to get started.', 'error');
      topicInput.focus();
      return;
    }

    if (topic.length < 3) {
      showNotification('Please enter a more specific topic (at least 3 characters).', 'error');
      return;
    }

    // Show loading state
    setLoadingState(true);
    
    try {
      // Simulate API call
      await simulateApiCall(topic);
      
      // Success - redirect to create plan page
      showNotification('Redirecting to create plan...', 'success');
      
      // Redirect to create plan page with topic parameter
      setTimeout(() => {
        window.location.href = `create-plan.html?topic=${encodeURIComponent(topic)}`;
      }, 1000);
      
    } catch (error) {
      showNotification('Something went wrong. Please try again.', 'error');
    } finally {
      setLoadingState(false);
    }
  }

  // Loading state management
  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      topicInput.disabled = true;
      loadingIndicator.classList.remove('hidden');
      submitBtn.classList.add('opacity-50');
    } else {
      submitBtn.disabled = false;
      topicInput.disabled = false;
      loadingIndicator.classList.add('hidden');
      submitBtn.classList.remove('opacity-50');
    }
  }

  // Simulate API call
  function simulateApiCall(topic) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Topic submitted:', topic);
        resolve();
      }, 1500); // 1.5 second delay to show loading
    });
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

  // Input validation and enhancement
  function setupInputEnhancement() {
    // Real-time character count
    topicInput.addEventListener('input', (e) => {
      const value = e.target.value;
      const isValid = value.trim().length >= 3;
      
      // Update button state
      submitBtn.disabled = !isValid;
      
      // Visual feedback
      if (value.trim().length > 0) {
        topicInput.parentElement.classList.add('border-green-500/50');
      } else {
        topicInput.parentElement.classList.remove('border-green-500/50');
      }
    });

    // Enter key support
    topicInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !submitBtn.disabled) {
        handleSubmit();
      }
    });

    // Focus enhancement
    topicInput.addEventListener('focus', () => {
      topicInput.parentElement.classList.add('ring-2', 'ring-green-500/20');
    });

    topicInput.addEventListener('blur', () => {
      topicInput.parentElement.classList.remove('ring-2', 'ring-green-500/20');
    });
  }

  // Keyboard navigation
  function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        topicInput.focus();
      }
      
      // Escape to clear input
      if (e.key === 'Escape' && document.activeElement === topicInput) {
        topicInput.value = '';
        topicInput.blur();
      }
    });
  }

  // Add entrance animations
  function addEntranceAnimations() {
    const elements = document.querySelectorAll('h1, p, .space-y-4');
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // Initialize everything
  function init() {
    loadThemePreference();
    setupInputEnhancement();
    setupKeyboardNavigation();
    addEntranceAnimations();
    
    // Event listeners
    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    
    // Add hover effect to theme toggle
    if (toggleBtn) {
      toggleBtn.classList.add('theme-toggle');
    }
  }

  // Initialize the app
  init();
});
