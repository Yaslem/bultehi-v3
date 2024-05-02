"use server"
import prisma from "../helpers/db";
import sendMessage from "../helpers/SendResponse.server.js";
import {CategorySchema} from "../helpers/Schemas";
import {revalidatePath} from "next/cache";
import useCurrentUser from "./CurrentUser";
export async function createCategory({name, slug, type, description}) {
    const user = await useCurrentUser()
    const validated =  CategorySchema.safeParse({ name })
    if (validated.success) {
        const existingCategory = await getCategoryByName(name, type)
        if (existingCategory) return sendMessage(false, 400, "التصميف موجود بالفعل")

        try {
            await prisma.category.create({
                data: {
                    name, slug, type, description,
                    userId: parseInt(user.id)
                }
            })
            revalidatePath("/dash/articles/categories")
            return sendMessage(true, 200, "تم إنشاء البيانات بنجاح.")

        } catch (e) {
            return sendMessage(false, 400, "حدث خطأ ما")
        }
    } else {
        return sendMessage(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}

export async function updateCategory({id, name, slug, type, description}) {
    const user = await useCurrentUser()
    const validated =  CategorySchema.safeParse({ name })
    if (validated.success) {
        const existingCategory = await getCategoryByName(name, type)
        if (existingCategory && existingCategory.id !== id) return sendMessage(false, 400, "التصميف موجود بالفعل")

        try {
            await prisma.category.update({
                where: {
                  id: parseInt(id)
                },
                data: {
                    name, slug, description
                }
            })
            revalidatePath("/dash/articles/categories")
            return sendMessage(true, 200, "تم تحديث التصنيف بنجاح.")

        } catch (e) {
            return sendMessage(false, 400, "حدث خطأ ما")
        }
    } else {
        return sendMessage(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}
export const getCategoryByName = async (name, type) => {
    const user = await useCurrentUser()
    const category = await prisma.category.findFirst({ where: { name, type, userId: parseInt(user.id) } })

    return category
}

export const getCategories = async (type) => {
    const categories = await prisma.category.findMany({
        where: {
            type: type
        },
        include: {
            articles: true,
            books: true,
            grantsByCollege: true,
            grantsByPhase: true,
            grantsBySpecialization: true,
        }
    })

    if(categories.length > 0){
        return sendMessage(true, 200, "تم جلب البيانات بنجاح", categories)
    }
    return sendMessage(false, 400, "لا توجد بيانات")


}

export const deleteCategory = async (id) => {
    await prisma.category.delete({
        where: {
            id: parseInt(id)
        }
    })
    revalidatePath("/dash/articles/categories")
    return sendMessage(true, 200, "تم حذف التصنيف بنجاح")
}