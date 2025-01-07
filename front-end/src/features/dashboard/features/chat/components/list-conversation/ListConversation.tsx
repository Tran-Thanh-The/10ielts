import React, { useEffect, useState, useCallback } from 'react';
  import { Box, Stack, Typography, Avatar, Paper } from '@mui/material';
  import { useDispatch } from 'react-redux';
  import { setAppLoading } from '@/stores/slices/appSlice';
  import conversationApis from '@/api/conversationApi';
  import { useSocket } from '@/context/SocketContext';
  import formatToVietnamTime from '@/utils/formatter/format-vietnamese-time';
  
  export interface Conversation {
    id: string;
    customer: string;
    lastMessage: string;
    avatar: string;
    timestamp?: string;
  }
  
  interface ListConversationProps {
    conversationCurrents?: any[];
    onSelectConversation: (conversation: Conversation) => void;
  }
  
  const ListConversation: React.FC<ListConversationProps> = ({ conversationCurrents, onSelectConversation }) => {
    const dispatch = useDispatch();
    const { socket } = useSocket();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  
    const updateConversationMessage = useCallback((conversationId: string, message: any) => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: message.message || message.content || 'Không có nội dung',
            timestamp: message.createdAt ? formatToVietnamTime(new Date(message.createdAt)) : undefined,
          };
        }
        return conv;
      }));
    }, []);
  
    useEffect(() => {
      if (!socket) return;
  
      const handleNewMessage = (data: {
        conversationId: string;
        message: {
          content: string;
          createdAt: string;
        }
      }) => {
        console.log('Nhận tin nhắn mới:', data.message);
        updateConversationMessage(data.conversationId, {
          content: data.message.content,
          createdAt: data.message.createdAt
        });
      };
  
      const handleNewConversation = (newConversation: any) => {
        console.log('Nhận conversation mới:', newConversation);
        setConversations(prev => [{
          id: newConversation.id,
          customer: newConversation.conversationName,
          lastMessage: 'Cuộc hội thoại mới',
          avatar: newConversation.avatar,
          timestamp: formatToVietnamTime(new Date(newConversation.createdAt))
        }, ...prev]);
      };
  
      socket.on('newMessage', handleNewMessage);
      socket.on('newConversation', handleNewConversation);
  
      return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('newConversation', handleNewConversation);
      };
    }, [socket, updateConversationMessage]);
  
    const fetchConversationMessages = async (conversationId: string) => {
      try {
        const messagesResponse = await conversationApis.getConversationMessages(
          conversationId,
          {
            page: 1,
            limit: 1,
          }
        );
  
        const messages = messagesResponse.data?.result || messagesResponse.data?.data || [];
  
        let lastMessage = null;
        if (Array.isArray(messages) && messages.length > 0) {
          lastMessage = messages[0];
        } else if (typeof messages === 'object' && messages !== null) {
          lastMessage = messages;
        }
  
        if (lastMessage) {
          updateConversationMessage(conversationId, lastMessage);
        }
      } catch (error) {
        console.error('Lỗi khi tải tin nhắn:', error);
        updateConversationMessage(conversationId, {
          content: 'Lỗi tải tin nhắn',
          createdAt: new Date()
        });
      }
    };
  
    const fetchStaffConversations = async () => {
      dispatch(setAppLoading(true));
      try {
        const response = await conversationApis.getAllStaffConversations({
          page: 1,
          limit: 10,
        });
  
        if (!response.data?.result) {
          throw new Error('Không tìm thấy cuộc hội thoại nào');
        }
  
        const fetchedConversations = response.data.result;
  
        const initialConversations = fetchedConversations.map(conversation => ({
          id: conversation.id,
          customer: conversation.conversationName,
          lastMessage: 'Đang tải...',
          avatar: conversation.avatar,
          timestamp: undefined,
        }));
  
        setConversations(initialConversations);
  
        fetchedConversations.forEach(conversation => {
          fetchConversationMessages(conversation.id);
        });
  
      } catch (error) {
        console.error('Lỗi khi tải danh sách hội thoại:', error);
        setConversations([]);
      } finally {
        dispatch(setAppLoading(false));
      }
    };
  
    useEffect(() => {
      fetchStaffConversations();
    }, []);
  
    const handleSelectConversation = (id: string) => {
      const selected = conversations.find(conv => conv.id === id);
      if (selected) {
        setSelectedConversation(id);
        onSelectConversation(selected);
        fetchConversationMessages(id);
      }
    };
  
    return (
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Stack
          spacing={0.5}
          sx={{
            maxHeight: '500px',
            overflowY: 'auto',
          }}
        >
          {conversations.map((chat) => (
            <Box
              key={chat.id}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: selectedConversation === chat.id ? '#ebf5ff' : 'background.default',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'scale(1.01)',
                },
                display: 'flex',
                alignItems: 'center',
                p: 2,
                gap: 2,
                borderLeft: selectedConversation === chat.id ? '4px solid' : '4px solid transparent',
                borderLeftColor: selectedConversation === chat.id ? 'primary.main' : 'transparent',
              }}
              onClick={() => handleSelectConversation(chat.id)}
            >
              <Avatar
                src={chat.avatar}
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid',
                  borderColor: 'divider',
                }}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%' }}
              >
                <Stack>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: '#4b5563' }}
                  >
                    {chat.customer}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chat.lastMessage}
                  </Typography>
                </Stack>
                {chat.timestamp && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    {chat.timestamp}
                  </Typography>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>
    );
  };
  
  export default ListConversation;