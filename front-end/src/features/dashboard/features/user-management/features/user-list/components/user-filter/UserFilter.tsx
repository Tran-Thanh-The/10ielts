import CreateUpdateUserModal from '@/features/dashboard/features/user-management/features/user-list/components/create-update-user-modal/CreateUpdateUserModal';
import { Box, Button, TextField } from '@mui/material';
import React from 'react';

type UserFilterProps = {
  buttonLabel?: string;
  onButtonClick?: () => void;
  onSearch?: (search: string) => void;
};
export default function UserFilter({
  buttonLabel = 'Tạo học sinh',
  onButtonClick,
  onSearch,
}: UserFilterProps) {
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
            height: '48px',
            '& input': {
              padding: '13px 14px',
            },
          }}
          size="small"
        />
      </Box>

      <Button
        sx={{
          height: '48px',
        }}
        variant="contained"
        onClick={() => (onButtonClick ? onButtonClick() : setOpen(true))}
        size="small"
      >
        {buttonLabel}
      </Button>
      <CreateUpdateUserModal
        open={open}
        onClose={() => setOpen(false)}
        onOk={() => setOpen(false)}
      />
    </Box>
  );
}
