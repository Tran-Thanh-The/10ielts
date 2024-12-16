import courseApi from '@/api/courseApi';
import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice';
import { Box, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CourseFilter({ refreshPage }: any) {
  const navigate = useNavigate();
  const studentDashboard = useSelector(selectIsStudentDashboard);
  const [categories, setCategories] = React.useState([]);
  const [selectCategory, setSelectCategory] = React.useState(0);
  const [selectedCourseType, setSelectedCourseType] = React.useState(1);

  useEffect(() => {
    if (studentDashboard) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('category', selectCategory.toString());
      currentParams.set('courseType', selectedCourseType.toString());
      navigate(`?${currentParams.toString()}`, { replace: true });
    }
  }, [studentDashboard, selectCategory, selectedCourseType]);

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
        <Select
          label="Danh mục"
          placeholder="Danh mục"
          fullWidth
          value={selectCategory}
          onChange={(e) => setSelectCategory(e.target.value as number)}
        >
          <MenuItem value={0}>Tất cả</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {studentDashboard ? (
        <Box flex={1}>
          <Select
            label="Phân loại"
            placeholder="Phân loại"
            size="small"
            fullWidth
            value={selectedCourseType}
            onChange={(e) => setSelectedCourseType(e.target.value as number)}
          >
            <MenuItem value={1}>Đã đăng ký</MenuItem>
            <MenuItem value={0}>Chưa đăng ký</MenuItem>
          </Select>
        </Box>
      ) : (
        <Box flex={1}>
          <Select
            label="Phân loại"
            placeholder="Phân loại"
            size="small"
            fullWidth
            value={0}
          >
            <MenuItem value={0}>Tất cả</MenuItem>
            <MenuItem>Đã xuất bản</MenuItem>
            <MenuItem>Chưa xuất bản xuất bản</MenuItem>
          </Select>
        </Box>
      )}
    </Box>
  );
}
