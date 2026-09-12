import 'dotenv/config';
import sendVerificationEmail from './Services/email.js';

console.log('Key present:', !!process.env.RESEND_API_KEY);
console.log('APP_URL:', process.env.APP_URL);
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);

sendVerificationEmail(
  'kidus1001@gmail.com',   // <- must match your Resend signup email
  'Test User',
  'faketoken123'
)
  .then(() => console.log('Sent OK'))
  .catch(err => console.error('Failed:', err));