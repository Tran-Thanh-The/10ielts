import { Box, Button, Divider, Modal, Typography } from '@mui/material'
import React from 'react'

export default function CourseOutcomes({ open, onClose, courseId }: any) {
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
          Kết quả học tập
        </Typography>

        <Divider />

        <Box
          sx={{
            maxHeight: 'calc(100vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          
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
  )
}
