import { createCourseCategory } from '@/api/api';
import courseApi from '@/api/courseApi';
import { setAppLoading } from '@/stores/slices/appSlice';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CUCategoryModal({
  open,
  onClose,
  onOk,
  data = null,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (data?.id) {
      setFormData({
        name: data.name,
      });
    } else {
      resetForm();
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      if (data?.id) {
        setFormData({
          name: data.name
        });
      } else {
        resetForm();
      }
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      name: ''
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
      !formData.name.trim()
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);

    try {
      dispatch(setAppLoading(true));
      if (data?.id) {
        await createCourseCategory({
          id: data.id,
          ...formData,
        });
        toast.success('Course updated successfully!');
      } else {
        await createCourseCategory(form);
        toast.success('Course created successfully!');
      }
      onOk();
      onClose(false);
      dispatch(setAppLoading(false));
    } catch (error) {
      dispatch(setAppLoading(false));
      toast.error('Failed to save the course.');
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
          {data?.id ? 'Cập nhập danh mục' : 'Tạo danh mục'}
        </Typography>
        <Divider />

        <Box
          sx={{
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                label="Tên danh mục"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
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
            Lưu danh mục
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
