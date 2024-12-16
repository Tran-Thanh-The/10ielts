import { Box, Typography, Button, Paper, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/features/auth/slices/authSlice';
import { RootState } from '@/stores/store';
import { Account } from '@/types/interface/Account';
import { AppDispatch } from '@/stores/store';
import { ROLE } from '@/utils/constants/constants';

const MySwal = withReactContent(Swal);

const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const LoginFormWithUsername = ({
  onBackClick,
}: {
  onBackClick: () => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { error, loading: isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Account>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: Account) => {
    setLoading(true);
    try {
      const actionResult = await dispatch(login(data));

      if (login.fulfilled.match(actionResult)) {
        MySwal.fire({
          title: 'Đăng nhập thành công!',
          text: `Chào mừng bạn, ${data.email}.`,
          icon: 'success',
          confirmButtonText: 'OK',
        });

        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        const role = auth.user?.role?.name;

        if (role == ROLE.USER) {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        MySwal.fire({
          title: 'Đăng nhập thất bại!',
          text: error || 'Thông tin đăng nhập không đúng, vui lòng thử lại.',
          icon: 'error',
          confirmButtonText: 'Thử lại',
        });
      }
    } catch (error) {
      MySwal.fire({
        title: 'Đăng nhập thất bại!',
        text: 'Đã có lỗi xảy ra, vui lòng thử lại.',
        icon: 'error',
        confirmButtonText: 'Thử lại',
      });
    } finally {
      setLoading(false);
    }
  };

  // Chuyển hướng đến trang đăng ký
  const handleRouterRegister = () => {
    navigate('/register');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: {
          xs: 'transparent',
          md: 'background.paper',
        },
        width: '100%',
        borderRadius: '30px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <ArrowBackIosIcon
          onClick={onBackClick}
          sx={{ position: 'absolute', left: '4', cursor: 'pointer' }}
        />
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Đăng nhập bằng username
        </Typography>
      </Box>

      <Typography
        variant="caption"
        align="center"
        sx={{ mt: 1 }}
        color="#374151"
      >
        Hình thức này chỉ áp dụng với các học viên được cung cấp <br />
        email khác với số điện thoại.
      </Typography>

      <Typography
        variant="caption"
        align="center"
        sx={{ mb: 4 }}
        color="#374151"
      >
        Trong trường hợp bạn đã dùng số điện thoại để đăng ký, <br />
        vui lòng{' '}
        <Box
          component="span"
          sx={{
            color: 'primary.main',
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: -2,
              width: '100%',
              height: '2px',
              backgroundColor: 'primary.main',
            },
          }}
        >
          Sử dụng số điện thoại
        </Box>
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: '100%' }}
      >
        <TextField
          label="Email"
          placeholder="Nhập email"
          margin="normal"
          variant="outlined"
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        />

        <TextField
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleRouterRegister}
        >
          Đăng ký
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginFormWithUsername;
