import { deleteUser, getUsers } from '@/api/api';
import CreateUpdateUserModal from '@/features/dashboard/features/user-management/features/user-list/components/create-update-user-modal/CreateUpdateUserModal';
import { setAppLoading } from '@/stores/slices/appSlice';
import { IUser } from '@/types/interface/User';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Box, Button, Chip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function UserListTab() {
  const dispatch = useDispatch();
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [refresh, setRefresh] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<IUser | null>(null);
  const [openCreateUpdateUserModal, setOpenCreateUpdateUserModal] =
    React.useState(false);

  useEffect(() => {
    handleFetchUsers();
  }, [refresh]);

  const handleFetchUsers = async () => {
    try {
      dispatch(setAppLoading(true));
      const response = await getUsers();
      setUsers(response?.data?.data ?? []);
      dispatch(setAppLoading(false));
    } catch (error) {
      console.log('Failed to fetch users');
    }
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteUser = async (id: number) => {
    try {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa user này?',
        showDenyButton: true,
        confirmButtonText: `Xóa`,
        denyButtonText: `Hủy`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch(setAppLoading(true));
          await deleteUser(id);
          setRefresh(!refresh);
        }
      });
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleUpdateUser = (user: IUser) => {
    setSelectedUser(user);
    setOpenCreateUpdateUserModal(true);
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{}}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ background: '#f4f4f4' }}>
              <TableCell>Họ và tên</TableCell>
              <TableCell align="left">Trạng thái</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Vai trò</TableCell>
              <TableCell align="left">Ngày sinh</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.fullName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.fullName}
                </TableCell>
                <TableCell align="left">
                  <Chip
                    label={row.status.toLocaleLowerCase()}
                    color={row.status === 'ACTIVE' ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">{row.role.name}</TableCell>
                <TableCell align="left">
                  {dayjs(row.dob).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="right">
                  {row.role.name === 'Admin' ? null : (
                    <Box sx={{ display: 'flex', gap: '12px' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleUpdateUser(row)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUser(row.id)}
                      >
                        Xóa
                      </Button>
                    </Box>
                  )}
                  {/* <Box sx={{ display: 'flex', gap: '12px' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleUpdateUser(row)}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(row.id)}
                    >
                      Xóa
                    </Button>
                  </Box> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateUpdateUserModal
        open={openCreateUpdateUserModal}
        onClose={(value: boolean) => {
          setOpenCreateUpdateUserModal(value);
          setRefresh(!refresh);
          setSelectedUser(null);
        }}
        onOk={() => setRefresh(!refresh)}
        data={selectedUser}
      ></CreateUpdateUserModal>
    </Box>
  );
}
