import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Breadcrumbs,
  Chip,
} from '@mui/material';
import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import { useNavigate, useParams } from 'react-router-dom';
import { setAppLoading } from '@/stores/slices/appSlice';
import { useDispatch } from 'react-redux';
import { InvoiceDetails } from '@/api/api';

const InvoiceDetail: React.FC<{ data: any }> = ({ data }) => {
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getPaymentStatusChip = (status: boolean) => {
    return (
      <Chip
        label={status ? 'Đã thanh toán' : 'Chưa thanh toán'}
        color={status ? 'success' : 'error'}
        size="small"
      />
    );
  };

  return (
    <Box
      p={4}
      sx={{
        maxWidth: '800px',
        margin: 'auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: '#1e88e5', marginBottom: 3 }}
      >
        HÓA ĐƠN
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Thông tin hóa đơn
            </Typography>
            <Typography>Mã hóa đơn: {data.orderCode}</Typography>
            <Typography>Ngày tạo: {formatDate(data.createdAt)}</Typography>
            <Typography>
              Trạng thái: {getPaymentStatusChip(data.paymentStatus)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Chi tiết thanh toán
            </Typography>
            <Typography>Số tiền: {formatCurrency(data.money)}</Typography>
            <Typography>Trạng thái đơn hàng: {data.status}</Typography>
            <Typography>Mã người dùng: {data.userId}</Typography>
          </Box>
        </Grid>
      </Grid>

      {data.description && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Mô tả:
          </Typography>
          <Box
            sx={{
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography>{data.description}</Typography>
          </Box>
        </Box>
      )}

      {data.invoiceProducts && data.invoiceProducts.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell align="right">Giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.invoiceProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(product.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box mt={3} textAlign="right">
        <Typography variant="h6">
          Tổng cộng: {formatCurrency(data.money)}
        </Typography>
      </Box>
    </Box>
  );
};

export default function InvoiceDetailsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [invoiceData, setInvoiceData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!id) return;

      dispatch(setAppLoading(true));
      try {
        const response = await InvoiceDetails(id);
        setInvoiceData(response.data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        dispatch(setAppLoading(false));
        setLoading(false);
      }
    };

    fetchInvoiceData();
  }, [id, dispatch]);

  if (loading) {
    return null;
  }

  return (
    <FeatureLayout>
      <FeatureHeader title="Chi tiết hóa đơn" />
      <Box sx={{ padding: '24px 0' }}>
        <Box sx={{ marginBottom: '20px' }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Breadcrumb
              component="a"
              href="#"
              label="Danh sách hóa đơn"
              onClick={() => navigate('/dashboard/payments')}
            />
            <Breadcrumb label="Hóa đơn chi tiết" component="a" href="#" />
          </Breadcrumbs>
        </Box>
        {invoiceData && <InvoiceDetail data={invoiceData} />}
      </Box>
    </FeatureLayout>
  );
}
