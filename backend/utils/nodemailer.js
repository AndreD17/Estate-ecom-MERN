import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'Damilaresammy1996@gmail.com',
  subject: 'Test Mail',
  text: 'It works!'
}).then(() => console.log('Mail sent'))
.catch(err => console.error(err));
