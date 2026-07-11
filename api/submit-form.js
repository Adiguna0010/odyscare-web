const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const { _subject, _cc, ...fields } = data;

    // Verify Gmail App Password configuration
    if (!process.env.GMAIL_APP_PASSWORD) {
      throw new Error('GMAIL_APP_PASSWORD environment variable is not configured on Vercel.');
    }

    // Create transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'odyscareofficial@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Generate HTML Email template matching ODYSCARE brand (dark & gold theme)
    let emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0b0b0b;
            color: #d1d1d1;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #121212;
            border-radius: 12px;
            border: 1px solid #c5a880;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7);
            overflow: hidden;
          }
          .header {
            background-color: #0b0b0b;
            padding: 40px 30px;
            text-align: center;
            border-bottom: 2px solid #c5a880;
          }
          .header img {
            max-width: 90px;
            margin-bottom: 12px;
          }
          .header h1 {
            color: #c5a880;
            font-size: 26px;
            margin: 0;
            font-family: 'Cormorant Garamond', 'Georgia', serif;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .content {
            padding: 40px 30px;
          }
          .subject {
            font-size: 18px;
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 25px;
            font-weight: 600;
            border-left: 4px solid #c5a880;
            padding-left: 12px;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .data-table tr {
            border-bottom: 1px solid #222222;
          }
          .data-table tr:last-child {
            border-bottom: none;
          }
          .data-table td {
            padding: 14px 10px;
            vertical-align: top;
          }
          .data-table td.label {
            width: 38%;
            color: #c5a880;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
          }
          .data-table td.value {
            color: #ffffff;
            font-size: 15px;
            line-height: 1.6;
          }
          .footer {
            background-color: #070707;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #666666;
            border-top: 1px solid #222222;
          }
          .footer a {
            color: #c5a880;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://odyscare-web.vercel.app/assets/logo.png" alt="ODYSCARE Logo">
            <h1>ODYSCARE</h1>
          </div>
          <div class="content">
            <div class="subject">${_subject || 'Notifikasi Form Website'}</div>
            <table class="data-table">
    `;

    // Loop through form fields dynamically
    for (const [key, value] of Object.entries(fields)) {
      emailHtml += `
        <tr>
          <td class="label">${key}</td>
          <td class="value">${value.replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    }

    emailHtml += `
            </table>
          </div>
          <div class="footer">
            Pesan ini dikirim secara otomatis oleh sistem situs web <a href="https://odyscare-web.vercel.app">ODYSCARE</a>.
          </div>
        </div>
      </body>
      </html>
    `;

    // Mail options
    const mailOptions = {
      from: '"ODYSCARE Official" <odyscareofficial@gmail.com>',
      to: 'odyscareofficial@gmail.com',
      cc: _cc || '',
      replyTo: fields['Alamat Email'] || fields['Email'] || '',
      subject: _subject || 'Website Form Submission',
      html: emailHtml
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email via Nodemailer:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
