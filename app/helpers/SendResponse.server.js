
const sendResponseServer = (status, code, message, data) => {
    return {
        data: data,
        status: status ? "success" : "error",
        code: code || 400,
        message: message || "لا توجد بيانات."
    }
}

export const globalResponse = (data = {}) => {
    return {
        ...data,
        TITLE_HIGH: process.env.TITLE_HIGH,
        SITE_TITLE: process.env.SITE_TITLE,
        SITE_DESCRIPTION: process.env.SITE_DESCRIPTION,
    }
}

export default sendResponseServer