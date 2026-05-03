import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Clock } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../../utils/storage';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  time: string;
  description: string;
}

const CalendarPlanner = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '09:00',
    description: '',
  });

  useEffect(() => {
    const savedEvents = safeGetItem<CalendarEvent[]>('calendar-events', []);
    if (savedEvents) {
      setEvents(savedEvents);
    }
  }, []);

  const saveEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    safeSetItem('calendar-events', newEvents);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return events.filter(event => event.date === dateKey);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const openEventModal = (date: Date | null = null) => {
    if (date) {
      setSelectedDate(formatDateKey(date));
    }
    setShowEventModal(true);
  };

  const closeEventModal = () => {
    setShowEventModal(false);
    setEditingEvent(null);
    setNewEvent({ title: '', time: '09:00', description: '' });
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !selectedDate) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEvent.title.trim(),
      time: newEvent.time,
      description: newEvent.description.trim(),
    };

    saveEvents([...events, event]);
    closeEventModal();
  };

  const updateEvent = () => {
    if (!editingEvent || !newEvent.title.trim()) return;

    const updatedEvent: CalendarEvent = {
      ...editingEvent,
      title: newEvent.title.trim(),
      time: newEvent.time,
      description: newEvent.description.trim(),
    };

    const updatedEvents = events.map(event =>
      event.id === editingEvent.id ? updatedEvent : event
    );

    saveEvents(updatedEvents);
    closeEventModal();
  };

  const deleteEvent = (eventId: string) => {
    saveEvents(events.filter(event => event.id !== eventId));
  };

  const editEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setNewEvent({
      title: event.title,
      time: event.time,
      description: event.description,
    });
    setShowEventModal(true);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendar Planner
          </h2>
          <button
            onClick={() => openEventModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-secondary rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-medium">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-secondary rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {days.map((date, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 border border-border rounded cursor-pointer hover:bg-secondary/50 ${
                date ? 'bg-card' : 'bg-secondary/20'
              }`}
              onClick={() => date && openEventModal(date)}
            >
              {date && (
                <>
                  <div className="text-sm font-medium mb-1">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {getEventsForDate(date).slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs bg-primary text-primary-foreground rounded px-1 py-0.5 truncate"
                        title={`${event.time} - ${event.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          editEvent(event);
                        }}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                    {getEventsForDate(date).length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{getEventsForDate(date).length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  {editingEvent ? 'Edit Event' : 'Add Event'}
                </h3>
                <button
                  onClick={closeEventModal}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    placeholder="Event title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
                    rows={3}
                    placeholder="Event description..."
                  />
                </div>

                {selectedDate && (
                  <div className="text-sm text-muted-foreground">
                    Date: {new Date(selectedDate).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={editingEvent ? updateEvent : addEvent}
                    disabled={!newEvent.title.trim()}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
                  >
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    onClick={closeEventModal}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-accent"
                  >
                    Cancel
                  </button>
                </div>

                {editingEvent && (
                  <button
                    onClick={() => {
                      deleteEvent(editingEvent.id);
                      closeEventModal();
                    }}
                    className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                  >
                    Delete Event
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Upcoming Events</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events
              .filter(event => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map(event => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50"
                  onClick={() => editEvent(event)}
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                  </div>
                </div>
              ))}
            {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-4">
                No upcoming events
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPlanner;