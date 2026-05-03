import { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workDuration] = useState(25 * 60);
  const [breakDuration] = useState(5 * 60);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play notification sound (if supported)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(mode === 'work' ? 'Break time!' : 'Work time!', {
          body: mode === 'work' ? 'Take a 5-minute break' : 'Time to focus!',
        });
      } else {
        // Fallback: alert for mobile
        alert(mode === 'work' ? 'Break time! Take a 5-minute break' : 'Work time! Time to focus!');
      }

      // Switch modes
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(breakDuration);
      } else {
        setMode('work');
        setTimeLeft(workDuration);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Pomodoro Timer
        </h2>

        <div className="text-center space-y-6">
          <div className="text-6xl font-mono font-bold">
            {formatTime(timeLeft)}
          </div>

          <div className="text-lg font-medium capitalize">
            {mode} Session
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 bg-secondary text-secondary-foreground rounded-full hover:bg-accent"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <div className="text-sm text-muted-foreground">
            Work: 25 min | Break: 5 min
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;