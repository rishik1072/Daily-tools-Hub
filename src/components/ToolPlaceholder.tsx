import { Construction } from 'lucide-react';

interface ToolPlaceholderProps {
  title: string;
  description: string;
}

const ToolPlaceholder = ({ title, description }: ToolPlaceholderProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="text-center py-12">
          <Construction className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">Coming Soon</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ToolPlaceholder;