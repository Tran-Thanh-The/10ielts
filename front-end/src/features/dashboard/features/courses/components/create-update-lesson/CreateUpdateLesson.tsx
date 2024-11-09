import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Input,
  FormHelperText,
  FormControl,
  Breadcrumbs,
} from '@mui/material';
import { CloudUpload, Clear } from '@mui/icons-material';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { LessonTypes } from '@/types/enum/LessonType';
import lessonApi from '@/api/lessonApi';
import { LessonRequest } from '@/types/interface/Lesson';
import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import courseApi from '@/api/courseApi';

interface LessonApiRequest extends LessonRequest {
  append(name: string, value: string | Blob, fileName?: string): void;
}

const validationSchema = Yup.object().shape({
  lessonType: Yup.string().required('Please select the lesson type'),
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .required('Title is required'),
  content: Yup.string()
    .min(10, 'Content must be at least 10 characters')
    .required('Content is required'),
  videoUrl: Yup.mixed().when('lessonType', {
    is: LessonTypes.Video,
    then: (schema) =>
      schema
        .test(
          'fileRequired',
          'Video file is required for video lessons',
          (value) => {
            return value !== null && value !== undefined;
          },
        )
        .test('fileFormat', 'Only MP4 files are allowed', (value) => {
          if (!value) return true;
          return value instanceof File && ['video/mp4'].includes(value.type);
        })
        .test('fileSize', 'File size must be less than 100MB', (value) => {
          if (!value) return true;
          return value instanceof File && value.size <= 100 * 1024 * 1024; // 100MB
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
}) as Yup.ObjectSchema<LessonRequest>;

const lessonTypes = [
  { label: 'Video bài giảng', value: LessonTypes.Video },
  { label: 'Tài liệu', value: LessonTypes.Docs },
  { label: 'Bài tập', value: LessonTypes.Exercise },
];

const CreateUpdateLesson = () => {
  const { idCourse, selectedLessonId } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonType, setLessonType] = useState<LessonTypes | ''>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [course, setCourse] = useState<any>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LessonRequest>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      lessonType: LessonTypes.Video,
      title: '',
      content: '',
      videoUrl: null,
    },
  });

  useEffect(() => {
    courseApi.getCourseDetailsById(idCourse as string).then((res) => {
      setCourse(res.data);
    });
  }, []);

  const selectedLessonType = watch('lessonType');

  const onSubmit = async (data: LessonRequest) => {
    console.log(data);
    // return;
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData() as LessonApiRequest;
      formData.append('title', data.title || '');
      formData.append('content', data.content || '');
      formData.append('lessonType', data.lessonType || '');
      if (data.videoUrl) {
        formData.append('file', data.videoUrl);
      }

      console.log(formData);

      if (isEditMode && selectedLessonId) {
        await lessonApi.updateLesson(selectedLessonId, formData);
      } else {
        await lessonApi.createLesson(formData, idCourse as string);
      }
      navigate(`/dashboard/courses/${idCourse}`);
    } catch (err) {
      setError(
        isEditMode
          ? 'Failed to update lesson. Please try again.'
          : 'Failed to create lesson. Please try again.',
      );
      console.error('Error submitting lesson:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileRemove = () => {
    setValue('videoUrl', null);
    setSelectedFileName('');
  };

  return (
    <FeatureLayout>
      <Breadcrumbs aria-label="breadcrumb" sx={{ paddingBottom: '24px' }}>
        <Breadcrumb
          component="a"
          href="#"
          label="Khóa học"
          icon={<LibraryBooksIcon fontSize="small" />}
          onClick={() => navigate('/dashboard/courses')}
        />
        <Breadcrumb
          label={course?.title}
          component="a"
          onClick={() => navigate(`/dashboard/courses/${idCourse}`)}
        />
        <Breadcrumb label={'Tạo mới bài học'} component="a" href="#" />
      </Breadcrumbs>

      <FeatureHeader title={isEditMode ? 'Cập nhật bài học' : 'Tạo bài học'} />

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ padding: '24px 0' }}
      >
        {/* <Typography variant="h5" gutterBottom sx={{ color: '#2E3091', mb: 2 }}>
          {isEditMode ? 'Cập nhật bài học' : 'Thêm bài học mới'}
        </Typography> */}

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              label="Tiêu đề"
              variant="outlined"
              fullWidth
              {...field}
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ mb: 3 }}
            />
          )}
        />

        <Controller
          name="lessonType"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Loại bài học"
              variant="outlined"
              fullWidth
              {...field}
              error={!!errors.lessonType}
              helperText={errors.lessonType?.message}
              sx={{ mb: 3 }}
              onChange={(e) => {
                field.onChange(e);
                setLessonType(e.target.value as LessonTypes);
              }}
            >
              {lessonTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              label="Mô tả"
              variant="outlined"
              multiline
              rows={6}
              fullWidth
              {...field}
              error={!!errors.content}
              helperText={errors.content?.message}
              sx={{ mb: 3 }}
            />
          )}
        />

        {(selectedLessonType === LessonTypes.Video ||
          selectedLessonType === LessonTypes.Docs) && (
          <Controller
            name="videoUrl"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormControl error={!!errors.videoUrl} fullWidth sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                  }}
                >
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    sx={{ flexGrow: 1 }}
                  >
                    {selectedFileName || 'Upload  File'}
                    <Input
                      type="file"
                      sx={{ display: 'none' }}
                      inputProps={{
                        accept:
                          selectedLessonType === LessonTypes.Video
                            ? 'video/mp4'
                            : 'application/pdf',
                        'data-testid': 'video-upload',
                      }}
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        const file = target.files?.[0];
                        if (file) {
                          onChange(file);
                          setSelectedFileName(file.name);
                        }
                      }}
                      {...field}
                    />
                  </Button>
                  {selectedFileName && (
                    <IconButton
                      onClick={handleFileRemove}
                      size="small"
                      sx={{ color: 'error.main' }}
                    >
                      <Clear />
                    </IconButton>
                  )}
                </Box>
                {errors.videoUrl && (
                  <FormHelperText>{errors.videoUrl.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        <Button type="submit" variant="contained" disabled={isLoading}>
          {isEditMode ? 'Cập nhật bài học' : 'Thêm bài học'}
        </Button>
      </Box>
    </FeatureLayout>
  );
};

export default CreateUpdateLesson;
