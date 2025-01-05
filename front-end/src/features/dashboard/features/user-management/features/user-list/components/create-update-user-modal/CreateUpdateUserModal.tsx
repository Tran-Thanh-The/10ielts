import { createUser, updateUser } from '@/api/api';
import { setAppLoading } from '@/stores/slices/appSlice';
import { IUser } from '@/types/interface/User';
import { ROLES } from '@/utils/constants/constants';
import {
  Box,
  Button,
  Divider,
  InputBase,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function CreateUpdateUserModal({
  open,
  onClose,
  onOk,
  data = null,
}: {
  open: boolean;
  onClose: (value: boolean) => void;
  onOk: () => void;
  data?: IUser | null;
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    dob: null,
    role: 0,
  });

  // Extract role based on URL
  const getRoleFromUrl = () => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('student')) return 'User';
      if (pathname.includes('staff')) return 'Staff';
    }
    return null;
  };

  // Lấy role từ URL
  // Lấy role từ URL và gán trực tiếp khi modal mở
  useEffect(() => {
    const pathRole = window.location.pathname.includes('student')
      ? 'User'
      : 'Staff';
    const defaultRole = ROLES.find((role) => role.name === pathRole)?.id ?? 0;

    setFormData((prevState) => ({
      ...prevState,
      role: defaultRole,
    }));
  }, [open]);

  const currentRole = getRoleFromUrl();

  // Filter roles based on current URL
  const filteredRoles = ROLES.filter((role) => role.name === currentRole);

  useEffect(() => {
    if (data?.id) {
      setFormData({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        dob: data.dob,
        role: data.role.id,
      });
    } else {
      resetForm();
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      if (data?.id) {
        setFormData({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          dob: data.dob,
          role: data.role.id,
        });
      } else {
        resetForm();
      }
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      dob: null,
      role: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.dob ||
      (!data?.id && (!formData.password || formData.password.trim() === '')) ||
      !formData.role
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const body = {
      email: formData.email,
      password: formData.password ?? undefined,
      fullName: formData.fullName,
      dob: formData.dob,
      role: { id: formData.role },
    };

    try {
      dispatch(setAppLoading(true));
      if (data?.id) {
        await updateUser(data.id, body);
        toast.success('User updated successfully!');
      } else {
        await createUser(body);
        toast.success('User created successfully!');
      }
      onOk();
      onClose(false);
    } catch (error) {
      toast.error('Failed to save the user.');
      console.error('Error:', error);
    } finally {
      dispatch(setAppLoading(false));
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          width: 800,
          bgcolor: 'background.paper',
          padding: '24px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          {data?.id ? 'Cập nhập user' : 'Tạo user'}
        </Typography>
        <Divider />

        <Box
          sx={{
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: '12px 0',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />

              {data?.id ? null : (
                <TextField
                  label="Mật khẩu"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              )}

              <Box
                sx={{ display: 'flex', alignContent: 'center', gap: '20px' }}
              >
                <Select
                  label="Vai trò"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  fullWidth
                  disabled // Ngăn người dùng chỉnh sửa
                >
                  {filteredRoles.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box>
                <Typography>Ngày sinh</Typography>
                <InputBase
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  fullWidth
                ></InputBase>
              </Box>
            </Box>
          </form>
        </Box>
        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => onClose(false)}
            sx={{ padding: '6px 24px' }}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {data?.id ? 'Cập nhập user' : 'Tạo user'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
