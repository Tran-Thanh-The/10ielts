import QuestionList from '@/features/dashboard/components/quesion/question-list/QuestionList';
import { Box, Button, Divider, Modal, Typography } from '@mui/material';

export default function ViewAnswer({
  open,
  onClose,
  onOk,
  questions,
  answers,
  score,
}) {

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px',
          }}
        >
        <Typography id="modal-title" variant="h6" component="h2">
          Kết quả
        </Typography>
          <Typography variant="h6" color="success">{`Điểm: ${score}`}</Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            maxHeight: 'calc(100vh - 200px)',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              flex: 1,
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Box
              sx={{
                overflowY: 'auto',
              }}
            >
              <QuestionList questions={questions} readOnly answers={answers} />
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => onClose(false)}
            sx={{ padding: '6px 24px' }}
          >
            Đóng
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
