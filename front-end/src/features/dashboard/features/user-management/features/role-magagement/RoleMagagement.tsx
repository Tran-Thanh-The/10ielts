import CreateUpdateUserModal from '@/features/dashboard/features/user-management/features/user-list/components/create-update-user-modal/CreateUpdateUserModal';
import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import UserListTab from '@/features/dashboard/features/user-management/features/user-list/components/user-list-tab/UserListTab';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { selectRoles } from '@/stores/slices/appSlice';
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
} from '@mui/material';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function RoleMagagement() {
  const navigate = useNavigate();
  const roles = useSelector(selectRoles);

  return (
    <FeatureLayout>
      <FeatureHeader title="Quản lý vai trò">
        <UserFilter
          buttonLabel="Tạo vai trò"
          onButtonClick={() =>
            navigate('/dashboard/user-management/role/create')
          }
        />
      </FeatureHeader>

      <Box sx={{ width: '100%' }}>
        <Box>
          <TableContainer component={Paper} sx={{}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ background: '#f4f4f4' }}>
                  <TableCell>Mã</TableCell>
                  <TableCell></TableCell>
                  <TableCell align="left">Vai trò</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
                      {row.name === 'Admin' || row.name === 'User' ? null : (
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
                                '/dashboard/user-management/role/update/' +
                                  row.id,
                              )
                            }
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            // onClick={() => handleDeleteUser(row.id)}
                          >
                            Xóa
                          </Button>
                        </Box>
                      )}
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

export default RoleMagagement;
