// API Service Layer for Tuto Learning Platform
class APIService {
    constructor() {
        this.baseURL = 'https://api.tuto.com/v1'; // Replace with your actual API base URL
        this.aiConfig = getActiveAIConfig();
        this.authToken = localStorage.getItem('authToken');
    }

    // Set authentication token
    setAuthToken(token) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }

    // Get authentication headers
    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        
        return headers;
    }

    // Generic API request method
    async makeRequest(endpoint, options = {}) {
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: this.getAuthHeaders(),
                ...options
            };

            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Study Plans API Methods
    async getAllStudyPlans() {
        return this.makeRequest('/study-plans');
    }

    async getStudyPlanById(planId) {
        return this.makeRequest(`/study-plans/${planId}`);
    }

    async getStudyPlanLessons(planId) {
        return this.makeRequest(`/study-plans/${planId}/lessons`);
    }

    async getLessonContent(planId, lessonId) {
        return this.makeRequest(`/study-plans/${planId}/lessons/${lessonId}`);
    }

    async getUserProgress(planId) {
        return this.makeRequest(`/user/progress/${planId}`);
    }

    async updateLessonProgress(planId, lessonId, completed) {
        return this.makeRequest(`/user/progress/${planId}/lessons/${lessonId}`, {
            method: 'PUT',
            body: JSON.stringify({ completed })
        });
    }

    async getQuizData(planId, lessonId) {
        return this.makeRequest(`/study-plans/${planId}/lessons/${lessonId}/quiz`);
    }

    async submitQuizResults(planId, lessonId, answers) {
        return this.makeRequest(`/study-plans/${planId}/lessons/${lessonId}/quiz/submit`, {
            method: 'POST',
            body: JSON.stringify({ answers })
        });
    }

    // AI Chatbot API Methods
    async sendChatMessage(message, context = {}) {
        const { provider, baseURL, model, apiKey, maxTokens, temperature } = this.aiConfig;
        
        try {
            let response;
            
            switch (provider) {
                case 'openai':
                case 'azure':
                    response = await this.callOpenAICompatibleAPI(baseURL, model, apiKey, message, context, maxTokens, temperature);
                    break;
                    
                case 'anthropic':
                    response = await this.callAnthropicAPI(baseURL, model, apiKey, message, context, maxTokens, temperature);
                    break;
                    
                case 'groq':
                    response = await this.callGroqAPI(baseURL, model, apiKey, message, context, maxTokens, temperature);
                    break;
                    
                case 'local':
                    response = await this.callLocalAIAPI(baseURL, model, apiKey, message, context, maxTokens, temperature);
                    break;
                    
                default:
                    throw new Error(`Unsupported AI provider: ${provider}`);
            }
            
            return response;
        } catch (error) {
            console.error('AI API call failed:', error);
            // Fallback to a more generic response
            return this.generateFallbackResponse(message, context);
        }
    }

    // OpenAI-compatible API (OpenAI, Azure, Groq)
    async callOpenAICompatibleAPI(baseURL, model, apiKey, message, context, maxTokens, temperature) {
        const response = await fetch(`${baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: this.buildSystemPrompt(context)
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: maxTokens,
                temperature: temperature
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Anthropic Claude API
    async callAnthropicAPI(baseURL, model, apiKey, message, context, maxTokens, temperature) {
        const response = await fetch(`${baseURL}/messages`, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                system: this.buildSystemPrompt(context),
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Anthropic API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    // Local AI API
    async callLocalAIAPI(baseURL, model, apiKey, message, context, maxTokens, temperature) {
        const response = await fetch(`${baseURL}/chat`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                message: message,
                context: context,
                max_tokens: maxTokens,
                temperature: temperature
            })
        });

        if (!response.ok) {
            throw new Error(`Local AI API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
    }

    // Build system prompt for AI context
    buildSystemPrompt(context) {
        const { lessonTitle, lessonContent, planTitle, userLevel } = context;
        
        return `You are an AI learning assistant for the Tuto learning platform. You're helping a student with the lesson "${lessonTitle}" from the study plan "${planTitle}".

Context:
- Lesson: ${lessonTitle}
- Study Plan: ${planTitle}
- User Level: ${userLevel || 'Beginner'}

Your role is to:
1. Provide clear, accurate explanations related to the current lesson
2. Give practical examples when helpful
3. Answer questions about programming concepts, syntax, and best practices
4. Help students understand common mistakes and how to avoid them
5. Suggest related topics and practice exercises
6. Keep responses concise but comprehensive
7. Use a friendly, encouraging tone

If the student asks about something not covered in the current lesson, guide them back to relevant topics or suggest they explore related lessons. Always be supportive and educational.`;
    }

    // Fallback response when AI API fails
    generateFallbackResponse(message, context) {
        const { lessonTitle } = context;
        const messageLower = message.toLowerCase();
        
        // Simple keyword-based responses as fallback
        if (messageLower.includes('variable') || messageLower.includes('var') || messageLower.includes('let') || messageLower.includes('const')) {
            return "Variables are containers for storing data values. In JavaScript, you can declare them using 'var', 'let', or 'const'. 'let' and 'const' are block-scoped, while 'var' is function-scoped. 'const' creates read-only references.";
        }
        
        if (messageLower.includes('function') || messageLower.includes('method')) {
            return "Functions are reusable blocks of code. You can define them using the 'function' keyword, arrow functions (=>), or function expressions. They can accept parameters and return values.";
        }
        
        if (messageLower.includes('array') || messageLower.includes('list')) {
            return "Arrays are ordered collections of values. You can access elements by index, add/remove items with methods like push(), pop(), shift(), and unshift(). Arrays are zero-indexed.";
        }
        
        return `I'm here to help you with "${lessonTitle}"! I'm experiencing some technical difficulties right now, but I can still provide basic guidance. Could you try asking your question again or check back in a few minutes?`;
    }

    // User Authentication Methods
    async login(email, password) {
        const response = await this.makeRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.token) {
            this.setAuthToken(response.token);
        }
        
        return response;
    }

    async register(email, password, name) {
        const response = await this.makeRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
        
        if (response.token) {
            this.setAuthToken(response.token);
        }
        
        return response;
    }

    async logout() {
        try {
            await this.makeRequest('/auth/logout', { method: 'POST' });
        } finally {
            this.authToken = null;
            localStorage.removeItem('authToken');
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.authToken;
    }

    // Get current user profile
    async getCurrentUser() {
        return this.makeRequest('/user/profile');
    }
}

// Create global instance
window.apiService = new APIService();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}
