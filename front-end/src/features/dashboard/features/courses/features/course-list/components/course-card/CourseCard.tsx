import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Swal from 'sweetalert2';
import courseApi from '@/api/courseApi';
import dayjs from 'dayjs';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  createdAt: Date | string;
  totalLesson: number;
  completedLesson: number;
  isMyCourse: boolean;
  photo: string;
  onDeleted: () => void;
}

const CourseCard = ({
  id,
  title,
  description,
  price,
  createdAt,
  totalLesson,
  completedLesson,
  photo,
  isMyCourse,
  onDeleted,
}: CourseCardProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    navigate(`/dashboard/courses/${id}`);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    navigate(`/dashboard/courses/update/${id}`);
    handleMenuClose();
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    Swal.fire({
      title: 'Xác nhận xóa khóa học?',
      showCancelButton: true,
      showDenyButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Hủy',
      denyButtonText: 'Xóa',
    }).then(async (result) => {
      if (result.isDenied) {
        await courseApi.deleteCourse(id);
        onDeleted();
        Swal.fire('Xóa thành công!', '', 'success');
      }
    });
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 4,
        '&:hover': {
          boxShadow: 6,
          img: {
            scale: 1.1,
            transition: '0.1s',
          },
        },
        width: 286,
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        sx={{ width: '100%', height: '160px', overflow: 'hidden' }}
        image={photo}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>
        <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <Chip label={`Giá: ${price} VND`} size="small"></Chip>
          <Chip label="Đã đăng ký" color="success" size="small"></Chip>
        </Box>
        <Box sx={{ display: 'flex', gap: '8px' }}>
          <Box sx={{ mb: 1, flex: 1 }}>
            <Typography variant="caption">
              Tiến độ: {completedLesson}/{totalLesson} bài học
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(completedLesson / totalLesson) * 100}
              sx={{ mt: 1, height: 8, borderRadius: 5 }}
            />
          </Box>
          <Box sx={{ alignSelf: 'flex-end' }}>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem onClick={handleEdit}>Chỉnh sửa</MenuItem>
              <MenuItem onClick={handleDelete}>Xóa</MenuItem>
            </Menu>
          </Box>
        </Box>
        {isMyCourse && <Chip label="Đã mua" color="success" size="small" />}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
