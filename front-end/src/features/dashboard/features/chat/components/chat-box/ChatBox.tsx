import React, { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  styled,
  Avatar,
  InputBase,
  Input,
  Link,
  Dialog,
  DialogContent,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiIcon from '@mui/icons-material/EmojiEmotions';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

interface Message {
  id: number;
  sender: 'user' | 'admin';
  content: string;
  type: 'text' | 'image' | 'file' | 'video';
  timestamp: Date;
  fileUrl?: string;
}

interface Conversation {
  id: number;
  customer: string;
  avatar?: string;
}

interface BoxChatProps {
  conversation: Conversation | null;
}

// Styled Components
const MessageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  cursor: 'default',
  transition: 'transform 0.2s ease',
}));

const MessageBubble = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  maxWidth: '70%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'scale(1.02)',
  },
}));

const ChatInput = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: 'sticky',
  bottom: 0,
  zIndex: 1000,
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  borderRadius: '100px',
  padding: theme.spacing(1, 2),
  border: `1px solid ${theme.palette.divider}`,
  margin: theme.spacing(0, 1),
  fontSize: '14px',
  transition: 'all 0.3s ease',
  '&:focus-within': {
    boxShadow: `0 0 0 1px ${theme.palette.primary.light}`,
    borderColor: theme.palette.primary.main,
  },
}));

const FileIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.3s ease',
  marginRight: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'scale(1.1)',
  },
}));

const BoxChat: React.FC<BoxChatProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [openVideo, setOpenVideo] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && !isSending) {
      setIsSending(true);
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        content: messageText.trim(),
        type: 'text',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessageText('');
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && messageText.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, type: 'image' | 'file' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        content: file.name,
        type: type,
        fileUrl,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  const handleOpenImage = (imageUrl: string) => {
    setOpenImage(imageUrl);
  };

  const handleOpenVideo = (videoUrl: string) => {
    setOpenVideo(videoUrl);
  };

  const handleClose = () => {
    setOpenImage(null);
    setOpenVideo(null);
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleFileIconClick = (type: 'image' | 'file' | 'video') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 
                                     type === 'video' ? 'video/*' : '*';
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.closest('.MuiBox-root');
      if (scrollContainer) {
        const offset = 64; 
        const scrollPosition = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        scrollContainer.scrollTo({
          top: scrollPosition + offset, 
          behavior: 'smooth',
        });
      }
    }
  }, [messages]);
  

  if (!conversation) {
    return (
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Typography variant="h6" color="#0071f9" sx={{marginBottom: 20}}>
          Hãy bắt đầu một cuộc trò chuyện!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Avatar
          src={conversation.avatar || ''}
          alt={conversation.customer}
          sx={{ marginRight: 2 }}
        />
        <Box>
          <Typography variant="h6">{conversation.customer}</Typography>
          <Typography variant="body2" color="textSecondary">
            Hoạt động 1 giờ trước
          </Typography>
        </Box>
      </Paper>

      {/* Message List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: 3,
          backgroundColor: '#f5f5f5',
          marginBottom: '64px'
        }}
      >
        {messages.map((msg, index) => (
          <Box key={msg.id}>
            <MessageContainer
              sx={{
                justifyContent:
                  msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.sender === 'admin' && (
                <Avatar
                  src={conversation.avatar || ''}
                  sx={{ marginRight: 1 }}
                />
              )}
              <MessageBubble
                sx={{
                  backgroundColor:
                    msg.sender === 'user' ? '#e0f7fa' : '#ffffff',
                  cursor: msg.type !== 'text' ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (msg.type === 'image' && msg.fileUrl) {
                    handleOpenImage(msg.fileUrl);
                  } else if (msg.type === 'video' && msg.fileUrl) {
                    handleOpenVideo(msg.fileUrl);
                  }
                }}
              >
                {msg.type === 'text' ? (
                  <Typography variant="body2">{msg.content}</Typography>
                ) : msg.type === 'image' ? (
                  <img
                    src={msg.fileUrl}
                    alt={msg.content}
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : msg.type === 'video' ? (
                  <video
                    width="100%"
                    height="auto"
                    controls
                  >
                    <source src={msg.fileUrl} type="video/mp4" />
                  </video>
                ) : (
                  <Typography variant="body2">{msg.content}</Typography>
                )}
              </MessageBubble>
            </MessageContainer>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Chat Input */}
      <ChatInput>
        <Tooltip title="Chọn biểu tượng cảm xúc">
          <IconButton onClick={handleEmojiClick}>
            <InsertEmoticonIcon />
          </IconButton>
        </Tooltip>

        <StyledInput
          value={messageText}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
        />

        <FileIconButton onClick={() => handleFileIconClick('image')}>
          <ImageIcon />
        </FileIconButton>
        <FileIconButton onClick={() => handleFileIconClick('file')}>
          <AttachFileIcon />
        </FileIconButton>
        <FileIconButton onClick={() => handleFileIconClick('video')}>
          <AddIcon />
        </FileIconButton>

        <Tooltip title="Gửi">
          <IconButton onClick={handleSendMessage} disabled={isSending || !messageText.trim()}>
            <SendIcon />
          </IconButton>
        </Tooltip>
      </ChatInput>

      {/* Image Modal */}
      <Dialog open={!!openImage} onClose={handleClose}>
        <DialogContent>
          {openImage && <img src={openImage} alt="Image" style={{ width: '100%' }} />}
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={!!openVideo} onClose={handleClose}>
        <DialogContent>
          {openVideo && (
            <video width="100%" controls>
              <source src={openVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </DialogContent>
      </Dialog>

      {/* File Input */}
      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={(e) => handleFileUpload(e, 'image')}
      />
    </Box>
  );
};

export default BoxChat;
