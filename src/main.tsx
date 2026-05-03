import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { Capacitor } from '@capacitor/core';

// Initialize Capacitor (only runs on mobile)
if (Capacitor.isNativePlatform()) {
  console.log('Running on Capacitor native platform');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
