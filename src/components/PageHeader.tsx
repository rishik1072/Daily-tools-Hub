import { ReactNode } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';
import { useAppStore } from '../store/store';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  action?: ReactNode;
}

const PageHeader = ({ title, subtitle, showBack, onBack, action }: PageHeaderProps) => {
  const navigate = useNavigate();
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack ?? (() => navigate(-1))}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-secondary text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg ring-1 ring-black/5">
              <AppLogo className="h-6 w-6" />
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">DailyTools Hub</p>
            <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {action}
          <button
            onClick={toggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-secondary text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
