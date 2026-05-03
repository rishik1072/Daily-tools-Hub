import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const UnitConverter = () => {
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [category, setCategory] = useState('length');

  const categories = {
    length: {
      units: ['meters', 'feet', 'inches', 'centimeters', 'kilometers', 'miles'],
      conversions: {
        meters: { feet: 3.28084, inches: 39.3701, centimeters: 100, kilometers: 0.001, miles: 0.000621371 },
        feet: { meters: 0.3048, inches: 12, centimeters: 30.48, kilometers: 0.0003048, miles: 0.000189394 },
        inches: { meters: 0.0254, feet: 0.0833333, centimeters: 2.54, kilometers: 0.0000254, miles: 0.0000157828 },
        centimeters: { meters: 0.01, feet: 0.0328084, inches: 0.393701, kilometers: 0.00001, miles: 0.00000621371 },
        kilometers: { meters: 1000, feet: 3280.84, inches: 39370.1, centimeters: 100000, miles: 0.621371 },
        miles: { meters: 1609.34, feet: 5280, inches: 63360, centimeters: 160934, kilometers: 1.60934 },
      },
    },
    weight: {
      units: ['kilograms', 'pounds', 'ounces', 'grams'],
      conversions: {
        kilograms: { pounds: 2.20462, ounces: 35.274, grams: 1000 },
        pounds: { kilograms: 0.453592, ounces: 16, grams: 453.592 },
        ounces: { kilograms: 0.0283495, pounds: 0.0625, grams: 28.3495 },
        grams: { kilograms: 0.001, pounds: 0.00220462, ounces: 0.035274 },
      },
    },
    temperature: {
      units: ['celsius', 'fahrenheit', 'kelvin'],
      conversions: {
        celsius: {
          fahrenheit: (c: number) => c * 9/5 + 32,
          kelvin: (c: number) => c + 273.15,
        },
        fahrenheit: {
          celsius: (f: number) => (f - 32) * 5/9,
          kelvin: (f: number) => (f - 32) * 5/9 + 273.15,
        },
        kelvin: {
          celsius: (k: number) => k - 273.15,
          fahrenheit: (k: number) => (k - 273.15) * 9/5 + 32,
        },
      },
    },
  };

  const convert = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) {
      setToValue('');
      return;
    }

    const cat = categories[category as keyof typeof categories];
    const conversions = cat.conversions[fromUnit as keyof typeof cat.conversions];

    if (category === 'temperature') {
      const convertFunc = conversions[toUnit as keyof typeof conversions];
      if (typeof convertFunc === 'function') {
        setToValue(convertFunc(value).toFixed(2));
      }
    } else if (typeof conversions === 'object' && toUnit in conversions) {
      const factor = conversions[toUnit as keyof typeof conversions];
      setToValue((value * (factor as number)).toFixed(2));
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const cat = categories[newCategory as keyof typeof categories];
    setFromUnit(cat.units[0]);
    setToUnit(cat.units[1]);
    setFromValue('');
    setToValue('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Unit Converter
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || (!isNaN(Number(val)) && !isNaN(parseFloat(val)))) {
                    setFromValue(val);
                    if (val) convert();
                    else setToValue('');
                  }
                }}
                placeholder="Enter value"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
              >
                {categories[category as keyof typeof categories].units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <input
                type="number"
                value={toValue}
                readOnly
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
              >
                {categories[category as keyof typeof categories].units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;