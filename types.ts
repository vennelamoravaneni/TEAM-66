import React from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: Coordinates;
  address: string;
  network_partners: string[];
  specialties: string[];
  tier: 'Premium' | 'Budget';
  tpa_desk_location: string;
  rating: number;
  distance: string; // Mock distance for display
}

export type CoverageStatus = 'CASHLESS' | 'REIMBURSEMENT' | 'UNAVAILABLE';

export interface ProcessedHospital extends Hospital {
  status: CoverageStatus;
}

export interface UserContextType {
  userPolicy: string;
  setUserPolicy: (policy: string) => void;
  requiredSpecialty: string;
  setRequiredSpecialty: (specialty: string) => void;
  selectedHospital: ProcessedHospital | null;
  setSelectedHospital: (hospital: ProcessedHospital | null) => void;
  hoveredHospitalId: string | null;
  setHoveredHospitalId: (id: string | null) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface AIAnalysisResult {
  isCovered: boolean;
  reason: string;
  estimatedOutOfPocket: string;
  confidenceScore: number;
}

export const AppContext = React.createContext<UserContextType | null>(null);