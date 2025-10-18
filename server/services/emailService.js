import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Email configuration
const emailConfig = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER || process.env.NODEMAILER_MAIL || '990453001@smtp-brevo.com',
    pass: process.env.SMTP_PASS || process.env.NODEMAILER_PASS || 'vGdA4TEyfYMF2nDz'
  }
};

// Debug email configuration on startup
console.log('📧 Email Configuration Check:');
console.log('- Host:', emailConfig.host);
console.log('- Port:', emailConfig.port);
console.log('- SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'MISSING');
console.log('- SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'MISSING');
console.log('- NODEMAILER_MAIL:', process.env.NODEMAILER_MAIL ? 'SET' : 'MISSING');
console.log('- NODEMAILER_PASS:', process.env.NODEMAILER_PASS ? 'SET' : 'MISSING');

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

const emailTemplates = {
  newAssignment: (assignmentData, courseData) => ({
    subject: `New Assignment: ${assignmentData.title}`,
    html: `
      <h2>New Assignment Available</h2>
      <p><strong>Course:</strong> ${courseData?.title || courseData?.name || 'Course'}</p>
      <p><strong>Assignment:</strong> ${assignmentData.title}</p>
      <p><strong>Description:</strong> ${assignmentData.description || 'No description provided'}</p>
      <p><strong>Due Date:</strong> ${assignmentData.dueDate ? new Date(assignmentData.dueDate).toLocaleDateString() : 'Not specified'}</p>
      <p>Please submit your assignment before the due date.</p>
      <br>
      <p>Best regards,<br>LMS Team</p>
    `
  }),

  gradeNotification: (gradeData, assignmentData, courseData) => ({
    subject: `Grade Received: ${assignmentData.title}`,
    html: `
      <h2>Assignment Graded</h2>
      <p><strong>Course:</strong> ${courseData?.title || courseData?.name || 'Course'}</p>
      <p><strong>Assignment:</strong> ${assignmentData.title}</p>
      <p><strong>Grade:</strong> ${gradeData.marks}/100</p>
      <p><strong>Feedback:</strong> ${gradeData.feedback || 'No feedback provided'}</p>
      <br>
      <p>Best regards,<br>LMS Team</p>
    `
  }),

  courseEnrollment: (courseData, studentData) => ({
    subject: `Welcome to ${courseData.title}`,
    html: `
      <h2>Course Enrollment Confirmation</h2>
      <p>Dear ${studentData.name},</p>
      <p>You have been successfully enrolled in <strong>${courseData.title}</strong>.</p>
      <p><strong>Instructor:</strong> ${courseData.teacher?.name || 'TBA'}</p>
      <p><strong>Duration:</strong> ${courseData.duration || 'Not specified'}</p>
      <br>
      <p>Welcome to the course!</p>
      <p>Best regards,<br>LMS Team</p>
    `
  })
};

// Send email function
export const sendEmail = async (to, template, data) => {
  try {
    console.log(`📧 Attempting to send ${template} email to ${to}`);

    const templateData = emailTemplates[template](data);
    const mailOptions = {
      from: `"LMS System" <${emailConfig.auth.user}>`,
      to,
      subject: templateData.subject,
      html: templateData.html
    };

    console.log('📨 Email details:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      host: emailConfig.host,
      port: emailConfig.port
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: info.envelope?.to?.[0] || to,
      subject: info.subject
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', {
      error: error.message,
      code: error.code,
      response: error.response,
      to,
      template
    });
    return { success: false, error: error.message };
  }
};

// Test email function (for debugging)
export const sendTestEmail = async (to) => {
  try {
    console.log(`Sending test email to ${to}`);

    const testTemplate = {
      subject: 'LMS Email System Test',
      html: `
        <h2>LMS Email System Test</h2>
        <p>This is a test email to verify that the email notification system is working correctly.</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        <p><strong>Server:</strong> ${process.env.EMAIL_HOST || 'Unknown'}</p>
        <br>
        <p>If you received this email, the email notification system is working properly!</p>
        <p>Best regards,<br>LMS Team</p>
      `
    };

    const mailOptions = {
      from: emailConfig.auth.user,
      to,
      subject: testTemplate.subject,
      html: testTemplate.html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Test email sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Test email failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send multiple emails (for bulk notifications)
export const sendBulkEmails = async (recipients, template, data) => {
  const results = [];

  for (const recipient of recipients) {
    const result = await sendEmail(recipient.email, template, { ...data, student: recipient });
    results.push({ email: recipient.email, ...result });
  }

  return results;
};

export default { sendEmail };
