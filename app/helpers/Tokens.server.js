import {v4 as uuidv4} from "uuid"
import {
    createVerificationToken,
    deleteVerificationToken,
    getVerificationTokenByEmail
} from "../controllers/VerificationToken.server.js"
import {
    createPasswordResetToken,
    deletePasswordResetToken,
    getPasswordResetTokenByEmail
} from "../controllers/PasswordResetToken.server.js";

export const generateVerificationToken = async (email) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    const existingToken = await getVerificationTokenByEmail(email)

    if(existingToken){
        await deleteVerificationToken(existingToken.id)
    }

    return await createVerificationToken(email, token, expires);
}

export const generatePasswordResetToken = async (email) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email)

    if(existingToken){
        await deletePasswordResetToken(existingToken.id)
    }

    return await createPasswordResetToken(email, token, expires);
}