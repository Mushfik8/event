import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  capacity: number;
  attendees: number;
  image: string;
  category: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  featured: boolean;
  rating: number;
  tags: string[];
  createdAt: string;
}

interface EventContextType {
  events: Event[];
  loading: boolean;
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'attendees' | 'rating'>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  bookEvent: (eventId: string) => Promise<void>;
  getEventById: (id: string) => Event | undefined;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Tech Conference 2024',
      description: 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
      date: '2024-03-15',
      time: '09:00',
      location: 'San Francisco Convention Center',
      price: 299,
      capacity: 500,
      attendees: 342,
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Technology',
      organizer: {
        id: '1',
        name: 'TechEvents Inc.',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      featured: true,
      rating: 4.8,
      tags: ['Technology', 'Innovation', 'Networking'],
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Music Festival Summer',
      description: 'Experience the best music festival with top artists from around the world.',
      date: '2024-06-20',
      time: '18:00',
      location: 'Central Park, New York',
      price: 150,
      capacity: 2000,
      attendees: 1850,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Music',
      organizer: {
        id: '2',
        name: 'Music Events Co.',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      featured: true,
      rating: 4.9,
      tags: ['Music', 'Festival', 'Entertainment'],
      createdAt: '2024-01-20T14:30:00Z'
    },
    {
      id: '3',
      title: 'Startup Pitch Night',
      description: 'Watch innovative startups pitch their ideas to top investors.',
      date: '2024-02-28',
      time: '19:00',
      location: 'Innovation Hub, Austin',
      price: 50,
      capacity: 200,
      attendees: 156,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Business',
      organizer: {
        id: '3',
        name: 'Startup Community',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      featured: false,
      rating: 4.6,
      tags: ['Startup', 'Investment', 'Networking'],
      createdAt: '2024-01-25T16:45:00Z'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'attendees' | 'rating'>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
        attendees: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
      };
      
      setEvents(prev => [newEvent, ...prev]);
    } catch (error) {
      throw new Error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      ));
    } catch (error) {
      throw new Error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (error) {
      throw new Error('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const bookEvent = async (eventId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1 }
          : event
      ));
    } catch (error) {
      throw new Error('Failed to book event');
    } finally {
      setLoading(false);
    }
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const value: EventContextType = {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    bookEvent,
    getEventById,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};