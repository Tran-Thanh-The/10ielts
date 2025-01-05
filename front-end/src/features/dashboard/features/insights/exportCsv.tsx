export const generateCSVReport = ({
  revenueData,
  registrationData,
  courseRegistrationData,
  year,
  month,
}) => {
  const createSeparator = (length = 50) => {
    return Array(length).fill('=').join('');
  };

  const createHeader = (title) => {
    return [createSeparator(), title, createSeparator(), ''].join('\n');
  };

  const arrayToCSV = (headers, data) => {
    const columnWidths = headers.map((header, index) => {
      const maxDataWidth = data.reduce((max, row) => {
        const value = Object.values(row)[index]?.toString() || '';
        return Math.max(max, value.length);
      }, 0);
      return Math.max(maxDataWidth, header.length);
    });

    const padString = (str, width) => {
      const padding = width - str.toString().length;
      return str + ' '.repeat(Math.max(0, padding));
    };

    const csvRows = [];

    csvRows.push(
      headers
        .map((header, i) => padString(header, columnWidths[i]))
        .join(',  '),
    );

    csvRows.push(
      headers.map((_, i) => '-'.repeat(columnWidths[i])).join(',  '),
    );

    data.forEach((row) => {
      csvRows.push(
        Object.values(row)
          .map((value, i) => padString(value, columnWidths[i]))
          .join(',  '),
      );
    });

    return csvRows.join('\n');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace('₫', '')
      .trim();
  };

  const titleSection = [
    createSeparator(70),
    `BÁO CÁO THỐNG KÊ TỔNG HỢP`,
    `Năm: ${year} - Tháng: ${month}`,
    `Ngày xuất báo cáo: ${new Date().toLocaleDateString('vi-VN')}`,
    createSeparator(70),
    '',
  ].join('\n');

  const revenueSummary = revenueData.reduce((sum, item) => sum + item.payed, 0);
  const revenueSection = [
    createHeader('1. BÁO CÁO DOANH THU'),
    arrayToCSV(
      ['Tháng', 'Doanh thu (VND)'],
      revenueData.map((item) => ({
        month: `Tháng ${item.month}`,
        revenue: formatCurrency(item.payed),
      })),
    ),
    '',
    `Tổng doanh thu: ${formatCurrency(revenueSummary)}`,
    '',
  ].join('\n');

  const registrationSummary = registrationData.reduce(
    (sum, item) => sum + item.registrationCount,
    0,
  );
  const registrationSection = [
    createHeader('2. BÁO CÁO ĐĂNG KÝ THEO THÁNG'),
    arrayToCSV(
      ['Tháng', 'Số lượng đăng ký'],
      registrationData.map((item) => ({
        month: `Tháng ${item.month}`,
        count: item.registrationCount,
      })),
    ),
    '',
    `Tổng số lượng đăng ký: ${registrationSummary}`,
    '',
  ].join('\n');

  const sortedCourseData = [...courseRegistrationData].sort(
    (a, b) => parseFloat(b.percentage) - parseFloat(a.percentage),
  );

  const courseSection = [
    createHeader('3. BÁO CÁO TỶ LỆ ĐĂNG KÝ KHÓA HỌC'),
    arrayToCSV(
      ['Tên khóa học', 'Số lượng đăng ký', 'Tỷ lệ (%)'],
      sortedCourseData.map((item) => ({
        name: item.courseName,
        count: item.totalRegistration,
        percentage: `${parseFloat(item.percentage).toFixed(1)}%`,
      })),
    ),
    '',
    `Tổng số khóa học: ${courseRegistrationData.length}`,
    '',
  ].join('\n');

  const fullReport = [
    titleSection,
    revenueSection,
    registrationSection,
    courseSection,
    createSeparator(70),
    'Kết thúc báo cáo',
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + fullReport], {
    type: 'text/csv;charset=utf-8;',
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `bao-cao-thong-ke-${year}-${month}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};
