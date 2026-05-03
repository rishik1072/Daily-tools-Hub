import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();

    // Simple rule-based responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! How are you doing today?';
    }

    if (message.includes('how are you') || message.includes('how do you do')) {
      return 'I\'m doing well, thank you for asking! I\'m here to help you with various tasks.';
    }

    if (message.includes('time') || message.includes('what time')) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    }

    if (message.includes('date') || message.includes('what day')) {
      return `Today is ${new Date().toLocaleDateString()}.`;
    }

    if (message.includes('weather')) {
      return 'I don\'t have access to real-time weather data, but I hope it\'s nice where you are!';
    }

    if (message.includes('joke') || message.includes('funny')) {
      const jokes = [
        'Why don\'t scientists trust atoms? Because they make up everything!',
        'Why did the scarecrow win an award? Because he was outstanding in his field!',
        'What do you call fake spaghetti? An impasta!',
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    if (message.includes('help') || message.includes('what can you do')) {
      return 'I can help you with basic conversations, tell jokes, provide the current time and date, and answer simple questions. What would you like to know?';
    }

    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you')) {
      return 'Goodbye! It was nice chatting with you. Feel free to come back anytime!';
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    if (message.includes('name')) {
      return 'I\'m your DailyTools Hub assistant. I don\'t have a personal name, but you can call me whatever you like!';
    }

    // Default responses
    const defaultResponses = [
      'That\'s interesting! Can you tell me more?',
      'I\'m not sure I understand. Could you rephrase that?',
      'That\'s a good question! Let me think about it.',
      'I\'m here to help! What else would you like to know?',
      'Hmm, I\'m still learning about that topic. Is there something else I can assist you with?',
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your AI assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border border-border rounded-lg h-[600px] flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h2 className="text-lg font-semibold">AI Chat Assistant</h2>
          </div>
          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-accent"
          >
            Clear Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;