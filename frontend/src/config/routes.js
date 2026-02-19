// src/config/routes.js

export const routes = {
  // Public routes
  public: [
    { path: '/', component: 'Landing' },
    { path: '/about', component: 'About' },
    { path: '/departments', component: 'Departments' },
    { path: '/equipment', component: 'Equipment' },
    { path: '/contact', component: 'Contact' },
    { path: '/find-us', component: 'FindUs' },
    { path: '/login', component: 'Login' },
    { path: '/register', component: 'Register' },
    { path: '/forgot-password', component: 'ForgotPassword' },
    { path: '/reset-password/:token', component: 'ResetPassword' },
  ],

  // Super Admin only routes
  superAdmin: [
    { path: '/super-admin/dashboard', component: 'SuperAdmin/Dashboard', icon: 'FaTachometerAlt', label: 'Dashboard' },
    { path: '/super-admin/admins', component: 'SuperAdmin/ManageAdmins', icon: 'FaUserShield', label: 'Manage Admins' },
    { path: '/super-admin/schools', component: 'SuperAdmin/ManageSchools', icon: 'FaSchool', label: 'Schools & Classes' },
    { path: '/super-admin/registrations', component: 'SuperAdmin/AllRegistrations', icon: 'FaClipboardList', label: 'Registrations' },
    { path: '/super-admin/students', component: 'SuperAdmin/AllStudents', icon: 'FaUsers', label: 'All Students' },
    { path: '/super-admin/announcements', component: 'SuperAdmin/Announcements', icon: 'FaBell', label: 'Announcements' },
    { path: '/super-admin/finances', component: 'SuperAdmin/FinancialReports', icon: 'FaMoneyBillWave', label: 'Financial Reports' },
    { path: '/super-admin/download-reports', component: 'SuperAdmin/DownloadReports', icon: 'FaDownload', label: 'Download Reports' },
  ],

  // Junior Admin routes (permission-based)
  juniorAdmin: [
    { path: '/admin/dashboard', component: 'JuniorAdmin/Dashboard', icon: 'FaTachometerAlt', label: 'Dashboard', permission: null },
    { path: '/admin/registrations', component: 'JuniorAdmin/Registrations', icon: 'FaClipboardList', label: 'Registrations', permission: 'canViewRegistrations' },
    { path: '/admin/attendance', component: 'JuniorAdmin/ManageAttendance', icon: 'FaCalendarCheck', label: 'Attendance', permission: 'canManageAttendance' },
    { path: '/admin/timetable', component: 'JuniorAdmin/ManageTimetable', icon: 'FaCalendarAlt', label: 'Timetable', permission: 'canManageTimetable' },
    { path: '/admin/shifts', component: 'JuniorAdmin/ManageShifts', icon: 'FaClock', label: 'Manage Shifts', permission: 'canManageShifts' },
    { path: '/admin/announcements', component: 'JuniorAdmin/Announcements', icon: 'FaBell', label: 'Announcements', permission: 'canPostAnnouncements' },
  ],

  // Student routes
  student: [
    { path: '/student/dashboard', component: 'Student/Dashboard', icon: 'FaTachometerAlt', label: 'Dashboard' },
    { path: '/student/apply', component: 'Student/ApplyInternship', icon: 'FaClipboardList', label: 'Apply for Internship' },
    { path: '/student/attendance', component: 'Student/MyAttendance', icon: 'FaCalendarCheck', label: 'My Attendance' },
  ],
};

export const getRoleRoutes = (role, permissions = {}) => {
  switch (role) {
    case 'super_admin':
      return routes.superAdmin;
    
    case 'junior_admin':
      return routes.juniorAdmin.filter(route => 
        !route.permission || permissions[route.permission] !== false
      );
    
    case 'student':
      return routes.student;
    
    default:
      return [];
  }
};