import db from "../helpers/db.js";
import sendResponseServer from "../helpers/SendResponse.server.js";
import Validate from "../helpers/Validate.js";

export default class Notification {
    static async getGlobalNotifications(){
        const notifications = await db.notification.findMany({
            where: {
                isPublished: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        if (notifications.length){
            return sendResponseServer(true, 200,"تم جلب الإشعارات بنجاح", notifications)
        }
        return sendResponseServer(false, 400,"لا توجد بيانات.")
    }
    static async getNotifications(){
        const notifications = await db.notification.findMany()
        if (notifications.length){
            return sendResponseServer(true, 200,"تم جلب الإشعارات بنجاح", notifications)
        }
        return sendResponseServer(false, 400,"لا توجد بيانات.")
    }
    static async createNotification({title, body}){
        const validated = Validate.createNotification.safeParse({title, body})
        if (validated.success){
            await db.notification.create({
                data: {title, body}
            })
            return sendResponseServer(true, 200,"تم إنشاء الإشعار بنجاح")
        }
        return sendResponseServer(false, 400,"بعض البيانات مطلوبة.", validated.error.format())
    }
    static async updateNotification({id, title, body}){
        const validated = Validate.createNotification.safeParse({title, body})
        if (validated.success){
            await db.notification.update({
                where: {id},
                data: {title, body}
            })
            return sendResponseServer(true, 200,"تم تحديث الإشعار بنجاح")
        }
        return sendResponseServer(false, 400,"بعض البيانات مطلوبة.", validated.error.format())
    }
    static async deleteNotification({id}){
            await db.notification.delete({
                where: {id}
            })
            return sendResponseServer(true, 200,"تم حذف الإشعار بنجاح")
    }
    static async updateStatusNotification({id, status}){
        await db.notification.update({
            where: {id},
            data: {isPublished: status}
        })
        return sendResponseServer(true, 200,"تم تحديث الإشعار بنجاح")
    }
}