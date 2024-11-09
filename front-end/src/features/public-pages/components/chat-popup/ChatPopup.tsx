import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  ClickAwayListener,
  Avatar,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage: Message = {
        text: inputValue.trim(),
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      setTimeout(() => {
        const adminMessage: Message = {
          text: 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, adminMessage]);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <IconButton
        color="primary"
        onClick={toggleChat}
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
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#fff',
                  color: '#1976d2',
                  width: 40,
                  height: 40,
                }}
              >
                A
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Chat với Admin
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Thường trả lời trong vài phút
                </Typography>
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
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 2,
                      borderRadius: message.isUser
                        ? '20px 4px 20px 20px'
                        : '4px 20px 20px 20px',
                      bgcolor: message.isUser ? '#1976d2' : '#fff',
                      color: message.isUser ? '#fff' : '#000',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      color: '#666',
                      fontSize: '0.75rem',
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>
              ))}
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
                    color: '#fff',
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
            0% {
              transform: scale(1);
              box-shadow: 0px 4px 12px rgba(25, 118, 210, 0.5);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0px 8px 24px rgba(25, 118, 210, 0.7);
            }
            100% {
              transform: scale(1);
              box-shadow: 0px 4px 12px rgba(25, 118, 210, 0.5);
            }
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          /* Custom scrollbar for messages */
          .MuiBox-root::-webkit-scrollbar {
            width: 6px;
          }
          .MuiBox-root::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .MuiBox-root::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }
          .MuiBox-root::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}
      </style>
    </>
  );
};

export default ChatPopup;
