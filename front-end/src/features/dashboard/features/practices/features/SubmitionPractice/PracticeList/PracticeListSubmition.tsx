import { getPracticeExercises } from '@/api/api';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import CreatePracticeModal from '@/features/dashboard/features/practices/components/CreatePracticeModal/CreatePracticeModal';
import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import { EPracticeFilter } from '@/types/enum/practice.enum';
import { ROLE } from '@/utils/constants/constants';
import {
  Box,
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
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function PracticeListSubmition() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filter, setFilter] = React.useState(EPracticeFilter.ALL);
  const [open, setOpen] = React.useState(false);
  const [practices, setPractices] = React.useState([]);

  useEffect(() => {
    fetchPractices();
  }, [filter]);

  const fetchPractices = async () => {
    dispatch(setAppLoading(true));
    getPracticeExercises().then((response) => {
      setPractices(
        response.data.data.filter(
          (item) =>
            item.practiceType === EPracticeFilter.SPEAKING ||
            item.practiceType === EPracticeFilter.WRITING,
        ),
      );
      dispatch(setAppLoading(false));
    });
  };

  return (
    <FeatureLayout>
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
          <Typography variant="h6">Danh sách bộ đề</Typography>

          <TableContainer component={Paper} sx={{}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ background: '#f4f4f4' }}>
                  <TableCell>Mã</TableCell>
                  <TableCell></TableCell>
                  <TableCell align="left">Bài luyện tập</TableCell>
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
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell component="th" scope="row">
                      {row.title}
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
                              '/dashboard/practices/' + row.id + '/submitions',
                            )
                          }
                        >
                          Xem danh sách bài nộp
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
