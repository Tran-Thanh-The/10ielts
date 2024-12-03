import FeatureHeader from '@/features/dashboard/layouts/feature-layout/components/feature-header/FeatureHeader';
import FeatureLayout from '@/features/dashboard/layouts/feature-layout/FeatureLayout';
import { setAppLoading } from '@/stores/slices/appSlice';
import { Box, Button, Typography } from '@mui/material';
import { axisClasses, BarChart, LineChart, PieChart } from '@mui/x-charts';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const chartSetting = {
  yAxis: [
    {
      label: 'Triệu đồng (VNĐ)',
    },
  ],
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
    [`&`]: {
      // transform: 'translateX(-10px)',
      // paddingLeft: '60px',
    },
  },
};

export default function Insights() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAppLoading(true));

    setTimeout(() => {
      dispatch(setAppLoading(false));
    }, 500);
  }, []);

  return (
    <FeatureLayout>
      <FeatureHeader title="Thông kê" />
      <Box
        sx={{
          padding: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            justifyContent: 'space-between',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <DatePicker label="Ngày bắt đầu" />
              <DatePicker label="Ngày kết thúc" />
            </Box>
          </LocalizationProvider>
          <Button variant="contained" sx={{ minWidth: 100 }}>
            Xuất
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
            }}
          >
            <Typography variant="h6">
              Biểu đồ doanh thu (01/01/2024 - 31/12/2024)
            </Typography>
            <Box
              sx={{
                pading: '0 20px',
              }}
            >
              <Box>
                <BarChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: [
                        'Tháng 1',
                        'Tháng 2',
                        'Tháng 3',
                        'Tháng 4',
                        'Tháng 5',
                        'Tháng 6',
                        'Tháng 7',
                        'Tháng 8',
                        'Tháng 9',
                        'Tháng 10',
                        'Tháng 11',
                        'Tháng 12',
                      ],
                    },
                  ]}
                  series={[
                    {
                      data: [
                        89200, 69200, 49200, 99200, 109000, 18920, 82200, 93200,
                        83200, 29000, 49200, 79200,
                      ],
                    },
                  ]}
                  height={300}
                  {...chartSetting}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
            }}
          >
            <Typography variant="h6">
              Biểu đồ tăng trưởng (01/01/2024 - 31/12/2024)
            </Typography>
            <Box
              sx={{
                pading: '0 20px',
              }}
            >
              <Box>
                <LineChart
                  xAxis={[
                    {
                      scaleType: 'band',
                      data: [
                        'Tháng 1',
                        'Tháng 2',
                        'Tháng 3',
                        'Tháng 4',
                        'Tháng 5',
                        'Tháng 6',
                        'Tháng 7',
                        'Tháng 8',
                        'Tháng 9',
                        'Tháng 10',
                        'Tháng 11',
                        'Tháng 12',
                      ],
                    },
                  ]}
                  series={[
                    {
                      data: [2, 5.5, 2, 8.5, 1.5, 5, 1, 2, 2, 3, 2, 2],
                    },
                  ]}
                  height={300}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
            }}
          >
            <Typography variant="h6">
              Biểu đồ thể hiện tỷ lệ các khóa học (01/01/2024 - 31/12/2024)
            </Typography>
            <Box
              sx={{
                pading: '0 20px',
              }}
            >
              <Box>
                <PieChart
                  series={[
                    {
                      data: [
                        { id: 0, value: 13120, label: 'Khóa học Toeic 300+' },
                        { id: 1, value: 112345, label: 'Khóa học Toeic 500+' },
                        { id: 2, value: 21230, label: 'Khóa học Toeic 700+' },
                        { id: 3, value: 13230, label: 'Khóa học Toeic 800+' },
                      ],
                    },
                  ]}
                  width={800}
                  height={300}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </FeatureLayout>
  );
}
