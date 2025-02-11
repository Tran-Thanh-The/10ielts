import { createRole, getRoleDetail, updateRole } from '@/api/api';
import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { PermissionEnum } from '@/types/enum/account.enum';
import { DEFAULT_PERMISSIONS, ROLE_FORM } from '@/utils/constants/constants';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RoleForm() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    permissions: [],
  });

  useEffect(() => {
    if (roleId) {
      getRoleDetail(parseInt(roleId)).then((res) => {
        setForm({
          name: res.data.name,
          permissions: res.data.permissions,
        });
      });
    }
  }, [roleId]);

  const handleChangeParent = (e: any, permissions: PermissionEnum[]) => {
    if (e.target.checked) {
      setForm({
        ...form,
        permissions: Array.from(new Set([...form.permissions, ...permissions])),
      });
    } else {
      setForm({
        ...form,
        permissions: form.permissions.filter(
          (permission) => !permissions.includes(permission),
        ),
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.warning('Vui lòng nhập tên vai trò');
      return;
    }

    if (roleId) {
      await updateRole(parseInt(roleId), {
        name: form.name,
        permissions: Array.from(new Set([...form.permissions, ...DEFAULT_PERMISSIONS])),
      });
      toast.success('Cập nhật vai trò thành công');
    } else {
      await createRole({
        name: form.name,
        permissions: Array.from(new Set([...form.permissions, ...DEFAULT_PERMISSIONS])),
      });
      toast.success('Tạo mới vai trò thành công');
    }

    navigate('/dashboard/user-management/role');
  };

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
                    checked={role.permissons.every((role) =>
                      form.permissions.includes(role),
                    )}
                    indeterminate={
                      role.permissons.some((role) =>
                        form.permissions.includes(role),
                      ) &&
                      !role.permissons.every((role) =>
                        form.permissions.includes(role),
                      )
                    }
                    onChange={(e) => handleChangeParent(e, role.permissons)}
                  />
                }
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                {role.children?.map((child, index) => (
                  <FormControlLabel
                    label={child.label}
                    control={
                      <Checkbox
                        checked={child.permissions.every((role) =>
                          form.permissions.includes(role),
                        )}
                        onChange={(e) =>
                          handleChangeParent(e, child.permissions)
                        }
                      />
                    }
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
          <Button variant="contained" onClick={handleSubmit}>
            Lưu
          </Button>
        </Box>
      </Box>
    </FeatureLayout>
  );
}
