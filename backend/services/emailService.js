// services/emailService.js
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Create transporter
let transporter = null;

try {
  const emailUser = process.env.EMAIL_USER || 'nicjbdede@gmail.com';
  const emailPass = process.env.EMAIL_PASS || 'ymya xgee snin xifn';

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  // Verify on startup
  transporter.verify()
    .then(() => console.log('✅ Email server ready'))
    .catch(err => console.log('⚠️ Email error:', err.message));

} catch (error) {
  console.log('⚠️ Email not configured:', error.message);
}

// Send welcome email after registration
const sendWelcomeEmail = async (user) => {
  if (!transporter) {
    console.log('⚠️ No email transporter - skipping email');
    return false;
  }

  const mailOptions = {
    from: `"KNAX_250 TECHNOLOGY Ltd" <${process.env.EMAIL_USER || 'nicjbdede@gmail.com'}>`,
    to: user.email,
    subject: '🎉 Welcome to KNAX_250 TECHNOLOGY Ltd!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1976D2, #0D47A1); padding: 40px 20px; text-align: center;">
            <h1 style="color: #FFD700; margin: 0; font-size: 28px;">🎓 KNAX_250 TECHNOLOGY Ltd</h1>
            <p style="color: white; margin-top: 10px; font-size: 14px;">RTB Certified Technical Training Center</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1976D2; margin-top: 0;">Welcome, ${user.fullName}! 🎉</h2>
            <p style="color: #333; line-height: 1.6;">Thank you for registering with KNAX_250 TECHNOLOGY Ltd! We're excited to have you join our community of learners.</p>
            
            <!-- Steps Box -->
            <div style="background: linear-gradient(135deg, #1976D2, #1565C0); color: white; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #FFD700; margin: 0 0 15px 0;">📋 Next Steps:</h3>
              <ol style="margin: 0; padding-left: 20px; line-height: 2;">
                <li>Login to your dashboard</li>
                <li>Apply for your preferred internship</li>
                <li>Pay 30,000 RWF registration fee</li>
                <li>Upload your payment receipt</li>
                <li>Wait for approval (24-48 hours)</li>
              </ol>
            </div>
            
            <!-- Departments -->
            <h3 style="color: #1976D2;">Available Departments:</h3>
            <ul style="line-height: 2; color: #333;">
              <li>🖥️ <strong>NIT</strong> - Networking & IT</li>
              <li>💻 <strong>SOD</strong> - Software Development</li>
              <li>📊 <strong>ACCOUNTING</strong> - Financial Management</li>
              <li>🔧 <strong>CSA</strong> - Computer Service & Assembly</li>
              <li>⚡ <strong>ETE</strong> - Electronics & Telecommunications</li>
            </ul>
            
            <!-- Info Box -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #1976D2; margin: 20px 0;">
              <p style="margin: 0;"><strong>📍 Location:</strong> Near Makuza Peace Plaza, ATENE Building, Kigali</p>
              <p style="margin: 10px 0 0 0;"><strong>📞 Phone:</strong> 0782562906</p>
              <p style="margin: 10px 0 0 0;"><strong>📧 Email:</strong> nicjbdede@gmail.com</p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3000/login" style="display: inline-block; background: linear-gradient(135deg, #FFD700, #FFC107); color: #1a1a2e; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Login to Dashboard →</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #1a1a2e; padding: 30px; text-align: center; color: white;">
            <p style="margin: 0;">© 2024 KNAX_250 TECHNOLOGY Ltd. All rights reserved.</p>
            <p style="margin: 15px 0 0 0;">Follow us: <a href="https://www.instagram.com/knax_250" style="color: #FFD700; text-decoration: none;">@knax_250</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Send email error:', error.message);
    return false;
  }
};

// Send registration confirmation (when student applies for internship)
const sendRegistrationConfirmation = async (user, registration) => {
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${process.env.EMAIL_USER || 'nicjbdede@gmail.com'}>`,
      to: user.email,
      subject: '📋 Application Received - KNAX_250',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; background: white;">
          <div style="background: linear-gradient(135deg, #1976D2, #0D47A1); padding: 30px; text-align: center;">
            <h1 style="color: #FFD700; margin: 0;">KNAX_250 TECHNOLOGY Ltd</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #1976D2;">Application Received! 📋</h2>
            <p>Dear <strong>${user.fullName}</strong>,</p>
            <p>We have received your internship application for <strong>${registration.department}</strong>.</p>
            <div style="background: #FFF3E0; padding: 15px; border-radius: 8px; border-left: 4px solid #FF9800; margin: 20px 0;">
              <p style="margin: 0;"><strong>⏳ Status:</strong> Pending Review</p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Our team is reviewing your payment receipt.</p>
            </div>
            <p>You'll receive an email once your application is approved!</p>
            <p>📞 Questions? Call us: <strong>0782562906</strong></p>
          </div>
          <div style="background: #1a1a2e; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">© 2024 KNAX_250 TECHNOLOGY Ltd</p>
          </div>
        </div>
      `
    });
    console.log('✅ Registration confirmation sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send approval email
const sendApprovalEmail = async (user, registration) => {
  if (!transporter) return false;

  const startDate = registration.startDate 
    ? new Date(registration.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'To be announced';

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${process.env.EMAIL_USER || 'nicjbdede@gmail.com'}>`,
      to: user.email,
      subject: '✅ Congratulations! Application Approved - KNAX_250',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto; background: white;">
          <div style="background: linear-gradient(135deg, #4CAF50, #388E3C); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">✅ YOU'RE APPROVED!</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #4CAF50;">Congratulations, ${user.fullName}! 🎉</h2>
            <p>Your internship application has been <strong style="color: #4CAF50;">APPROVED</strong>!</p>
            
            <div style="background: #E8F5E9; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #2E7D32; margin-top: 0;">📋 Internship Details:</h3>
              <p><strong>Department:</strong> ${registration.department}</p>
              <p><strong>Start Date:</strong> ${startDate}</p>
              <p><strong>Location:</strong> Near Makuza Peace Plaza, ATENE Building</p>
            </div>
            
            <h3 style="color: #1976D2;">📌 What to Bring:</h3>
            <ul style="line-height: 2;">
              <li>✅ National ID</li>
              <li>✅ This approval email</li>
              <li>✅ Notebook and pen</li>
            </ul>
            
            <p><strong>🆓 Free WiFi Available!</strong></p>
          </div>
          <div style="background: #1a1a2e; padding: 20px; text-align: center; color: white;">
            <p>📞 0782562906 | Follow: <a href="https://www.instagram.com/knax_250" style="color: #FFD700;">@knax_250</a></p>
          </div>
        </div>
      `
    });
    console.log('✅ Approval email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send rejection email
const sendRejectionEmail = async (user, registration, reason = 'Payment verification failed') => {
  if (!transporter) return false;

  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${process.env.EMAIL_USER || 'nicjbdede@gmail.com'}>`,
      to: user.email,
      subject: '⚠️ Application Update - KNAX_250',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <div style="background: #FF9800; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">⚠️ Application Update</h1>
          </div>
          <div style="padding: 30px; background: white;">
            <p>Dear ${user.fullName},</p>
            <div style="background: #FFF3E0; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Reason:</strong> ${reason}</p>
            </div>
            <p>You can resubmit with correct documents. Contact us for help!</p>
            <p>📞 <strong>0782562906</strong></p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

// Send certificate (simplified version)
const sendCertificate = async (user, registration) => {
  if (!transporter) return false;

  // For now, just send an email without PDF attachment
  // PDF generation can be added later
  try {
    await transporter.sendMail({
      from: `"KNAX_250 TECHNOLOGY Ltd" <${process.env.EMAIL_USER || 'nicjbdede@gmail.com'}>`,
      to: user.email,
      subject: '🎓 Congratulations! Internship Completed - KNAX_250',
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 40px; text-align: center;">
            <h1 style="color: #FFD700; margin: 0;">🎓 CERTIFICATE OF COMPLETION</h1>
          </div>
          <div style="padding: 30px; background: white; text-align: center;">
            <h2 style="color: #1976D2;">Congratulations, ${user.fullName}! 🎉</h2>
            <p>You have successfully completed your internship in <strong>${registration.department}</strong>!</p>
            <div style="background: #FFD700; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; color: #1a1a2e; font-weight: bold;">Your physical certificate is ready for pickup!</p>
            </div>
            <p>Visit our office to collect your official RTB-certified certificate.</p>
            <p>📍 Near Makuza Peace Plaza, ATENE Building</p>
          </div>
          <div style="background: #1a1a2e; padding: 20px; text-align: center; color: white;">
            <p>© 2024 KNAX_250 TECHNOLOGY Ltd</p>
          </div>
        </div>
      `
    });
    console.log('✅ Certificate notification sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendRegistrationConfirmation,
  sendApprovalEmail,
  sendRejectionEmail,
  sendCertificate
};