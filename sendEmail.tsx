const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

dotenv.config();

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  try {
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
      }
    });

    return transporter;
  } catch (error) {
    throw new Error(`Failed to create access token: ${error.message}`);
  }
};

const sendEmail = async (emailOptions) => {
  try {
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
};

////////////////locker No/pickup code/to emailadress////////////////////////////////////
sendEmail({
  subject: 'Your parcel has arrived!',
  text: 'Your parcel is waiting for you in Locker 1. The pickup code is 1234.',
  to: 't2tato01@students.oamk.fi',
  from: process.env.EMAIL
});
