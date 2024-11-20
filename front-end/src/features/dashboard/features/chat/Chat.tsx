import React, { useState } from 'react';
import {
  Box,
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const conversations = [
  {
    id: 1,
    name: 'Ngọc Uyn',
    lastMessage: 'Bạn: oke tí ghé thì call tôi nhé',
    avatar: '/path/to/avatar1.jpg',
  },
  {
    id: 2,
    name: 'Đồ án',
    lastMessage: 'Bạn: Có cái chat ở dashboard...',
    avatar: '/path/to/avatar2.jpg',
  },
];

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'admin', content: 'Hello! How can I help you?' },
    { id: 2, sender: 'user', content: 'I need some help with my project.' },
  ]);

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newUserMessage = {
        id: messages.length + 1,
        sender: 'user',
        content: messageText,
      };

      // Add user's message
      setMessages([...messages, newUserMessage]);

      // Clear the input field
      setMessageText('');

      // Simulate an auto-reply after 1 second
      setTimeout(() => {
        const newAdminMessage = {
          id: messages.length + 2,
          sender: 'admin',
          content: 'This is an automatic reply. How can I assist you further?',
        };
        setMessages((prevMessages) => [...prevMessages, newAdminMessage]);
      }, 1000);
    }
  };

  return (
    <Box display="flex" height="100vh">
      <Paper
        elevation={3}
        sx={{ width: '25%', overflowY: 'auto', borderRight: '1px solid #ddd' }}
      >
        <List>
          {conversations.map((conv) => (
            <ListItemButton
              component="div"
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              selected={conv.id === selectedConversation}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar src={conv.avatar} alt={conv.name} />
              </ListItemAvatar>
              <ListItemText primary={conv.name} secondary={conv.lastMessage} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      <Box flexGrow={1}>
        <Paper
          elevation={2}
          sx={{
            padding: 2,
            borderBottom: '1px solid #ddd',
          }}
        >
          <Typography variant="h6">
            {conversations.find((conv) => conv.id === selectedConversation)
              ?.name || 'Chọn cuộc trò chuyện'}
          </Typography>
        </Paper>

        <Box
          sx={{
            height: 'calc(100vh - 140px)',
            overflowY: 'auto',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pb: '80px',
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              display="flex"
              flexDirection={msg.sender === 'user' ? 'row-reverse' : 'row'}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  margin: msg.sender === 'user' ? '0 0 0 8px' : '0 8px 0 0',
                }}
              />
              <Box>
                <Paper
                  sx={{
                    padding: 1.5,
                    backgroundColor:
                      msg.sender === 'user' ? '#0078fe' : '#e5e5ea',
                    color: msg.sender === 'user' ? '#fff' : '#000',
                    borderRadius: '18px',
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: '64%',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: '20px',
              padding: '8px 12px',
              marginRight: '8px',
              border: '2px solid rgba(0,0,0,0.2)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Aa"
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '15px',
                backgroundColor: 'transparent',
                padding: '4px 8px',
              }}
            />
          </Box>

          <IconButton
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            sx={{
              backgroundColor: messageText.trim() ? '#0084ff' : '#e4e6eb',
              color: messageText.trim() ? '#fff' : '#bcc0c4',
              '&:hover': {
                backgroundColor: messageText.trim() ? '#0072db' : '#e4e6eb',
              },
              width: '36px',
              height: '36px',
            }}
          >
            <SendIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
