import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Info } from 'lucide-react';
import { ParameterType, InputValues, LockedParameters, Unit } from '../utils/types';
import { convertUnit } from '../utils/unitConversion';
import UnitSelector from './UnitSelector';

interface InputPanelProps {
  unit: Unit;
  onUnitChange: (unit: Unit) => void;
  onCalculate: (selectedParams: ParameterType[], values: InputValues) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  unit,
  onUnitChange,
  onCalculate,
}) => {
  const [values, setValues] = useState<InputValues>({
    aspectRatio: null,
    height: null,
    width: null,
    diagonal: null,
  });

  const [locked, setLocked] = useState<LockedParameters>({
    aspectRatio: false,
    height: false,
    width: false,
    diagonal: false,
  });

  const [previousUnit, setPreviousUnit] = useState<Unit>(unit);

  // Handle unit conversion when unit changes
  useEffect(() => {
    if (previousUnit !== unit) {
      setValues((prev) => ({
        aspectRatio: prev.aspectRatio, // Aspect ratio doesn't change with units
        height: prev.height ? convertUnit(prev.height, previousUnit, unit) : null,
        width: prev.width ? convertUnit(prev.width, previousUnit, unit) : null,
        diagonal: prev.diagonal ? convertUnit(prev.diagonal, previousUnit, unit) : null,
      }));
      setPreviousUnit(unit);
    }
  }, [unit, previousUnit]);

  const getLockedCount = () => {
    return Object.values(locked).filter((l) => l).length;
  };

  const handleLockToggle = (param: ParameterType) => {
    const currentLockedCount = getLockedCount();

    if (locked[param]) {
      // Unlocking
      setLocked({ ...locked, [param]: false });
    } else {
      // Locking
      if (currentLockedCount >= 2) {
        alert('You can only lock 2 parameters at a time. Please unlock one first.');
        return;
      }
      setLocked({ ...locked, [param]: true });
    }
  };

  const handleValueChange = (param: ParameterType, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setValues({ ...values, [param]: numValue });
  };

  const handleApply = (param: ParameterType) => {
    if (!locked[param] && values[param] !== null) {
      const currentLockedCount = getLockedCount();
      if (currentLockedCount >= 2) {
        alert('You can only lock 2 parameters at a time. Please unlock one first.');
        return;
      }
      setLocked({ ...locked, [param]: true });
    }
  };

  const handleCalculate = () => {
    const lockedParams = Object.entries(locked)
      .filter(([_, isLocked]) => isLocked)
      .map(([param, _]) => param as ParameterType);

    if (lockedParams.length !== 2) {
      alert('Please select exactly 2 parameters');
      return;
    }

    // Check if locked parameters have values
    const hasValues = lockedParams.every((param) => values[param] !== null);
    if (!hasValues) {
      alert('Please enter values for the locked parameters');
      return;
    }

    onCalculate(lockedParams, values);
  };

  const aspectRatios = [
    { value: '5.33', label: '48:9 (5.33)' },
    { value: '3.56', label: '32:9 (3.56)' },
    { value: '2.67', label: '24:9 (2.67)' },
    { value: '2.40', label: '2.40:1' },
    { value: '2.35', label: '21:9 (2.35)' },
    { value: '1.78', label: '16:9 (1.78)' },
    { value: '1.60', label: '16:10 (1.60)' },
    { value: '1.33', label: '4:3 (1.33)' },
    { value: '1.00', label: '1:1 (1.00)' },
    { value: '0.889', label: '16:18 (0.89)' },
    { value: '0.5625', label: '9:16 (0.56)' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Size</h1>
        <p className="text-xl text-gray-600 mt-2">Enter at least 2 parameters.</p>
      </div>

      {/* Info Message with Unit Selector */}
      <div className="mb-8 bg-gray-100 p-4 rounded-lg flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            Select a measurement to start
          </p>
        </div>
        <UnitSelector selectedUnit={unit} onUnitChange={onUnitChange} />
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Diagonal Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagonal ({unit})
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              step="0.01"
              value={values.diagonal ?? ''}
              onChange={(e) => handleValueChange('diagonal', e.target.value)}
              disabled={locked.diagonal}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="0.00"
            />
            <button
              onClick={() => handleApply('diagonal')}
              disabled={locked.diagonal || values.diagonal === null}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              apply
            </button>
            <button
              onClick={() => handleLockToggle('diagonal')}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              {locked.diagonal ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Aspect Ratio Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aspect Ratio
          </label>
          <div className="flex gap-2 items-center">
            <select
              value={values.aspectRatio ?? ''}
              onChange={(e) => handleValueChange('aspectRatio', e.target.value)}
              disabled={locked.aspectRatio}
              className="select-enhanced flex-1 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Select Aspect Ratio</option>
              {aspectRatios.map((ar) => (
                <option key={ar.value} value={ar.value}>
                  {ar.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleApply('aspectRatio')}
              disabled={locked.aspectRatio || values.aspectRatio === null}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed invisible"
            >
              apply
            </button>
            <button
              onClick={() => handleLockToggle('aspectRatio')}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              {locked.aspectRatio ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Width Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Width ({unit})
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              step="0.01"
              value={values.width ?? ''}
              onChange={(e) => handleValueChange('width', e.target.value)}
              disabled={locked.width}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="0.00"
            />
            <button
              onClick={() => handleApply('width')}
              disabled={locked.width || values.width === null}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              apply
            </button>
            <button
              onClick={() => handleLockToggle('width')}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              {locked.width ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Height Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height ({unit})
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              step="0.01"
              value={values.height ?? ''}
              onChange={(e) => handleValueChange('height', e.target.value)}
              disabled={locked.height}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              placeholder="0.00"
            />
            <button
              onClick={() => handleApply('height')}
              disabled={locked.height || values.height === null}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              apply
            </button>
            <button
              onClick={() => handleLockToggle('height')}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              {locked.height ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* What to Know Section */}
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center flex-shrink-0">
            ?
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">What to know</h3>
            <p className="text-sm text-gray-600">
              When you enter your values, this tool will design the largest video wall which fits
              into your dimensions. Initially, you can lock 2 parameters and the tool will "fit" a
              Video Wall to your specifications.
            </p>
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCalculate}
          className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={getLockedCount() !== 2}
        >
          Calculate Configurations
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
