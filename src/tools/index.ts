import { lazy } from 'react';
import { Tool } from '../types';

// PDF Tools
const MergePDF = lazy(() => import('./pdf/MergePDF'));
const SplitPDF = lazy(() => import('./pdf/SplitPDF'));
const CompressPDF = lazy(() => import('./pdf/CompressPDF'));
const ImageToPDF = lazy(() => import('./pdf/ImageToPDF'));
const AddWatermark = lazy(() => import('./pdf/AddWatermark'));
const SignPDF = lazy(() => import('./pdf/SignPDF'));
const OCRExtract = lazy(() => import('./pdf/OCRExtract'));

// Utilities
const Calculator = lazy(() => import('./utilities/Calculator'));
const UnitConverter = lazy(() => import('./utilities/UnitConverter'));
const QRGenerator = lazy(() => import('./utilities/QRGenerator'));
const QRScanner = lazy(() => import('./utilities/QRScanner'));
const TextTools = lazy(() => import('./utilities/TextTools'));
const PasswordGenerator = lazy(() => import('./utilities/PasswordGenerator'));
const QuickNotes = lazy(() => import('./utilities/QuickNotes'));

// Productivity
const TodoList = lazy(() => import('./productivity/TodoList'));
const DailyPlanner = lazy(() => import('./productivity/DailyPlanner'));
const HabitTracker = lazy(() => import('./productivity/HabitTracker'));
const PomodoroTimer = lazy(() => import('./productivity/PomodoroTimer'));
const CalendarPlanner = lazy(() => import('./productivity/CalendarPlanner'));

// AI Tools
const TextSummarizer = lazy(() => import('./ai/TextSummarizer'));
const ResumeGenerator = lazy(() => import('./ai/ResumeGenerator'));
const EmailWriter = lazy(() => import('./ai/EmailWriter'));
const ChatAssistant = lazy(() => import('./ai/ChatAssistant'));
const CodeSnippetGenerator = lazy(() => import('./ai/CodeSnippetGenerator'));

// File Tools
const FileCompressor = lazy(() => import('./file/FileCompressor'));
const ImageResizer = lazy(() => import('./file/ImageResizer'));
const ImageConverter = lazy(() => import('./file/ImageConverter'));
const DocumentScanner = lazy(() => import('./file/DocumentScanner'));

export const tools: Tool[] = [
  // PDF
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    category: 'pdf',
    icon: 'FileText',
    component: MergePDF,
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Split PDF into separate pages',
    category: 'pdf',
    icon: 'Scissors',
    component: SplitPDF,
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Reduce PDF file size',
    category: 'pdf',
    icon: 'Archive',
    component: CompressPDF,
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert images to PDF',
    category: 'pdf',
    icon: 'Image',
    component: ImageToPDF,
  },
  {
    id: 'add-watermark',
    name: 'Add Watermark',
    description: 'Add text watermark to PDF',
    category: 'pdf',
    icon: 'Droplets',
    component: AddWatermark,
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    description: 'Add signature to PDF',
    category: 'pdf',
    icon: 'PenTool',
    component: SignPDF,
  },
  {
    id: 'ocr-extract',
    name: 'OCR Extract',
    description: 'Extract text from images/PDFs',
    category: 'pdf',
    icon: 'Scan',
    component: OCRExtract,
  },
  // Utilities
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Advanced calculator with math functions',
    category: 'utilities',
    icon: 'Calculator',
    component: Calculator,
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between different units',
    category: 'utilities',
    icon: 'ArrowRightLeft',
    component: UnitConverter,
  },
  {
    id: 'qr-generator',
    name: 'QR Generator',
    description: 'Generate QR codes',
    category: 'utilities',
    icon: 'QrCode',
    component: QRGenerator,
  },
  {
    id: 'qr-scanner',
    name: 'QR Scanner',
    description: 'Scan QR codes',
    category: 'utilities',
    icon: 'ScanLine',
    component: QRScanner,
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    description: 'Text manipulation utilities',
    category: 'utilities',
    icon: 'Type',
    component: TextTools,
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords',
    category: 'utilities',
    icon: 'Lock',
    component: PasswordGenerator,
  },
  {
    id: 'quick-notes',
    name: 'Quick Notes',
    description: 'Save and manage notes',
    category: 'utilities',
    icon: 'StickyNote',
    component: QuickNotes,
  },
  // Productivity
  {
    id: 'todo-list',
    name: 'To-do List',
    description: 'Manage tasks and reminders',
    category: 'productivity',
    icon: 'CheckSquare',
    component: TodoList,
  },
  {
    id: 'daily-planner',
    name: 'Daily Planner',
    description: 'Plan your daily schedule',
    category: 'productivity',
    icon: 'Calendar',
    component: DailyPlanner,
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Track daily habits and streaks',
    category: 'productivity',
    icon: 'Target',
    component: HabitTracker,
  },
  {
    id: 'pomodoro-timer',
    name: 'Pomodoro Timer',
    description: 'Focus timer with breaks',
    category: 'productivity',
    icon: 'Timer',
    component: PomodoroTimer,
  },
  {
    id: 'calendar-planner',
    name: 'Calendar Planner',
    description: 'Date-based planning',
    category: 'productivity',
    icon: 'CalendarDays',
    component: CalendarPlanner,
  },
  // AI Tools
  {
    id: 'text-summarizer',
    name: 'Text Summarizer',
    description: 'Summarize long texts',
    category: 'ai',
    icon: 'FileText',
    component: TextSummarizer,
  },
  {
    id: 'resume-generator',
    name: 'Resume Generator',
    description: 'Create professional resumes',
    category: 'ai',
    icon: 'User',
    component: ResumeGenerator,
  },
  {
    id: 'email-writer',
    name: 'Email Writer',
    description: 'Generate professional emails',
    category: 'ai',
    icon: 'Mail',
    component: EmailWriter,
  },
  {
    id: 'chat-assistant',
    name: 'Chat Assistant',
    description: 'Simple AI chat interface',
    category: 'ai',
    icon: 'MessageCircle',
    component: ChatAssistant,
  },
  {
    id: 'code-snippet-generator',
    name: 'Code Generator',
    description: 'Generate code snippets',
    category: 'ai',
    icon: 'Code',
    component: CodeSnippetGenerator,
  },
  // File Tools
  {
    id: 'file-compressor',
    name: 'File Compressor',
    description: 'Compress files into ZIP',
    category: 'file',
    icon: 'Archive',
    component: FileCompressor,
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images',
    category: 'file',
    icon: 'Image',
    component: ImageResizer,
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert PNG to JPG and vice versa',
    category: 'file',
    icon: 'Shuffle',
    component: ImageConverter,
  },
  {
    id: 'document-scanner',
    name: 'Document Scanner',
    description: 'Scan documents with camera',
    category: 'file',
    icon: 'Scan',
    component: DocumentScanner,
  },
];

export { categories } from '../types';