# Video Wall Size Calculator

A professional video wall configuration calculator built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

- **Cabinet Type Selection**: Choose between 16:9 (600×337.5mm) or 1:1 (500×500mm) cabinets
- **Dual Parameter Input**: Lock exactly 2 parameters at a time (Aspect Ratio, Height, Width, Diagonal)
- **Unit Conversion**: Support for mm, meters, feet, and inches with real-time conversion
- **Smart Calculations**: 
  - Finds closest lower and upper cabinet configurations
  - Handles exact matches properly
  - Optimizes for both dimension and aspect ratio accuracy
- **Visual Grid Display**: Interactive cabinet grid with adjustable rows/columns
- **Professional UI**: Clean, intuitive interface matching industry standards

## 🏗️ Project Structure

```
video-wall-calculator/
├── src/
│   ├── components/
│   │   ├── InputPanel.tsx       # Main input dashboard
│   │   ├── ResultsModal.tsx     # Configuration selection modal
│   │   ├── VisualGrid.tsx       # Visual cabinet grid display
│   │   └── UnitSelector.tsx     # Unit conversion selector
│   ├── utils/
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── unitConversion.ts    # Unit conversion logic
│   │   └── calculations.ts      # Core calculation algorithms
│   ├── App.tsx                  # Main app orchestrator
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## 🧮 Calculation Logic

### How It Works

1. **Input Validation**: System ensures exactly 2 parameters are locked
2. **Unit Normalization**: All inputs converted to millimeters for calculation
3. **Configuration Generation**: Creates all possible cabinet combinations (1-50 rows/cols)
4. **Scoring Algorithm**: 
   - Calculates error for each dimension (height, width, diagonal)
   - Adds weighted aspect ratio error
   - Sorts by total error (lower = better match)
5. **Result Selection**: Returns top 4 best-matching configurations

### Valid Parameter Combinations

- Aspect Ratio + Height
- Aspect Ratio + Width  
- Height + Width
- Height + Diagonal
- Width + Diagonal

### Edge Cases Handled

- No exact aspect ratio possible (especially with 1:1 cabinets)
- Very small/large sizes (clamped to 1-50 cabinets per dimension)
- Decimal precision (2 decimal places)
- Unit switching after calculations (auto-converts displayed values)

## 🎨 Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📝 Usage Flow

1. **Select Cabinet Type** (16:9 or 1:1)
2. **Choose Unit** (mm, meters, feet, inches)
3. **Lock 2 Parameters** (click lock icons or "apply" buttons)
4. **Enter Values** for locked parameters
5. **Click "Calculate Configurations"**
6. **Review Options** in modal (shows 4 best matches)
7. **Select Configuration** 
8. **View Visual Grid** with exact dimensions
9. **Adjust if needed** using +/- controls
10. **Start Over** to create new configuration

## 🔧 Development Notes

### Testing Scenarios

1. **Test Case 1**: 16:9 cabinet, Aspect Ratio (16:9) + Height (100 inches)
2. **Test Case 2**: 1:1 cabinet, Width (200 inches) + Diagonal (300 inches)
3. **Test Case 3**: 16:9 cabinet, Height (50 inches) + Width (89 inches)
4. **Test Case 4**: Unit switching mid-calculation

## 🐛 Known Limitations

- Maximum 50 cabinets per dimension (performance optimization)
- Aspect ratio with 1:1 cabinets may not match perfectly
- Diagonal calculations use Pythagorean theorem (assumes rectangular grid)

