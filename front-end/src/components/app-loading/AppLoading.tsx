import loadingIcon from '@/assets/app-loading.gif';
import { selectAppLoading } from '@/stores/slices/appSlice';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

export default function AppLoading() {
  const appLoading = useSelector(selectAppLoading);

  return appLoading ? (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.2)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <img src={loadingIcon} alt="loading" />
      </Box>
    </Box>
  ) : null;
}
