import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import {
  getCourseRegisterStatistic,
  getCourseStatistic,
  getRevenue,
} from '@/api/api';
import { setAppLoading } from '@/stores/slices/appSlice';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartOptions,
  ArcElement,
  Filler,
} from 'chart.js';
import FeatureLayout from '../../layouts/feature-layout/FeatureLayout';
import FeatureHeader from '../../layouts/feature-layout/components/feature-header/FeatureHeader';
import generatePDFReport from './generatePDFReport';
import ExportMenu from './ExportMenu';
import { generateCSVReport } from './exportCsv';

// Register ChartJS components
ChartJS.register(
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
);

interface RevenueData {
  month: number;
  payed: number;
}

interface RegistrationData {
  month: number;
  registrationCount: number;
}

interface CourseRegistrationData {
  courseName: string;
  totalRegistration: string;
  percentage: string;
}

const YEARS = [2023, 2024, 2025];
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const CHART_COLORS = {
  revenue: {
    border: '#1976d2',
    background: 'rgba(25, 118, 210, 0.1)',
  },
  registration: {
    border: '#2e7d32',
    background: 'rgba(46, 125, 50, 0.4)',
  },
  pie: [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#45b7d1',
    '#96c93d',
    '#e88031',
    '#26A69A',
    '#78909C',
    '#EC407A',
    '#AB47BC',
    '#7E57C2',
    '#5C6BC0',
    '#42A5F5',
    '#26C6DA',
    '#26A69A',
    '#66BB6A',
    '#D4E157',
    '#FFEE58',
    '#FFA726',
    '#FF7043',
    '#8D6E63',
    '#78909C',
  ],
};

const truncateString = (str: string, maxLength: number = 20) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export default function Insights() {
  const dispatch = useDispatch();
  const [year, setYear] = useState<number>(2024);
  const [month, setMonth] = useState<number>(1);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [registrationData, setRegistrationData] = useState<RegistrationData[]>(
    [],
  );
  const [courseRegistrationData, setCourseRegistrationData] = useState<
    CourseRegistrationData[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      dispatch(setAppLoading(true));
      const [revenueResponse, registrationResponse, courseRegResponse] =
        await Promise.all([
          getRevenue(year),
          getCourseStatistic(year),
          getCourseRegisterStatistic(year, month),
        ]);

      if (Array.isArray(revenueResponse?.data)) {
        setRevenueData(revenueResponse.data);
      }
      if (Array.isArray(registrationResponse?.data)) {
        setRegistrationData(registrationResponse.data);
      }
      if (Array.isArray(courseRegResponse?.data)) {
        setCourseRegistrationData(courseRegResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      dispatch(setAppLoading(false));
    }
  }, [year, month, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Revenue Line Chart Configuration
  const createLineChartData = (data: RevenueData[]) => ({
    labels: data.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map((item) => item.payed),
        borderColor: CHART_COLORS.revenue.border,
        backgroundColor: CHART_COLORS.revenue.background,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#fff',
        pointBorderColor: CHART_COLORS.revenue.border,
        pointHoverBackgroundColor: CHART_COLORS.revenue.border,
        pointHoverBorderColor: '#fff',
      },
    ],
  });

  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14 } },
      },
      title: {
        display: true,
        text: `Biểu đồ doanh thu - Năm ${year}`,
        font: { size: 16, weight: 'bold' },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.parsed.y !== null) {
              return `Doanh thu: ${formatCurrency(context.parsed.y)}`;
            }
            return '';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (typeof value === 'number') {
              return formatCurrency(value);
            }
            return value;
          },
        },
      },
    },
  };

  // Registration Bar Chart Configuration
  const createBarChartData = (data: RegistrationData[]) => ({
    labels: data.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: 'Số lượng đăng ký',
        data: data.map((item) => item.registrationCount),
        backgroundColor: CHART_COLORS.registration.background,
        borderColor: CHART_COLORS.registration.border,
        borderWidth: 1,
      },
    ],
  });

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 14 } },
      },
      title: {
        display: true,
        text: `Biểu đồ số lượng đăng ký khóa học - Năm ${year}`,
        font: { size: 16, weight: 'bold' },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Số lượng: ${context.parsed.y} học sinh`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => `${value} học sinh`,
        },
      },
    },
  };

  // Pie Chart Configuration
  const createPieChartData = (data: CourseRegistrationData[]) => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      };
    }

    const sortedData = [...data].sort(
      (a, b) => parseFloat(b.percentage) - parseFloat(a.percentage),
    );

    return {
      labels: sortedData.map((item) => truncateString(item.courseName)),
      datasets: [
        {
          data: sortedData.map((item) => parseFloat(item.percentage)),
          backgroundColor: CHART_COLORS.pie.slice(0, sortedData.length),
          borderColor: Array(sortedData.length).fill('#ffffff'),
          borderWidth: 1,
        },
      ],
    };
  };

  const pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: { size: 11 },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            if (datasets.length === 0) return [];

            const data = datasets[0].data as number[];
            const backgroundColor = datasets[0].backgroundColor as string[];

            return (chart.data.labels as string[]).map((label, i) => ({
              text: `${label} (${data[i].toFixed(1)}%)`,
              fillStyle: backgroundColor[i],
              hidden: false,
              lineCap: 'butt',
              lineDash: [],
              lineDashOffset: 0,
              lineJoin: 'miter',
              lineWidth: 1,
              strokeStyle: '#fff',
              pointStyle: 'circle',
              datasetIndex: 0,
              index: i,
            }));
          },
        },
      },
      title: {
        display: true,
        text: `Tỷ lệ đăng ký khóa học - Tháng ${month} Năm ${year}`,
        font: { size: 16, weight: 'bold' },
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const data = courseRegistrationData[context.dataIndex];
            return [
              `Khóa học: ${data.courseName}`,
              `Số lượng: ${data.totalRegistration}`,
              `Tỷ lệ: ${data.percentage}%`,
            ];
          },
        },
      },
    },
  };

  const handleExport = () => {
    generatePDFReport({
      revenueData,
      registrationData,
      courseRegistrationData,
      year,
      month,
    });
  };

  const handleYearChange = (event: any) => {
    setYear(Number(event.target.value));
  };

  const handleMonthChange = (event: any) => {
    setMonth(Number(event.target.value));
  };

  return (
    <FeatureLayout>
      <FeatureHeader title="Thống kê" />
      <Box
        sx={{ p: 3, margin: '0 auto', minHeight: '100vh', overflowY: 'auto' }}
      >
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Năm</InputLabel>
                  <Select
                    value={year}
                    label="Năm"
                    onChange={handleYearChange}
                    size="small"
                  >
                    {YEARS.map((yr) => (
                      <MenuItem key={yr} value={yr}>
                        Năm {yr}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Tháng</InputLabel>
                  <Select
                    value={month}
                    label="Tháng"
                    onChange={handleMonthChange}
                    size="small"
                  >
                    {MONTHS.map((m) => (
                      <MenuItem key={m} value={m}>
                        Tháng {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Làm mới dữ liệu">
                  <IconButton
                    onClick={fetchData}
                    disabled={isLoading}
                    color="primary"
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <RefreshIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                >
                  Xuất báo cáo
                </Button>
              </Box> */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Làm mới dữ liệu">
                  <IconButton
                    onClick={fetchData}
                    disabled={isLoading}
                    color="primary"
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <RefreshIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <ExportMenu
                  onExportPDF={() =>
                    generatePDFReport({
                      revenueData,
                      registrationData,
                      courseRegistrationData,
                      year,
                      month,
                    })
                  }
                  onExportCSV={() =>
                    generateCSVReport({
                      revenueData,
                      registrationData,
                      courseRegistrationData,
                      year,
                      month,
                    })
                  }
                />
              </Box>
            </Box>
          </Grid>

          {/* Revenue Chart */}
          <Grid item xs={12} mt={4}>
            <Box
              sx={{ height: 400, width: '100%', position: 'relative', mb: 4 }}
            >
              {revenueData.length > 0 ? (
                <Line
                  data={createLineChartData(revenueData)}
                  options={lineChartOptions}
                />
              ) : (
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                  Không có dữ liệu doanh thu
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Registration Chart */}
          <Grid item xs={12} mt={4}>
            <Box
              sx={{ height: 400, width: '100%', position: 'relative', mb: 4 }}
            >
              {registrationData.length > 0 ? (
                <Bar
                  data={createBarChartData(registrationData)}
                  options={barChartOptions}
                />
              ) : (
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                  Không có dữ liệu đăng ký
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Course Registration Pie Chart */}
          <Grid item xs={12} mt={4}>
            <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
              {courseRegistrationData.length > 0 ? (
                <Pie
                  data={createPieChartData(courseRegistrationData)}
                  options={pieChartOptions}
                />
              ) : (
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                  Không có dữ liệu
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </FeatureLayout>
  );
}
