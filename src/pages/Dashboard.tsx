import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, History, FileText, Calculator, ArrowRightLeft, QrCode, Type, Lock, StickyNote, CheckSquare, Calendar, Target, Timer, Bot, User, Mail, MessageCircle, Code, Archive, Image, Shuffle, Scan } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAppStore } from '../store/store';
import { tools, categories } from '../tools';
import { Tool } from '../types';
import { cn } from '../utils/cn';

const iconMap: Record<string, any> = {
  FileText,
  Calculator,
  ArrowRightLeft,
  QrCode,
  Type,
  Lock,
  StickyNote,
  CheckSquare,
  Calendar,
  Target,
  Timer,
  Bot,
  User,
  Mail,
  MessageCircle,
  Code,
  Archive,
  Image,
  Shuffle,
  Scan,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { favorites, recents, addFavorite, removeFavorite } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const recentTools = useMemo(() => {
    return recents.map(id => tools.find(t => t.id === id)).filter(Boolean) as Tool[];
  }, [recents]);

  const handleToolClick = (toolId: string) => {
    navigate(`/tool/${toolId}`);
  };

  const ToolCard = ({ tool }: { tool: Tool }) => {
    const IconComponent = iconMap[tool.icon] || FileText;
    const isFavorite = favorites.includes(tool.id);
    const favoriteLabel = isFavorite ? 'Remove from favorites' : 'Add to favorites';

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleToolClick(tool.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToolClick(tool.id);
          }
        }}
        className="group min-h-[160px] w-full cursor-pointer rounded-2xl border border-border bg-secondary/50 p-5 text-left transition-all duration-200 hover:border-primary hover:bg-secondary hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary animate-fade-in"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 group-hover:scale-110 group-hover:bg-primary/20">
            <IconComponent className="h-6 w-6" />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isFavorite) {
                removeFavorite(tool.id);
              } else {
                addFavorite(tool.id);
              }
            }}
            className={cn(
              'relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95',
              isFavorite ? 'bg-primary text-primary-foreground shadow-md' : 'bg-background text-muted-foreground hover:bg-secondary'
            )}
            aria-label={favoriteLabel}
          >
            <Star className={cn('h-4 w-4 transition-all duration-200', isFavorite ? 'fill-current' : '')} />
          </button>
        </div>
        <h3 className="text-sm font-semibold leading-5 text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
        <p className="mt-1.5 text-xs leading-5 text-muted-foreground group-hover:text-muted-foreground/80">{tool.description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Your toolbox"
        subtitle="Fast utilities built for mobile"
      />

      <main className="max-w-3xl mx-auto p-4">
        <div className="space-y-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-3xl border border-border bg-background px-12 py-4 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'inline-flex min-w-[96px] items-center justify-center rounded-full border px-4 py-3 text-sm font-medium transition',
                  selectedCategory === category.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-secondary text-foreground hover:border-primary hover:text-primary'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Tools */}
        {recentTools.length > 0 && (
          <section className="mb-10 animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h2 className="text-lg font-semibold text-foreground">Recently Used</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {recentTools.slice(0, 6).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* All Tools */}
        <section className="animate-fade-in">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <h2 className="text-lg font-semibold text-foreground">All Tools</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Explore our complete collection</p>
            </div>
            <span className="w-fit rounded-full border border-border/50 bg-secondary/50 px-3 py-2 text-xs font-medium text-muted-foreground">
              {filteredTools.length} tools
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="rounded-2xl border border-border bg-secondary/50 p-8 text-center">
              <p className="text-sm text-muted-foreground">No tools match your search. Try another keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;