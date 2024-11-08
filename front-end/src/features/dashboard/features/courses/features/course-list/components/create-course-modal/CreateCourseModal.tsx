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
import { toast } from 'react-toastify';

export default function CreateCourseModal({
  open,
  onClose,
  onOk,
  data = null,
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    category_id: '',
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await courseApi.getCategories();
        setCategories(response?.data?.data ?? []);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  // Initialize form data if editing an existing course
  useEffect(() => {
    if (data?.id) {
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.photo.path, // No need to load image here
        category_id: data.category.id,
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
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.photo.path, // No need to load image here
          category_id: data.category.id,
        });
      } else {
        resetForm();
      }
    }
  }, [open]);

  // Helper function to reset form fields
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null,
      category_id: '',
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

  // Handle image input change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0], // Store file object
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category_id
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Prepare form data to send via multipart/form-data
    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('category_id', formData.category_id);

    if (formData.image) {
      form.append('file', formData.image); // Append the file if present
    }

    try {
      dispatch(setAppLoading(true));
      if (data?.id) {
        await courseApi.updateCourse(data.id, form); // Pass FormData
        toast.success('Course updated successfully!');
      } else {
        await courseApi.createCourse(form); // Pass FormData
        toast.success('Course created successfully!');
      }
      onOk();
      onClose(false);
    } catch (error) {
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
          {data?.id ? 'Cập nhập khóa học' : 'Tạo khóa học'}
        </Typography>
        <Divider />

        <Box
          sx={{
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {formData.image && (
                <Box mt={2}>
                  <img
                    src={
                      data?.id
                        ? formData.image
                        : formData.image ?? URL.createObjectURL(formData.image)
                    }
                    alt="Course Preview"
                    style={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: '12px',
                    }}
                  />
                </Box>
              )}
              {!formData.image && (
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Tải ảnh bìa
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              )}

              <TextField
                label="Tên khóa học"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />

              <Box
                sx={{ display: 'flex', alignContent: 'center', gap: '20px' }}
              >
                <Select
                  label="Danhh mục"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>

                <TextField
                  label="Giá (VND)"
                  name="price"
                  type="number"
                  inputProps={{ step: '0.01', min: '0' }}
                  value={formData.price}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Box>

              <TextField
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
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
            Lưu khóa học
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
