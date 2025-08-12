// AI API Configuration
// Replace the placeholder values with your actual API keys

// Load environment values from a non-committed client env file (env.js)
const ENV = (typeof window !== 'undefined' && window.ENV) ? window.ENV : {};

const AI_CONFIG = {
  // Choose your AI provider by uncommenting one of the following configurations
  
  // Option 1: OpenAI GPT-4
  openai: {
    enabled: false, // Set to true to use OpenAI
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4',
    apiKey: ENV.OPENAI_API_KEY || '', // Provided via env.js
    maxTokens: 2000,
    temperature: 0.7
  },
  
  // Option 2: Anthropic Claude
  anthropic: {
    enabled: false, // Set to true to use Claude
    baseURL: 'https://api.anthropic.com/v1',
    model: 'claude-3-sonnet-20240229',
    apiKey: ENV.ANTHROPIC_API_KEY || '', // Provided via env.js
    maxTokens: 2000,
    temperature: 0.7
  },
  
  // Option 3: Local AI Service (if you have your own AI service)
  local: {
    enabled: false, // Set to true to use local AI service
    baseURL: 'http://localhost:3000/api',
    model: 'local-ai-model',
    apiKey: ENV.LOCAL_AI_API_KEY || '', // Provided via env.js
    maxTokens: 2000,
    temperature: 0.7
  },
  
  // Option 4: Azure OpenAI
  azure: {
    enabled: false, // Set to true to use Azure OpenAI
    baseURL: 'https://your-resource.openai.azure.com/openai/deployments/your-deployment',
    model: 'gpt-4',
    apiKey: ENV.AZURE_OPENAI_API_KEY || '', // Provided via env.js
    maxTokens: 2000,
    temperature: 0.7
  },
  
  // Option 5: Groq (Fast AI API)
  groq: {
    enabled: true, // Set to true to use Groq
    baseURL: 'https://api.groq.com/openai/v1',
    model: 'llama3-8b-8192', // or 'mixtral-8x7b-32768', 'gemma2-9b-it'
    apiKey: ENV.GROQ_API_KEY || '', // Provided via env.js
    maxTokens: 2000,
    temperature: 0.7
  }
};

// Helper function to get the active AI configuration
function getActiveAIConfig() {
  for (const [provider, config] of Object.entries(AI_CONFIG)) {
    if (config.enabled) {
      return { provider, ...config };
    }
  }
  throw new Error('No AI provider is enabled. Please enable one in config.js');
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AI_CONFIG, getActiveAIConfig };
} else {
  window.AI_CONFIG = AI_CONFIG;
  window.getActiveAIConfig = getActiveAIConfig;
}
