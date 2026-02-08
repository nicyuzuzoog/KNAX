const nodemailer = require('nodemailer');

let transporter = null;

try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nicjbdede@gmail.com',
      pass: 'ymya xgee snin xifn'
    }
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.log('⚠️ Email configuration warning:', error.message);
      console.log('📧 Emails will not be sent');
    } else {
      console.log('✅ Email server is ready');
    }
  });
} catch (error) {
  console.log('⚠️ Email not configured:', error.message);
}

module.exports = transporter;