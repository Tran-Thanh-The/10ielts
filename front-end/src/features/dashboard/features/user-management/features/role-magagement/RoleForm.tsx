import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { ROLE_FORM } from '@/utils/constants/constants';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function RoleForm() {
  const [form, setForm] = useState({
    name: '',
    functions: [
    ],
  });

  return (
    <FeatureLayout>
      <FeatureHeader title="Thêm mới vai trò" />

      <Box
        sx={{
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Typography variant="body1">Tên vai trò</Typography>
        <TextField
          label="Tên vai trò"
          fullWidth
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Typography variant="body1">Chức năng</Typography>
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px 24px',
          }}
        >
          {ROLE_FORM.map((role, index) => (
            <Box
              key={role.label}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderBottom: '1px solid #e0e0e0',
                padding: '10px 0',
              }}
            >
              <FormControlLabel
                label={role.label}
                control={
                  <Checkbox
                    checked={true}
                    indeterminate={false}
                    onChange={() => {}}
                  />
                }
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                {role.children?.map((child, index) => (
                  <FormControlLabel
                    label={child.label}
                    control={<Checkbox checked={true} onChange={() => {}} />}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="contained">Lưu</Button>
        </Box>
      </Box>
    </FeatureLayout>
  );
}
