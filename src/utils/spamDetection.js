import { chatbotConfig } from '../config/chatbot.js';

/**
 * AI-based spam detection using OpenRouter API
 * Analyzes form submission data to determine if it's spam
 */
export class SpamDetector {
  constructor() {
    this.config = chatbotConfig.openRouter;
  }

  /**
   * Detect if form submission is spam using AI
   * @param {Array} responseData - Array of form field data with Field and Value properties
   * @returns {Promise<boolean>} - true if spam, false if not spam
   */
  async detectSpam(responseData) {
    try {
      // Prepare the content for AI analysis
      const content = this.prepareContentForAnalysis(responseData);
      
      // Create the prompt for spam detection
      const prompt = this.createSpamDetectionPrompt(content);
      
      // Call OpenRouter API
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'BIM Form Spam Detection'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a spam detection AI. Analyze form submissions and determine if they are spam. Return only "true" for spam or "false" for legitimate submissions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          stream: this.config.stream
        })
      });

      if (!response.ok) {
        console.error('Spam detection API error:', response.status, response.statusText);
        // Default to false (not spam) if API fails
        return false;
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content?.trim().toLowerCase();
      
      // Parse the AI response
      if (aiResponse === 'true') {
        return true; // Spam detected
      } else if (aiResponse === 'false') {
        return false; // Not spam
      } else {
        // If AI response is unclear, default to false (not spam)
        console.warn('Unclear spam detection response:', aiResponse);
        return false;
      }

    } catch (error) {
      console.error('Spam detection error:', error);
      // Default to false (not spam) if there's an error
      return false;
    }
  }

  /**
   * Prepare form data content for AI analysis
   * @param {Array} responseData - Array of form field data
   * @returns {string} - Formatted content for analysis
   */
  prepareContentForAnalysis(responseData) {
    if (!Array.isArray(responseData)) {
      return '';
    }

    return responseData
      .map(item => `${item.Field || item.field}: ${item.Value || item.value}`)
      .join('\n');
  }

  /**
   * Create the prompt for spam detection
   * @param {string} content - Form content to analyze
   * @returns {string} - Complete prompt for AI
   */
  createSpamDetectionPrompt(content) {
    return `Analyze the following form submission and determine if it's spam:

Form Content:
${content}

Spam indicators to look for:
- Gibberish or random characters
- Excessive use of keywords or promotional content
- Suspicious email patterns or fake information
- Inappropriate or offensive content
- Automated bot-like responses

Return only "true" if this appears to be spam, or "false" if it appears to be a legitimate form submission.`;
  }
}

// Export a singleton instance
export const spamDetector = new SpamDetector();
