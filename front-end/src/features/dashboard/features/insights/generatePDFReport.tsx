import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

interface ReportGeneratorProps {
  revenueData: RevenueData[];
  registrationData: RegistrationData[];
  courseRegistrationData: CourseRegistrationData[];
  year: number;
  month: number;
}

// Style configuration
const STYLES = {
  colors: {
    primary: [25, 118, 210] as [number, number, number], // #1976d2
    secondary: [97, 97, 97] as [number, number, number], // #616161
    background: [240, 240, 240] as [number, number, number], // #f0f0f0
    white: [255, 255, 255] as [number, number, number],
    black: [0, 0, 0] as [number, number, number],
  },
  fontSize: {
    title: 24,
    heading: 16,
    normal: 12,
    small: 10,
  },
  margin: {
    page: 20,
  },
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const generatePDFReport = ({
  revenueData,
  registrationData,
  courseRegistrationData,
  year,
  month,
}: ReportGeneratorProps): void => {
  // Initialize PDF document with UTF-8 support
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Helper function for centered text
  const centerText = (text: string, y: number): void => {
    const textWidth = doc.getTextDimensions(text).w;
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // ==== Cover Page ====
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(STYLES.fontSize.title);
  doc.setTextColor(...STYLES.colors.primary);
  centerText('BAO CAO THONG KE', 60);

  // Report information
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(STYLES.fontSize.normal);
  doc.setTextColor(...STYLES.colors.secondary);

  const reportInfo = [
    `Ky bao cao: Thang ${month} nam ${year}`,
    `Ngay xuat bao cao: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}`,
  ];

  reportInfo.forEach((text, index) => {
    centerText(text, 90 + index * 10);
  });

  // ==== Table of Contents ====
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(STYLES.fontSize.heading);
  doc.setTextColor(...STYLES.colors.primary);
  doc.text('MUC LUC', STYLES.margin.page, 40);

  // Content sections
  const sections = [
    { title: '1. Tong quan', y: 60 },
    { title: '2. Chi tiet doanh thu', y: 72 },
    { title: '3. Thong ke dang ky khoa hoc', y: 84 },
    { title: '4. Phan tich ty le dang ky', y: 96 },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(STYLES.fontSize.normal);
  doc.setTextColor(...STYLES.colors.black);

  sections.forEach(({ title, y }) => {
    doc.text(title, 30, y);
  });

  // ==== Overview Section ====
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(STYLES.fontSize.heading);
  doc.text('1. TONG QUAN', STYLES.margin.page, 30);

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.payed, 0);
  const totalRegistrations = registrationData.reduce(
    (sum, item) => sum + item.registrationCount,
    0,
  );
  const avgRevenue = totalRevenue / (revenueData.length || 1);

  autoTable(doc, {
    startY: 40,
    head: [['Chi so', 'Gia tri']],
    body: [
      ['Tong doanh thu', formatCurrency(totalRevenue)],
      ['Doanh thu trung binh/thang', formatCurrency(avgRevenue)],
      ['Tong so luong dang ky', `${totalRegistrations} hoc sinh`],
      [
        'So khoa hoc dang hoat dong',
        `${courseRegistrationData.length} khoa hoc`,
      ],
    ],
    styles: {
      font: 'helvetica',
      fontSize: STYLES.fontSize.normal,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: STYLES.colors.background,
      textColor: STYLES.colors.black,
      fontStyle: 'bold',
    },
    theme: 'grid',
  });

  // ==== Revenue Details ====
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(STYLES.fontSize.heading);
  doc.text('2. CHI TIET DOANH THU', STYLES.margin.page, 30);

  autoTable(doc, {
    startY: 40,
    head: [['Thang', 'Doanh thu']],
    body: revenueData.map((item) => [
      `Thang ${item.month}`,
      formatCurrency(item.payed),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: STYLES.fontSize.normal,
    },
    headStyles: {
      fillColor: STYLES.colors.background,
      textColor: STYLES.colors.black,
      fontStyle: 'bold',
    },
    theme: 'grid',
  });

  // ==== Registration Statistics ====
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.text('3. THONG KE DANG KY KHOA HOC', STYLES.margin.page, 30);

  autoTable(doc, {
    startY: 40,
    head: [['Thang', 'So luong dang ky']],
    body: registrationData.map((item) => [
      `Thang ${item.month}`,
      item.registrationCount.toString(),
    ]),
    styles: {
      font: 'helvetica',
      fontSize: STYLES.fontSize.normal,
    },
    headStyles: {
      fillColor: STYLES.colors.background,
      textColor: STYLES.colors.black,
      fontStyle: 'bold',
    },
    theme: 'grid',
  });

  // ==== Course Registration Analysis ====
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.text('4. PHAN TICH TY LE DANG KY', STYLES.margin.page, 30);

  autoTable(doc, {
    startY: 40,
    head: [['Ten khoa hoc', 'So luong dang ky', 'Ty le']],
    body: courseRegistrationData.map((item) => [
      item.courseName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      item.totalRegistration,
      `${item.percentage}%`,
    ]),
    styles: {
      font: 'helvetica',
      fontSize: STYLES.fontSize.normal,
    },
    headStyles: {
      fillColor: STYLES.colors.background,
      textColor: STYLES.colors.black,
      fontStyle: 'bold',
    },
    theme: 'grid',
  });

  // Add page numbers
  const totalPages = doc.internal.pages.length - 1;
  // const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(STYLES.fontSize.small);
    doc.setTextColor(...STYLES.colors.secondary);
    centerText(`Trang ${i}/${totalPages}`, pageHeight - 10);
  }

  // Save the PDF
  const fileName = `bao-cao-thong-ke-t${month}-${year}_${format(
    new Date(),
    'ddMMyyy_HHmm',
  )}.pdf`;
  doc.save(fileName);
};

export default generatePDFReport;
