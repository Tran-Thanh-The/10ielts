import { getAnswerHistories, getPracticeExercises } from '@/api/api';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import CreatePracticeModal from '@/features/dashboard/features/practices/components/CreatePracticeModal/CreatePracticeModal';
import PracticeCard from '@/features/dashboard/features/practices/components/PracticeCard/PracticeCard';
import PracticeFilter from '@/features/dashboard/features/practices/components/PracticeFilter/PracticeFilter';
import PracticeGroup from '@/features/dashboard/features/practices/components/PracticeGroup/PracticeGroup';
import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import { EPracticeFilter } from '@/types/enum/practice.enum';
import { ROLE } from '@/utils/constants/constants';
import {
  Box,
  Breadcrumbs,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

export default function UserPracticeSubmition() {
  const { idPractice } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [practices, setPractices] = React.useState([]);

  useEffect(() => {
    if (!idPractice) return;
    fetchPracticeSubmitions();
  }, [idPractice]);

  const fetchPracticeSubmitions = async () => {
    dispatch(setAppLoading(true));
    getAnswerHistories({
      practiceId: idPractice,
    }).then((response) => {
      setPractices(response.data.data);
      dispatch(setAppLoading(false));
    });
  };

  return (
    <FeatureLayout>
      <Breadcrumbs aria-label="breadcrumb">
        <Breadcrumb
          component="a"
          href="#"
          label="Danh sách bài luyện tập"
          icon={<LibraryBooksIcon fontSize="small" />}
          onClick={() => navigate('/dashboard/practices/submitions')}
        />
        <Breadcrumb label={"Bài luyện tập"} component="a" href="#" />
      </Breadcrumbs>
      <Box>
        <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <UserFilter
              buttonLabel="Tạo bài luyện tập"
              onButtonClick={() => setOpen(true)}
              hiddenButton={true}
            />
          </Box>
        </RoleBasedComponent>

        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">Danh sách bài nộp</Typography>

          <TableContainer component={Paper} sx={{}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ background: '#f4f4f4' }}>
                  <TableCell>Mã</TableCell>
                  <TableCell>Học sinh</TableCell>
                  <TableCell>Loại bài</TableCell>
                  <TableCell align="left">Thời gian làm</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {practices.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.user.fullName}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.writingAnswer ? 'Bài viết' : 'Bài nói'}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {dayjs(row.completedAt).format('DD/MM/YYYY HH:mm')}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '12px',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            navigate(
                              '/dashboard/practices/' + idPractice + '/submitions/' + row.id,
                            )
                          }
                        >
                          Xem chi tiết bài nộp
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
      <CreatePracticeModal
        open={open}
        onClose={setOpen}
        onOk={() => {}}
        data={[]}
      />
    </FeatureLayout>
  );
}
