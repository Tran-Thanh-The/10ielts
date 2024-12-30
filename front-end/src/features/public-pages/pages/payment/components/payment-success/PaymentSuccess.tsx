import React, { useEffect } from 'react';
import { Button, Typography, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard/courses/list');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f0f8ff"
      padding={3}
    >
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Thanh toán thành công!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Cảm ơn bạn đã hoàn thành thanh toán. Đơn hàng của bạn đã được ghi nhận.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        sx={{ mt: 3 }}
      >
        Quay về trang chủ
      </Button>
    </Box>
  );
};

export default PaymentSuccess;
