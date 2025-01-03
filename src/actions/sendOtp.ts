import otpGenerator from 'otp-generator';

import MailTemplate from '@/components/emailTemplates/MailTemplate';
import { sendMail } from '@/lib/resend';

export async function generateAndSendOtp(email: string) {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  try {
    const { error } = await sendMail(email, 'Email Verification', MailTemplate({ otp: otp }));

    if (error) {
      return null;
    }

    return otp;
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
}
