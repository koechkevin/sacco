import sgMail from '@sendgrid/mail';
// import os from 'os';
import {config} from 'dotenv';

config();

const apiKey: string = process.env.SENDGRID_API || '';
sgMail.setApiKey(apiKey);

const mailOptions = {
  from: `noreply@${'sacco.com'}`,
};

export const sendEmail = (options: any) => sgMail.send({...mailOptions, ...options});
