import * as nodemailer from 'nodemailer';

export const mail = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false,
  debug: true,
});
