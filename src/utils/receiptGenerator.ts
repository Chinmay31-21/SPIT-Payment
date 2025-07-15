import jsPDF from 'jspdf';
import { PaymentRecord } from '../types/payment';

export const generateReceipt = (paymentRecord: PaymentRecord): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SPIT ALLIED DIVISION', 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Sardar Patel Institute of Technology', 105, 40, { align: 'center' });
  doc.text('Fee Receipt for Certificate Courses', 105, 50, { align: 'center' });
  
  // Line separator
  doc.line(20, 60, 190, 60);
  
  // Receipt details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 20, 80);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const details = [
    ['Transaction ID:', paymentRecord.transactionId],
    ['Payment ID:', paymentRecord.paymentId],
    ['Date:', new Date(paymentRecord.createdAt).toLocaleDateString('en-IN')],
    ['Time:', new Date(paymentRecord.createdAt).toLocaleTimeString('en-IN')],
    ['', ''],
    ['Student Name:', paymentRecord.fullName],
    ['Email:', paymentRecord.email],
    ['Phone:', paymentRecord.phone],
    ['College:', paymentRecord.collegeName],
    ['Course:', paymentRecord.courseName],
    ['', ''],
    ['Amount Paid:', `₹${paymentRecord.amount}`],
    ['Payment Gateway:', 'Easebuzz'],
    ['Status:', 'SUCCESS'],
  ];
  
  let yPosition = 95;
  details.forEach(([label, value]) => {
    if (label === '' && value === '') {
      yPosition += 5;
      return;
    }
    
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 80, yPosition);
    yPosition += 12;
  });
  
  // Footer
  doc.line(20, yPosition + 10, 190, yPosition + 10);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a computer-generated receipt. No signature required.', 105, yPosition + 25, { align: 'center' });
  doc.text('For queries, contact: support@spit.ac.in', 105, yPosition + 35, { align: 'center' });
  doc.text('Payment processed securely through Easebuzz', 105, yPosition + 45, { align: 'center' });
  
  // Download the PDF
  doc.save(`SPIT_Receipt_${paymentRecord.transactionId}.pdf`);
};