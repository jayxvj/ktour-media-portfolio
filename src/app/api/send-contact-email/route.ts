import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

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
              <h1>🎬 New Contact Request</h1>
              <p>KTOUR Media Production</p>
            </div>
            <div class="content">
              <p>You have received a new contact request from your website:</p>
              
              <div class="field">
                <div class="label">👤 Name:</div>
                <div>${name}</div>
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
                <div class="label">💬 Message:</div>
                <div>${message}</div>
              </div>
              
              <p style="margin-top: 30px; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #2196f3; border-radius: 4px;">
                <strong>⏰ Action Required:</strong> Please respond to this inquiry as soon as possible.
              </p>
            </div>
            <div class="footer">
              <p>This email was sent from KTOUR website contact form</p>
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
      subject: `🎬 New Contact Request from ${name}`,
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
