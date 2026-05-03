import { useState } from 'react';
import { Mail, Copy, RefreshCw, Send } from 'lucide-react';

type EmailTone = 'professional' | 'friendly' | 'formal' | 'casual' | 'urgent';

interface EmailTemplate {
  subject: string;
  body: string;
}

const EmailWriter = () => {
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [tone, setTone] = useState<EmailTone>('professional');
  const [generatedEmail, setGeneratedEmail] = useState<EmailTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmail = () => {
    if (!recipient.trim() || !purpose.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const email = generateEmailContent(recipient, purpose, keyPoints, tone);
      setGeneratedEmail(email);
      setIsGenerating(false);
    }, 1500);
  };

  const generateEmailContent = (
    recipient: string,
    purpose: string,
    keyPoints: string,
    tone: EmailTone
  ): EmailTemplate => {
    const points = keyPoints.split('\n').filter(point => point.trim());

    let subject = '';
    let greeting = '';
    let body = '';
    let closing = '';

    // Generate subject based on purpose
    const purposeLower = purpose.toLowerCase();
    if (purposeLower.includes('meeting') || purposeLower.includes('schedule')) {
      subject = `Request for Meeting: ${purpose}`;
    } else if (purposeLower.includes('update') || purposeLower.includes('status')) {
      subject = `Update: ${purpose}`;
    } else if (purposeLower.includes('follow') || purposeLower.includes('check')) {
      subject = `Following Up: ${purpose}`;
    } else if (purposeLower.includes('thank')) {
      subject = `Thank You: ${purpose}`;
    } else {
      subject = purpose.length > 50 ? purpose.substring(0, 47) + '...' : purpose;
    }

    // Generate greeting based on tone
    switch (tone) {
      case 'formal':
        greeting = `Dear ${recipient},`;
        break;
      case 'professional':
        greeting = `Dear ${recipient},`;
        break;
      case 'friendly':
        greeting = `Hi ${recipient},`;
        break;
      case 'casual':
        greeting = `Hey ${recipient},`;
        break;
      case 'urgent':
        greeting = `Dear ${recipient},`;
        break;
    }

    // Generate body based on purpose and tone
    if (purposeLower.includes('meeting') || purposeLower.includes('schedule')) {
      switch (tone) {
        case 'formal':
          body = `I am writing to request a meeting to discuss ${purpose.toLowerCase()}.`;
          break;
        case 'professional':
          body = `I would like to schedule a meeting to discuss ${purpose.toLowerCase()}.`;
          break;
        case 'friendly':
          body = `I'd love to set up a time to chat about ${purpose.toLowerCase()}.`;
          break;
        case 'casual':
          body = `Let's grab some time to talk about ${purpose.toLowerCase()}.`;
          break;
        case 'urgent':
          body = `I need to schedule an urgent meeting regarding ${purpose.toLowerCase()}.`;
          break;
      }
    } else if (purposeLower.includes('update') || purposeLower.includes('status')) {
      switch (tone) {
        case 'formal':
          body = `I am writing to provide an update on ${purpose.toLowerCase()}.`;
          break;
        case 'professional':
          body = `I wanted to provide you with an update on ${purpose.toLowerCase()}.`;
          break;
        case 'friendly':
          body = `Just wanted to give you a quick update on ${purpose.toLowerCase()}.`;
          break;
        case 'casual':
          body = `Here's what's going on with ${purpose.toLowerCase()}.`;
          break;
        case 'urgent':
          body = `Urgent update regarding ${purpose.toLowerCase()}.`;
          break;
      }
    } else {
      // Generic purpose
      switch (tone) {
        case 'formal':
          body = `I am writing regarding ${purpose.toLowerCase()}.`;
          break;
        case 'professional':
          body = `I am reaching out regarding ${purpose.toLowerCase()}.`;
          break;
        case 'friendly':
          body = `I wanted to touch base about ${purpose.toLowerCase()}.`;
          break;
        case 'casual':
          body = `Just wanted to talk about ${purpose.toLowerCase()}.`;
          break;
        case 'urgent':
          body = `This is urgent - regarding ${purpose.toLowerCase()}.`;
          break;
      }
    }

    // Add key points if provided
    if (points.length > 0) {
      body += '\n\n';
      switch (tone) {
        case 'formal':
          body += 'The key points I would like to discuss are:\n';
          break;
        case 'professional':
          body += 'Here are the key points:\n';
          break;
        case 'friendly':
          body += 'Here are the main things I wanted to cover:\n';
          break;
        case 'casual':
          body += 'The main points are:\n';
          break;
        case 'urgent':
          body += 'Key points that need immediate attention:\n';
          break;
      }

      points.forEach((point, index) => {
        body += `${index + 1}. ${point.trim()}\n`;
      });
    }

    // Add call to action based on purpose
    if (purposeLower.includes('meeting') || purposeLower.includes('schedule')) {
      switch (tone) {
        case 'formal':
          body += '\n\nPlease let me know your availability for a meeting.';
          break;
        case 'professional':
          body += '\n\nPlease let me know when would be convenient for you.';
          break;
        case 'friendly':
          body += '\n\nLet me know when works best for you!';
          break;
        case 'casual':
          body += '\n\nWhen are you free to chat?';
          break;
        case 'urgent':
          body += '\n\nPlease respond immediately with your availability.';
          break;
      }
    } else {
      switch (tone) {
        case 'formal':
          body += '\n\nI would appreciate your response at your earliest convenience.';
          break;
        case 'professional':
          body += '\n\nPlease let me know if you have any questions.';
          break;
        case 'friendly':
          body += '\n\nLet me know your thoughts!';
          break;
        case 'casual':
          body += '\n\nWhat do you think?';
          break;
        case 'urgent':
          body += '\n\nPlease respond as soon as possible.';
          break;
      }
    }

    // Generate closing based on tone
    switch (tone) {
      case 'formal':
        closing = '\n\nBest regards,\n[Your Name]';
        break;
      case 'professional':
        closing = '\n\nBest regards,\n[Your Name]';
        break;
      case 'friendly':
        closing = '\n\nBest,\n[Your Name]';
        break;
      case 'casual':
        closing = '\n\nCheers,\n[Your Name]';
        break;
      case 'urgent':
        closing = '\n\nUrgently,\n[Your Name]';
        break;
    }

    return {
      subject,
      body: `${greeting}\n\n${body}${closing}`,
    };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers or restricted environments
      const textArea = document.createElement('textarea');
      textArea.value = text;
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

  const regenerateEmail = () => {
    generateEmail();
  };

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Business-appropriate, balanced tone' },
    { value: 'formal', label: 'Formal', description: 'Very polite, structured language' },
    { value: 'friendly', label: 'Friendly', description: 'Warm, approachable tone' },
    { value: 'casual', label: 'Casual', description: 'Relaxed, informal language' },
    { value: 'urgent', label: 'Urgent', description: 'Emphasizes importance and immediacy' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="w-5 h-5" />
          <h2 className="text-lg font-semibold">AI Email Writer</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g., John Smith, Team, Client Name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Schedule a meeting, Provide project update"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Key Points (optional)</label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Enter key points, one per line..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <div className="space-y-2">
                {toneOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={tone === option.value}
                      onChange={(e) => setTone(e.target.value as EmailTone)}
                      className="text-primary"
                    />
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generateEmail}
              disabled={!recipient.trim() || !purpose.trim() || isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate Email
                </>
              )}
            </button>
          </div>

          {/* Generated Email */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Generated Email</h3>
              {generatedEmail && (
                <div className="flex gap-2">
                  <button
                    onClick={regenerateEmail}
                    className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-accent"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
              )}
            </div>

            {generatedEmail ? (
              <div className="border border-border rounded-lg">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Subject:</span>
                    <button
                      onClick={() => copyToClipboard(generatedEmail.subject)}
                      className="p-1 hover:bg-secondary rounded"
                      title="Copy subject"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-sm bg-secondary/50 p-2 rounded">
                    {generatedEmail.subject}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Body:</span>
                    <button
                      onClick={() => copyToClipboard(generatedEmail.body)}
                      className="p-1 hover:bg-secondary rounded"
                      title="Copy body"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-sm bg-secondary/50 p-3 rounded whitespace-pre-wrap font-mono">
                    {generatedEmail.body}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-8 text-center text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Fill in the details and click "Generate Email" to create your email</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">💡 Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Be specific about the purpose to get better results</li>
            <li>• Add key points to include important details in the email</li>
            <li>• Choose the appropriate tone for your recipient and situation</li>
            <li>• Review and personalize the generated email before sending</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailWriter;