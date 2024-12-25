import Breadcrumb from '@/features/dashboard/components/breadcrumb/Breadcrumb';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { getAnswerHistorieById, updateAnswerHistory } from '@/api/api';
import { EPracticeType } from '@/types/enum/practice.enum';
import ReactQuill from 'react-quill';
import { set } from 'date-fns';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAppLoading } from '@/stores/slices/appSlice';

export default function SubmitionDetail() {
  const dispatch = useDispatch();
  const { submitionId, idPractice } = useParams();
  const navigate = useNavigate();
  const [submition, setSubmition] = React.useState<any>({});
  const [content, setContent] = React.useState('');
  const [score, setScore] = React.useState(0);
  const [reload, setReload] = React.useState(false);

  useEffect(() => {
    if (!submitionId) return;
    fetchSubmitionDetail();
  }, [submitionId]);

  const fetchSubmitionDetail = async () => {
    dispatch(setAppLoading(true));
    getAnswerHistorieById(submitionId).then((response) => {
      dispatch(setAppLoading(false));
      setSubmition(response.data);
      setContent(response.data?.teacherFeedback);
      setScore(response.data?.teacherScore ?? 0);
    });
  };

  const handleSave = () => {
    // save data
    dispatch(setAppLoading(true));
    updateAnswerHistory(submitionId, {
      teacherScore: score,
      teacherFeedback: content,
    }).then(() => {
      dispatch(setAppLoading(false));
      setReload(!reload);
      toast.success('Chấm bài thành công');
    });
  };

  return (
    <FeatureLayout>
      <Breadcrumbs aria-label="breadcrumb">
        <Breadcrumb
          component="a"
          href="#"
          label="Danh sách bài luyện tập"
          icon={<LibraryBooksIcon fontSize="small" />}
          onClick={() => navigate('/dashboard/practices/submitions')}
        />
        <Breadcrumb
          label="Danh sách bài nộp"
          component="a"
          href="#"
          onClick={() =>
            navigate('/dashboard/practices/' + idPractice + '/submitions')
          }
        />
        <Breadcrumb label="Chi tiết" component="a" href="#" />
      </Breadcrumbs>

      {submition?.teacherFeedback ? (
        <Chip
          color="success"
          label="Đã chấm"
          sx={{
            marginTop: '20px',
          }}
        ></Chip>
      ) : null}

      <Box sx={{ marginTop: '20px' }}>
        <Box>
          <Typography variant="h6">Thông tin học sinh</Typography>
          <ul>
            <li>Họ và tên: {submition?.user?.fullName}</li>
          </ul>
        </Box>

        <Box>
          <Typography variant="h6">Thông tin bài</Typography>
          <ul>
            <li>Tiêu đề: {submition?.practice?.title}</li>
            <li>Nội dung: {submition?.practice?.content}</li>
            <li>Mô tả thêm: {submition?.practice?.description}</li>
          </ul>
        </Box>

        <Box>
          <Typography variant="h6">Bài làm</Typography>

          <Box sx={{ marginTop: '20px' }}>
            {submition?.practice?.practiceType === EPracticeType.WRITING ? (
              <Box
                sx={{
                  p: 2, // padding
                  border: '1px solid #ccc', // khung bao quanh
                  borderRadius: '8px',
                }}
                dangerouslySetInnerHTML={{
                  __html: submition?.writingAnswer,
                }}
              ></Box>
            ) : (
              <Box>
                <audio src={submition?.audioAnswer?.path} controls />
              </Box>
            )}
          </Box>
        </Box>
        <Box>
          <Typography variant="h6">Chấm bài</Typography>

          <Box sx={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
            <Box>
              <TextField
                label="Điểm"
                variant="outlined"
                type="number"
                sx={{
                  '& input': {
                    width: '100px',
                    height: '80px',
                    fontSize: '50px',
                  },
                }}
                value={score}
                disabled={!!submition?.teacherFeedback}
                onChange={(e) => setScore(Number(e.target.value))}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <ReactQuill
                readOnly={!!submition?.teacherFeedback}
                value={content}
                onChange={(value) => setContent(value)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {submition?.teacherFeedback ? null : (
              <Button size="small" variant="outlined" onClick={handleSave}>
                Lưu
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </FeatureLayout>
  );
}
