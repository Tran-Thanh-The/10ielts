import React from 'react';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { LessonResponse as Lesson } from '@/types/interface/Lesson';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { ROLE } from '@/utils/constants/constants';
interface LessonCardProps {
  index: number;
  lesson: Lesson;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, lessonId: string) => void;
  handRouterLessonDetail: (lessonId: string) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({
  index,
  lesson,
  onMenuOpen,
  handRouterLessonDetail,
}) => {
  return (
    <Box
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        width: '240px',
        padding: '12px',
        border: `1px solid ${lesson.isCompleted ? '#4caf50' : '#ccc'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: lesson.isCompleted ? '#f0f9eb' : '#fff',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: '12px',
        }}
      >
        <Box
          sx={{
            width: '50px',
            height: '50px',
            bgcolor: lesson.isCompleted ? '#f0f9eb' : '#f3f7ff',
            border: `1px solid ${lesson.isCompleted ? '#4caf50' : '#c6d8fc'}`,
            borderRadius: 1,
            textAlign: 'center',
            padding: '10px',
            color: lesson.isCompleted ? 'success.main' : 'primary.main',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          {index + 1}
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              wordWrap: 'break-word',
              textWrap: 'nowrap',
              maxWidth: '120px',
            }}
            onClick={() => handRouterLessonDetail(lesson.id)}
          >
            {lesson.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              wordWrap: 'break-word',
              textWrap: 'nowrap',
              maxWidth: '120px',
            }}
          >
            {lesson.content}
          </Typography>
        </Box>
      </Box>

      <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
        <IconButton onClick={(event) => onMenuOpen(event, lesson.id)}>
          <MoreVertIcon />
        </IconButton>
      </RoleBasedComponent>
      {/* <Paper elevation={1} sx={{ mb: 2, p: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={1}>
            <Box
              sx={{
                width: '50px',
                height: '50px',
                bgcolor: '#f3f7ff',
                border: '1px solid #c6d8fc',
                borderRadius: 1,
                textAlign: 'center',
                padding: '10px',
                color: 'primary.main',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              {index + 1}
            </Box>
          </Grid>

          <Grid item xs={7.5}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              onClick={() => handRouterLessonDetail(lesson.id)}
            >
              {lesson.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                wordWrap: 'break-word',
                textWrap: 'nowrap',
                maxWidth: '600px',
              }}
            >
              {lesson.content}
            </Typography>
          </Grid>

          <Grid item xs={2.5}>
            <Box display="flex" alignItems="center" justifyContent="center">
              {[...Array(3)].map((_, index) => (
                <EmojiEventsIcon
                  key={index}
                  color="action"
                  sx={{ opacity: 0.3 }}
                />
              ))}
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="body2" color="text.secondary">
                {lesson.stars}/{lesson.totalStars}
              </Typography>
              <StarIcon sx={{ ml: 0.5, color: '#ffb400', fontSize: '20px' }} />
            </Box>
          </Grid>

          <Grid item xs={1}>
            <RoleBasedComponent allowedRoles={[ROLE.ADMIN, ROLE.STAFF]}>
              <IconButton onClick={(event) => onMenuOpen(event, lesson.id)}>
                <MoreVertIcon />
              </IconButton>
            </RoleBasedComponent>
          </Grid>
        </Grid>
      </Paper> */}
    </Box>
  );
};

export default LessonCard;
