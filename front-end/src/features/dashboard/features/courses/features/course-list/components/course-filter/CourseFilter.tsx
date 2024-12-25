import courseApi from '@/api/courseApi';
import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice';
import { Box, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CourseFilterProps {
  onFilterChange: (params: any) => void;
}

export default function CourseFilter({
  onFilterChange,
}: CourseFilterProps) {
  const navigate = useNavigate();
  const studentDashboard = useSelector(selectIsStudentDashboard);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [selectCategory, setSelectCategory] = React.useState<string>('0');
  const [selectedCourseType, setSelectedCourseType] =
    React.useState<string>('1');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('0');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

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

  useEffect(() => {
    if (studentDashboard) {
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set('category', selectCategory);
      currentParams.set('courseType', selectedCourseType);
      navigate(`?${currentParams.toString()}`, { replace: true });
    }
  }, [studentDashboard, selectCategory, selectedCourseType]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onFilterChange({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
      search: value,
      orderBy: 'created_at:DESC',
    });
  };

  const handleCategoryChange = (value: string) => {
    setSelectCategory(value);
    onFilterChange({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
      categoryId: value !== '0' ? value : undefined,
      orderBy: 'created_at:DESC',
    });
  };

  const handleCourseTypeChange = (value: string) => {
    setSelectedCourseType(value);
    onFilterChange({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
      isMyCourse: value === '1' ? 'true' : 'false',
      orderBy: 'created_at:DESC',
    });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onFilterChange({
      paginationOptions: {
        page: 1,
        limit: 10,
      },
      status:
        value === '1' ? 'ACTIVE' : value === '2' ? 'IN_ACTIVE' : undefined,
      orderBy: 'created_at:DESC',
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 250, maxWidth: 400 }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            '& input': {
              padding: '16px 14px',
            },
            '& .MuiInputLabel-root': {
              fontSize: '16px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 250, maxWidth: 400 }}>
        <Select
          label="Danh mục"
          fullWidth
          value={selectCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '16px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
        >
          <MenuItem value="0">Tất cả</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {studentDashboard ? (
        <Box sx={{ flex: 1, minWidth: 250, maxWidth: 400 }}>
          <Select
            label="Phân loại"
            fullWidth
            value={selectedCourseType}
            onChange={(e) => handleCourseTypeChange(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: '16px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          >
            <MenuItem value="1">Đã đăng ký</MenuItem>
            <MenuItem value="0">Chưa đăng ký</MenuItem>
          </Select>
        </Box>
      ) : (
        <Box sx={{ flex: 1, minWidth: 250, maxWidth: 400 }}>
          <Select
            label="Trạng thái"
            fullWidth
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: '16px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          >
            <MenuItem value="0">Tất cả</MenuItem>
            <MenuItem value="1">Đã xuất bản</MenuItem>
            <MenuItem value="2">Chưa xuất bản</MenuItem>
          </Select>
        </Box>
      )}
    </Box>
  );
}
