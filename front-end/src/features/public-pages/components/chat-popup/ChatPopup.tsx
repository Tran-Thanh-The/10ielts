import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  ClickAwayListener,
  Avatar,
  CircularProgress,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import conversationApis from '@/api/conversationApi';
import { useSocket } from '@/context/SocketContext';
import chatApi from '@/api/chatApi';
import { Message } from '@/features/dashboard/features/chat/components/chat-box/ChatBox';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import formatToVietnamTime from '@/utils/formatter/format-vietnamese-time';

const WELCOME_MESSAGE: Message = {
  content: 'Xin chào! Tôi có thể giúp gì cho bạn?',
  sender: 'admin',
  type:'text',
  timestamp: new Date(),
  senderId: ''
};

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { socket, sendChatMessage } = useSocket();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentUserId = user.id.toString();

  useEffect(() => {
    if (isOpen) {
      getCurrentConversation();
    }
  }, [isOpen]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !currentConversation) return;

    const handleNewMessage = (data: {
      conversationId: string;
      senderId: string;
      message: {
        content: string;
        createdAt: string;
      };
    }) => {
      if (data.conversationId === currentConversation.id) {
        const newMessage: Message = {
               id: Date.now(),
               sender: data.senderId == currentUserId ? 'currentUser' : 'admin',
               content: data.message.content,
               type: 'text',
               timestamp: new Date(data.message.createdAt),
               senderId: ''
             };
             setMessages(prev => [...prev, newMessage]);
      }
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, currentConversation]);

  const getCurrentConversation = async () => {
    setLoading(true);
    try {
      const conversationResponse = await conversationApis.getCurrentUserConversations();
      if (!conversationResponse.data) {
        await createNewConversation();
      }
      else {
        setCurrentConversation(conversationResponse.data);
        await fetchMessagesForConversation(conversationResponse.data.id);
      }
    } catch (error) {
      console.error('Error in getCurrentConversation:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const createNewConversation = async () => {
    try {
      const newConvResponse = await conversationApis.createConversation();
      const newConversation = newConvResponse.data.data;
      setCurrentConversation(newConversation);
      setMessages([WELCOME_MESSAGE]);
      await fetchMessagesForConversation(newConversation.id);
    } catch (createError) {
      console.error('Error creating new conversation:', createError);
    }
  };
  
  const fetchMessagesForConversation = async (conversationId: string) => {
    if (!conversationId) {
      console.error('Conversation ID is undefined');
      return;
    }
    
    try {
      const messagesResponse = await conversationApis.getConversationMessages(conversationId, { page: 1, limit: 50 });
      if (messagesResponse.data.data && messagesResponse.data.data.length > 0) {
        const formattedMessages = messagesResponse.data.data.map((msg: any) => ({
          id: msg.id,
          sender: msg.userId == currentUserId ? 'currentUser' : 'admin',
          content: msg.message,
          type: msg.type || 'text',
          timestamp: new Date(msg.createdAt),
          fileUrl: msg.fileUrl,
        }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
        setMessages(formattedMessages); 
      } else {
        setMessages([WELCOME_MESSAGE]);
      }
    } catch (error) {
      console.error('Error fetching messages for conversation:', error);
    }
  };
  
  const handleSendMessage = async () => {
    if (!currentConversation || !inputValue.trim() || isSending) return;
    setIsSending(true);
    try {
      const data = {
        conversationId: currentConversation.id,
        message: inputValue.trim(),
      };
  
      const response = await chatApi.sendMessage(data);
      if (response.status === 201) {
        sendChatMessage(currentConversation.id, inputValue.trim(), currentUserId);
        setInputValue('');
      } else {
        console.error('Failed to send message via API:', response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <>
      <IconButton
        color="primary"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 140,
          right: 25,
          backgroundColor: '#0000FF',
          color: 'white',
          zIndex: 1000,
          width: 56,
          height: 56,
          boxShadow: '0px 4px 12px rgba(25, 118, 210, 0.5)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            backgroundColor: '#115293',
            transform: 'scale(1.1)',
          },
          animation: 'pulse 1.5s infinite',
        }}
      >
        <ChatIcon sx={{ color: 'white', fontSize: 28 }} />
      </IconButton>

      {isOpen && (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 100,
              width: 380,
              height: 600,
              backgroundColor: '#fff',
              borderRadius: '20px',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1000,
              animation: 'fadeIn 0.3s ease-in-out',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                bgcolor: '#1976d2',
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar sx={{ bgcolor: '#fff', color: '#1976d2' }}>A</Avatar>
              <Box>
                <Typography variant="h6">Chat với Admin</Typography>
                <Typography variant="caption">Thường trả lời trong vài phút</Typography>
              </Box>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                bgcolor: '#f5f5f5',
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : (
                messages.map((message, index) => (
                  <Box
                    key={message.id || index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: (message.sender == 'currentUser') ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: (message.sender == 'currentUser') ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                        bgcolor: (message.sender == 'currentUser') ? '#1976d2' : '#fff',
                        color: (message.sender == 'currentUser') ? '#fff' : '#000',
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 0.5, color: '#666' }}>
                      {formatToVietnamTime(message.timestamp)}
                    </Typography>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box
              sx={{
                display: 'flex',
                p: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                bgcolor: '#fff',
                gap: 1,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Nhập tin nhắn..."
                fullWidth
                size="small"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />

              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                sx={{
                  bgcolor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#115293',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#ccc',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </ClickAwayListener>
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0px 4px 12px rgba(25, 118, 210, 0.5); }
            50% { transform: scale(1.05); box-shadow: 0px 8px 24px rgba(25, 118, 210, 0.7); }
            100% { transform: scale(1); box-shadow: 0px 4px 12px rgba(25, 118, 210, 0.5); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default ChatPopup;