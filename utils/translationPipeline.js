import TranslationStrategies from './translationStrategies';
import TextProcessor from './textProcessing';

// Main Translation Pipeline class
class TranslationPipeline {
  constructor() {
    this.strategies = new TranslationStrategies();
    this.processor = new TextProcessor();
  }

  async process(text, options = {}) {
    try {
      // Step 1: Preprocessing
      const preprocessed = await this.processor.preprocess(text);
      
      // Step 2: Context Analysis
      const context = await this.processor.analyzeContext(text);
      
      // Step 3: Smart Translation
      const translated = await this.strategies.translate(
        preprocessed.cleaned,
        context,
        options
      );
      
      // Step 4: Post-processing
      const final = await this.processor.postprocess(translated, {
        ...context,
        specialElements: preprocessed.specialElements
      });
      
      return {
        translatedText: final.text,
        confidence: this.calculateConfidence(context),
        metadata: {
          domain: context.domain,
          tone: context.tone,
          strategy: this.strategies.selectStrategy(context)
        }
      };
    } catch (error) {
      console.error('Translation pipeline error:', error);
      throw new Error('Translation failed: ' + error.message);
    }
  }

  calculateConfidence(context) {
    // Calculate confidence score based on context analysis
    let score = 100;
    
    if (context.requiresContext) score -= 20;
    if (context.hasIdioms) score -= 15;
    if (context.hasCulturalReferences) score -= 15;
    if (context.isTechnical) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }
}

export default TranslationPipeline;