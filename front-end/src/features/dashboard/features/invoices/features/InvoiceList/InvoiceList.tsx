import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const mockData = [
  {
    id: 1,
    sender: 'Nguyễn Văn A',
    amount: 1000000,
    status: 'APPROVED',
    createdAt: '2021-10-10',
  },
  {
    id: 2,
    sender: 'Nguyễn Văn B',
    amount: 2000000,
    status: 'PENDING',
    createdAt: '2021-10-10',
  },
  {
    id: 3,
    sender: 'Nguyễn Văn C',
    amount: 3000000,
    status: 'PENDING',
    createdAt: '2021-10-10',
  },
  {
    id: 4,
    sender: 'Nguyễn Văn D',
    amount: 4000000,
    status: 'APPROVED',
    createdAt: '2021-10-10',
  },
  {
    id: 5,
    sender: 'Nguyễn Văn E',
    amount: 5000000,
    status: 'APPROVED',
    createdAt: '2021-10-10',
  },
  {
    id: 6,
    sender: 'Nguyễn Văn F',
    amount: 6000000,
    status: 'PENDING',
    createdAt: '2021-10-10',
  },
  {
    id: 7,
    sender: 'Nguyễn Văn G',
    amount: 7000000,
    status: 'PENDING',
    createdAt: '2021-10-10',
  },
  {
    id: 8,
    sender: 'Nguyễn Văn H',
    amount: 8000000,
    status: 'APPROVED',
    createdAt: '2021-10-10',
  },
  {
    id: 9,
    sender: 'Nguyễn Văn I',
    amount: 9000000,
    status: 'APPROVED',
    createdAt: '2021-10-10',
  },
  {
    id: 10,
    sender: 'Nguyễn Văn K',
    amount: 10000000,
    status: 'PENDING',
    createdAt: '2021-10-10',
  },
];

export default function InvoiceList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoToInvoiceDetail = () => {
    navigate('/dashboard/payments/1');
  };

  
  useEffect(() => {
    dispatch(setAppLoading(true));

    setTimeout(() => {
      dispatch(setAppLoading(false));
    }, 500);
  }, []);

  return (
    <FeatureLayout>
      <FeatureHeader title="Danh sách hóa đơn" />
      <Box sx={{ padding: '24px 0' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Box>
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{
                minWidth: 400,
                margin: 0,
                '& input': {
                  padding: '16px 14px',
                },
              }}
            />
          </Box>
        </Box>
        <Box sx={{ marginTop: '20px' }}>
          <TableContainer component={Paper} sx={{}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ background: '#f4f4f4' }}>
                  <TableCell>Mã hóa đơn</TableCell>
                  <TableCell align="left">Người gửi</TableCell>
                  <TableCell align="left">Số tiền</TableCell>
                  <TableCell align="left">Trạng thái</TableCell>
                  <TableCell align="left">Thời gian gửi</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={handleGoToInvoiceDetail}
                    >
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.sender}</TableCell>
                    <TableCell align="left">{row.amount}</TableCell>
                    <TableCell align="left">
                      <Chip
                        label={
                          row.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'
                        }
                        color={row.status === 'APPROVED' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="left">
                      {dayjs(row.createdAt).format('DD/MM/YYYY HH:mm')}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: '12px' }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleGoToInvoiceDetail}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                        >
                          Duyệt
                        </Button>
                        <Button variant="contained" size="small" color="error">
                          Hủy bỏ
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </FeatureLayout>
  );
}
