import prisma from "../helpers/db";
import sendMessage from "../helpers/SendResponse.server.js";
import {ResultSettingsSchema} from "../helpers/Schemas";

export async function CreateResultSettings({name,  nameFr, model, slug}) {

    const validated =  ResultSettingsSchema.safeParse({ name })
    if (validated.success) {
        switch (model) {
            case "type":
                const existingType= await getTypeByName(name)

                if (existingType) return sendMessage(false, 404, "النوع موجود بالفعل")

                try {

                    await prisma.reslutType.create({
                        data: {
                            name, slug: parseInt(slug)
                        }
                    })
                    return sendMessage(true, 200, "تم إنشاء النوع بنجاح.")

                } catch (error) {
                    return sendMessage(false, 400, "حدث خطأ ما.")
                }
            case "year":
                const existingYear = await getYearByName(name)

                if (existingYear) return sendMessage(false, 404, "السنة موجودة بالفعل")

                try {

                    await prisma.year.create({
                        data: {
                            name
                        }
                    })
                    return sendMessage(true, 200, "تم إنشاء السنة بنجاح.")

                } catch (error) {
                    return sendMessage(false, 400, "حدث خطأ ما.")
                }
            case "session":
                const existingSession = await getSessionByName(name)

                if (existingSession) return sendMessage(false, 404, "الدورة موجودة بالفعل")

                try {

                    await prisma.session.create({
                        data: {
                            name,
                            slug: parseInt(slug)
                        }
                    })
                    return sendMessage(true, 200, "تم إنشاء الدورة بنجاح.")

                } catch (error) {
                    return sendMessage(false, 400, "حدث خطأ ما.")
                }
            case "unknown":
                const existingUnknown= await getUnknownByName(name)

                if (existingUnknown) return sendMessage(false, 404, "القيمة موجودة بالفعل")

                try {
                    await prisma.$transaction([
                        prisma.state.create({ data: { name: "unknown"}}),
                        prisma.county.create({ data: { name: "unknown"}}),
                        prisma.school.create({ data: { name: "unknown"}}),
                        prisma.center.create({ data: { name: "unknown"}}),
                    ])
                    await prisma.unknown.create({
                        data: {
                            nameAr: name, nameFr
                        }
                    })
                    return sendMessage(true, 200, "تم إنشاء القيمة بنجاح.")

                } catch (error) {
                    return sendMessage(false, 400, "حدث خطأ ما.")
                }
        }
    } else {
        return sendMessage(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}

export async function updateResultSettings({id, name, nameFr, model, slug}) {

    const validated =  ResultSettingsSchema.safeParse({ name })
    if (validated.success) {
        switch (model) {
            case "type":
                const existingType= await getTypeByName(name)
                if (existingType && existingType.id !== parseInt(id)) return sendMessage(false, 404, "النوع موجود بالفعل")
                await prisma.reslutType.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        name, slug: parseInt(slug)
                    }
                })
                return sendMessage(true, 200, "تم تحديث النوع بنجاح.")
            case "year":
                const existingYear = await getYearByName(name)
                if (existingYear && existingYear.id !== parseInt(id)) return sendMessage(false, 404, "السنة موجودة بالفعل")
                await prisma.year.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        name
                    }
                })
                return sendMessage(true, 200, "تم تحديث السنة بنجاح.")
            case "session":
                const existingSession = await getSessionByName(name)
                if (existingSession && existingSession.id !== parseInt(id)) return sendMessage(false, 404, "الدورة موجودة بالفعل")
                await prisma.session.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        name,
                        slug: parseInt(slug)
                    }
                })
                return sendMessage(true, 200, "تم تحديث الدورة بنجاح.")
            case "unknown":
                const existingUnknown = await getUnknownByName(name)
                if (existingUnknown && existingUnknown.id !== parseInt(id)) return sendMessage(false, 404, "القيمة موجودة بالفعل")
                await prisma.unknown.update({
                    where: {
                        id: parseInt(id)
                    },
                    data: {
                        nameAr: name, nameFr
                    }
                })
                return sendMessage(true, 200, "تم تحديث القيمة بنجاح.")
        }
    } else {
        return sendMessage(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}

export const getTypes =  async () => {
    const types = await prisma.reslutType.findMany({
        select: {
          id: true,
          name: true,
          slug: true
        },
        orderBy: {
            slug: 'asc',
        },
    })
    if(types.length > 0){
        return sendMessage(true, 200,"تم جلب البيانات بنجاح.", types)
    }
    return sendMessage(false, 400,"لا توجد بيانات.")
}


export const getYears =  async () => {
    const years = await prisma.year.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true
        },
        orderBy: {
            name: 'desc',
        },
    })
    if(years.length > 0){
        return sendMessage(true, 200,"تم جلب البيانات بنجاح.", years)
    }
    return sendMessage(false, 400,"لا توجد بيانات.")
}
export const getUnknown =  async () => {
    const unknown = await prisma.unknown.findMany({
        select: {
            id: true,
            nameAr: true,
            nameFr: true
        }
    })
    if(unknown.length > 0){
        return sendMessage(true, 200,"تم جلب البيانات بنجاح.", unknown)
    }
    return sendMessage(false, 400,"لا توجد بيانات.")
}

export const getSessions =  async () => {
    const sessions = await prisma.session.findMany({
        select: {
          id: true,
          name: true,
          slug: true
        },
        orderBy: {
            slug: 'asc',
        },
    })
    if(sessions.length > 0){
        return sendMessage(true, 200,"تم جلب البيانات بنجاح.", sessions)
    }
    return sendMessage(false, 400,"لا توجد بيانات.")
}

export const getTypeByName =  async (name) => {
    return await prisma.reslutType.findFirst({where: {name}})
}

export const deleteType =  async (id) => {
    await prisma.reslutType.delete({ where: { id: parseInt(id) } })
    return sendMessage(true, 200,"تم حذف البيانات بنجاح.")
}

export const deleteYear =  async (id) => {
    await prisma.year.delete({ where: { id: parseInt(id) } })
    return sendMessage(true, 200,"تم حذف البيانات بنجاح.")
}

export const deleteUnknown =  async (id) => {
    await prisma.unknown.delete({ where: { id: parseInt(id) } })
    return sendMessage(true, 200,"تم حذف البيانات بنجاح.")
}
export const deleteSession=  async (id) => {
    await prisma.session.delete({ where: { id: parseInt(id) } })
    return sendMessage(true, 200,"تم حذف البيانات بنجاح.")
}

export const getYearByName =  async (name) => {
    return await prisma.year.findFirst({where: {name}})
}

export const getSessionByName =  async (name) => {
    return await prisma.session.findFirst({where: {name}})
}

export const getUnknownByName =  async (nameAr) => {
    return await prisma.unknown.findFirst({where: {nameAr}})
}