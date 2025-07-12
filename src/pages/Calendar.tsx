import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  space: string;
  description: string;
  ageGroup: string;
  cost: string;
  isFree: boolean;
  hasOpenAccess: boolean;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Workshop di Fotografia',
    date: '2024-01-15',
    time: '14:00 - 17:00',
    space: 'Stanza Laboratori',
    description: 'Corso base di fotografia digitale per principianti',
    ageGroup: 'Adulti',
    cost: 'Gratuito',
    isFree: true,
    hasOpenAccess: false
  },
  {
    id: '2',
    title: 'Incontro Associazioni',
    date: '2024-01-18',
    time: '18:30 - 20:30',
    space: 'Spazio Open',
    description: 'Riunione mensile delle associazioni del territorio',
    ageGroup: 'Adulti',
    cost: 'Gratuito',
    isFree: true,
    hasOpenAccess: true
  },
  {
    id: '3',
    title: 'Laboratorio Creativo Bambini',
    date: '2024-01-20',
    time: '15:00 - 16:30',
    space: 'Stanza Mezzaluna',
    description: 'Attività creative per bambini dai 6 ai 12 anni',
    ageGroup: 'Bambini',
    cost: '€5',
    isFree: false,
    hasOpenAccess: false
  }
];

const filterOptions = [
  { id: 'spazio-open', label: 'Spazio Open' },
  { id: 'spazio-presentazioni', label: 'Spazio Presentazioni' },
  { id: 'stanza-colloqui', label: 'Stanza Colloqui' },
  { id: 'stanza-mezzaluna', label: 'Stanza Mezzaluna' },
  { id: 'stanza-laboratori', label: 'Stanza Laboratori' },
  { id: 'foresteria', label: 'Foresteria' },
  { id: 'giardino', label: 'Giardino' },
  { id: 'gratuite', label: 'Gratuite' },
  { id: 'accesso-libero', label: 'Accesso Libero' },
  { id: 'libero', label: 'Libero (nessun evento)' }
];

interface CalendarProps {
  onBack: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter(event => event.date === dateStr);
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const filteredEvents = mockEvents.filter(event => {
    if (selectedFilters.length === 0) return true;
    
    return selectedFilters.some(filter => {
      switch (filter) {
        case 'spazio-open': return event.space === 'Spazio Open';
        case 'spazio-presentazioni': return event.space === 'Spazio Presentazioni';
        case 'stanza-colloqui': return event.space === 'Stanza Colloqui';
        case 'stanza-mezzaluna': return event.space === 'Stanza Mezzaluna';
        case 'stanza-laboratori': return event.space === 'Stanza Laboratori';
        case 'foresteria': return event.space === 'Foresteria';
        case 'giardino': return event.space === 'Giardino';
        case 'gratuite': return event.isFree;
        case 'accesso-libero': return event.hasOpenAccess;
        case 'libero': return false; // No events for free days
        default: return true;
      }
    });
  });

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna alla Home
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendario Eventi</h1>
          <p className="text-gray-600">Visualizza gli eventi per mese</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtri
          </Button>
        </div>

        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filterOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={option.id}
                      checked={selectedFilters.includes(option.id)}
                      onCheckedChange={() => toggleFilter(option.id)}
                    />
                    <Label htmlFor={option.id} className="text-sm">{option.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map((day, index) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const hasEvents = dayEvents.length > 0;
                
                return (
                  <div key={index} className="min-h-[80px] border border-gray-200 rounded p-1">
                    {day && (
                      <>
                        <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                        {hasEvents && (
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div key={event.id} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate">
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500">+{dayEvents.length - 2} altri</div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {filteredEvents.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Eventi del Mese</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant="outline">{event.space}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="text-sm space-y-1">
                      <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString('it-IT')}</p>
                      <p><strong>Orario:</strong> {event.time}</p>
                      <p><strong>Costo:</strong> {event.cost}</p>
                      <p><strong>Target:</strong> {event.ageGroup}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;