const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendEmail(targetEmail, content) {
    const playlistName = (content.playlist.name).replace(/ /g, "_");

    const message = {
      from: 'openmusic@admin.com',
      to: targetEmail,
      subject: 'Playlist export',
      text: 'attached the export results of the records',
      attachments: [
        {
          filename: `${playlistName}-playlist.json`,
          content: JSON.stringify(content),
        },
      ],
    };

    return this._transporter.sendMail(message);
  }

}

module.exports = MailSender;
