import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, MapPin, Users, Star, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import { useMessages } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import EventModal from '../components/EventModal';
import CreateEventModal from '../components/CreateEventModal';

const EventsPage: React.FC = () => {
  const { events, deleteEvent } = useEvents();
  const { startConversation } = useMessages();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'my-events'>('all');

  const categories = ['All', 'Technology', 'Music', 'Business', 'Sports', 'Art', 'Food', 'Education', 'Health'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesView = viewMode === 'all' || (viewMode === 'my-events' && event.organizer.id === user?.id);
    return matchesSearch && matchesCategory && matchesView;
  });

  const handleMessageOrganizer = (organizerId: string, organizerName: string, organizerAvatar?: string) => {
    if (!user || organizerId === user.id) return;
    
    const conversationId = startConversation(organizerId, organizerName, organizerAvatar);
    navigate('/messages');
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const EventCard: React.FC<{ event: any }> = ({ event }) => {
    const isMyEvent = event.organizer.id === user?.id;
    const revenue = event.attendees * event.price;

    return (
      <div className="bg-light-bg dark:bg-dark-bg-secondary rounded-2xl overflow-hidden shadow-sm border border-light-border dark:border-dark-border hover:shadow-lg transition-all duration-300">
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
            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
              {renderStars(event.rating)}
              <span className="text-light-text dark:text-dark-text text-sm ml-1">({event.rating})</span>
            </div>
          </div>
          {event.featured && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            </div>
          )}
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
            {isMyEvent && (
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <span>Revenue: ${revenue.toLocaleString()}</span>
              </div>
            )}
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
            
            <div className="flex items-center space-x-2">
              {isMyEvent ? (
                <>
                  <button
                    onClick={() => {/* TODO: Add edit functionality */}}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Edit Event"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : user && event.organizer.id !== user.id && (
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
      </div>
    );
  };

  return (
    <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-light-bg-secondary dark:bg-dark-bg min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-light-text dark:text-dark-text mb-4">Event Management</h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg max-w-2xl mx-auto">
          Manage your events, discover new ones, and connect with organizers.
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-light-bg dark:bg-dark-bg-secondary rounded-lg p-1 shadow-sm border border-light-border dark:border-dark-border">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'all'
                ? 'bg-primary-600 text-white'
                : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setViewMode('my-events')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'my-events'
                ? 'bg-primary-600 text-white'
                : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text'
            }`}
          >
            My Events
          </button>
        </div>
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
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div>
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-light-text-muted dark:text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-light-text-secondary dark:text-dark-text-secondary mb-2">
              {viewMode === 'my-events' ? 'No events created yet' : 'No events found'}
            </h3>
            <p className="text-light-text-muted dark:text-dark-text-muted mb-4">
              {viewMode === 'my-events' 
                ? 'Create your first event to get started' 
                : 'Try adjusting your search or filters'
              }
            </p>
            {viewMode === 'my-events' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Event</span>
              </button>
            )}
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

export default EventsPage;