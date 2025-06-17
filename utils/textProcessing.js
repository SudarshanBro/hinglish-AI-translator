// Text Processing Utilities for translation pipeline
class TextProcessor {
  constructor() {
    this.specialElements = {
      numbers: /\d+/g,
      urls: /https?:\/\/[^\s]+/g,
      emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      dates: /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/g
    };
  }

  async preprocess(text) {
    return {
      cleaned: this.cleanText(text),
      specialElements: this.extractSpecialElements(text),
      chunks: this.splitIntoChunks(text)
    };
  }

  async analyzeContext(text) {
    return {
      domain: this.detectDomain(text),
      tone: this.detectTone(text),
      terminology: this.extractTerminology(text),
      requiresContext: this.needsContext(text),
      hasIdioms: this.containsIdioms(text),
      hasCulturalReferences: this.hasCulturalReferences(text),
      isTechnical: this.isTechnicalContent(text)
    };
  }

  async postprocess(translated, context) {
    return {
      text: this.fixCommonIssues(translated),
      formatting: this.restoreFormatting(translated, context)
    };
  }

  cleanText(text) {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?-]/g, '');
  }

  extractSpecialElements(text) {
    const elements = {};
    for (const [type, regex] of Object.entries(this.specialElements)) {
      elements[type] = text.match(regex) || [];
    }
    return elements;
  }

  splitIntoChunks(text) {
    // Split text into sentences or paragraphs
    return text.split(/[.!?]+/).filter(chunk => chunk.trim().length > 0);
  }

  detectDomain(text) {
    // Simple domain detection based on keywords
    const domains = {
      technical: /code|program|software|computer|system/i,
      medical: /patient|doctor|hospital|medicine|treatment/i,
      legal: /law|legal|contract|agreement|court/i,
      financial: /money|bank|finance|investment|stock/i
    };

    for (const [domain, pattern] of Object.entries(domains)) {
      if (pattern.test(text)) return domain;
    }
    return 'general';
  }

  detectTone(text) {
    // Detect formal vs informal tone
    const formalMarkers = /please|kindly|would you|could you|thank you/i;
    const informalMarkers = /hey|hi|thanks|cool|awesome/i;
    
    if (formalMarkers.test(text)) return 'formal';
    if (informalMarkers.test(text)) return 'informal';
    return 'neutral';
  }

  extractTerminology(text) {
    // Extract potential technical terms
    return text.match(/[A-Z][a-z]+(?:[A-Z][a-z]+)+/g) || [];
  }

  needsContext(text) {
    // Check if text needs context for proper translation
    return text.includes('it') || 
           text.includes('this') || 
           text.includes('that') ||
           text.includes('they');
  }

  containsIdioms(text) {
    // Check for common idioms
    const idioms = [
      'piece of cake',
      'break a leg',
      'hit the road',
      'cost an arm and a leg'
    ];
    return idioms.some(idiom => text.toLowerCase().includes(idiom));
  }

  hasCulturalReferences(text) {
    // Check for cultural references
    const culturalTerms = [
      'holiday',
      'festival',
      'tradition',
      'custom',
      'celebration'
    ];
    return culturalTerms.some(term => text.toLowerCase().includes(term));
  }

  isTechnicalContent(text) {
    // Check if content is technical
    const technicalTerms = [
      'algorithm',
      'function',
      'variable',
      'database',
      'server',
      'client',
      'API',
      'protocol'
    ];
    return technicalTerms.some(term => text.toLowerCase().includes(term));
  }

  fixCommonIssues(translated) {
    return translated
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?])/g, '$1')
      .replace(/([.,!?])\s*/g, '$1 ');
  }

  restoreFormatting(translated, context) {
    let result = translated;
    
    // Restore special elements
    for (const [type, elements] of Object.entries(context.specialElements)) {
      elements.forEach(element => {
        result = result.replace(`[${type}]`, element);
      });
    }
    
    return result;
  }
}

export default TextProcessor; 