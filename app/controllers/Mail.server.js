import { Resend } from 'resend';

const resend = new Resend('re_6p62XiKe_P7VUsjg9izBSYA4M6vRe57x1');

export const sendVerificationEmail = async (email, token) => {
    const confirmLink = `${process.env.BASE_URL}/auth/verification?token=${token}`;

    await resend.emails.send({
        from: 'verification@yeslem.dev',
        to: email,
        subject: 'تأكيد حسابك',
        html: `<p>رجاء اضغط <a href="${confirmLink}">هنا</a> لتأكيد حسابك</p>`
    });

}

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: 'newPassword@yeslem.dev',
        to: email,
        subject: 'تغيير كلمة المرور',
        html: `<p>رجاء اضغط <a href="${resetLink}">here</a> لتغيير كلمة مرور</p>`
    });

}