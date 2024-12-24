import { ArrowBackIosNewRounded } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type FeatureHeaderProps = {
  title: string;
  description?: string;
  backPath?: string;
  children?: React.ReactNode;
};

export default function FeatureHeader({
  title,
  description,
  backPath,
  children,
}: FeatureHeaderProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        paddingBottom: '30px',
        borderBottom: '1px solid #e0e0e0',
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box sx={{ flex: 1 }}>
        {backPath ? (
          <Button
            variant="text"
            startIcon={<ArrowBackIosNewRounded />}
            onClick={() => navigate(backPath)}
          >
            Back
          </Button>
        ) : null}
        <Typography variant="h6">{title}</Typography>
        {description ? (
          <Typography variant="body1">{description}</Typography>
        ) : null}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}
