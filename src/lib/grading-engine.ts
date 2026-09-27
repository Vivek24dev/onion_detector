import { DefectPercentages, OnionGrade } from './types';

export function calculateGrade(defects: DefectPercentages): { grade: OnionGrade, reason: string, score: number } {
  const healthy = defects.healthy;
  const criticalDefects = defects.rotten + defects.sprouted;
  const minorDefects = defects.undersized + defects.damaged + (defects.surface_defect || 0);
  
  // A simple weighted score: healthy is 100%, critical defects penalize heavily
  const score = Math.max(0, Math.round(healthy - criticalDefects * 2 - minorDefects * 0.5));

  if (healthy >= 85 && criticalDefects === 0) {
    return {
      grade: 'A',
      score,
      reason: 'Batch classified as Grade A because the healthy percentage is very high and there are no critical defects.'
    };
  }

  if (criticalDefects > 15 || healthy < 50) {
    return {
      grade: 'Reject',
      score,
      reason: 'Batch rejected due to a high percentage of critical defects (rotten/sprouted) or low healthy percentage.'
    };
  }

  return {
    grade: 'B',
    score,
    reason: 'Batch classified as Grade B because the detected defect percentages exceed the Grade A threshold but are acceptable for procurement.'
  };
}
