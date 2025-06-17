// Translation Strategies for different types of content
class TranslationStrategies {
  constructor() {
    this.strategies = {
      direct: this.directTranslation,
      contextual: this.contextualTranslation,
      idiomatic: this.idiomaticTranslation,
      technical: this.technicalTranslation,
      cultural: this.culturalTranslation
    };
  }

  async translate(text, context, options) {
    const strategy = this.selectStrategy(context);
    return await this.strategies[strategy](text, context, options);
  }

  selectStrategy(context) {
    if (context.isTechnical) return 'technical';
    if (context.hasIdioms) return 'idiomatic';
    if (context.hasCulturalReferences) return 'cultural';
    if (context.requiresContext) return 'contextual';
    return 'direct';
  }

  async directTranslation(text, context, options) {
    // Simple direct translation for straightforward text
    const prompt = this.buildPrompt(text, 'direct', options);
    return await this.callTranslationAPI(prompt);
  }

  async contextualTranslation(text, context, options) {
    // Translation that considers surrounding context
    const prompt = this.buildPrompt(text, 'contextual', options, context);
    return await this.callTranslationAPI(prompt);
  }

  async idiomaticTranslation(text, context, options) {
    // Special handling for idioms and expressions
    const prompt = this.buildPrompt(text, 'idiomatic', options);
    return await this.callTranslationAPI(prompt);
  }

  async technicalTranslation(text, context, options) {
    // Domain-specific technical translation
    const prompt = this.buildPrompt(text, 'technical', options, context);
    return await this.callTranslationAPI(prompt);
  }

  async culturalTranslation(text, context, options) {
    // Translation with cultural context consideration
    const prompt = this.buildPrompt(text, 'cultural', options, context);
    return await this.callTranslationAPI(prompt);
  }

  buildPrompt(text, strategy, options, context = {}) {
    const basePrompt = {
      direct: "Translate this text directly to Hinglish:",
      contextual: "Translate this text to Hinglish considering the context:",
      idiomatic: "Translate this idiomatic expression to natural Hinglish:",
      technical: "Translate this technical text to Hinglish while maintaining technical accuracy:",
      cultural: "Translate this text to Hinglish while preserving cultural nuances:"
    };

    let prompt = basePrompt[strategy];
    
    if (context.surroundingText) {
      prompt += `\nContext: ${context.surroundingText}`;
    }
    
    if (options.style) {
      prompt += `\nStyle: ${options.style}`;
    }
    
    if (options.level) {
      prompt += `\nLanguage Level: ${options.level}`;
    }

    prompt += `\nText: ${text}`;
    
    return prompt;
  }

  async callTranslationAPI(prompt) {
    // Implementation will use the existing Groq API call
    // This will be integrated with the current API implementation
    return await translateWithGroq(prompt);
  }
}

export default TranslationStrategies; 