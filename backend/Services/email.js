import 'dotenv/config'
import { Resend } from 'resend';

export default async function sendverificationEmail (to, name, token) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const verifyURL = `${process.env.APP_URL}/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send ({
        from: `Mezmur Debter <${process.env.FROM_EMAIL}>`,
        to,
        subject: 'Verify your email address',
        html: `
            <h1>Hello ${name}</h1>
            <p>Click the link below to verify your email address.</p>
            <>href="${verifyURL}"</a>
            <p>This link expires in 2 hours.</p>
        `
    });

    if (error) {
        console.error ('Resend error:', error);
        throw new Error ('Failed to send verification email');
    }
    return data;
}