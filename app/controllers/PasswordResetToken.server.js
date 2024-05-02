import prisma from "../helpers/db";


export const getPasswordResetTokenByToken = async (token) => {
    try {
        return await prisma.passwordResetToken.findUnique({where: {token}})
    } catch {
        return null
    }
}

export const getPasswordResetTokenByEmail = async (email) => {
    try {
        return await prisma.passwordResetToken.findFirst({where: {email}})
    } catch {
        return null
    }
}

export const deletePasswordResetToken = async (id) => {
    try {
         return await prisma.passwordResetToken.delete({ where: { id: parseInt(id) } })
    } catch {
        return null
    }
}

export const createPasswordResetToken = async (email, token, expires) => {
    try {
        return await prisma.passwordResetToken.create({data: {email, token, expires}})
    } catch {
        return null
    }
}
