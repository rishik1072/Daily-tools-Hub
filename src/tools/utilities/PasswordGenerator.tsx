import { useState } from 'react';
import { Lock, Copy } from 'lucide-react';

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset.length === 0) return;

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      alert('Password copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers or restricted environments
      const textArea = document.createElement('textarea');
      textArea.value = password;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Password copied to clipboard!');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('Unable to copy password. Please select and copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Password Generator
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Password Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              <span className="text-sm">Uppercase letters (A-Z)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              <span className="text-sm">Lowercase letters (a-z)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              <span className="text-sm">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              <span className="text-sm">Symbols (!@#$%^&*)</span>
            </label>
          </div>

          <button
            onClick={generatePassword}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Generate Password
          </button>

          {password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background font-mono text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-secondary text-secondary-foreground rounded hover:bg-accent"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;