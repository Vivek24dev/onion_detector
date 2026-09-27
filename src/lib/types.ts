export type OnionGrade = 'A' | 'B' | 'Reject';
export type SizeCategory = 'Small' | 'Standard' | 'Large';
export type UserRole = 'PROCUREMENT_OFFICER' | 'QUALITY_INSPECTOR' | 'FARMER';

export interface DefectPercentages {
  healthy: number;
  undersized: number;
  damaged: number;
  sprouted: number;
  rotten: number;
  surface_defect?: number;
}

export interface SizePercentages {
  small: number;
  standard: number;
  large: number;
}

export interface BatchResult {
  id: string;
  date: string;
  supplier: string;
  totalOnions: number;
  grade: OnionGrade;
  qualityScore: number;
  confidence: number;
  defects: DefectPercentages;
  sizes: SizePercentages;
  reason: string;
  status: 'Completed' | 'Pending Verification';
  image?: string;
  inspectorApproved?: boolean;
}

