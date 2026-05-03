import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dailytools.hub',
  appName: 'DailyTools Hub',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: '#2563eb',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false
    }
  }
};

export default config;
