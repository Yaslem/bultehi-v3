import prisma from "../helpers/db";
import sendMessage from "../helpers/SendResponse.server.js";
import bcrypt from 'bcryptjs';
import {NewPasswordSchema, ResetSchema} from "../helpers/Schemas";
import {getUserByEmail, updateEmailVerified} from "./User.server.js";
import {generatePasswordResetToken, generateVerificationToken} from "../helpers/Tokens.server.js";
import {sendPasswordResetEmail, sendVerificationEmail} from "./Mail.server.js";
import {deleteVerificationToken, getVerificationTokenByToken} from "./VerificationToken.server.js";
import {
    deletePasswordResetToken,
    getPasswordResetTokenByToken
} from "./PasswordResetToken.server.js";
import Validate from "../helpers/Validate.js";
import {Authenticator, signIn} from "../services/auth.server.js";
import {commitSession} from "../services/session.server.js";
import {redirect} from "@remix-run/node";

export async function authRegister({ name, email, password }) {

    const validated = Validate.register.safeParse({ name, email, password })
    if (validated.success) {
        const existingUser = await getUserByEmail(email)

        if (existingUser) return sendMessage(false, 404, "المستخدم موجود بالفعل")

        const hashedPassword = await bcrypt.hash(password, 12)

        try {

            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword
                }
            })

            const verificationToken = await generateVerificationToken(email)
            await sendVerificationEmail(verificationToken.email, verificationToken.token)
            return sendMessage(true, 200, "تم إرسال رابط إلى بريدك لتأكيد حسابك.")

        } catch (error) {
            console.log(error)
            return sendMessage(false, 400, "حدث خطأ ما.")
        }
    } else {
        return sendMessage(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}

export async function authLogin({ email, password, request}) {

    const validated = Validate.login.safeParse({ email, password })
    if (validated.success) {

        const existingUser = await getUserByEmail(email)

        if(!existingUser || !existingUser.email || !existingUser.password || !await bcrypt.compare(password, existingUser.password)) {
            return sendMessage(false, 400, "المعلومات غير صحيحة.")
        }

        if(!existingUser.emailVerified) {
            try {
                const verificationToken = await generateVerificationToken(existingUser.email)
                await sendVerificationEmail(verificationToken.email, verificationToken.token)
                return sendMessage(true, 200, "تم إرسال رابط إلى بريدك لتأكيد حسابك.")
            } catch (error) {
                console.log(error)
                return sendMessage(false, 400, "حدث خطأ ما.")
            }
        }

        // const authenticator = new Authenticator(session)
        await signIn(request, {
            email: existingUser.email
        })

    } else {
        return sendMessage(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

    return sendMessage(true, 200, "تم تسجيل الدخول بنجاح.")

}

export async function authReset({ email }) {

    const validated = Validate.reset.safeParse({ email })
    if (validated.success) {
        const existingUser = await getUserByEmail(email)
        if(!existingUser) {
            return sendMessage(false, 400, "المعلومات غير صحيحة.")
        }

        const passwordResetToken = await generatePasswordResetToken(existingUser.email)
        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

        return sendMessage(true, 200, "تم إرسال رابط إلى بريدك لتغيير كلمة مرورك.")

    } else {
        return sendMessage(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

    return sendMessage(true, 200, "تم تسجيل الدخول بنجاح.")

}

export async function authVerification(token) {

    const existingToken = await getVerificationTokenByToken(token)

    if(!existingToken) return sendMessage(false, 400, "رابط تأكيد الحساب غير صحيح.")

    const hasExpired = new Date(existingToken.expires) < new Date()

    if(hasExpired) return sendMessage(false, 400, "انتهت مدة رابط تأكيد الحساب.")

    const existingUser = await getUserByEmail(existingToken.email)

    if(!existingUser) return sendMessage(false, 400, "البريد المرتبط بهذا الحساب غير موجود.")

    await updateEmailVerified(existingUser.id, existingToken.email)

    await deleteVerificationToken(existingToken.id)

    return sendMessage(true, 200, "تم تأكيد الحساب.")

}

export async function authNewPassword({password, token}) {

    const validated = Validate.newPassword.safeParse({ password })

    if(validated.success) {

        if (!token) return sendMessage(false, 400, "رمز تغيير كلمة المرور مطلوب.")

        const existingToken = await getPasswordResetTokenByToken(token)

        if(!existingToken) return sendMessage(false, 400, "رابط تغيير كلمة المرور غير صحيح.")

        const hasExpired = new Date(existingToken.expires) < new Date()

        if(hasExpired) return sendMessage(false, 400, "انتهت مدة رابط تغيير كلمة المرور.")

        const existingUser = await getUserByEmail(existingToken.email)

        if(!existingUser) return sendMessage(false, 400, "البريد المرتبط بهذا الحساب غير موجود.")

        await authUpdatePassword(existingUser.id, password)

        await deletePasswordResetToken(existingToken.id)

        throw redirect("/auth/login")

    } else {
        return sendMessage(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

    return sendMessage(true, 200, "تم تغيير كلمة المرور بنجاح.")

}

export async function authUpdatePassword(id, password) {

    const hashedPassword = await bcrypt.hash(password, 12)

    try {
        return  await prisma.user.update({
            where: {
              id: parseInt(id)
            },
            data: {
                password: hashedPassword
            }
        })

    } catch (error) {
        return null
    }

}

export async function authLogout() {
    await signOut()

    return sendMessage(true, 200, "تم تسجيل الخروج بنجاح")
}