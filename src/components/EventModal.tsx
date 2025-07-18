import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Star, Heart, Share2, MessageCircle, CreditCard, ArrowLeft } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import { useMessages } from '../contexts/MessageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EventModalProps {
  eventId: string;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ eventId, onClose }) => {
  const { events, bookEvent } = useEvents();
  const { startConversation } = useMessages();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return null;
  }

  const handleBookEvent = async () => {
    setLoading(true);
    try {
      await bookEvent(event.id);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to book event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageOrganizer = () => {
    if (!user || event.organizer.id === user.id) return;
    
    const conversationId = startConversation(
      event.organizer.id,
      event.organizer.name,
      event.organizer.avatar
    );
    
    onClose();
    navigate('/messages');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-light-bg dark:bg-dark-bg-secondary rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-light-border dark:border-dark-border">
        {/* Header */}
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4">
            <button
              onClick={onClose}
              className="p-2 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm rounded-full text-light-text dark:text-dark-text hover:bg-white dark:hover:bg-dark-bg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm rounded-full text-light-text dark:text-dark-text hover:bg-white dark:hover:bg-dark-bg transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm rounded-full text-light-text dark:text-dark-text hover:bg-white dark:hover:bg-dark-bg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm rounded-full text-light-text dark:text-dark-text hover:bg-white dark:hover:bg-dark-bg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {event.featured && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured Event
              </span>
            </div>
          )}
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
          {/* Success Message */}
          {bookingSuccess && (
            <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg text-success-700 dark:text-success-400 text-sm flex items-center">
              <span>✅ Successfully booked! Check your email for confirmation.</span>
            </div>
          )}

          {/* Event Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                {event.category}
              </span>
              <div className="flex items-center">
                {renderStars(event.rating)}
                <span className="text-light-text-muted dark:text-dark-text-muted text-sm ml-2">({event.rating})</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-light-text dark:text-dark-text mb-4">{event.title}</h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg leading-relaxed mb-6">{event.description}</p>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-light-text dark:text-dark-text">
                  <Calendar className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-semibold">{formatDate(event.date)}</p>
                    <p className="text-sm text-light-text-muted dark:text-dark-text-muted">at {event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-light-text dark:text-dark-text">
                  <MapPin className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-sm text-light-text-muted dark:text-dark-text-muted">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-light-text dark:text-dark-text">
                  <Users className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-semibold">{event.attendees}/{event.capacity} Attending</p>
                    <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
                      {event.capacity - event.attendees} spots remaining
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-light-text dark:text-dark-text">
                  <CreditCard className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="font-semibold text-2xl text-green-600">${event.price}</p>
                    <p className="text-sm text-light-text-muted dark:text-dark-text-muted">per person</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">Event Organizer</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {event.organizer.avatar ? (
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      className="w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                      onClick={handleMessageOrganizer}
                    />
                  ) : (
                    <div 
                      className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                      onClick={handleMessageOrganizer}
                    >
                      <span className="text-white font-semibold">
                        {event.organizer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 
                      className="font-semibold text-light-text dark:text-dark-text cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      onClick={handleMessageOrganizer}
                    >
                      {event.organizer.name}
                    </h4>
                    <p className="text-light-text-muted dark:text-dark-text-muted text-sm">Event Organizer</p>
                  </div>
                </div>
                {user && event.organizer.id !== user.id && (
                  <button
                    onClick={handleMessageOrganizer}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleBookEvent}
              disabled={loading || event.attendees >= event.capacity}
              className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Booking...
                </div>
              ) : event.attendees >= event.capacity ? (
                'Event Full'
              ) : (
                `Book Now - $${event.price}`
              )}
            </button>
            
            {user && event.organizer.id !== user.id && (
              <button
                onClick={handleMessageOrganizer}
                className="px-8 py-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text rounded-xl font-semibold hover:bg-light-border dark:hover:bg-dark-border transition-all duration-200"
              >
                Contact Organizer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;