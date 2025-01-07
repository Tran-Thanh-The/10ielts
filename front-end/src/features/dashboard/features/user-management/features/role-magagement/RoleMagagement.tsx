import { deleteRole, getRoles } from '@/api/api';
import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { selectRoles, setRoles } from '@/stores/slices/appSlice';
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
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function RoleMagagement() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roles = useSelector(selectRoles);
  const [reload, setReload] = React.useState(false);

  useEffect(() => {
      getRoles().then((res) => {
        dispatch(setRoles(res.data.data));
      })
    }, [reload]);

  const handleDeleteRole = (id: number) => {
    Swal.fire({
      title: 'Xác nhận xóa vài trò?',
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Hủy',
      denyButtonText: 'Xóa',
    }).then(async (result) => {
      if (result.isDenied) {
        deleteRole(id).then(() => {
          setReload(!reload);
          toast.success('Xóa vai trò thành công');
        })
      }
    });
  };

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
                            onClick={() => handleDeleteRole(row.id)}
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
