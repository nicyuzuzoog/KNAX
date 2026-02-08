import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { 
  FaDownload, 
  FaFilePdf, 
  FaFileExcel, 
  FaCalendarAlt,
  FaSpinner
} from 'react-icons/fa';
import './DownloadReports.css';

const DownloadReports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const downloadCSV = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/financial-report', {
        params: dateRange
      });

      const report = response.data;
      
      // Create CSV content
      let csvContent = 'KNAX250 Financial Report\n';
      csvContent += `Generated: ${new Date().toLocaleString()}\n`;
      csvContent += `Period: ${dateRange.startDate} to ${dateRange.endDate}\n\n`;
      csvContent += `Total Transactions: ${report.summary.totalTransactions}\n`;
      csvContent += `Total Amount: ${formatCurrency(report.summary.totalAmount)}\n\n`;
      csvContent += 'Date,Student,Email,Phone,Department,School,Class,Amount,Approved By\n';
      
      report.transactions.forEach(t => {
        csvContent += `${new Date(t.date).toLocaleDateString()},${t.student},${t.email},${t.phone},${t.department},${t.school},${t.class},${t.amount},${t.approvedBy}\n`;
      });

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `KNAX250_Financial_Report_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
      link.click();

      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/financial-report', {
        params: dateRange
      });

      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `KNAX250_Financial_Report_${dateRange.startDate}_to_${dateRange.endDate}.json`;
      link.click();

      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const printReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/financial-report', {
        params: dateRange
      });

      const report = response.data;
      
      // Create printable HTML
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>KNAX250 Financial Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1976D2; }
            .header { margin-bottom: 30px; }
            .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .summary h3 { margin: 0 0 15px 0; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            .summary-item strong { display: block; font-size: 1.5em; color: #1976D2; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #1976D2; color: white; }
            tr:nth-child(even) { background: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; color: #666; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>KNAX250 Financial Report</h1>
            <p>Period: ${dateRange.startDate} to ${dateRange.endDate}</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="summary">
            <h3>Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <strong>${report.summary.totalTransactions}</strong>
                <span>Total Transactions</span>
              </div>
              <div class="summary-item">
                <strong>${formatCurrency(report.summary.totalAmount)}</strong>
                <span>Total Revenue</span>
              </div>
              <div class="summary-item">
                <strong>${formatCurrency(report.summary.averagePerTransaction)}</strong>
                <span>Average per Transaction</span>
              </div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Department</th>
                <th>School</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${report.transactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td>${t.student}</td>
                  <td>${t.department}</td>
                  <td>${t.school}</td>
                  <td>${formatCurrency(t.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>KNAX250 - Technical Training Center</p>
            <p>Near Makuza Peace Plaza, Kigali | Tel: 0782562906</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();

      toast.success('Print window opened!');
    } catch (error) {
      toast.error('Failed to generate print view');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="download-reports-page">
        <div className="page-header">
          <h1><FaDownload /> Download Financial Reports</h1>
          <p>Export financial data for your records</p>
        </div>

        {/* Date Range Selector */}
        <div className="date-range-card card">
          <h2><FaCalendarAlt /> Select Date Range</h2>
          <div className="date-inputs">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="download-options">
          <div className="download-card" onClick={downloadCSV}>
            {loading ? <FaSpinner className="spin" /> : <FaFileExcel />}
            <h3>Download CSV</h3>
            <p>Excel-compatible spreadsheet format</p>
          </div>

          <div className="download-card" onClick={downloadJSON}>
            {loading ? <FaSpinner className="spin" /> : <FaDownload />}
            <h3>Download JSON</h3>
            <p>Raw data format for developers</p>
          </div>

          <div className="download-card" onClick={printReport}>
            {loading ? <FaSpinner className="spin" /> : <FaFilePdf />}
            <h3>Print Report</h3>
            <p>Print-friendly format</p>
          </div>
        </div>

        {/* Info */}
        <div className="download-info card">
          <h3>Report Contents</h3>
          <ul>
            <li>Transaction dates and amounts</li>
            <li>Student information (name, email, phone)</li>
            <li>Department and school details</li>
            <li>Approval information</li>
            <li>Summary statistics</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DownloadReports;