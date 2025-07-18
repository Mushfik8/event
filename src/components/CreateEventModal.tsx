import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, DollarSign, Image, ArrowLeft } from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';

interface CreateEventModalProps {
  onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose }) => {
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: 0,
    capacity: 100,
    category: 'Technology',
    image: '',
    tags: [] as string[],
  });

  const categories = ['Technology', 'Music', 'Business', 'Sports', 'Art', 'Food', 'Education', 'Health'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      await createEvent({
        ...formData,
        organizer: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
        featured: false,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // In a real app, you would upload the file to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData({ ...formData, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-light-bg/95 dark:bg-dark-bg-secondary/95 backdrop-blur-md rounded-3xl border border-light-border dark:border-dark-border max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-light-bg/90 dark:bg-dark-bg-secondary/90 backdrop-blur-md border-b border-light-border dark:border-dark-border p-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Create New Event</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text dark:hover:text-dark-text hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {error && (
            <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl text-error-700 dark:text-error-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Image */}
            <div>
              <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                Event Image
              </label>
              <div className="relative">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Event preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 p-2 bg-error-500/80 text-white rounded-lg hover:bg-error-600/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-light-border dark:border-dark-border border-dashed rounded-xl cursor-pointer hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors">
                    <Image className="w-12 h-12 text-light-text-muted dark:text-dark-text-muted mb-2" />
                    <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">Click to upload event image</p>
                    <p className="text-light-text-muted dark:text-dark-text-muted text-xs">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                placeholder="Enter event title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-colors duration-200"
                placeholder="Describe your event..."
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                  placeholder="Enter event location"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-light-bg dark:bg-dark-bg">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price and Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                  Price ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-12 pr-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                  Capacity
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 100 })}
                    className="w-full pl-12 pr-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                    placeholder="100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-light-text dark:text-dark-text text-sm font-medium mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-primary-400 hover:text-primary-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const target = e.target as HTMLInputElement;
                    handleTagAdd(target.value.trim());
                    target.value = '';
                  }
                }}
                className="w-full px-4 py-3 bg-light-bg-secondary dark:bg-dark-bg-tertiary border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-dark-text placeholder-light-text-muted dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                placeholder="Type a tag and press Enter"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Event...
                </div>
              ) : (
                'Create Event'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;