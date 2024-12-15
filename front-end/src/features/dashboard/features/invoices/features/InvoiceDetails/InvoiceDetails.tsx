import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import React, { useEffect } from 'react';
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
} from '@mui/material';
import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { setAppLoading } from '@/stores/slices/appSlice';
import { useDispatch } from 'react-redux';

const InvoiceDetail = () => {
  const data = {
    companyInfo: {
      name: 'Công ty TNHH ABC',
      address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      phone: '0123 456 789',
      email: 'contact@abc.com',
    },
    clientInfo: {
      name: 'Nguyễn Văn A',
      company: 'Công ty TNHH XYZ',
      address: '456 Đường Hoàng Hoa Thám, Quận Bình Thạnh, TP.HCM',
      phone: '0987 654 321',
      email: 'nguyenvana@xyz.com',
    },
    invoiceInfo: {
      dateOfInvoice: '05/12/2025',
      invoiceNo: '#1234',
      dueDate: '06/12/2025',
      projectName: 'Thiết kế website',
    },
    items: [
      { description: 'Thiết kế logo', hours: 1, rate: 100, amount: 100 },
      {
        description: 'Chỉnh sửa file thiết kế',
        hours: 2,
        rate: 100,
        amount: 200,
      },
      { description: 'Thiết kế danh thiếp', hours: 3, rate: 100, amount: 300 },
      { description: 'Lập trình backend', hours: 1, rate: 100, amount: 100 },
      { description: 'Chỉnh sửa website', hours: 4, rate: 100, amount: 400 },
    ],
    tax: 5, // phần trăm
    paymentMethod: 'Chuyển khoản ngân hàng',
    totalAmount: 1100,
  };

  return (
    <Box
      p={4}
      style={{ maxWidth: '800px', margin: 'auto', border: '1px solid #ddd' }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        style={{ color: '#1e88e5' }}
      >
        HÓA ĐƠN
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box>
            <Typography>{data.companyInfo.name}</Typography>
            <Typography>{data.companyInfo.address}</Typography>
            <Typography>{data.companyInfo.phone}</Typography>
            <Typography>{data.companyInfo.email}</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box>
            <Typography>
              Ngày lập hóa đơn: {data.invoiceInfo.dateOfInvoice}
            </Typography>
            <Typography>Số hóa đơn: {data.invoiceInfo.invoiceNo}</Typography>
            <Typography>Hạn thanh toán: {data.invoiceInfo.dueDate}</Typography>
            <Typography>Dự án: {data.invoiceInfo.projectName}</Typography>
          </Box>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Typography variant="h6">Thông tin khách hàng:</Typography>
        <Box>
          <Typography>{data.clientInfo.name}</Typography>
          <Typography>{data.clientInfo.company}</Typography>
          <Typography>{data.clientInfo.address}</Typography>
          <Typography>{data.clientInfo.phone}</Typography>
          <Typography>{data.clientInfo.email}</Typography>
        </Box>
      </Box>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mô tả</TableCell>
              <TableCell>Số giờ</TableCell>
              <TableCell>Đơn giá (USD)</TableCell>
              <TableCell>Thành tiền (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.hours}</TableCell>
                <TableCell>${item.rate}</TableCell>
                <TableCell>${item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2} textAlign="right">
        <Typography>
          Tạm tính: ${data.totalAmount - (data.totalAmount * data.tax) / 100}
        </Typography>
        <Typography>
          Thuế ({data.tax}%): ${(data.totalAmount * data.tax) / 100}
        </Typography>
        <Typography>Tổng cộng: ${data.totalAmount}</Typography>
      </Box>
      <Box mt={3}>
        <Typography variant="h6">Ghi chú:</Typography>
        <Box
          style={{
            border: '1px solid #ddd',
            padding: '10px',
            minHeight: '50px',
          }}
        >
          Vui lòng thanh toán trước ngày {data.invoiceInfo.dueDate}.
        </Box>
      </Box>
      <Box mt={2}>
        <Typography>Phương thức thanh toán: {data.paymentMethod}</Typography>
      </Box>
      <Typography align="center" mt={2}>
        Xin cảm ơn!
      </Typography>
    </Box>
  );
};

export default function InvoiceDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setAppLoading(true));

    setTimeout(() => {
      dispatch(setAppLoading(false));
    }, 500);
  }, []);

  return (
    <FeatureLayout>
      <FeatureHeader title="Chi tiết hóa đơn" />
      <Box sx={{ padding: '24px 0' }}>
        <Box sx={{ marginBottom: "20px" }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Breadcrumb
              component="a"
              href="#"
              label="Danh sách hóa đơn"
              onClick={() => navigate('/dashboard/payments')}
            />
            <Breadcrumb label={'Hóa đơn chi tiết'} component="a" href="#" />
          </Breadcrumbs>
        </Box>
        <InvoiceDetail />
      </Box>
    </FeatureLayout>
  );
}
