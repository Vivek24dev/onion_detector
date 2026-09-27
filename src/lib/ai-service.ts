import { BatchResult } from './types';
import { calculateGrade } from './grading-engine';
import { DEMO_BATCHES } from './demo-data';

export type ValidationStatus = 'VALID' | 'NOT_ONION' | 'POOR_IMAGE' | 'LOW_COUNT';

// Abstract Interface for AI Provider
export interface AIProvider {
  validateImage(imageFile: File | null, metadata?: any): Promise<{ status: ValidationStatus, message: string }>;
  analyzeBatch(imageFile: File | null, metadata?: any): Promise<BatchResult>;
}

// Demo Provider for Prototype
class DemoAIProvider implements AIProvider {
  async validateImage(imageFile: File | null, metadata?: any): Promise<{ status: ValidationStatus, message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const testScenario = metadata?.testScenario;

    if (!imageFile && !testScenario) {
      return { status: 'NOT_ONION', message: 'No onions detected. Please upload a clear image containing an onion batch.' };
    }

    if (testScenario === 'non-onion') {
      return { status: 'NOT_ONION', message: 'No onions detected. Please upload a clear image containing an onion batch.' };
    }
    if (testScenario === 'blurry') {
      return { status: 'POOR_IMAGE', message: 'Image quality insufficient. Reason: Image is too blurry for reliable analysis.' };
    }
    if (testScenario === 'low-count') {
      return { status: 'LOW_COUNT', message: 'Image quality insufficient. Reason: Insufficient onion coverage.' };
    }

    return { status: 'VALID', message: 'Image validated successfully.' };
  }

  async analyzeBatch(imageFile: File | null, metadata?: any): Promise<BatchResult> {
    await new Promise(resolve => setTimeout(resolve, 2500));
    const testScenario = metadata?.testScenario;

    if (DEMO_BATCHES[testScenario]) {
      return DEMO_BATCHES[testScenario];
    }
    
    // In real app, we would process imageFile
    // Since it's a demo, default to good batch if validated
    return DEMO_BATCHES['good-batch'];
  }
}

// Current configured provider
export const AIAnalysisService: AIProvider = new DemoAIProvider();
