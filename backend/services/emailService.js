const nodemailer = require('nodemailer');

let transporter = null;

// Initialize mail transporter (uses Ethereal Email for local testing and real email rendering)
async function getTransporter() {
  if (transporter) return transporter;

  try {
    // Generate a test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();
    console.log(`[Email Service] Ethereal test account created successfully: User: ${testAccount.user}`);

    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    return transporter;
  } catch (error) {
    console.error('[Email Service] Failed to initialize Ethereal transporter:', error.message);
    throw error;
  }
}

/**
 * Sends a tracking-enabled automated email to the lead
 */
async function sendAutomatedEmail(lead) {
  try {
    const mailTransporter = await getTransporter();

    // Define host (use localhost:5000 for backend endpoints)
    const backendHost = `http://localhost:${process.env.PORT || 5000}`;
    const frontendHost = 'http://localhost:5173'; // Vite React dev server

    const trackingPixelUrl = `${backendHost}/api/track/open/${lead._id}`;
    const trackingClickUrl = `${backendHost}/api/track/click/${lead._id}`;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">Thank You for Reaching Out!</h2>
        
        <p>Hi <strong>${lead.name}</strong>,</p>
        
        <p>We have successfully received your inquiry regarding:</p>
        
        <blockquote style="margin: 20px 0; padding: 10px 20px; border-left: 4px solid #4f46e5; background-color: #f7fafc; font-style: italic;">
          "${lead.requirement}"
        </blockquote>
        
        <p>Our team has categorized your inquiry under <strong>${lead.aiCategory}</strong>, and an expert will review it shortly to contact you at <strong>${lead.phone}</strong> or reply directly to this email.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${trackingClickUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);">
            Learn More About Our Services
          </a>
        </div>
        
        <p style="font-size: 0.9em; color: #718096; margin-top: 30px;">
          Best regards,<br>
          <strong>Automated Lead Management System</strong>
        </p>
        
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;" />
        
        <!-- Tracking Pixel (1x1 Transparent Image) -->
        <img src="${trackingPixelUrl}" width="1" height="1" alt="" style="display:none; width: 1px; height: 1px;" />
      </div>
    `;

    const mailOptions = {
      from: '"Lead Tracker System" <no-reply@leadtracker.com>',
      to: lead.email,
      subject: `Inquiry Received - ${lead.name}`,
      html: htmlContent,
    };

    const info = await mailTransporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log(`[Email Service] Email sent successfully for lead ${lead._id}`);
    console.log(`[Email Service] Ethereal Preview URL: ${previewUrl}`);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
    };
  } catch (error) {
    console.error('[Email Service] Error sending email:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  sendAutomatedEmail,
};
