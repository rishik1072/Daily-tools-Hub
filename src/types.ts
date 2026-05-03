export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'pdf' | 'utilities' | 'productivity' | 'ai' | 'file';
  icon: string;
  component: React.ComponentType;
}

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'pdf', name: 'PDF' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'ai', name: 'AI Tools' },
  { id: 'file', name: 'File Tools' },
] as const;