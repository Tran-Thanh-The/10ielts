import { deleteCourseCategory } from '@/api/api';
import courseApi from '@/api/courseApi';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import CUCategoryModal from '@/features/dashboard/features/courses/features/course-categories/CUCategoryModal';
import UserFilter from '@/features/dashboard/features/user-management/features/user-list/components/user-filter/UserFilter';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
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
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CourseCategories() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [reload, setReload] = React.useState(false);

  useEffect(() => {
    getCategories();
  }, [reload]);

  const getCategories = () => {
    dispatch(setAppLoading(true));
    courseApi.getCategories().then((response) => {
      dispatch(setAppLoading(false));
      setCategories(response?.data?.data ?? []);
    });
  };

  const handleDeleteCategory = (id: string) => {
    dispatch(setAppLoading(true));
    deleteCourseCategory(id).then(() => {
      dispatch(setAppLoading(false));
      setReload(!reload);
    });
  }

  return (
    <FeatureLayout>
      <FeatureHeader title="Danh mục khóa học">
        <UserFilter
          buttonLabel="Tạo danh mục"
          onButtonClick={() => {
            setOpen(true);
            setSelectedCategory(null);
          }}
        />
      </FeatureHeader>

      <Box sx={{ width: '100%' }}>
        <Box>
          <TableContainer component={Paper} sx={{}}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ background: '#f4f4f4' }}>
                  <TableCell>Mã</TableCell>
                  <TableCell align="left">Tên danh mục</TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
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
                          onClick={() => {
                            setOpen(true);
                            setSelectedCategory(row);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCategory(row.id)}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {open ? (
        <CUCategoryModal
          open={open}
          data={selectedCategory}
          onClose={() => {
            setOpen(false);
            setSelectedCategory(null);
          }}
          onOk={() => {
            setOpen(false);
            setSelectedCategory(null);
            setReload(!reload);
          }}
        />
      ) : null}
    </FeatureLayout>
  );
}
