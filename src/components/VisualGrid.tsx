import React, { useState } from 'react';
import { ConfigurationResult, Unit } from '../utils/types';
import { formatNumber } from '../utils/unitConversion';

interface VisualGridProps {
  configuration: ConfigurationResult;
  unit: Unit;
  onStartOver: () => void;
}

const VisualGrid: React.FC<VisualGridProps> = ({ configuration, onStartOver }) => {
  const [rows, setRows] = useState(configuration.rows);
  const [columns, setColumns] = useState(configuration.columns);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleRowChange = (delta: number) => {
    const newRows = Math.max(1, rows + delta);
    setRows(newRows);

    if (lockAspectRatio) {
      const aspectRatio = configuration.columns / configuration.rows;
      const newColumns = Math.round(newRows * aspectRatio);
      setColumns(Math.max(1, newColumns));
    }
  };

  const handleColumnChange = (delta: number) => {
    const newColumns = Math.max(1, columns + delta);
    setColumns(newColumns);

    if (lockAspectRatio) {
      const aspectRatio = configuration.columns / configuration.rows;
      const newRows = Math.round(newColumns / aspectRatio);
      setRows(Math.max(1, newRows));
    }
  };

  // Calculate current dimensions based on adjusted rows/columns
  const currentWidth = (configuration.widthMm / configuration.columns) * columns;
  const currentHeight = (configuration.heightMm / configuration.rows) * rows;
  const currentWidthDisplay = formatNumber(currentWidth / 25.4); // Convert to inches for display
  const currentHeightDisplay = formatNumber(currentHeight / 25.4);
  const currentDiagonal = Math.sqrt(currentWidth ** 2 + currentHeight ** 2);
  const currentDiagonalDisplay = formatNumber(currentDiagonal / 25.4);

  // Grid cell size calculation for visualization
  const maxGridWidth = 800;
  const cellWidth = Math.min(maxGridWidth / columns, 50);
  const cellHeight = (cellWidth * configuration.heightMm) / configuration.widthMm;
  const gridWidth = cellWidth * columns;
  const gridHeight = cellHeight * rows;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">Your Video Wall Results</h2>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-medium text-gray-700">Lock Aspect Ratio</span>
            <div
              className={`w-12 h-6 rounded-full transition-colors ${lockAspectRatio ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              onClick={() => setLockAspectRatio(!lockAspectRatio)}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${lockAspectRatio ? 'translate-x-6' : 'translate-x-1'
                  } mt-0.5`}
              ></div>
            </div>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowPreview(true)}
            className="px-6 py-2 border-2 border-gray-800 rounded-md text-gray-800 hover:bg-gray-50 font-medium"
          >
            Preview
          </button>
          <button
            onClick={onStartOver}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 font-medium"
          >
            Start Over
          </button>
        </div>
      </div>

      {/* Row Controls - Above Grid */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-md">
          <button
            onClick={() => handleRowChange(-1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50"
          >
            −
          </button>
          <span className="font-medium text-gray-700 min-w-[60px] text-center">Rows</span>
          <button
            onClick={() => handleRowChange(1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Main Grid Visualization */}
      <div className="flex justify-center mb-4" style={{ padding: '60px 80px' }}>
        <div key={`${rows}-${columns}`} className="relative inline-block">
          {/* Width Arrow and Label - Above Grid */}
          <svg
            className="absolute -top-16 left-0 pointer-events-none"
            width={gridWidth}
            height="50"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker
                id="width-arrowhead-left"
                markerWidth="10"
                markerHeight="10"
                refX="1"
                refY="5"
                orient="auto"
              >
                <polygon points="10,0 0,5 10,10" fill="#000000" />
              </marker>
              <marker
                id="width-arrowhead-right"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <polygon points="0,0 10,5 0,10" fill="#000000" />
              </marker>
            </defs>
            {/* Arrow line spanning full width - aligned with grid edges */}
            <line
              x1="0"
              y1="30"
              x2={gridWidth}
              y2="30"
              stroke="#000000"
              strokeWidth="2"
              markerStart="url(#width-arrowhead-left)"
              markerEnd="url(#width-arrowhead-right)"
            />
            {/* Label above arrow */}
            <text
              x={gridWidth / 2}
              y="15"
              fill="#000000"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {currentWidthDisplay} Inches ({columns} columns)
            </text>
          </svg>

          {/* Height Arrow and Label - Left of Grid (arrowheads point UP and DOWN) */}
          <svg
            className="absolute -left-20 top-0 pointer-events-none"
            width="50"
            height={gridHeight}
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Top: triangle tip at top (pointing UP) - orient 0 = no rotation, tip at y=0 */}
              <marker
                id="height-arrowhead-top"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="0"
                orient="0"
              >
                <polygon points="5,0 0,10 10,10" fill="#000000" />
              </marker>
              {/* Bottom: triangle tip at top of marker, orient 180 so it points DOWN at line end */}
              <marker
                id="height-arrowhead-bottom"
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="0"
                orient="180"
              >
                <polygon points="5,0 0,10 10,10" fill="#000000" />
              </marker>
            </defs>
            {/* Arrow line spanning full height */}
            <line
              x1="30"
              y1="0"
              x2="30"
              y2={gridHeight}
              stroke="#000000"
              strokeWidth="2"
              markerStart="url(#height-arrowhead-top)"
              markerEnd="url(#height-arrowhead-bottom)"
            />
            {/* Label above arrow (rotated) */}
            <text
              x="15"
              y={gridHeight / 2}
              fill="#000000"
              fontSize="13"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(-90, 15, ${gridHeight / 2})`}
            >
              {currentHeightDisplay} Inches ({rows} rows)
            </text>
          </svg>

          {/* Grid */}
          <div
            className="border-2 border-gray-800 bg-white relative"
            style={{ width: gridWidth, height: gridHeight }}
          >
            {/* Grid Lines */}
            <svg width={gridWidth} height={gridHeight} className="absolute inset-0">
              {/* Vertical lines */}
              {Array.from({ length: columns - 1 }).map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={(i + 1) * cellWidth}
                  y1={0}
                  x2={(i + 1) * cellWidth}
                  y2={gridHeight}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
              ))}
              {/* Horizontal lines */}
              {Array.from({ length: rows - 1 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={(i + 1) * cellHeight}
                  x2={gridWidth}
                  y2={(i + 1) * cellHeight}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
              ))}
            </svg>

            {/* Diagonal Arrow and Label - Inside Grid */}
            <svg
              width={gridWidth}
              height={gridHeight}
              className="absolute inset-0 pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Bottom-left: arrowhead points toward bottom-left corner (from inside) */}
                <marker
                  id="diagonal-arrowhead-start"
                  markerWidth="10"
                  markerHeight="10"
                  refX="5"
                  refY="5"
                  orient="auto"
                >
                  <polygon points="0,5 10,0 10,10" fill="#000000" />
                </marker>
                {/* Top-right: arrowhead points toward top-right corner (from inside) */}
                <marker
                  id="diagonal-arrowhead-end"
                  markerWidth="10"
                  markerHeight="10"
                  refX="5"
                  refY="5"
                  orient="auto"
                >
                  <polygon points="10,5 0,0 0,10" fill="#000000" />
                </marker>
              </defs>

              {/* Diagonal line inset from corners so arrowheads point toward corners from inside */}
              <line
                x1={16}
                y1={gridHeight - 16}
                x2={gridWidth - 16}
                y2={16}
                stroke="#000000"
                strokeWidth="2"
                markerStart="url(#diagonal-arrowhead-start)"
                markerEnd="url(#diagonal-arrowhead-end)"
              />

              {/* Diagonal Label positioned in the middle, slightly above the line */}
              <text
                x={gridWidth / 2}
                y={gridHeight / 2 - 12}
                fill="#000000"
                fontSize="13"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${-Math.atan2(gridHeight, gridWidth) * (180 / Math.PI)}, ${gridWidth / 2}, ${gridHeight / 2 - 12})`}
                style={{
                  textShadow: '2px 2px 4px rgba(255,255,255,1), -2px -2px 4px rgba(255,255,255,1), 0 0 4px rgba(255,255,255,1)'
                }}
              >
                {currentDiagonalDisplay} Inches
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Column Controls - Below Grid */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-md">
          <button
            onClick={() => handleColumnChange(-1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50"
          >
            −
          </button>
          <span className="font-medium text-gray-700 min-w-[80px] text-center">Columns</span>
          <button
            onClick={() => handleColumnChange(1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Summary Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Cabinets</div>
            <div className="text-2xl font-bold text-gray-800">{rows * columns}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Configuration</div>
            <div className="text-2xl font-bold text-gray-800">
              {columns} × {rows}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Aspect Ratio</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatNumber(columns / rows)}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-8"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white rounded-lg p-12 relative max-w-7xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 z-10"
            >
              ×
            </button>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Grid Preview</h3>

            {/* Container with padding for arrows */}
            <div className="flex justify-center items-center" style={{ padding: '80px' }}>
              {/* Scaled Grid Wrapper */}
              <div className="transform scale-125" style={{ transformOrigin: 'center center' }}>
                <div key={`${rows}-${columns}-preview`} className="relative inline-block">
                  {/* Width Arrow and Label - Above Grid */}
                  <svg
                    className="absolute -top-16 left-0 pointer-events-none"
                    width={gridWidth}
                    height="50"
                    style={{ overflow: 'visible' }}
                  >
                    <defs>
                      <marker
                        id="preview-width-arrowhead-left"
                        markerWidth="10"
                        markerHeight="10"
                        refX="1"
                        refY="5"
                        orient="auto"
                      >
                        <polygon points="10,0 0,5 10,10" fill="#000000" />
                      </marker>
                      <marker
                        id="preview-width-arrowhead-right"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="5"
                        orient="auto"
                      >
                        <polygon points="0,0 10,5 0,10" fill="#000000" />
                      </marker>
                    </defs>
                    {/* Arrow line spanning full width */}
                    <line
                      x1="0"
                      y1="30"
                      x2={gridWidth}
                      y2="30"
                      stroke="#000000"
                      strokeWidth="2"
                      markerStart="url(#preview-width-arrowhead-left)"
                      markerEnd="url(#preview-width-arrowhead-right)"
                    />
                    {/* Label above arrow */}
                    <text
                      x={gridWidth / 2}
                      y="15"
                      fill="#000000"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {currentWidthDisplay} Inches ({columns} columns)
                    </text>
                  </svg>

                  {/* Height Arrow - arrowheads point UP and DOWN */}
                  <svg
                    className="absolute -left-20 top-0 pointer-events-none"
                    width="50"
                    height={gridHeight}
                    style={{ overflow: 'visible' }}
                  >
                    <defs>
                      <marker
                        id="preview-height-arrowhead-top"
                        markerWidth="10"
                        markerHeight="10"
                        refX="5"
                        refY="0"
                        orient="0"
                      >
                        <polygon points="5,0 0,10 10,10" fill="#000000" />
                      </marker>
                      <marker
                        id="preview-height-arrowhead-bottom"
                        markerWidth="10"
                        markerHeight="10"
                        refX="5"
                        refY="0"
                        orient="180"
                      >
                        <polygon points="5,0 0,10 10,10" fill="#000000" />
                      </marker>
                    </defs>
                    <line
                      x1="30"
                      y1="0"
                      x2="30"
                      y2={gridHeight}
                      stroke="#000000"
                      strokeWidth="2"
                      markerStart="url(#preview-height-arrowhead-top)"
                      markerEnd="url(#preview-height-arrowhead-bottom)"
                    />
                    {/* Label above arrow (rotated) */}
                    <text
                      x="15"
                      y={gridHeight / 2}
                      fill="#000000"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(-90, 15, ${gridHeight / 2})`}
                    >
                      {currentHeightDisplay} Inches ({rows} rows)
                    </text>
                  </svg>

                  {/* Grid SVG */}
                  <div className="border-4 border-gray-800">
                    <svg width={gridWidth} height={gridHeight}>
                      {/* Vertical lines */}
                      {Array.from({ length: columns - 1 }).map((_, i) => (
                        <line
                          key={`v-${i}`}
                          x1={(i + 1) * cellWidth}
                          y1={0}
                          x2={(i + 1) * cellWidth}
                          y2={gridHeight}
                          stroke="#d1d5db"
                          strokeWidth="1"
                        />
                      ))}
                      {/* Horizontal lines */}
                      {Array.from({ length: rows - 1 }).map((_, i) => (
                        <line
                          key={`h-${i}`}
                          x1={0}
                          y1={(i + 1) * cellHeight}
                          x2={gridWidth}
                          y2={(i + 1) * cellHeight}
                          stroke="#d1d5db"
                          strokeWidth="1"
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Diagonal Arrow and Label - Inside Grid */}
                  <svg
                    width={gridWidth}
                    height={gridHeight}
                    className="absolute inset-0 pointer-events-none"
                    style={{ overflow: 'visible' }}
                  >
                    <defs>
                      <marker
                        id="preview-diagonal-start"
                        markerWidth="10"
                        markerHeight="10"
                        refX="5"
                        refY="5"
                        orient="auto"
                      >
                        <polygon points="0,5 10,0 10,10" fill="#000000" />
                      </marker>
                      <marker
                        id="preview-diagonal-end"
                        markerWidth="10"
                        markerHeight="10"
                        refX="5"
                        refY="5"
                        orient="auto"
                      >
                        <polygon points="10,5 0,0 0,10" fill="#000000" />
                      </marker>
                    </defs>

                    {/* Diagonal line inset from corners - pointers toward corners from inside */}
                    <line
                      x1={16}
                      y1={gridHeight - 16}
                      x2={gridWidth - 16}
                      y2={16}
                      stroke="#000000"
                      strokeWidth="2"
                      markerStart="url(#preview-diagonal-start)"
                      markerEnd="url(#preview-diagonal-end)"
                    />

                    {/* Diagonal Label positioned in the middle, slightly above the line */}
                    <text
                      x={gridWidth / 2}
                      y={gridHeight / 2 - 12}
                      fill="#000000"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${-Math.atan2(gridHeight, gridWidth) * (180 / Math.PI)}, ${gridWidth / 2}, ${gridHeight / 2 - 12})`}
                      style={{
                        textShadow: '2px 2px 4px rgba(255,255,255,1), -2px -2px 4px rgba(255,255,255,1), 0 0 4px rgba(255,255,255,1)'
                      }}
                    >
                      {currentDiagonalDisplay} Inches
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualGrid;
