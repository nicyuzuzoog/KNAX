// pages/SuperAdmin/DownloadReports.jsx
import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaDownload, FaFilePdf, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import './DownloadReports.css';

const DownloadReports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const downloadReport = async (type) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/download-report/${type}`, {
        params: dateRange,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report_${Date.now()}.${type === 'pdf' ? 'pdf' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="download-reports-page">
        <h1><FaDownload /> Download Reports</h1>
        <div className="date-range-selector card">
          <div className="date-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
          </div>
          <div className="date-group">
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>

        <div className="reports-grid">
          <div className="report-card" onClick={() => downloadReport('registrations')}>
            <FaFileExcel className="report-icon excel" />
            <h3>Registrations Report</h3>
            <p>Download all registrations as CSV</p>
            <button className="btn btn-primary" disabled={loading}>
              <FaDownload /> Download CSV
            </button>
          </div>

          <div className="report-card" onClick={() => downloadReport('financial')}>
            <FaFilePdf className="report-icon pdf" />
            <h3>Financial Report</h3>
            <p>Download revenue report as PDF</p>
            <button className="btn btn-primary" disabled={loading}>
              <FaDownload /> Download PDF
            </button>
          </div>

          <div className="report-card" onClick={() => downloadReport('attendance')}>
            <FaFileAlt className="report-icon" />
            <h3>Attendance Report</h3>
            <p>Download attendance records</p>
            <button className="btn btn-primary" disabled={loading}>
              <FaDownload /> Download CSV
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DownloadReports;