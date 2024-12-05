import React from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  Avatar, 
  Paper 
} from '@mui/material';

interface Conversation {
  id: number;
  customer: string;
  lastMessage: string;
  avatar: string;
  timestamp?: string;
}

interface ListConversationProps {
  conversations: Conversation[];
  selectedConversation: number | null;
  onSelectConversation: (id: number) => void;
}

const ListConversation: React.FC<ListConversationProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation
}) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: '100%', 
        // borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Stack 
        spacing={0.5} 
        sx={{ 
        //   py: 1,
          maxHeight: '500px', 
          overflowY: 'auto' 
        }}
      >
        {conversations.map(chat => (
          <Box
            key={chat.id}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: selectedConversation === chat.id 
                ? '#ebf5ff' 
                : 'background.default',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'scale(1.01)'
              },
              display: 'flex',
              alignItems: 'center',
              p: 2,
              gap: 2,
              borderLeft: selectedConversation === chat.id 
                ? '4px solid' 
                : '4px solid transparent',
              borderLeftColor: selectedConversation === chat.id 
                ? 'primary.main' 
                : 'transparent'
            }}
            onClick={() => onSelectConversation(chat.id)}
          >
            <Avatar 
              src={chat.avatar} 
              sx={{ 
                width: 48, 
                height: 48,
                border: '2px solid',
                borderColor: 'divider'
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
                    whiteSpace: 'nowrap'
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