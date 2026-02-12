import { useState } from 'react';
import InputPanel from './components/InputPanel';
import ResultsModal from './components/ResultsModal';
import VisualGrid from './components/VisualGrid';
import { Unit, ParameterType, InputValues, ConfigurationResult } from './utils/types';
import { calculateConfigurations } from './utils/calculations';
import './index.css';

type AppState = 'input' | 'results';

function App() {
  const [state, setState] = useState<AppState>('input');
  const [unit, setUnit] = useState<Unit>('inches');
  const [configurations, setConfigurations] = useState<ConfigurationResult[]>([]);
  const [selectedConfiguration, setSelectedConfiguration] = useState<ConfigurationResult | null>(
    null
  );
  const [userInputs, setUserInputs] = useState({
    param1: '',
    value1: '',
    param2: '',
    value2: '',
  });

  const handleCalculate = (selectedParams: ParameterType[], values: InputValues) => {
    // Perform calculations with fixed 16:9 cabinet type
    const calculationInput = {
      selectedParams,
      values,
      unit,
      cabinetType: '16:9',
    };

    const results = calculateConfigurations(calculationInput);
    setConfigurations(results);

    // Store user inputs for display in modal
    const inputs = {
      param1: selectedParams[0],
      value1: values[selectedParams[0]]?.toString() || '',
      param2: selectedParams[1],
      value2: values[selectedParams[1]]?.toString() || '',
    };
    setUserInputs(inputs);

    // Move to results state
    setState('results');
  };

  const handleSelectConfiguration = (config: ConfigurationResult) => {
    setSelectedConfiguration(config);
    setState('input'); // Close modal; visual will show below input
  };

  const handleStartOver = () => {
    setSelectedConfiguration(null);
    setConfigurations([]);
  };

  const handleCloseModal = () => {
    setState('input');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Input Panel - Always visible at top */}
      <InputPanel
        unit={unit}
        onUnitChange={setUnit}
        onCalculate={handleCalculate}
      />

      {/* Results Modal - Overlay when calculations are done */}
      {state === 'results' && (
        <ResultsModal
          isOpen={true}
          onClose={handleCloseModal}
          configurations={configurations}
          unit={unit}
          userInputs={userInputs}
          onSelectConfiguration={handleSelectConfiguration}
        />
      )}

      {/* Visual Grid - Below input when a configuration is selected */}
      {selectedConfiguration && (
        <div className="mt-10">
          <VisualGrid
            configuration={selectedConfiguration}
            unit={unit}
            onStartOver={handleStartOver}
          />
        </div>
      )}
    </div>
  );
}

export default App;
