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
import { deleteQuestion, getLessonDetailsByIdV2 } from '@/api/api';
import QuestionForm from '@/features/dashboard/components/quesion/question-form/QuestionForm';
import QuestionFormModal from '@/features/dashboard/components/quesion/question-form/QuestionForm';
import QuestionDetail from '@/features/dashboard/components/quesion/question-detail/QuestionDetail';
import Swal from 'sweetalert2';

interface LessonApiRequest extends LessonRequest {
  append(name: string, value: string | Blob, fileName?: string): void;
}

const validationSchema = Yup.object().shape({
  lessonType: Yup.string().required('Please select the lesson type'),
  title: Yup.string()
    .required('Title is required'),
  content: Yup.string(),
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

const CreateUpdateLessonForm = () => {
  const { idCourse, selectedLessonId } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(Boolean(selectedLessonId));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lessonType, setLessonType] = useState<LessonTypes | ''>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [course, setCourse] = useState<any>(null);
  const [openQuestionForm, setOpenQuestionForm] = useState(false);
  const [lesson, setLesson] = useState<any>(null);
  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    if (!selectedLessonId) return;

    getLessonDetailsByIdV2(selectedLessonId).then((res) => {
      const lesson = res.data;
      setValue('title', lesson.title);
      setValue('content', lesson.content);
      setValue('lessonType', lesson.lessonType);
      setLessonType(
        lesson.lessonType
          ? (lesson.lessonType as LessonTypes)
          : LessonTypes.Video,
      );
      setLesson(lesson);
    });
  }, [selectedLessonId, refresh]);

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
        console.log('data.videoUrl', data.videoUrl);
        formData.append('file', data.videoUrl);
      }

      if (isEditMode && selectedLessonId) {
        await lessonApi.updateLesson(selectedLessonId, formData);
        navigate(`/dashboard/courses/${idCourse}/lesson/${selectedLessonId}`);
      } else {
        const newLesson = await lessonApi.createLesson(
          formData,
          idCourse as string,
        );
        navigate(
          `/dashboard/courses/${idCourse}/lessons/${newLesson.data?.id}`,
        );
      }
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

  const handleDeleteQuestion = (questionId: string) => {
    if (questionId) {
      Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
        showDenyButton: true,
        confirmButtonText: `Xóa`,
        denyButtonText: `Hủy`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteQuestion(questionId);
          setRefresh((prev) => !prev);
        }
      });
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ padding: '24px 0' }}
      >
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

        {selectedLessonType === LessonTypes.Exercise && (
          <>
            <FeatureHeader title={`Danh sách câu hỏi`}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setOpenQuestionForm(true)}
              >
                Thêm câu hỏi
              </Button>
            </FeatureHeader>

            <Box>
              {lesson?.questions?.map((question: any, index: number) => (
                <QuestionDetail
                  key={question.id}
                  question={question}
                  index={index}
                  readOnly={true}
                  onDelete={() => handleDeleteQuestion(question.id)}
                  onEdit={() => {}}
                ></QuestionDetail>
              ))}
            </Box>
            {openQuestionForm && (
              <QuestionFormModal
                open={openQuestionForm}
                onClose={setOpenQuestionForm}
                onOk={() => {
                  setRefresh((prev) => !prev);
                  setOpenQuestionForm(false);
                }}
              ></QuestionFormModal>
            )}
          </>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '24px',
          }}
        >
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isEditMode ? 'Cập nhật bài học' : 'Thêm bài học'}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CreateUpdateLessonForm;
