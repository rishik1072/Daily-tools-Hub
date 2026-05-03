import { useState } from 'react';
import { evaluate } from 'mathjs';
import { Calculator as CalculatorIcon } from 'lucide-react';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        const res = evaluate(expression);
        setResult(res.toString());
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setExpression('');
      setResult('');
    } else {
      setExpression(prev => prev + value);
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
    'C', '(', ')', 'sqrt(',
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CalculatorIcon className="w-5 h-5" />
          Calculator
        </h2>

        <div className="space-y-4">
          <div className="bg-background border border-border rounded p-3">
            <div className="text-right text-sm text-muted-foreground mb-1">
              {expression || '0'}
            </div>
            <div className="text-right text-lg font-mono">
              {result || '0'}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className={`p-3 text-center rounded-lg font-medium ${
                  btn === '='
                    ? 'bg-primary text-primary-foreground'
                    : btn === 'C'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;