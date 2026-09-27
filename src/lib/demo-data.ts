import { BatchResult } from './types';

export const DEMO_BATCHES: Record<string, BatchResult> = {
  'good-batch': {
    id: 'ON-24090',
    date: new Date().toISOString(),
    supplier: 'Ramesh Farmer Co.',
    totalOnions: 20,
    grade: 'A',
    qualityScore: 92,
    confidence: 96,
    defects: {
      healthy: 90,
      undersized: 5,
      damaged: 5,
      sprouted: 0,
      rotten: 0,
    },
    sizes: {
      small: 5,
      standard: 80,
      large: 15,
    },
    reason: 'Batch classified as Grade A because the healthy percentage is very high and there are no critical defects.',
    status: 'Completed',
  },
  'mixed-batch': {
    id: 'ON-24091',
    date: new Date().toISOString(),
    supplier: 'Suresh Farms',
    totalOnions: 20,
    grade: 'B',
    qualityScore: 78,
    confidence: 91,
    defects: {
      healthy: 70,
      undersized: 15,
      damaged: 10,
      sprouted: 0,
      rotten: 5,
    },
    sizes: {
      small: 25,
      standard: 60,
      large: 15,
    },
    reason: 'Batch classified as Grade B because the detected defect and undersized percentages exceed the Grade A threshold.',
    status: 'Completed',
  },
  'poor-batch': {
    id: 'ON-24092',
    date: new Date().toISOString(),
    supplier: 'Kisan Organics',
    totalOnions: 20,
    grade: 'Reject',
    qualityScore: 45,
    confidence: 89,
    defects: {
      healthy: 40,
      undersized: 10,
      damaged: 20,
      sprouted: 15,
      rotten: 15,
    },
    sizes: {
      small: 40,
      standard: 50,
      large: 10,
    },
    reason: 'Batch rejected due to a high percentage of critical defects (rotten/sprouted) and overall low healthy percentage.',
    status: 'Completed',
  },
  'low-confidence': {
    id: 'ON-24093',
    date: new Date().toISOString(),
    supplier: 'Unknown Supplier',
    totalOnions: 20,
    grade: 'B',
    qualityScore: 68,
    confidence: 65, // Below 80 threshold -> Manual verification needed
    defects: {
      healthy: 60,
      undersized: 20,
      damaged: 10,
      sprouted: 5,
      rotten: 5,
    },
    sizes: {
      small: 30,
      standard: 60,
      large: 10,
    },
    reason: 'AI classification generated with low confidence. Manual verification by an inspector is required.',
    status: 'Pending Verification',
  },
};

export const RECENT_INSPECTIONS = [
  DEMO_BATCHES['good-batch'],
  DEMO_BATCHES['mixed-batch'],
  DEMO_BATCHES['poor-batch'],
  DEMO_BATCHES['low-confidence'],
];
