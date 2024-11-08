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

  // Initialize form data if editing an existing course
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

  // Reset form when modal is closed
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

  // Helper function to reset form fields
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      dob: null,
      role: 0,
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    console.log(formData);
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.dob ||
      (!data.id && !formData.password) ||
      !formData.role
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Prepare form data to send via multipart/form-data
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
        toast.success('Course updated successfully!');
      } else {
        await createUser(body);
        toast.success('Course created successfully!');
      }
      onOk();
      onClose(false);
    } catch (error) {
      toast.error('Failed to save the course.', error);
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
                >
                  {ROLES.map((category) => (
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
            Lưu user
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
