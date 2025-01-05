import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Tabs, Tab, createTheme, ThemeProvider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import ListConversation from './components/list-conversation/ListConversation';
import BoxChat from './components/chat-box/ChatBox';
import { useDispatch } from 'react-redux';
import { setAppLoading } from '@/stores/slices/appSlice';
import conversationApis from '@/api/conversationApi';


const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
  },
});

const myChats = [
  {
    id: 1,
    employee: 'Nhân viên A',
    customer: 'Khách hàng 1',
    lastMessage: 'Nhân viên A: Chúng tôi có thể giúp gì cho bạn?',
    avatar: '/avatar2.jpg',
  },
  {
    id: 2,
    employee: 'Nhân viên B',
    customer: 'Khách hàng 2',
    lastMessage: 'Khách hàng: Tôi có vấn đề với đơn hàng',
    avatar: '/avatar3.jpg',
  },
];

const teamChats = [
  {
    id: 3,
    employee: 'Nhân viên A',
    customer: 'Khách hàng 4',
    lastMessage: 'Nhân viên A: Chúng tôi có thể giúp gì cho bạn?',
    avatar: '/avatar2.jpg',
  },
  {
    id: 4,
    employee: 'Nhân viên B',
    customer: 'Khách hàng 3',
    lastMessage: 'Khách hàng: Tôi có vấn đề với đơn hàng',
    avatar: '/avatar3.jpg',
  },
  
];

const Chat = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [staffAllChats, setStaffAllChats] = useState({});

  useEffect(() => {
    fetchStaffAllChats();
    console.log(staffAllChats);
  }, []);

  const fetchStaffAllChats = async () => {
    try {
      dispatch(setAppLoading(true));
      // Call API to get all chats
      const response = await conversationApis.getAllStaffConversations({
        page: 1,
        limit: 10,
      });
      setStaffAllChats(response.data);
      dispatch(setAppLoading(false));
    } catch (error) {
      dispatch(setAppLoading(false));
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedConversation(null);
  };

  const handleSelectConversation = (id: number) => {
    setSelectedConversation(id);
  };

  const conversations = selectedTab === 0 ? myChats : teamChats;

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" height="100vh">
        {/* Sidebar */}
        <Paper elevation={3} sx={{ width: '300px', borderRight: '1px solid #e0e0e0' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<ChatIcon />} label="My Chat" />
            <Tab icon={<GroupIcon />} label="List Chat" />
          </Tabs>

          <ListConversation
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        </Paper>

        {/* Chat Box */}
        <Box flexGrow={1}>
          <BoxChat
            conversation={
              conversations.find(chat => chat.id === selectedConversation) || null
            }
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Chat;
