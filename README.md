# DailyTools Hub

DailyTools Hub is a modern, lightweight, all-in-one web app that bundles daily utility workflows into one fast interface.

## Highlights

- Modern grid dashboard with categorized tools
- Light and dark mode
- Smooth transitions using Framer Motion
- Favorites and recent tool history
- Offline-friendly local-first tools (notes, to-do, habit tracker, planner, timer)
- Privacy-first file workflows with in-browser processing for supported operations

## Categories Included

- PDF Tools: merge, split, image to PDF, watermark, sign, API-ready OCR/compression
- Daily Utilities: calculator, unit converter, QR generator/scanner, text tools, password generator, notes
- Productivity: to-do with reminders, planner, habit tracker, Pomodoro, calendar event link integration
- AI Tools: summarizer, resume draft generator, email writer, local chat assistant, code snippet generator
- File Tools: image compressor, image resizer, format converter, document scanner to PDF

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion for UI motion
- pdf-lib for local PDF processing
- qrcode for QR generation
- Local caching with localStorage

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Deployment Guide

### Vercel

1. Push this project to GitHub.
2. Import repository into Vercel.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy.

### Netlify

1. Connect repository in Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

### Firebase Hosting

1. Install Firebase CLI.
2. Run `firebase init hosting` and set `dist` as public directory.
3. Build app with `npm run build`.
4. Run `firebase deploy`.

## Backend/API Integration Notes

- PDF compress and OCR are prepared as API-ready workflows in the UI.
- Integrate Node.js or Firebase Functions endpoints for:
  - OCR processing
  - PDF to Word conversion
  - Advanced AI generation
- For cloud sync, add Firestore (or your preferred backend) to sync notes/tasks across devices.

## Security and Privacy

- No login required for core usage
- Local processing for supported sensitive file operations
- No unnecessary data collection in the frontend app
