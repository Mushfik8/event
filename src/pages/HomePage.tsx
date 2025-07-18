import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, MapPin, Users, Star, MessageCircle } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import { useMessages } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EventModal from '../components/EventModal';
import CreateEventModal from '../components/CreateEventModal';

const HomePage: React.FC = () => {
  const { events } = useEvents();
  const { startConversation } = useMessages();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = ['All', 'Technology', 'Music', 'Business', 'Sports', 'Art', 'Food', 'Education', 'Health'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEvents = filteredEvents.filter(event => event.featured);
  const regularEvents = filteredEvents.filter(event => !event.featured);

  const handleMessageOrganizer = (organizerId: string, organizerName: string, organizerAvatar?: string) => {
    if (!user || organizerId === user.id) return;
    
    const conversationId = startConversation(organizerId, organizerName, organizerAvatar);
    navigate('/messages');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ));
  };

  const EventCard: React.FC<{ event: any; featured?: boolean }> = ({ event, featured = false }) => (
    <div className={`bg-light-bg dark:bg-dark-bg-secondary rounded-2xl overflow-hidden shadow-sm border border-light-border dark:border-dark-border hover:shadow-lg transition-all duration-300 ${featured ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}`}>
      {featured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 text-sm font-semibold">
          ⭐ Featured Event
        </div>
      )}
      
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => setSelectedEvent(event.id)}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {event.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full px-2 py-1">
            {renderStars(event.rating)}
            <span className="text-light-text dark:text-dark-text text-sm ml-1">({event.rating})</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-light-text-muted dark:text-dark-text-muted text-sm">{formatDate(event.date)} • {event.time}</span>
          <span className="text-green-600 font-bold text-lg">${event.price}</span>
        </div>

        <h3 
          className="text-xl font-bold text-light-text dark:text-dark-text mb-2 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          onClick={() => setSelectedEvent(event.id)}
        >
          {event.title}
        </h3>
        
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-light-text-muted dark:text-dark-text-muted text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-light-text-muted dark:text-dark-text-muted text-sm">
            <Users className="w-4 h-4 mr-2" />
            {event.attendees}/{event.capacity} attending
          </div>
        </div>

        {/* Organizer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-light-border-light dark:border-dark-border-light">
          <div className="flex items-center space-x-3">
            {event.organizer.avatar ? (
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                onClick={() => handleMessageOrganizer(event.organizer.id, event.organizer.name, event.organizer.avatar)}
              />
            ) : (
              <div 
                className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                onClick={() => handleMessageOrganizer(event.organizer.id, event.organizer.name, event.organizer.avatar)}
              >
                <span className="text-white text-sm font-semibold">
                  {event.organizer.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span 
              className="text-light-text dark:text-dark-text text-sm font-medium cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={() => handleMessageOrganizer(event.organizer.id, event.organizer.name, event.organizer.avatar)}
            >
              {event.organizer.name}
            </span>
          </div>
          
          {user && event.organizer.id !== user.id && (
            <button
              onClick={() => handleMessageOrganizer(event.organizer.id, event.organizer.name, event.organizer.avatar)}
              className="flex items-center space-x-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-light-bg dark:bg-dark-bg min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-4">Discover Amazing Events</h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Find and join events that match your interests, or create your own to bring people together.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-light-bg dark:bg-dark-bg-secondary rounded-2xl p-6 shadow-sm border border-light-border dark:border-dark-border mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
            <input
              type="text"
              placeholder="Search events, locations, or organizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-lg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Create Event Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Events */}
      <div>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text mb-6">
          {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
        </h2>
        
        {regularEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-light-text-muted dark:text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2">No events found</h3>
            <p className="text-light-text-muted dark:text-dark-text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedEvent && (
        <EventModal
          eventId={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {showCreateModal && (
        <CreateEventModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default HomePage;