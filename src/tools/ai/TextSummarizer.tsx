import { useState } from 'react';
import { FileText } from 'lucide-react';

const TextSummarizer = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');

  const summarizeText = () => {
    if (!inputText.trim()) return;

    // Simple summarization: take first sentence and key phrases
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const firstSentence = sentences[0]?.trim();
    const wordCount = inputText.split(/\s+/).length;

    let summaryText = '';
    if (firstSentence) {
      summaryText = firstSentence + '. ';
    }

    if (wordCount > 50) {
      summaryText += `This ${wordCount}-word text discusses various topics.`;
    } else {
      summaryText += 'This is a brief text.';
    }

    setSummary(summaryText);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Text Summarizer
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Input Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here to summarize..."
              className="w-full h-32 px-3 py-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>

          <button
            onClick={summarizeText}
            disabled={!inputText.trim()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            Summarize Text
          </button>

          {summary && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Summary
              </label>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm">{summary}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextSummarizer;