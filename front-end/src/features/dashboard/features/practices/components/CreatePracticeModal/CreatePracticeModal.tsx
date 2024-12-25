import { createPractice, updatePractice } from '@/api/api';
import courseApi from '@/api/courseApi';
import { setAppLoading } from '@/stores/slices/appSlice';
import { EPracticeDifficulty, EPracticeType } from '@/types/enum/practice.enum';
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

const categories = [
  {
    value: EPracticeDifficulty.EASY,
    label: 'Dễ',
  },
  {
    value: EPracticeDifficulty.MEDIUM,
    label: 'Trung bình',
  },
  {
    value: EPracticeDifficulty.HARD,
    label: 'Khó',
  },
];

const practiceTypes = [
  {
    value: EPracticeType.READING,
    label: 'Đọc',
  },
  {
    value: EPracticeType.LISTENING,
    label: 'Nghe',
  },
  {
    value: EPracticeType.WRITING,
    label: 'Viết',
  },
  {
    value: EPracticeType.SPEAKING,
    label: 'Nói',
  },
];

export default function CreatePracticeModal({
  open,
  onClose,
  onOk,
  data = null,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    practiceType: EPracticeType.READING,
    content: '',
    description: '',
    difficulty: EPracticeDifficulty.EASY,
  });

  // Initialize form data if editing an existing course
  useEffect(() => {
    if (data?.id) {
      setFormData({
        title: data.title,
        price: data.price,
        practiceType: data.practiceType,
        content: data.content,
        description: data.description,
        difficulty: data.difficulty,
      });
    } else {
      resetForm();
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      if (data?.id) {
        setFormData({
          title: data.title,
          price: data.price,
          practiceType: data.practiceType,
          content: data.content,
          description: data.description,
          difficulty: data.difficulty,
        });
      } else {
        resetForm();
      }
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      title: '',
      price: 0,
      practiceType: EPracticeType.READING,
      content: '',
      description: '',
      difficulty: EPracticeDifficulty.EASY,
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
    // Validate required fields
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.practiceType ||
      !formData.difficulty
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      dispatch(setAppLoading(true));
      if (data?.id) {
        await updatePractice(data.id, {
          title: formData.title,
          price: formData.price,
          practiceType: formData.practiceType,
          content: formData.content,
          description: formData.description,
          difficulty: formData.difficulty,
        });
        toast.success('Cập nhập bài luyện tập thành công!');
      } else {
        const course = await createPractice({
          title: formData.title,
          price: formData.price,
          practiceType: formData.practiceType,
          content: formData.content,
          description: formData.description,
          difficulty: formData.difficulty,
        });
        toast.success('Tạo bài luyện tập thành công!');
        if (course) {
          navigate(`/dashboard/practices`);
        }
      }
      dispatch(setAppLoading(false));
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
          {data?.id ? 'Cập nhập bài luyện tập' : 'Tạo bài luyện tập'}
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
                label="Tiêu đề"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                fullWidth
              />

              <Box
                sx={{ display: 'flex', alignContent: 'center', gap: '20px' }}
              >
                <Select
                  label="Độ khó"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  label="Loại"
                  name="practiceType"
                  value={formData.practiceType}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  {practiceTypes.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
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

              {formData.practiceType === EPracticeType.WRITING ||
              formData.practiceType === EPracticeType.SPEAKING ? (
                <TextField
                  label="Nội dung"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  fullWidth
                />
              ) : null}

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
            Lưu bài luyện tập
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
