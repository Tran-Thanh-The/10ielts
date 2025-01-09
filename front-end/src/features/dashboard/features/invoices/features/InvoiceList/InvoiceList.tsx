import { getInvoiceList, updateInvoiceStatus } from '@/api/api';
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
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

export default function InvoiceList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataInvoices, setDataInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page] = useState(1);
  const [limit] = useState(10);

  const fetchInvoices = async (search: string) => {
    dispatch(setAppLoading(true));
    try {
      const data = await getInvoiceList(page, limit, search);
      setDataInvoices(data.data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      dispatch(setAppLoading(false));
    }
  };

  // Create debounced search function with 3 second delay
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        fetchInvoices(term);
      }, 3000),
    [],
  );

  useEffect(() => {
    fetchInvoices('');

    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleApproveInvoice = async (id: number, paymentStatus: boolean) => {
    if (paymentStatus) {
      alert('Hóa đơn này đã được duyệt trước đó!');
      return;
    }

    try {
      await updateInvoiceStatus(id, {
        paymentStatus: true,
      });
      setDataInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === id
            ? { ...invoice, paymentStatus: true, status: 'APPROVED' }
            : invoice,
        ),
      );
      alert('Duyệt hóa đơn thành công!');
    } catch (err) {
      console.error('Error updating invoice status:', err);
      alert('Duyệt hóa đơn thất bại!');
    }
  };

  const handleGoToInvoiceDetail = (id: string) => {
    navigate(`/dashboard/payments/${id}`);
  };

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
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm theo mã hóa đơn, tên người dùng..."
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
          <TableContainer component={Paper}>
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
                {dataInvoices.map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={() => handleGoToInvoiceDetail(row.id)}
                    >
                      {row.orderCode || index + 1}
                    </TableCell>
                    <TableCell align="left">{row.user?.fullName}</TableCell>
                    <TableCell align="left">{row.money}</TableCell>
                    <TableCell align="left">
                      <Chip
                        label={
                          row.paymentStatus === true
                            ? 'Đã duyệt'
                            : 'Đang chờ duyệt'
                        }
                        color={row.paymentStatus === true ? 'success' : 'error'}
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
                          onClick={() => handleGoToInvoiceDetail(row.id)}
                        >
                          Xem chi tiết
                        </Button>
                        {row.paymentStatus === false && (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() =>
                              handleApproveInvoice(row.id, row.paymentStatus)
                            }
                          >
                            Duyệt
                          </Button>
                        )}
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
