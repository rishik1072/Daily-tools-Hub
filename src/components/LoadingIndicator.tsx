interface LoadingIndicatorProps {
  visible: boolean;
  label?: string;
}

const LoadingIndicator = ({ visible, label = 'Loading...' }: LoadingIndicatorProps) => {
  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-50 h-1 origin-left bg-primary transition-transform duration-300 ${
          visible ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
      <div
        className={`pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-border bg-background/95 px-4 py-3 shadow-2xl shadow-black/5 transition-all duration-300 ${
          visible ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex items-center gap-3 text-sm font-medium text-foreground">
          <span className="inline-flex h-3.5 w-3.5 animate-pulse rounded-full bg-primary" />
          {label}
        </div>
      </div>
    </>
  );
};

export default LoadingIndicator;
