import prisma from "../helpers/db";

export const getUserById = async (id) => {
    try {
        return await prisma.user.findUnique({where: {id: parseInt(id)}})
    } catch {
        return null
    }
}

export const getUserByEmail = async (email) => {
    try {
        return await prisma.user.findUnique({where: {email}})
    } catch {
        return null
    }
}

export const updateEmailVerified = async (id, email) => {
    try {
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                emailVerified: new Date(),
                email
            }
        })
    } catch {
        return null
    }
}