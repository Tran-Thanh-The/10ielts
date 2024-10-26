import courseApi from '@/api/courseApi';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function CreateCourseModal({
  open,
  onClose,
  onOk,
  data = null,
}) {
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
        image: null, // No need to load image here
        category_id: data.category.id,
      });
    } else {
      resetForm();
    }
  }, [data]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) resetForm();
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
          gap: 3,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          {data?.id ? 'Update Course' : 'Create Course'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Image Preview */}
            {formData.image && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Course Preview"
                  style={{
                    width: '100%',
                    maxHeight: 100,
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}
            {/* Image Upload */}
            <Button
              variant="contained"
              component="label"
              startIcon={<AddIcon />}
              fullWidth
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>

            {/* Course Name */}
            <TextField
              label="Course Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />

            {/* Category Selection */}
            <Select
              label="Category"
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

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
            />

            {/* Price */}
            <TextField
              label="Price ($)"
              name="price"
              type="number"
              inputProps={{ step: '0.01', min: '0' }}
              value={formData.price}
              onChange={handleChange}
              required
              fullWidth
            />
          </Box>
        </form>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={() => onClose(false)} sx={{ padding: '6px 24px' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ padding: '6px 24px' }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
