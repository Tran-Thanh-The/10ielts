import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  styled,
  CircularProgress,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { QRCodeCanvas } from 'qrcode.react';
import { PaymentData } from '@/types/interface/PaymentData';
import paymentApi from '@/api/paymentApi';

const StyledBox = styled(Box)({
  maxWidth: '500px',
  margin: 'auto',
  textAlign: 'center',
  '& .MuiTypography-body1': {
    marginTop: '24px',
    '& strong': {
      fontWeight: 'bold',
      marginRight: '8px',
      color: '#333333',
    },
    '& span': {
      color: '#666666',
    },
  },
  '& .MuiButton-root': {
    marginTop: '24px',
    backgroundColor: '#1976d2',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
});

const StyledInfoBox = styled(Box)({
  backgroundColor: '#fff3e0',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '8px',
  padding: '12px 16px',
});

const Checkout = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(type, id);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await paymentApi.postPayment(type!, id!);
      setPaymentData(response.data);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Type:', typeof type);
    console.log('ID:', typeof id);
  }, [type, id]);

  useEffect(() => {
    fetchPaymentData();
  }, [type, id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', height: '60vh' }}>
        <CircularProgress />
        <Typography
          variant="h6"
          style={{ marginTop: '10px', marginBottom: '20px' }}
        >
          Đang tải dữ liệu thanh toán...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '50px',
          marginBottom: '20px',
          height: '60vh',
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchPaymentData}>
          Thử lại
        </Button>
      </div>
    );
  }

  // const paymentData = {
  //   bin: '970422',
  //   accountNumber: 'VQRQAAUQA6336',
  //   accountName: 'NGUYEN TIEN ANH',
  //   amount: 100000,
  //   description: 'Payment for course',
  //   orderCode: 1731078729667,
  //   currency: 'VND',
  //   paymentLinkId: '193d94fd35fd49ceaf32567c80724295',
  //   status: 'PENDING',
  //   checkoutUrl: 'https://pay.payos.vn/web/193d94fd35fd49ceaf32567c80724295',
  //   qrCode:
  //     '00020101021238570010A000000727012700069704220113VQRQAAUQA63360208QRIBFTTA530370454061000005802VN62220818Payment for course6304AC3C',
  // };

  return (
    <Box p={4} maxWidth="lg" mx="auto" my={5}>
      <Typography
        color="#0071f9"
        variant="h5"
        align="center"
        gutterBottom
        mb={5}
        paddingBottom={'5px'}
        borderBottom={'1px solid #0071f9'}
      >
        Tiến hành thanh toán
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: '16px' }}>
            <StyledBox>
              <Typography variant="h6" fontWeight="bold" color="#333333">
                Thông tin thanh toán
              </Typography>
              <div style={{ marginTop: '24px' }}>
                <QRCodeCanvas value={paymentData.qrCode} size={180} />
              </div>
              <Typography variant="body1">
                <strong>Tên tài khoản:</strong>{' '}
                <span>{paymentData.accountName}</span>
              </Typography>
              <Typography variant="body1">
                <strong>Số tài khoản:</strong>{' '}
                <span>{paymentData.accountNumber}</span>
              </Typography>
              <Typography variant="body1">
                <strong>Số tiền:</strong>{' '}
                <span>
                  {paymentData.amount.toLocaleString('vi-VN')}{' '}
                  {paymentData.currency}
                </span>
              </Typography>
              <Typography variant="body1">
                <strong>Mã đơn hàng:</strong>{' '}
                <span>{paymentData.orderCode}</span>
              </Typography>
              <Typography variant="body1">
                <strong>Ghi chú:</strong> <span>{paymentData.description}</span>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.open(paymentData.checkoutUrl, '_blank')}
              >
                Thanh toán ngay
              </Button>
            </StyledBox>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: '16px' }}>
            <Typography variant="h6" fontWeight="bold" color="#333333">
              Sản phẩm:
            </Typography>
            <Typography color="#666666" mt={1}>
              • TOEIC mất gốc đến LR 300 & SW 100
            </Typography>

            <Typography variant="h6" fontWeight="bold" mt={3} color="#333333">
              Tổng giá bán:
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#333333" mt={1}>
              1.000.000 VND
            </Typography>

            <Box mt={3} p={2} bgcolor="#f0fff4" borderRadius={2}>
              <Typography display="flex" alignItems="center" color="#666666">
                <LocalOfferIcon
                  fontSize="small"
                  sx={{ mr: 1, color: '#FF9800' }}
                />
                <span>Chưa có mã khuyến mãi</span>
              </Typography>
            </Box>

            <Typography mt={3} variant="h6" fontWeight="bold" color="#333333">
              Giá bán sau khuyến mãi
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#1976d2" mt={1}>
              1.000.000 VND
            </Typography>

            <StyledInfoBox>
              <InfoIcon sx={{ color: '#f57c00', marginRight: '8px' }} />
              <Typography variant="body2" color="#666666">
                Hơn 12.567 học viên của Prep đã sử dụng lộ trình này!
              </Typography>
            </StyledInfoBox>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
