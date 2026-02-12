import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { ConfigurationResult, Unit } from '../utils/types';
import { formatNumber } from '../utils/unitConversion';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  configurations: ConfigurationResult[];
  unit: Unit;
  userInputs: {
    param1: string;
    value1: string;
    param2: string;
    value2: string;
  };
  onSelectConfiguration: (config: ConfigurationResult) => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  configurations,
  unit,
  userInputs,
  onSelectConfiguration,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Select a Size</h2>
            <p className="text-gray-600 mt-1">
              The following size options are the closest available to your entered dimensions.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-800 rounded-md hover:bg-yellow-500 font-medium"
            >
              <HelpCircle className="w-5 h-5" />
              Help me choose
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Configurations - Table: Dimensions column on left, one value column per size (no lines) */}
        <div className="p-6">
          <div className="rounded-lg">
            {/* Table header row: size options */}
            <div className="grid gap-4 pr-4" style={{ gridTemplateColumns: 'minmax(140px, auto) repeat(4, 1fr)' }}>
              <div className="py-3 pl-4 font-semibold text-gray-800">Dimensions</div>
              {configurations.map((config, index) => (
                <div key={index} className="py-3 text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {config.columns}×{config.rows}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    {config.cabinetType} Cabinet System
                  </div>
                  {index === 0 && (
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
                        Nearest Size
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Width row - light grey */}
            <div className="grid gap-4 pt-2 bg-gray-100 rounded-t" style={{ gridTemplateColumns: 'minmax(140px, auto) repeat(4, 1fr)' }}>
              <div className="py-3 pl-4 text-sm text-gray-600 font-medium">Width</div>
              {configurations.map((config, i) => (
                <div key={i} className="py-3 pl-4 font-semibold text-gray-800">
                  {formatNumber(config.width)} {unit}
                </div>
              ))}
            </div>

            {/* Height row - white */}
            <div className="grid gap-4 bg-white" style={{ gridTemplateColumns: 'minmax(140px, auto) repeat(4, 1fr)' }}>
              <div className="py-3 pl-4 text-sm text-gray-600 font-medium">Height</div>
              {configurations.map((config, i) => (
                <div key={i} className="py-3 pl-4 font-semibold text-gray-800">
                  {formatNumber(config.height)} {unit}
                </div>
              ))}
            </div>

            {/* Your Height Entry row - white */}
            <div className="grid gap-4 bg-white" style={{ gridTemplateColumns: 'minmax(140px, auto) repeat(4, 1fr)' }}>
              <div className="py-2 pl-4 text-xs text-gray-500 font-medium">Your Height Entry</div>
              {configurations.map((_, i) => (
                <div key={i} className="py-2 pl-4 text-xs text-gray-500">
                  {userInputs.param1 === 'height' || userInputs.param2 === 'height'
                    ? `${userInputs.param1 === 'height' ? userInputs.value1 : userInputs.value2} ${unit}`
                    : '-'}
                </div>
              ))}
            </div>

            {/* Diagonal row - light grey */}
            <div className="grid gap-4 bg-gray-100" style={{ gridTemplateColumns: 'minmax(140px, auto) repeat(4, 1fr)' }}>
              <div className="py-3 pl-4 text-sm text-gray-600 font-medium">Diagonal</div>
              {configurations.map((config, i) => (
                <div key={i} className="py-3 pl-4 font-semibold text-gray-800">
                  {formatNumber(config.diagonal)} {unit}
                </div>
              ))}
            </div>

            {/* Aspect Ratio row - white */}
            <div className="grid gap-4 bg-white" style={{ gridTemplateColumns: 'minmax(140px, auto) repeat(4, 1fr)' }}>
              <div className="py-3 pl-4 text-sm text-gray-600 font-medium">Aspect Ratio</div>
              {configurations.map((config, i) => (
                <div key={i} className="py-3 pl-4 font-semibold text-gray-800">
                  {config.columns}:{config.rows} ({formatNumber(config.aspectRatio)})
                </div>
              ))}
            </div>

            {/* Your Aspect Ratio Entry row - white */}
            <div className="grid gap-4 bg-white" style={{ gridTemplateColumns: 'minmax(140px, auto) repeat(4, 1fr)' }}>
              <div className="py-2 pl-4 text-xs text-gray-500 font-medium">Your Aspect Ratio Entry</div>
              {configurations.map((_, i) => (
                <div key={i} className="py-2 pl-4 text-xs text-gray-500">
                  {userInputs.param1 === 'aspectRatio' || userInputs.param2 === 'aspectRatio'
                    ? `${userInputs.param1 === 'aspectRatio' ? userInputs.value1 : userInputs.value2}`
                    : '-'}
                </div>
              ))}
            </div>

            {/* Select row */}
            <div className="grid gap-4 pt-4 bg-white rounded-b" style={{ gridTemplateColumns: 'minmax(140px, auto) repeat(4, 1fr)' }}>
              <div className="py-3 pl-4" />
              {configurations.map((config, i) => (
                <div key={i} className="py-3 pl-4">
                  <button
                    onClick={() => onSelectConfiguration(config)}
                    className="w-full flex items-center justify-between px-4 py-2.5 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <span className="font-medium text-sm">Select</span>
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-full flex-shrink-0" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 font-medium"
              disabled
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;
