// backend/services/emailService.js
const nodemailer = require('nodemailer');

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'nicjbdede@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'ymya xgee snin xifn';

let transporter = null;

const initializeTransporter = () => {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log('⚠️ Email warning:', error.message);
      } else {
        console.log('✅ Email server ready');
      }
    });
  } catch (error) {
    console.log('⚠️ Email not configured:', error.message);
  }
};

initializeTransporter();

// Email template base
const getEmailTemplate = (title, content, footerText = '') => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white;">
    <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px 20px; text-align: center;">
      <h1 style="color: #FFD700; margin: 0; font-size: 24px;">🎓 KNAX_250 TECHNOLOGY Ltd</h1>
      <p style="color: rgba(255,255,255,0.8); margin-top: 8px; font-size: 14px;">RTB Certified Technical Training Center</p>
    </div>
    
    <div style="padding: 30px;">
      <h2 style="color: #1976D2; margin-top: 0;">${title}</h2>
      ${content}
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        📍 Near Makuza Peace Plaza, ATENE Building, Kigali<br>
        📞 0782562906 | 📧 nicjbdede@gmail.com
      </p>
      ${footerText}
    </div>
    
    <div style="background: #1a1a2e; padding: 20px; text-align: center; color: rgba(255,255,255,0.7);">
      <p style="margin: 0; font-size: 12px;">© 2024 KNAX_250 TECHNOLOGY Ltd. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Send Welcome Email
const sendWelcomeEmail = async (user) => {
  if (!transporter) return false;

  const content = `
    <p style="color: #333; line-height: 1.6;">
      Welcome <strong>${user.fullName}</strong>! 🎉
    </p>
    <p style="color: #333; line-height: 1.6;">
      Thank you for registering with KNAX_250 TECHNOLOGY Ltd. You can now apply for an internship program.
    </p>
    
    <div style="background: linear-gradient(135deg, #1976D2, #1565C0); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3 style="color: #FFD700; margin: 0 0 10px 0;">📋 Next Steps:</h3>
      <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
        <li>Login to your dashboard</li>
        <li>Apply for your preferred department</li>
        <li>Pay 30,000 RWF registration fee</li>
        <li>Upload payment receipt</li>
        <li>Wait for admin approval</li>
      </ol>
    </div>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
         style="display: inline-block; background: linear-gradient(135deg, #FFD700, #FFC107); 
                color: #1a1a2e; padding: 14px 35px; text-decoration: none; border-radius: 8px; 
                font-weight: bold;">
        Login to Dashboard →
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${EMAIL_USER}>`,
      to: user.email,
      subject: '🎉 Welcome to KNAX_250 TECHNOLOGY Ltd!',
      html: getEmailTemplate('Welcome! 🎉', content)
    });
    console.log('✅ Welcome email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send Junior Admin Welcome Email
const sendJuniorAdminWelcome = async (user, password) => {
  if (!transporter) return false;

  const content = `
    <p style="color: #333; line-height: 1.6;">
      Congratulations <strong>${user.fullName}</strong>! 🎉
    </p>
    <p style="color: #333; line-height: 1.6;">
      You have been appointed as a <strong>Junior Admin</strong> for the 
      <strong style="color: #1976D2;">${user.department}</strong> department.
    </p>
    
    <div style="background: linear-gradient(135deg, #1976D2, #1565C0); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3 style="color: #FFD700; margin: 0 0 15px 0;">🔐 Your Login Credentials:</h3>
      <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
        <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
        <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
      </div>
      <p style="font-size: 12px; opacity: 0.9; margin: 15px 0 0 0;">
        ⚠️ Please change your password after first login!
      </p>
    </div>
    
    <h3 style="color: #1976D2;">📋 Your Responsibilities:</h3>
    <ul style="line-height: 2; color: #333;">
      <li>✅ Approve/Reject student payments</li>
      <li>✅ Mark student attendance</li>
      <li>✅ Manage timetable & shifts</li>
      <li>✅ Post announcements</li>
    </ul>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
         style="display: inline-block; background: linear-gradient(135deg, #FFD700, #FFC107); 
                color: #1a1a2e; padding: 14px 35px; text-decoration: none; border-radius: 8px; 
                font-weight: bold;">
        Login to Admin Portal →
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${EMAIL_USER}>`,
      to: user.email,
      subject: '🎉 Junior Admin Account Created - KNAX_250',
      html: getEmailTemplate('Admin Account Created! 🎉', content)
    });
    console.log('✅ Junior admin welcome email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send Registration Confirmation
const sendRegistrationConfirmation = async (user, registration) => {
  if (!transporter) return false;

  const content = `
    <p style="color: #333; line-height: 1.6;">
      Dear <strong>${user.fullName}</strong>,
    </p>
    <p style="color: #333; line-height: 1.6;">
      We have received your internship application. Here are the details:
    </p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Department:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #1976D2;">${registration.department}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Shift:</td>
          <td style="padding: 8px 0; font-weight: bold;">${registration.shift}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Amount Paid:</td>
          <td style="padding: 8px 0; font-weight: bold;">30,000 RWF</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #FFF3E0; padding: 15px; border-radius: 8px; border-left: 4px solid #FF9800;">
      <p style="margin: 0; color: #E65100;">
        <strong>⏳ Status:</strong> Pending Review<br>
        Our team will review your payment and get back to you within 24-48 hours.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${EMAIL_USER}>`,
      to: user.email,
      subject: '📋 Application Received - KNAX_250',
      html: getEmailTemplate('Application Received! 📋', content)
    });
    console.log('✅ Registration confirmation sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send Payment Approval Email
const sendPaymentApprovalEmail = async (user, registration) => {
  if (!transporter) return false;

  const content = `
    <p style="color: #333; line-height: 1.6;">
      Dear <strong>${user.fullName}</strong>,
    </p>
    <p style="color: #333; line-height: 1.6;">
      Great news! 🎉 Your payment has been <strong style="color: #4CAF50;">APPROVED</strong>!
    </p>
    
    <div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
      <h2 style="margin: 0;">✅ PAYMENT APPROVED</h2>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">You are now officially enrolled!</p>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h3 style="color: #1976D2; margin-top: 0;">📋 Your Internship Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Department:</td>
          <td style="padding: 8px 0; font-weight: bold;">${registration.department}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Shift:</td>
          <td style="padding: 8px 0; font-weight: bold;">${registration.shift}</td>
        </tr>
        ${registration.startDate ? `
        <tr>
          <td style="padding: 8px 0; color: #666;">Start Date:</td>
          <td style="padding: 8px 0; font-weight: bold;">${new Date(registration.startDate).toLocaleDateString()}</td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    <h3 style="color: #1976D2;">📋 What's Next:</h3>
    <ul style="line-height: 2; color: #333;">
      <li>Check your dashboard for your timetable</li>
      <li>Attend classes according to your shift</li>
      <li>Mark your attendance daily</li>
      <li>Complete all assigned homeworks</li>
    </ul>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/student/dashboard" 
         style="display: inline-block; background: linear-gradient(135deg, #FFD700, #FFC107); 
                color: #1a1a2e; padding: 14px 35px; text-decoration: none; border-radius: 8px; 
                font-weight: bold;">
        Go to Dashboard →
      </a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${EMAIL_USER}>`,
      to: user.email,
      subject: '✅ Payment Approved - Welcome to KNAX_250!',
      html: getEmailTemplate('Payment Approved! ✅', content)
    });
    console.log('✅ Approval email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send Payment Rejection Email
const sendPaymentRejectionEmail = async (user, reason) => {
  if (!transporter) return false;

  const content = `
    <p style="color: #333; line-height: 1.6;">
      Dear <strong>${user.fullName}</strong>,
    </p>
    <p style="color: #333; line-height: 1.6;">
      Unfortunately, your payment could not be verified and has been <strong style="color: #f44336;">REJECTED</strong>.
    </p>
    
    <div style="background: #FFEBEE; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #f44336;">
      <h3 style="color: #c62828; margin-top: 0;">❌ Reason for Rejection:</h3>
      <p style="color: #333; margin: 0;">${reason || 'Payment receipt could not be verified. Please contact support for more information.'}</p>
    </div>
    
    <h3 style="color: #1976D2;">📋 What You Can Do:</h3>
    <ul style="line-height: 2; color: #333;">
      <li>Ensure you have made the correct payment (30,000 RWF)</li>
      <li>Take a clear photo of your payment receipt</li>
      <li>Submit a new application with valid receipt</li>
      <li>Contact support if you believe this is an error</li>
    </ul>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
      <p style="margin: 0; color: #666;">
        <strong>Need Help?</strong><br>
        📞 Call: 0782562906<br>
        📧 Email: nicjbdede@gmail.com
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${EMAIL_USER}>`,
      to: user.email,
      subject: '❌ Payment Rejected - KNAX_250',
      html: getEmailTemplate('Payment Rejected', content)
    });
    console.log('✅ Rejection email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send Announcement Email - NEW FUNCTION
const sendAnnouncementEmail = async (recipients, announcement) => {
  if (!transporter) {
    console.log('⚠️ No email transporter');
    return { success: 0, failed: 0 };
  }

  const getTypeStyle = (type) => {
    switch (type) {
      case 'urgent':
        return { bg: '#f44336', icon: '🚨', label: 'URGENT' };
      case 'event':
        return { bg: '#9c27b0', icon: '📅', label: 'EVENT' };
      case 'reminder':
        return { bg: '#ff9800', icon: '⏰', label: 'REMINDER' };
      default:
        return { bg: '#2196F3', icon: '📢', label: 'ANNOUNCEMENT' };
    }
  };

  const style = getTypeStyle(announcement.type);

  const content = `
    <div style="background: ${style.bg}; color: white; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
      <span style="font-size: 24px;">${style.icon}</span>
      <h2 style="margin: 10px 0 5px 0;">${style.label}</h2>
    </div>
    
    <h2 style="color: #1e293b; margin-top: 0;">${announcement.title}</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; line-height: 1.8;">
      <p style="margin: 0; color: #333; white-space: pre-wrap;">${announcement.content}</p>
    </div>
    
    ${announcement.expiresAt ? `
    <div style="background: #FFF3E0; padding: 12px; border-radius: 8px; border-left: 4px solid #FF9800;">
      <p style="margin: 0; color: #E65100; font-size: 14px;">
        ⏰ This announcement expires on: <strong>${new Date(announcement.expiresAt).toLocaleDateString()}</strong>
      </p>
    </div>
    ` : ''}
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
         style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); 
                color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; 
                font-weight: bold;">
        View Dashboard →
      </a>
    </div>
  `;

  let success = 0;
  let failed = 0;

  for (const recipient of recipients) {
    try {
      await transporter.sendMail({
        from: `"KNAX_250 TECHNOLOGY Ltd" <${EMAIL_USER}>`,
        to: recipient.email,
        subject: `${style.icon} ${announcement.title} - KNAX_250`,
        html: getEmailTemplate(announcement.title, content)
      });
      success++;
      console.log('✅ Announcement email sent to:', recipient.email);
    } catch (error) {
      failed++;
      console.error('❌ Failed to send to:', recipient.email, error.message);
    }
  }

  return { success, failed };
};

// Send Password Reset Email
const sendPasswordResetEmail = async (user, resetUrl) => {
  if (!transporter) return false;

  const content = `
    <p style="color: #333; line-height: 1.6;">
      Hello <strong>${user.fullName}</strong>,
    </p>
    <p style="color: #333; line-height: 1.6;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="display: inline-block; background: linear-gradient(135deg, #FFD700, #FFC107); 
                color: #1a1a2e; padding: 15px 40px; text-decoration: none; border-radius: 8px; 
                font-weight: bold; font-size: 16px;">
        Reset Password →
      </a>
    </div>
    
    <div style="background: #FFF3E0; padding: 15px; border-radius: 8px; border-left: 4px solid #FF9800;">
      <p style="margin: 0; color: #E65100;">
        ⚠️ This link will expire in 1 hour.
      </p>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 20px;">
      If you didn't request this, please ignore this email.
    </p>
  `;

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Password Reset Request - KNAX_250',
      html: getEmailTemplate('Password Reset', content)
    });
    console.log('✅ Password reset email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendJuniorAdminWelcome,
  sendRegistrationConfirmation,
  sendPaymentApprovalEmail,
  sendPaymentRejectionEmail,
  sendAnnouncementEmail,
  sendPasswordResetEmail
};