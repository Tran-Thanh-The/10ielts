import conversationApis from '@/api/conversationApi';
import GroupIcon from '@mui/icons-material/Group';
import { Box, CircularProgress, createTheme, Paper, Tab, Tabs, ThemeProvider } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import BoxChat from './components/chat-box/ChatBox';
import ListConversation from './components/list-conversation/ListConversation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
  },
});

const Chat = () => {
  const dispatch = useDispatch();
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const fetchConversationMessages = async (id: number) => {
    setLoadingMessages(true);
    try {
      const response = await conversationApis.getConversationMessages(id.toString(), {
        page: 1,
        limit: 20,
      });
      setMessages(response.data.result);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    fetchConversationMessages(conversation.id);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" height="100vh">
        {/* Sidebar */}
        <Paper elevation={3} sx={{ width: '300px', borderRight: '1px solid #e0e0e0' }}>
          <Tabs
            value={0}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab icon={<GroupIcon />} label="List Chat" />
          </Tabs>
          <ListConversation onSelectConversation={handleSelectConversation} />
        </Paper>

        {/* Chat Box */}
        <Box flexGrow={1}>
          {selectedConversation ? (
            loadingMessages ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
            ) : (
              <BoxChat
                conversation={selectedConversation}
              />
            )
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <p>Select a conversation to start chatting</p>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;

