import courseApi from '@/api/courseApi';
import { Box, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function CourseFilter() {
  const [categories, setCategories] = React.useState([]);

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

  return (
    <Box sx={{ display: 'flex', gap: '20px', flex: 1, alignItems: 'center' }}>
      <Box flex={1}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          fullWidth
          margin="normal"
          sx={{
            minWidth: 400,
            margin: 0,
            '& input': {
              padding: '16px 14px',
            },
          }}
        />
      </Box>
      <Box flex={1}>
        <Select label="Danh mục" placeholder="Danh mục" fullWidth value={0}>
          <MenuItem value={0}>Tất cả</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box flex={1}>
        <Select
          label="Phân loại"
          placeholder="Phân loại"
          size="small"
          fullWidth
          value={0}
        >
          <MenuItem value={0}>Tất cả</MenuItem>
          {/* Với staff/admin */}
          <MenuItem>Đã xuất bản</MenuItem>
          <MenuItem>Chưa xuất bản xuất bản</MenuItem>
          {/* Với user */}
          <MenuItem>Đã đăng ký</MenuItem>
          <MenuItem>Chưa đăng ký</MenuItem>
        </Select>
      </Box>
    </Box>
  );
}
