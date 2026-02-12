import { CABINET_TYPES, ConfigurationResult, CalculationInput } from './types';
import { toMillimeters, fromMillimeters } from './unitConversion';

/**
 * Calculate all possible configurations and return closest lower and upper options
 */
export function calculateConfigurations(input: CalculationInput): ConfigurationResult[] {
  const { selectedParams, values, unit, cabinetType } = input;
  const cabinet = CABINET_TYPES[cabinetType];

  // Convert all inputs to mm
  const heightMm = values.height ? toMillimeters(values.height, unit) : null;
  const widthMm = values.width ? toMillimeters(values.width, unit) : null;
  const diagonalMm = values.diagonal ? toMillimeters(values.diagonal, unit) : null;
  const targetAspectRatio = values.aspectRatio ? parseFloat(values.aspectRatio) : null;

  // Generate all possible configurations
  const configurations: ConfigurationResult[] = [];

  // Determine reasonable range for rows and columns (1 to 50)
  const maxDimension = 50;

  for (let cols = 1; cols <= maxDimension; cols++) {
    for (let rows = 1; rows <= maxDimension; rows++) {
      const configWidthMm = cols * cabinet.width;
      const configHeightMm = rows * cabinet.height;
      const configDiagonalMm = Math.sqrt(configWidthMm ** 2 + configHeightMm ** 2);
      const configAspectRatio = configWidthMm / configHeightMm;

      configurations.push({
        columns: cols,
        rows: rows,
        totalCabinets: cols * rows,
        width: fromMillimeters(configWidthMm, unit),
        height: fromMillimeters(configHeightMm, unit),
        diagonal: fromMillimeters(configDiagonalMm, unit),
        aspectRatio: configAspectRatio,
        cabinetType: cabinetType,
        widthMm: configWidthMm,
        heightMm: configHeightMm,
      });
    }
  }

  // Filter and score configurations based on selected parameters
  const scoredConfigs = configurations.map((config) => {
    let score = 0;
    let errorSum = 0;

    // Score based on selected parameters
    if (selectedParams.includes('height') && heightMm) {
      const error = Math.abs(config.heightMm - heightMm);
      errorSum += error;
    }

    if (selectedParams.includes('width') && widthMm) {
      const error = Math.abs(config.widthMm - widthMm);
      errorSum += error;
    }

    if (selectedParams.includes('diagonal') && diagonalMm) {
      const diagonalError = Math.abs(
        Math.sqrt(config.widthMm ** 2 + config.heightMm ** 2) - diagonalMm
      );
      errorSum += diagonalError;
    }

    if (selectedParams.includes('aspectRatio') && targetAspectRatio) {
      const aspectError = Math.abs(config.aspectRatio - targetAspectRatio) * 1000;
      errorSum += aspectError;
    }

    score = errorSum;
    return { config, score };
  });

  // Sort by score (lower is better)
  scoredConfigs.sort((a, b) => a.score - b.score);

  // Determine the primary dimension to compare for lower/upper separation
  const getPrimaryDimension = (config: ConfigurationResult): number => {
    if (selectedParams.includes('height') && heightMm) {
      return config.heightMm;
    }
    if (selectedParams.includes('width') && widthMm) {
      return config.widthMm;
    }
    if (selectedParams.includes('diagonal') && diagonalMm) {
      return Math.sqrt(config.widthMm ** 2 + config.heightMm ** 2);
    }
    // For aspect ratio only cases, use total area as comparison
    return config.widthMm * config.heightMm;
  };

  const getTargetDimensionValue = (): number => {
    if (selectedParams.includes('height') && heightMm) {
      return heightMm;
    }
    if (selectedParams.includes('width') && widthMm) {
      return widthMm;
    }
    if (selectedParams.includes('diagonal') && diagonalMm) {
      return diagonalMm;
    }
    // For aspect ratio only, use a median area
    return 5000000; // 5 million mm²
  };

  const targetValue = getTargetDimensionValue();

  // Separate into lower (at or below target) and upper (above target) configurations
  const lowerOrEqualConfigs = scoredConfigs.filter(sc =>
    getPrimaryDimension(sc.config) <= targetValue
  );

  const upperConfigs = scoredConfigs.filter(sc =>
    getPrimaryDimension(sc.config) > targetValue
  );

  // Build results: best 2 from lower group + best 2 from upper group
  const results: ConfigurationResult[] = [];

  // Add best matches from lower group (closest to target from below)
  const lowerResults = lowerOrEqualConfigs.slice(0, 2);
  results.push(...lowerResults.map(sc => sc.config));

  // Add best matches from upper group (closest to target from above)
  const upperResults = upperConfigs.slice(0, 2);
  results.push(...upperResults.map(sc => sc.config));

  // If we don't have 4 results, fill with more best matches
  if (results.length < 4) {
    const additionalNeeded = 4 - results.length;
    const remaining = scoredConfigs
      .filter(sc => !results.includes(sc.config))
      .slice(0, additionalNeeded);
    results.push(...remaining.map(sc => sc.config));
  }

  return results;
}

/**
 * Get target value based on primary selected parameter
 */
function getTargetValue(
  selectedParams: string[],
  values: any,
  unit: string
): number | null {
  if (selectedParams.includes('height') && values.height) {
    return toMillimeters(values.height, unit as any);
  }
  if (selectedParams.includes('width') && values.width) {
    return toMillimeters(values.width, unit as any);
  }
  if (selectedParams.includes('diagonal') && values.diagonal) {
    return toMillimeters(values.diagonal, unit as any);
  }
  return null;
}

/**
 * Find exact match or closest match index
 */
function findExactOrClosestMatch(
  scoredConfigs: any[],
  target: number | null,
  selectedParams: string[]
): number {
  if (!target) return 0;

  for (let i = 0; i < scoredConfigs.length; i++) {
    const config = scoredConfigs[i].config;

    if (selectedParams.includes('height') && Math.abs(config.heightMm - target) < 1) {
      return i;
    }
    if (selectedParams.includes('width') && Math.abs(config.widthMm - target) < 1) {
      return i;
    }
  }

  return 0; // Return best match if no exact match
}

/**
 * Calculate implied parameters based on two selected parameters
 */
export function calculateImpliedValues(
  selectedParams: string[],
  values: any,
  unit: string
): any {
  // Aspect Ratio + Height -> calculate Width
  if (
    selectedParams.includes('aspectRatio') &&
    selectedParams.includes('height') &&
    values.aspectRatio &&
    values.height
  ) {
    const aspectRatio = parseFloat(values.aspectRatio);
    const width = values.height * aspectRatio;
    const heightMm = toMillimeters(values.height, unit as any);
    const widthMm = heightMm * aspectRatio;
    const diagonal = fromMillimeters(
      Math.sqrt(widthMm ** 2 + heightMm ** 2),
      unit as any
    );
    return { width, diagonal };
  }

  // Aspect Ratio + Width -> calculate Height
  if (
    selectedParams.includes('aspectRatio') &&
    selectedParams.includes('width') &&
    values.aspectRatio &&
    values.width
  ) {
    const aspectRatio = parseFloat(values.aspectRatio);
    const height = values.width / aspectRatio;
    const widthMm = toMillimeters(values.width, unit as any);
    const heightMm = widthMm / aspectRatio;
    const diagonal = fromMillimeters(
      Math.sqrt(widthMm ** 2 + heightMm ** 2),
      unit as any
    );
    return { height, diagonal };
  }

  // Width + Height -> calculate Aspect Ratio and Diagonal
  if (
    selectedParams.includes('width') &&
    selectedParams.includes('height') &&
    values.width &&
    values.height
  ) {
    const aspectRatio = values.width / values.height;
    const widthMm = toMillimeters(values.width, unit as any);
    const heightMm = toMillimeters(values.height, unit as any);
    const diagonal = fromMillimeters(
      Math.sqrt(widthMm ** 2 + heightMm ** 2),
      unit as any
    );
    return { aspectRatio: aspectRatio.toFixed(2), diagonal };
  }

  // Width + Diagonal -> calculate Height
  if (
    selectedParams.includes('width') &&
    selectedParams.includes('diagonal') &&
    values.width &&
    values.diagonal
  ) {
    const widthMm = toMillimeters(values.width, unit as any);
    const diagonalMm = toMillimeters(values.diagonal, unit as any);
    const heightMm = Math.sqrt(diagonalMm ** 2 - widthMm ** 2);
    const height = fromMillimeters(heightMm, unit as any);
    const aspectRatio = values.width / height;
    return { height, aspectRatio: aspectRatio.toFixed(2) };
  }

  // Height + Diagonal -> calculate Width
  if (
    selectedParams.includes('height') &&
    selectedParams.includes('diagonal') &&
    values.height &&
    values.diagonal
  ) {
    const heightMm = toMillimeters(values.height, unit as any);
    const diagonalMm = toMillimeters(values.diagonal, unit as any);
    const widthMm = Math.sqrt(diagonalMm ** 2 - heightMm ** 2);
    const width = fromMillimeters(widthMm, unit as any);
    const aspectRatio = width / values.height;
    return { width, aspectRatio: aspectRatio.toFixed(2) };
  }

  return {};
}
