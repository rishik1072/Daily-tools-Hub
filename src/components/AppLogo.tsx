interface AppLogoProps {
  className?: string;
}

const AppLogo = ({ className }: AppLogoProps) => (
  <div className={`inline-flex items-center justify-center rounded-3xl bg-primary text-primary-foreground ${className ?? ''}`}>
    <svg viewBox="0 0 64 64" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 42a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" fill="currentColor" opacity="0.12" />
      <path d="M32 44a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z" stroke="currentColor" strokeWidth="3" />
      <path d="M42 18l6-6M52 18l6-6M18 42l-6 6M10 42l-6 6M18 10l-6-6M10 10l-6-6M42 18l6 6M52 10l6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M36.5 24.5c-1.15-1.15-3.35-1.54-4.92-.42l-8.44 5.66c-1.02.68-1.46 1.99-1.01 3.09l1.77 4.53a1.5 1.5 0 0 0 1.94.94l9.13-3.47c1.31-.5 2.25-1.76 2.25-3.2v-5.54c0-.86-.34-1.69-.72-2.09Z" fill="currentColor" />
      <path d="M35 26c0 1.38-1.12 2.5-2.5 2.5S30 27.38 30 26s1.12-2.5 2.5-2.5S35 24.62 35 26Z" fill="currentColor" />
    </svg>
  </div>
);

export default AppLogo;
