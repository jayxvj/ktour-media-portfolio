import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, businessName, location, serviceType, message } = await request.json();

    // Service type labels
    const serviceLabels: { [key: string]: string } = {
      'google-360-tour': 'Google 360° Virtual Tour',
      '360-product': '360° Product Shoot',
      '360-interior': '360° Interior & Real Estate',
      '360-video': '360° Video Production',
      'branding': 'Business Branding Photography',
      'custom': 'Custom Virtual Tour Solution',
    };

    const serviceLabel = serviceLabels[serviceType] || serviceType;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .field {
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f5f5f5;
              border-radius: 5px;
            }
            .label {
              font-weight: bold;
              color: #667eea;
              margin-bottom: 5px;
            }
            .service-highlight {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
              font-size: 18px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💼 New Quote Request</h1>
              <p>KTOUR Media Production</p>
            </div>
            <div class="content">
              <p>You have received a new quote request from your website:</p>
              
              <div class="service-highlight">
                🎯 ${serviceLabel}
              </div>
              
              <div class="field">
                <div class="label">👤 Name:</div>
                <div>${name}</div>
              </div>
              
              <div class="field">
                <div class="label">🏢 Business Name:</div>
                <div>${businessName}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 Email:</div>
                <div>${email}</div>
              </div>
              
              <div class="field">
                <div class="label">📞 Phone:</div>
                <div>${phone}</div>
              </div>
              
              <div class="field">
                <div class="label">📍 Location:</div>
                <div>${location}</div>
              </div>
              
              ${message ? `
              <div class="field">
                <div class="label">💬 Additional Message:</div>
                <div>${message}</div>
              </div>
              ` : ''}
              
              <p style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <strong>⚡ Priority Lead:</strong> This is a high-value quote request. Please follow up within 24 hours!
              </p>
            </div>
            <div class="footer">
              <p>This email was sent from KTOUR website quote form</p>
              <p>© ${new Date().getFullYear()} KTOUR - Kosmos Media Production</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `💼 New Quote Request: ${serviceLabel} - ${businessName}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
