import CreateUpdateUserModal from '@/features/dashboard/features/user-management/features/user-list/components/create-update-user-modal/CreateUpdateUserModal';
import { Box, Button, TextField } from '@mui/material';
import React from 'react';

export default function UserFilter() {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Box>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          fullWidth
          margin="normal"
          sx={{
            minWidth: 400,
            margin: 0,
            '& input': {
              padding: '16px 14px',
            },
          }}
        />
      </Box>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Tạo học sinh
      </Button>
      <CreateUpdateUserModal
        open={open}
        onClose={() => setOpen(false)}
        onOk={() => setOpen(false)}
      />
    </Box>
  );
}
