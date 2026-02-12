import React from 'react';
import { Unit } from '../utils/types';
import { getUnitDisplay } from '../utils/unitConversion';

interface UnitSelectorProps {
  selectedUnit: Unit;
  onUnitChange: (unit: Unit) => void;
}

const UnitSelector: React.FC<UnitSelectorProps> = ({ selectedUnit, onUnitChange }) => {
  const units: Unit[] = ['inches', 'mm', 'meters', 'feet'];

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedUnit}
        onChange={(e) => onUnitChange(e.target.value as Unit)}
        className="select-enhanced px-4 py-2"
      >
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {getUnitDisplay(unit)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UnitSelector;
