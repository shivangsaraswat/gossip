import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = new Resend(env.RESEND_API_KEY);

export const emailService = {
    async sendVerificationEmail(
        email: string,
        code: string,
        displayName: string
    ): Promise<void> {
        try {
            await resend.emails.send({
                from: env.EMAIL_FROM,
                to: email,
                subject: 'Verify your Gossip account',
                html: getVerificationEmailTemplate(code, displayName),
            });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw new Error('Failed to send verification email');
        }
    },

    async sendPasswordResetEmail(
        email: string,
        code: string,
        displayName: string
    ): Promise<void> {
        try {
            await resend.emails.send({
                from: env.EMAIL_FROM,
                to: email,
                subject: 'Reset your Gossip password',
                html: getPasswordResetEmailTemplate(code, displayName),
            });
        } catch (error) {
            console.error('Failed to send password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    },
};

function getVerificationEmailTemplate(code: string, displayName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">Gossip</h1>
    </div>
    
    <p style="font-size: 16px; color: #333; margin: 0 0 24px;">Hey ${displayName},</p>
    
    <p style="font-size: 16px; color: #333; margin: 0 0 24px;">Welcome to Gossip! Use the code below to verify your email address:</p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 24px; text-align: center; margin: 0 0 24px;">
      <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: white;">${code}</span>
    </div>
    
    <p style="font-size: 14px; color: #666; margin: 0 0 8px;">This code expires in 10 minutes.</p>
    <p style="font-size: 14px; color: #666; margin: 0;">If you didn't create a Gossip account, you can safely ignore this email.</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
    
    <p style="font-size: 12px; color: #999; margin: 0; text-align: center;">© ${new Date().getFullYear()} Gossip. All rights reserved.</p>
  </div>
</body>
</html>
`;
}

function getPasswordResetEmailTemplate(code: string, displayName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 40px 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">Gossip</h1>
    </div>
    
    <p style="font-size: 16px; color: #333; margin: 0 0 24px;">Hey ${displayName},</p>
    
    <p style="font-size: 16px; color: #333; margin: 0 0 24px;">Use the code below to reset your password:</p>
    
    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px; padding: 24px; text-align: center; margin: 0 0 24px;">
      <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: white;">${code}</span>
    </div>
    
    <p style="font-size: 14px; color: #666; margin: 0 0 8px;">This code expires in 10 minutes.</p>
    <p style="font-size: 14px; color: #666; margin: 0;">If you didn't request a password reset, please secure your account.</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
    
    <p style="font-size: 12px; color: #999; margin: 0; text-align: center;">© ${new Date().getFullYear()} Gossip. All rights reserved.</p>
  </div>
</body>
</html>
`;
}
