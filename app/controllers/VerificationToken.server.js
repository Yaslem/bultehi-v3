import prisma from "../helpers/db";

export const getVerificationTokenByToken = async (token) => {
    try {
        return await prisma.verificationToken.findUnique({ where: { token } })
    } catch {
        return null
    }
}

export const getVerificationTokenByEmail = async (email) => {
    try {
        return await prisma.verificationToken.findFirst({where: {email}})
    } catch {
        return null
    }
}

export const deleteVerificationToken = async (id) => {
    try {
        return await prisma.verificationToken.delete({ where: { id: parseInt(id) } })
    } catch {
        return null
    }
}

export const createVerificationToken = async (email, tokenD, expires) => {
    try {
        return await prisma.verificationToken.create({data: {email, token: tokenD, expires}})
    } catch {
        return null
    }
}
