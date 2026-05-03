import { useState } from 'react';
import { Type } from 'lucide-react';

const TextTools = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const applyTransformation = (type: string) => {
    switch (type) {
      case 'uppercase':
        setOutputText(inputText.toUpperCase());
        break;
      case 'lowercase':
        setOutputText(inputText.toLowerCase());
        break;
      case 'titlecase':
        setOutputText(
          inputText.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
        );
        break;
      case 'removespaces':
        setOutputText(inputText.replace(/\s+/g, ' ').trim());
        break;
      case 'removelines':
        setOutputText(inputText.replace(/\n+/g, ' ').trim());
        break;
      case 'wordcount':
        const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
        setOutputText(`Words: ${words.length}, Characters: ${inputText.length}`);
        break;
      default:
        setOutputText(inputText);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers or restricted environments
      const textArea = document.createElement('textarea');
      textArea.value = outputText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert('Copied to clipboard!');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('Unable to copy. Please select and copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Type className="w-5 h-5" />
          Text Tools
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Input Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              onClick={() => applyTransformation('uppercase')}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent text-sm"
            >
              Uppercase
            </button>
            <button
              onClick={() => applyTransformation('lowercase')}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent text-sm"
            >
              Lowercase
            </button>
            <button
              onClick={() => applyTransformation('titlecase')}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent text-sm"
            >
              Title Case
            </button>
            <button
              onClick={() => applyTransformation('removespaces')}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent text-sm"
            >
              Remove Spaces
            </button>
            <button
              onClick={() => applyTransformation('removelines')}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent text-sm"
            >
              Remove Lines
            </button>
            <button
              onClick={() => applyTransformation('wordcount')}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent text-sm"
            >
              Word Count
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Output Text
            </label>
            <textarea
              value={outputText}
              readOnly
              className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>

          {outputText && (
            <button
              onClick={copyToClipboard}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Copy to Clipboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextTools;