import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Search, 
  Trash2, 
  User, 
  Phone, 
  Video, 
  MoreHorizontal,
  Smile,
  Paperclip,
  Image,
  Mic,
  Check,
  CheckCheck,
  Circle,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMessages } from '../contexts/MessageContext';
import { useTheme } from '../contexts/ThemeContext';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onClose }) => {
  const emojis = ['😀', '😂', '😍', '🥰', '😊', '😎', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉', '👏'];
  
  return (
    <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 p-3 grid grid-cols-4 gap-2 z-50">
      {emojis.map((emoji, index) => (
        <button
          key={index}
          onClick={() => onEmojiSelect(emoji)}
          className="text-2xl hover:bg-gray-100 dark:hover:bg-slate-700 rounded p-1 transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

interface TypingIndicatorProps {
  isTyping: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping }) => {
  if (!isTyping) return null;
  
  return (
    <div className="flex items-center space-x-2 p-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">Someone is typing...</span>
    </div>
  );
};

interface MessageStatusProps {
  status: 'sent' | 'delivered' | 'read';
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  switch (status) {
    case 'sent':
      return <Check className="w-4 h-4 text-gray-400" />;
    case 'delivered':
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    case 'read':
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    default:
      return null;
  }
};

export default function MessagesPage() {
  const { user } = useAuth();
  const { conversations, messages, sendMessage, deleteMessage, getConversationMessages } = useMessages();
  const { theme } = useTheme();
  
  // State management
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  
  // Get current conversation data
  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? getConversationMessages(selectedConversation) : [];
  const otherParticipant = currentConversation?.participants.find(p => p.id !== user?.id);
  
  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Typing simulation
  useEffect(() => {
    if (newMessage) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessage]);

  // Handle message sending
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      await sendMessage(selectedConversation, newMessage.trim());
      setNewMessage('');
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  // Handle file attachment
  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachmentPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Format last seen
  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 5) return 'Active now';
    if (diffInMinutes < 60) return `Active ${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `Active ${Math.floor(diffInMinutes / 60)}h ago`;
    return `Active ${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16">
      <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
        <div className="flex h-full bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Conversations Sidebar */}
          <div className={`
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:relative inset-y-0 left-0 z-50 w-80 lg:w-1/3 max-w-sm
            bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 
            flex flex-col transition-transform duration-300 ease-in-out
          `}>
            
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-slate-700 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-all"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherUser = conversation.participants.find(p => p.id !== user?.id);
                  const isSelected = selectedConversation === conversation.id;
                  const isOnline = Math.random() > 0.5; // Simulate online status
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        relative p-4 cursor-pointer border-b border-gray-100 dark:border-slate-700 
                        transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-700
                        ${isSelected ? 'bg-blue-50 dark:bg-slate-700 border-r-4 border-r-blue-500' : ''}
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar with online indicator */}
                        <div className="relative">
                          {otherUser?.avatar ? (
                            <img 
                              src={otherUser.avatar} 
                              alt={otherUser.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {otherUser?.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          {isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                          )}
                        </div>
                        
                        {/* Conversation Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {otherUser?.name || 'Unknown User'}
                            </h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {formatTime(conversation.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full min-w-[20px] text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          {/* Online status */}
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {isOnline ? 'Active now' : formatLastSeen(conversation.lastMessage?.timestamp || new Date().toISOString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    {/* Mobile menu button */}
                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                    
                    {/* User info */}
                    <div className="relative">
                      {otherParticipant?.avatar ? (
                        <img 
                          src={otherParticipant.avatar} 
                          alt={otherParticipant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                    </div>
                    
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        {otherParticipant?.name || 'Unknown User'}
                      </h2>
                      <p className="text-sm text-green-500">Active now</p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900 scrollbar-thin">
                  {currentMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-2xl">
                          {otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {otherParticipant?.name || 'Unknown User'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        You're now connected on Messenger
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Say hello to start the conversation!
                      </p>
                    </div>
                  ) : (
                    <>
                      {currentMessages.map((message, index) => {
                        const isOwnMessage = message.senderId === user?.id;
                        const showAvatar = index === 0 || currentMessages[index - 1]?.senderId !== message.senderId;
                        const messageStatus = Math.random() > 0.7 ? 'read' : Math.random() > 0.4 ? 'delivered' : 'sent';
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex items-end space-x-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isOwnMessage && (
                              <div className="w-8 h-8 flex-shrink-0">
                                {showAvatar && (
                                  otherParticipant?.avatar ? (
                                    <img 
                                      src={otherParticipant.avatar} 
                                      alt={otherParticipant.name}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-semibold">
                                        {otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                            
                            <div className={`group max-w-xs lg:max-w-md ${isOwnMessage ? 'order-1' : ''}`}>
                              <div className={`
                                relative px-4 py-2 rounded-2xl shadow-sm
                                ${isOwnMessage 
                                  ? 'bg-blue-500 text-white rounded-br-md' 
                                  : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-slate-600'
                                }
                              `}>
                                <p className="text-sm leading-relaxed break-words">{message.content}</p>
                                
                                {/* Message actions */}
                                {isOwnMessage && (
                                  <button
                                    onClick={() => deleteMessage(message.id)}
                                    className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                                    title="Delete message"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                )}
                              </div>
                              
                              {/* Timestamp and status */}
                              <div className={`flex items-center mt-1 space-x-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(message.timestamp)}
                                </span>
                                {isOwnMessage && (
                                  <MessageStatus status={messageStatus} />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Typing Indicator */}
                      <TypingIndicator isTyping={isTyping} />
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Attachment Preview */}
                {attachmentPreview && (
                  <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                    <div className="relative inline-block">
                      <img src={attachmentPreview} alt="Preview" className="max-w-xs max-h-32 rounded-lg" />
                      <button
                        onClick={() => setAttachmentPreview(null)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-end space-x-3">
                    {/* Attachment buttons */}
                    <div className="flex space-x-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileAttachment}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                      >
                        <Image className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Message input container */}
                    <div className="flex-1 relative">
                      <input
                        ref={messageInputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-slate-700 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-all"
                      />
                      
                      {/* Emoji picker button */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          <Smile className="w-5 h-5" />
                        </button>
                        
                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                          <EmojiPicker
                            onEmojiSelect={handleEmojiSelect}
                            onClose={() => setShowEmojiPicker(false)}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Send/Voice button */}
                    {newMessage.trim() ? (
                      <button
                        type="submit"
                        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="p-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-full transition-colors"
                      >
                        <Mic className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>
              </>
            ) : (
              /* No conversation selected */
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 p-8">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden mb-6 p-3 bg-blue-500 text-white rounded-full shadow-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Send className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Your Messages
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Send private messages to friends and family. Select a conversation from the sidebar to start messaging.
                  </p>
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    View Conversations
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}