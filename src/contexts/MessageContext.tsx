import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file';
  attachmentUrl?: string;
}

export interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  lastMessageTime?: string;
}

interface MessageContextType {
  conversations: Conversation[];
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  getConversationMessages: (conversationId: string) => Message[];
  startConversation: (userId: string, userName: string, userAvatar?: string) => string;
  deleteMessage: (messageId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    const savedMessages = localStorage.getItem('messages');
    
    if (savedConversations) {
      try {
        setConversations(JSON.parse(savedConversations));
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  // Initialize with demo data if no conversations exist
  useEffect(() => {
    if (user && conversations.length === 0) {
      const demoConversations: Conversation[] = [
        {
          id: 'conv-1',
          participants: [
            { id: user.id, name: user.name, avatar: user.avatar },
            { id: 'user-2', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' }
          ],
          lastMessage: {
            id: 'msg-1',
            senderId: 'user-2',
            receiverId: user.id,
            content: 'Hey! Are you going to the tech meetup tomorrow?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            read: false
          },
          unreadCount: 1
        },
        {
          id: 'conv-2',
          participants: [
            { id: user.id, name: user.name, avatar: user.avatar },
            { id: 'user-3', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' }
          ],
          lastMessage: {
            id: 'msg-2',
            senderId: user.id,
            receiverId: 'user-3',
            content: 'Thanks for organizing the workshop!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            read: true
          },
          unreadCount: 0
        }
      ];

      const demoMessages: Message[] = [
        {
          id: 'msg-1',
          conversationId: 'conv-1',
          senderId: 'user-2',
          receiverId: user.id,
          content: 'Hey! Are you going to the tech meetup tomorrow?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          status: 'delivered'
        },
        {
          id: 'msg-2',
          conversationId: 'conv-2',
          senderId: user.id,
          receiverId: 'user-3',
          content: 'Thanks for organizing the workshop!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: true,
          status: 'read'
        },
        {
          id: 'msg-3',
          conversationId: 'conv-2',
          senderId: 'user-3',
          receiverId: user.id,
          content: 'You\'re welcome! Hope you found it helpful.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
          read: true,
          status: 'read'
        }
      ];

      setConversations(demoConversations);
      setMessages(demoMessages);
    }
  }, [user, conversations.length]);

  const sendMessage = async (receiverId: string, content: string): Promise<void> => {
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: receiverId, // This should be the actual conversation ID
      senderId: user.id,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);

    // Update or create conversation
    setConversations(prev => {
      const existingConvIndex = prev.findIndex(conv => 
        conv.participants.some(p => p.id === receiverId)
      );

      if (existingConvIndex >= 0) {
        const updated = [...prev];
        updated[existingConvIndex] = {
          ...updated[existingConvIndex],
          lastMessage: newMessage
        };
        return updated;
      } else {
        // Create new conversation
        const newConv: Conversation = {
          id: `conv-${Date.now()}`,
          participants: [
            { id: user.id, name: user.name, avatar: user.avatar },
            { id: receiverId, name: 'User', avatar: undefined }
          ],
          lastMessage: newMessage,
          unreadCount: 0
        };
        return [...prev, newConv];
      }
    });
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );

    // Mark messages as read
    setMessages(prev =>
      prev.map(msg => {
        const conv = conversations.find(c => c.id === conversationId);
        if (conv && conv.participants.some(p => p.id === msg.senderId) && msg.receiverId === user?.id) {
          return { ...msg, read: true };
        }
        return msg;
      })
    );
  };

  const getConversationMessages = (conversationId: string): Message[] => {
    return messages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const startConversation = (userId: string, userName: string, userAvatar?: string): string => {
    if (!user) return '';

    // Check if conversation already exists
    const existingConv = conversations.find(conv =>
      conv.participants.some(p => p.id === userId)
    );

    if (existingConv) {
      return existingConv.id;
    }

    // Create new conversation
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [
        { id: user.id, name: user.name, avatar: user.avatar },
        { id: userId, name: userName, avatar: userAvatar }
      ],
      unreadCount: 0
    };

    setConversations(prev => [...prev, newConv]);
    return newConv.id;
  };

  const deleteMessage = async (messageId: string): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove message from messages array
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      // Update conversation's last message if the deleted message was the last one
      setConversations(prev => prev.map(conv => {
        if (conv.lastMessage?.id === messageId) {
          // Find the new last message for this conversation
          const participantIds = conv.participants.map(p => p.id);
          const conversationMessages = messages
            .filter(msg => 
              participantIds.includes(msg.senderId) && 
              participantIds.includes(msg.receiverId) &&
              msg.id !== messageId
            )
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          return {
            ...conv,
            lastMessage: conversationMessages[0] || undefined
          };
        }
        return conv;
      }));
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw new Error('Failed to delete message. Please try again.');
    }
  };

  const value: MessageContextType = {
    conversations,
    messages,
    sendMessage,
    markAsRead,
    getConversationMessages,
    startConversation,
    deleteMessage
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};