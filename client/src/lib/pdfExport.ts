import html2pdf from 'html2pdf.js';

interface Html2PdfOptions {
  margin?: number | number[];
  filename?: string;
  image?: { type?: 'png' | 'jpeg' | 'webp'; quality?: number };
  html2canvas?: { scale?: number };
  jsPDF?: { orientation?: 'portrait' | 'landscape'; unit?: string; format?: string };
}

export const exportReportsToPDF = (filename: string = 'convergent_technology_reports.pdf') => {
  const element = document.getElementById('reports-container');
  
  if (!element) {
    console.error('Reports container not found');
    return;
  }

  const opt = {
    margin: 10,
    filename: filename,
    image: { type: 'png' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' },
  };

  (html2pdf() as any).set(opt).from(element).save();
};

export const printReports = () => {
  const element = document.getElementById('reports-container');
  
  if (!element) {
    console.error('Reports container not found');
    return;
  }

  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write('<html><head><title>طباعة التقارير</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; direction: rtl; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin: 20px 0; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('.chart { page-break-inside: avoid; margin: 20px 0; }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
};

