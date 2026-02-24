import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { to, subject, html } = await request.json();

        // Check if environment variables are set
        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.FROM_EMAIL) {
            console.warn('⚠️ SMTP credentials are not fully configured in environment variables.');
            return NextResponse.json(
                { success: false, error: 'SMTP Configuration Missing' },
                { status: 500 }
            );
        }

        // Configure the transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Send backend email
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'Jahez Platform'}" <${process.env.FROM_EMAIL}>`,
            to,
            subject,
            html,
        });

        console.log('Email sent successfully: %s', info.messageId);

        return NextResponse.json({ success: true, messageId: info.messageId });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to send email' },
            { status: 500 }
        );
    }
}
