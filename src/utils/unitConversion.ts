import { Unit } from './types';

// Conversion factors to millimeters
const CONVERSION_TO_MM: Record<Unit, number> = {
  mm: 1,
  meters: 1000,
  feet: 304.8,
  inches: 25.4,
};

/**
 * Convert from any unit to millimeters
 */
export function toMillimeters(value: number, unit: Unit): number {
  return value * CONVERSION_TO_MM[unit];
}

/**
 * Convert from millimeters to any unit
 */
export function fromMillimeters(valueMm: number, unit: Unit): number {
  return valueMm / CONVERSION_TO_MM[unit];
}

/**
 * Convert from one unit to another
 */
export function convertUnit(value: number, fromUnit: Unit, toUnit: Unit): number {
  const mm = toMillimeters(value, fromUnit);
  return fromMillimeters(mm, toUnit);
}

/**
 * Format number to 2 decimal places
 */
export function formatNumber(value: number): string {
  return value.toFixed(2);
}

/**
 * Get unit display name
 */
export function getUnitDisplay(unit: Unit): string {
  const displays: Record<Unit, string> = {
    mm: 'Millimeters',
    meters: 'Meters',
    feet: 'Feet',
    inches: 'Inches',
  };
  return displays[unit];
}
