import {z} from "zod";

export const RegisterSchema = z.object({
    name: z.string({
        required_error: "الاسم مطلوب.",
        invalid_type_error: "الاسم يجب أن يكون متكونا من أحرف.",
    }).min(2, { message: "الاسم يجب أن يكون أكبر من حرفين." }),
    email: z.string({
        required_error: "البريد مطلوب.",
        invalid_type_error: "بريد غير صالح.",
    }).email({ message: "بريد غير صالح." }),
    password: z.string({
        required_error: "كلمة المرور مطلوبة.",
        invalid_type_error: "كلمة مرور غير صالحة.",
    })
        .min(8, { message: "كلمة المرور يجب أن تكون أطول من 8 أحرف." })
        .max(16, { message: "كلمة المرور يجب أن تكون أقل من 16 أحرف." }),
});

export const LoginSchema = z.object({
    email: z.string({
        required_error: "البريد مطلوب.",
        invalid_type_error: "بريد غير صالح.",
    }).email({ message: "بريد غير صالح." }),
    password: z.string({
        required_error: "كلمة المرور مطلوبة.",
        invalid_type_error: "كلمة مرور غير صالحة.",
    })
        .min(8, { message: "كلمة المرور يجب أن تكون أطول من 8 أحرف." })
        .max(16, { message: "كلمة المرور يجب أن تكون أقل من 16 أحرف." }),
});

export const ResetSchema = z.object({
    email: z.string({
        required_error: "البريد مطلوب.",
        invalid_type_error: "بريد غير صالح.",
    }).email({ message: "بريد غير صالح." })
});

export const NewPasswordSchema = z.object({
    password: z.string({
        required_error: "كلمة المرور مطلوبة.",
        invalid_type_error: "كلمة مرور غير صالحة.",
    })
        .min(8, { message: "كلمة المرور يجب أن تكون أطول من 8 أحرف." })
        .max(16, { message: "كلمة المرور يجب أن تكون أقل من 16 أحرف." }),
});

export const ResultSettingsSchema = z.object({
    name: z.string({
        required_error: "الاسم مطلوب.",
        invalid_type_error: "الاسم غير صالح.",
    })
        .min(2, { message: "الاسم يجب أن يكون أكبر من حرفين" })
});

export const CategorySchema = z.object({
    name: z.string({
        required_error: "الاسم مطلوب.",
        invalid_type_error: "الاسم غير صالح.",
    })
        .min(2, { message: "الاسم يجب أن يكون أكبر من حرفين" })
});

export const AuthorSchema = z.object({
    name: z.string({
        required_error: "الاسم مطلوب.",
        invalid_type_error: "الاسم غير صالح.",
    })
        .min(2, { message: "الاسم يجب أن يكون أكبر من حرفين" })
});

export const PublisherSchema = z.object({
    name: z.string({
        required_error: "الاسم مطلوب.",
        invalid_type_error: "الاسم غير صالح.",
    })
        .min(2, { message: "الاسم يجب أن يكون أكبر من حرفين" })
});

export const TagSchema = z.object({
    name: z.string({
        required_error: "الاسم مطلوب.",
        invalid_type_error: "الاسم غير صالح.",
    })
        .min(2, { message: "الاسم يجب أن يكون أكبر من حرفين" })
});

export const AddArticleSchema = z.object({
    title: z.string({
        required_error: "العنوان مطلوب.",
        invalid_type_error: "العنوان غير صالح.",
    })
        .min(2, { message: "العنوان يجب أن يكون أطول من حرفين" }),
    body: z.string({
        required_error: "المحتوى مطلوب.",
        invalid_type_error: "المحتوى غير صالح.",
    }).min(10, { message: "محتوى المقالة لا يصلح أن يكون مقالا." }),
    category: z.string({
        required_error: "التصنيف مطلوب.",
        invalid_type_error: "التصنيف غير صالح.",
    }),
    status: z.enum(["PUBLIC", "HIDDEN"], {
        required_error: "حالة المقالة مطلوبة.",
        invalid_type_error: "حالة المقالة غير صالحة.",
    }),
    summary: z.string({
        required_error: "المقتطف مطلوب.",
        invalid_type_error: "المقتطف غير صالح.",
    }),
    comment: z.boolean({
        required_error: "حالة التعليقات مطلوبة.",
        invalid_type_error: "حالة التعليقات غير صالحة.",
    }),
});

export const AddBookSchema = z.object({
    title: z.string({
        required_error: "العنوان مطلوب.",
        invalid_type_error: "العنوان غير صالح.",
    })
        .min(2, { message: "العنوان يجب أن يكون أطول من حرفين" }),
    description: z.string({
        required_error: "وصف الكتاب مطلوب.",
        invalid_type_error: "وصف الكتاب غير صالح.",
    }).min(10, { message: "محتوى وصف الكتاب لا يصلح أن يكون وصفا." }),
    category: z.string({
        required_error: "التصنيف مطلوب.",
        invalid_type_error: "التصنيف غير صالح.",
    }),
    image: z.object({}, {
        required_error: "الصورة مطلوبة.",
        invalid_type_error: "الصورة غير صالح.",
    }).or(z.string({
        required_error: "صورة الكتاب مطلوبة.",
        invalid_type_error: "صورة الكتاب غير صالحة.",
    })),
    publisher: z.string({
        required_error: "الناشر مطلوب.",
        invalid_type_error: "الناشر غير صالح.",
    }),
    numberOfPages: z.number( {
        required_error: "عدد الصفحات مطلوب.",
        invalid_type_error: "يجب أن يكون عدد الصفحات رقما.",
    }),
    publishYear: z.date( {
        required_error: "تاريخ النشر مطلوب.",
        invalid_type_error: "يجب أن يكون تاريخ النشر تاريخا.",
    }),
});
export const AddGrantSchema = z.object({
    title: z.string({
        required_error: "العنوان مطلوب.",
        invalid_type_error: "العنوان غير صالح.",
    }).min(2, { message: "العنوان يجب أن يكون أطول من حرفين" }),
    description: z.string({
        required_error: "وصف الكتاب مطلوب.",
        invalid_type_error: "وصف الكتاب غير صالح.",
    }).min(10, { message: "محتوى وصف الكتاب لا يصلح أن يكون وصفا." }),
    college: z.number({
        required_error: "الكلية مطلوبة.",
        invalid_type_error: "الكلية غير صالحة.",
    }),
    phase: z.number({
        required_error: "المرحلة مطلوبة.",
        invalid_type_error: "المرحلة غير صالحة.",
    }),
    country: z.string({
        required_error: "الدولة مطلوبة.",
        invalid_type_error: "الدولة غير صالحة.",
    }),
    specialization: z.number( {
        required_error: "التخصص مطلوب.",
        invalid_type_error: "التخصص غير صالح.",
    }),
    isFree: z.boolean( {
        required_error: "حالة المنحة مطلوبة.",
        invalid_type_error: "حالة المنحة غير صالحة.",
    }),
});