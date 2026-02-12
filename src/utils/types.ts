// Cabinet Types
export interface CabinetType {
  name: string;
  width: number; // in mm
  height: number; // in mm
  aspectRatio: number;
}

export const CABINET_TYPES: Record<string, CabinetType> = {
  '16:9': {
    name: '16:9',
    width: 600,
    height: 337.5,
    aspectRatio: 16 / 9,
  },
  '1:1': {
    name: '1:1',
    width: 500,
    height: 500,
    aspectRatio: 1.0,
  },
};

// Unit Types
export type Unit = 'mm' | 'meters' | 'feet' | 'inches';

// Input Parameter Types
export type ParameterType = 'aspectRatio' | 'height' | 'width' | 'diagonal';

export interface InputValues {
  aspectRatio: string | null;
  height: number | null;
  width: number | null;
  diagonal: number | null;
}

export interface LockedParameters {
  aspectRatio: boolean;
  height: boolean;
  width: boolean;
  diagonal: boolean;
}

// Configuration Result
export interface ConfigurationResult {
  columns: number;
  rows: number;
  totalCabinets: number;
  width: number; // in current unit
  height: number; // in current unit
  diagonal: number; // in current unit
  aspectRatio: number;
  cabinetType: string;
  widthMm: number; // in mm for internal calculations
  heightMm: number; // in mm for internal calculations
}

// Calculation Input
export interface CalculationInput {
  selectedParams: ParameterType[];
  values: InputValues;
  unit: Unit;
  cabinetType: string;
}
