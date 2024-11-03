import { Box } from '@mui/material';

export default function FeatureLayout({ children }) {
  return (
    <Box
      sx={{
        padding: '32px',
        maxHeight: 'calc(100vh - 60px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
}
