import prisma from "../../helpers/db";
import { redirect } from "@remix-run/node";
import sendResponseServer from "../../helpers/SendResponse.server.js";
import {
    getCountDegreeByExceptions,
    getDegreeByExceptions, getSortedValues,
    PAGINATE_LIMIT,
    PASSING_DEGREE_IN_ELEMENTARY, SELECT_DATA_FOR_RESULT,
    SELECT_DATA_FOR_STUDENT
} from "../../helpers/Global.js";
import Validate from "../../helpers/Validate";
export async function getPublicResults(slug) {
    const results = await prisma.result.findMany({
        where: {
            type: {
                slug: parseInt(slug),
            },
            isPublished: true,
            NOT: {
                year: {
                    results: {
                        none: {}
                    },
                }
            },
        },
        select: {
            id: true,
            title: true,
            year: true
        },
        orderBy: [
            {
                year: {
                    name: 'desc'
                },
            },
            {
                session: {
                    slug: 'desc'
                },
            },
        ],
        take: 4,
    })

    if(results.length > 0){
        return sendResponseServer(true, 200, "تم جلب النتائج بنجاح", results)
    }
    return sendResponseServer(false, 400, "لا توجد نتائج.")
}
export async function getTopStudentsByResultId(id, url) {
    const result = await getResultById({resultId: id, url})

    let types = await prisma.bacType.findMany({
        where: {
            results: {
              some: {
                  resultId: result.id,
              }
            },
            NOT: {
                results: {
                    none: {}
                },
            },
        },
        select: {
            id: true,
            nameAr: true,
            nameFr: true,
            results: {
                select: SELECT_DATA_FOR_RESULT,
                orderBy: {
                    degree: 'desc',
                },
                take: 1,
            }
        },
    })

    types = types.sort((a, b) => {
        return b.results[0].degree - a.results[0].degree;
    })
    let results = []
    await Promise.all(types.map( async type => {
        const student = await prisma.resultStudent.findMany({
            where: {
                resultId: result.id,
                typeId: type.id
            },
            select: SELECT_DATA_FOR_RESULT,
            orderBy: {
                degree: 'desc',
            },
            take: 1,
        })
        results.push(student)
    }))
    results = results.sort((a, b) => {
        return b[0].degree - a[0].degree;
    })
    return sendResponseServer(true, 200, "تم جلب النتائج بنجاح", results)
}
export async function getStudentByNumberAndResultId({resultId, number, url}) {
    const result = await getResultById({resultId, url})

    const student = await prisma.student.findFirst({
        where: {
            number: parseInt(number),
            resultId: result.id,
        },
        select: SELECT_DATA_FOR_STUDENT
    })
    if(student){
        return sendResponseServer(true, 200, "تم جلب نتيجة الطالب بنجاح", student)
    }
    throw redirect(url)
}

export async function getResultStudentByNumber({year, type, category, session, number}) {
    switch (parseInt(category)) {
        case 5: {
            const student = await prisma.student.findFirst({
                where: {
                    year: {
                        name: year
                    },
                    type: {
                        nameAr: type
                    },
                    session: {
                        name: session
                    },
                    typeResult: {
                        slug: parseInt(category)
                    },
                    number: Number(number),
                },
                select: SELECT_DATA_FOR_STUDENT,
            })

            if(student){
                return sendResponseServer(true, 200,"تم جلب البيانات بنجاح.", student)
            }
            return sendResponseServer(false, 400,"لا توجد بيانات.")
        }
    }

}

export const getBacTypes =  async () => {
    const types = await prisma.bacType.findMany({
        orderBy: {
            nameAr: 'asc',
        },
    })
    if(types.length > 0){
        return sendResponseServer(true, 200,"تم جلب البيانات بنجاح.", types)
    }
    return sendResponseServer(false, 400,"لا توجد بيانات.")
}
export async function getResultStudent({resultId, target, value, page = 0, isTitle, searchBy, searchById, url}) {

    const validated = Validate.searchResult.safeParse({value})
    if(validated.success){
        if(isTitle){
            if(searchBy === "state"){
                const searchByTitle = await getStateById({stateId: searchById, url})
                switch (target) {
                    case "name":
                        const count = await prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                stateId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: Number(resultId),
                                stateId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                            select: SELECT_DATA_FOR_RESULT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if(parseInt(page) > 0){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                            } else {
                                if(results.length > 1){
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                                }else {
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                                }
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const result = await prisma.resultStudent.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    student: {
                                        number: Number(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT,
                            })
                            if(result && result.state.id === parseInt(searchById)){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.state.id !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لولاية ${searchByTitle.name}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            } else if(searchBy === "county"){
                const searchByTitle = await getCountyById({countyId: searchById, url})
                switch (target) {
                    case "name":
                        const count = await prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                countyId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: Number(resultId),
                                countyId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                            select: SELECT_DATA_FOR_RESULT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if(parseInt(page) > 0){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                            } else {
                                if(results.length > 1){
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                                }else {
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                                }
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const result = await prisma.resultStudent.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    student: {
                                        number: Number(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT
                            })
                            if(result && result.county.id === parseInt(searchById)){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.county.id !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لمثاطعة ${searchByTitle.name}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            } else if(searchBy === "school"){
                const searchByTitle = await getSchoolById({schoolId: searchById, url})
                switch (target) {
                    case "name":
                        const count = await prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                schoolId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: Number(resultId),
                                schoolId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                            select: SELECT_DATA_FOR_RESULT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if(parseInt(page) > 0){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                            } else {
                                if(results.length > 1){
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                                }else {
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                                }
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const result = await prisma.resultStudent.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    student: {
                                        number: Number(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT
                            })
                            if(result && result.school.id === parseInt(searchById)){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.school.id !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لمدرسة ${searchByTitle.name}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            } else if(searchBy === "center"){
                const searchByTitle = await getCenterById({centerId: searchById, url})
                switch (target) {
                    case "name":
                        const count = await prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                centerId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: Number(resultId),
                                centerId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                            select: SELECT_DATA_FOR_RESULT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if(parseInt(page) > 0){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                            } else {
                                if(results.length > 1){
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                                }else {
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                                }
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const result = await prisma.resultStudent.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    student: {
                                        number: Number(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT
                            })
                            if(result && result.center.id === parseInt(searchById)){
                                console.log(parseInt(searchById), result.center.id)
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.center.id !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لمركز ${searchByTitle.name}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            } else if(searchBy === "type"){
                const searchByTitle = await getTypeById({typeId: searchById, url})
                switch (target) {
                    case "name":
                        const count = await prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                typeId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: Number(resultId),
                                typeId: parseInt(searchById),
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                            select: SELECT_DATA_FOR_RESULT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if(parseInt(page) > 0){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                            } else {
                                if(results.length > 1){
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                                }else {
                                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                                }
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const result = await prisma.resultStudent.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    student: {
                                        number: Number(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT
                            })
                            if(result && result.type.id === parseInt(searchById)){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.type.id !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لشعبة ${searchByTitle.nameAr}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            }
        }else {
            switch (target) {
                case "name":
                    const count = await prisma.resultStudent.count({
                        where: {
                            resultId: parseInt(resultId),
                            student: {
                                name: {
                                    contains: value,
                                }
                            }
                        },
                    })
                    const results = await prisma.resultStudent.findMany({
                        where: {
                            resultId: Number(resultId),
                            student: {
                                name: {
                                    contains: value,
                                }
                            }
                        },
                        select: SELECT_DATA_FOR_RESULT,
                        orderBy: {
                            degree: 'desc',
                        },
                        take: PAGINATE_LIMIT,
                        skip: (parseInt(page) * PAGINATE_LIMIT),
                    })
                    if(page !== 0){
                        return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                    } else {
                        if(results.length > 0){
                            if(results.length > 1){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {results, count: Math.ceil(count / PAGINATE_LIMIT)})
                            }else {
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                            }
                        }
                    }
                    return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                case "number":
                    if(!isNaN(+value)){
                        const result = await prisma.resultStudent.findFirst({
                            where: {
                                resultId: Number(resultId),
                                student: {
                                    number: Number(value),
                                }
                            },
                            select: SELECT_DATA_FOR_RESULT,
                        })
                        if(result){
                            return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    }
                    return sendResponseServer(false, 400, "رقم الطالب غير صالح")
            }
        }
        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
    }
    return sendResponseServer(false, 400, "بعض البيانات مطلوبة.", validated.error.format())

}
export async function searchNameStudent({resultId, stateId = 0, value, countyId = 0, schoolId = 0, centerId = 0, page = 0}) {
    const validated = Validate.searchResult.safeParse({value})
    if(validated.success){
        if(stateId !== 0){
            const results = await prisma.resultStudent.findMany({
                where: {
                    resultId: Number(resultId),
                    stateId: parseInt(stateId),
                    countyId: parseInt(countyId),
                    schoolId: parseInt(schoolId),
                    centerId: parseInt(centerId),
                    student: {
                        name: {
                            contains: value,
                        }
                    }
                },
                select: SELECT_DATA_FOR_RESULT,
                orderBy: {
                    degree: 'desc',
                }
            })
            if(results.length > 0){
                if(results.length > 1){
                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results)
                }else {
                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                }
            }
        } else if(countyId !== 0){
            const results = await prisma.resultStudent.findMany({
                where: {
                    resultId: Number(resultId),
                    countyId: parseInt(countyId),
                    schoolId: parseInt(schoolId),
                    centerId: parseInt(centerId),
                    student: {
                        name: {
                            contains: value,
                        }
                    }
                },
                select: SELECT_DATA_FOR_RESULT,
                orderBy: {
                    degree: 'desc',
                }
            })
            if(results.length > 0){
                if(results.length > 1){
                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results)
                }else {
                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                }
            }
        } else if(schoolId !== 0){
            const results = await prisma.resultStudent.findMany({
                where: {
                    resultId: Number(resultId),
                    schoolId: parseInt(schoolId),
                    centerId: parseInt(centerId),
                    student: {
                        name: {
                            contains: value,
                        }
                    }
                },
                select: SELECT_DATA_FOR_RESULT,
                orderBy: {
                    degree: 'desc',
                }
            })
            if(results.length > 0){
                if(results.length > 1){
                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results)
                }else {
                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                }
            }
        } else if(centerId !== 0){
            const results = await prisma.resultStudent.findMany({
                where: {
                    resultId: Number(resultId),
                    centerId: parseInt(centerId),
                    student: {
                        name: {
                            contains: value,
                        }
                    }
                },
                select: SELECT_DATA_FOR_RESULT,
                orderBy: {
                    degree: 'desc',
                },
            })
            if(results.length > 0){
                if(results.length > 1){
                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results)
                }else {
                    return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", results[0])
                }
            }
        }
        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
    }
    return sendResponseServer(false, 400, "بعض البيانات مطلوبة.", validated.error.format())

}
export async function getResultById({resultId, url}) {
    if(isNaN(+resultId)) throw redirect(url)
    const result = await prisma.result.findUnique({
        where: {
            id: parseInt(resultId)
        },
        select: {
            id: true,
            isPublished: true,
            title: true,
            type: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
            year: {
                select: {
                    id: true,
                    name: true
                }
            },
            session: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
        }
    })
    if(!result || !result.isPublished) throw redirect(url)
    return result
}
export async function getTopStudentsByResultIdInElementaryAndInMiddle(resultId, url) {
    const result = await getResultById({resultId, url})
    const results = await prisma.resultStudent.findMany({
        where: {
            resultId: result.id,
        },
        select: SELECT_DATA_FOR_RESULT,
        orderBy: {
            rankingInCountry: 'asc',
        },
        take: 10,
    })
    if(results.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب بنجاح", results)
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب")
}

export async function getStudentsDegreeByCategoryName({by, name, resultId, degree}) {
    switch (by) {
        case "state": {
            return await prisma.resultStudent.count({
                where: {
                    state: {
                        name: name
                    },
                    resultId: parseInt(resultId),
                    degree: {
                        lt: PASSING_DEGREE_IN_ELEMENTARY,
                        gte: degree,
                    }
                },
            })
        }
        case "county": {
            return await prisma.resultStudent.count({
                where: {
                    county: {
                        name: name
                    },
                    resultId: parseInt(resultId),
                    degree: {
                        lt: PASSING_DEGREE_IN_ELEMENTARY,
                        gte: degree,
                    }
                },
            })
        }
        case "school": {
            return await prisma.resultStudent.count({
                where: {
                    school: {
                        name: name
                    },
                    resultId: parseInt(resultId),
                    degree: {
                        lt: PASSING_DEGREE_IN_ELEMENTARY,
                        gte: degree,
                    }
                },
            })
        }
        case "center": {
            return await prisma.resultStudent.count({
                where: {
                    center: {
                        name: name
                    },
                    resultId: parseInt(resultId),
                    degree: {
                        lt: PASSING_DEGREE_IN_ELEMENTARY,
                        gte: degree,
                    }
                },
            })
        }
    }
}
export async function getSchoolById({schoolId, url}) {
    if(isNaN(+schoolId)) throw redirect(url)
    const school = await prisma.school.findUnique({
        where: {
            id: parseInt(schoolId)
        }
    })
    if(!school) throw redirect(url)
    return school
}
export async function getCenterById({centerId, url}) {
    if(isNaN(+centerId)) throw redirect(url)
    const center = await prisma.center.findUnique({
        where: {
            id: parseInt(centerId)
        }
    })
    if(!center) throw redirect(url)
    return center
}
export async function getStateById({stateId, url}) {
    if(isNaN(+stateId)) throw redirect(url)
    const state = await prisma.state.findUnique({
        where: {
            id: parseInt(stateId)
        }
    })
    if(!state) throw redirect(url)
    return state
}

export async function getTypeById({typeId, url}) {
    if(isNaN(+typeId)) throw redirect(url)
    const type = await prisma.bacType.findUnique({
        where: {
            id: parseInt(typeId)
        }
    })
    if(!type) throw redirect(url)
    return type
}
export async function getCountyById({countyId, url}) {
    if(isNaN(+countyId)) throw redirect(url)
    const county = await prisma.county.findUnique({
        where: {
            id: parseInt(countyId)
        }
    })
    if(!county) throw redirect(url)
    return county
}
export async function getTopStudentsBySchoolId({schoolId, resultId, url}) {
    const result = await getResultById({resultId, url})
    const top = await prisma.resultStudent.findMany({
        where: {
            schoolId: parseInt(schoolId),
            resultId: result.id,
        },
        select: SELECT_DATA_FOR_RESULT,
        orderBy: {
            degree: 'desc',
        },
        take: 10
    })
    if(top.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب الأوائل بنجاح", top)
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب أوائل")
}
export async function getTopStudentsByCenterId({centerId, resultId, url}) {
    const result = await getResultById({resultId, url})
    const top = await prisma.resultStudent.findMany({
        where: {
            centerId: parseInt(centerId),
            resultId: result.id,
        },
        select: SELECT_DATA_FOR_RESULT,
        orderBy: {
            degree: 'desc',
        },
        take: 10
    })
    if(top.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب الأوائل بنجاح", top)
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب أوائل")
}
export async function getStudentsByCenterId({centerId, resultId, url}) {
    const result = await getResultById({resultId, url})
    const top = await prisma.student.findMany({
        where: {
            centerId: parseInt(centerId),
            resultId: result.id,
        },
        select: SELECT_DATA_FOR_STUDENT,
        orderBy: {
            degree: 'desc',
        },
        take: 10
    })
    if(top.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب الأوائل بنجاح", top)
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب أوائل")
}
export async function getTopStudentsByCountyId({countyId, resultId, url}) {
    const result = await getResultById({resultId, url})

    const top = await prisma.resultStudent.findMany({
        where: {
            countyId: parseInt(countyId),
            resultId: result.id,
        },
        select: SELECT_DATA_FOR_RESULT,
        orderBy: {
            degree: 'desc',
        },
        take: 10
    })

    return sendResponseServer(true, 200, "تم جلب الطلاب الأوائل بنجاح", top)
}
export async function getTopStudentsByStateId({stateId, resultId, url}) {
    const result = await getResultById({resultId, url})
    const top = await prisma.resultStudent.findMany({
        where: {
            stateId: parseInt(stateId),
            resultId: parseInt(result.id),
        },
        select: SELECT_DATA_FOR_RESULT,
        orderBy: {
            degree: 'desc',
        },
        take: 10
    })
    if(top.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب الأوائل بنجاح", top)
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب أوائل")
}

export async function getTopStudentsByTypeId({typeId, resultId, url}) {
    const result = await getResultById({resultId, url})
    const top = await prisma.resultStudent.findMany({
        where: {
            typeId: parseInt(typeId),
            resultId: parseInt(result.id),
        },
        select: SELECT_DATA_FOR_RESULT,
        orderBy: {
            degree: 'desc',
        },
        take: 10
    })
    if(top.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب الأوائل بنجاح", top)
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب أوائل")
}
export async function getCountStudents({nameData, valueId, valueTitle, resultId = null, byCategory = null}) {
    const {data: exceptions, status: statusExceptions} = await getPublicExceptions()
    const slug = await getPublicTypeSlugByResultId(resultId)
    if(byCategory !== null){
        switch (byCategory) {
            case "elementary": {
                const admisException = await getCountDegreeByExceptions({exceptions: {data: exceptions, status: statusExceptions}, resultId})
                const [admis, ajourne] = await prisma.$transaction([
                    prisma.resultStudent.count({
                        where: {
                            degree: {
                                gte: PASSING_DEGREE_IN_ELEMENTARY,
                            },
                            resultId: parseInt(resultId),
                        }

                    }),
                    prisma.resultStudent.count({
                        where: {
                            resultId: parseInt(resultId),
                            degree: {
                                lt: PASSING_DEGREE_IN_ELEMENTARY,
                            },
                        }

                    }),
                ])
                return {admis: (admis + admisException), ajourne: (ajourne - admisException)}
            }
            case "high": {
                const [admis, sessionnaire, ajourne] = await prisma.$transaction([
                    prisma.resultStudent.count({
                        where: {
                            decision: 'Admis',
                            resultId: parseInt(resultId),
                        }

                    }),
                    prisma.resultStudent.count({
                        where: {
                            decision: 'Sessionnaire',
                            resultId: parseInt(resultId),
                        }

                    }),
                    prisma.resultStudent.count({
                        where: {
                            resultId: parseInt(resultId),
                            decision: 'Ajourné',
                        }

                    }),
                ])
                return {admis, sessionnaire, ajourne}
            }
            case "middle": {
                const [admis, ajourne] = await prisma.$transaction([
                    prisma.resultStudent.count({
                        where: {
                            decision: 'Admis',
                            resultId: parseInt(resultId),
                        }

                    }),
                    prisma.resultStudent.count({
                        where: {
                            resultId: parseInt(resultId),
                            decision: 'Ajourné',
                        }

                    }),
                ])
                return {admis, ajourne}
            }
        }
    } else {
        switch (slug) {
            case 1: {
                if(nameData === "states"){
                    const admisException = await getDegreeByExceptions({exceptions: {data: exceptions, status: statusExceptions}, ref: valueTitle, resultId})
                    const [all, admis, ajourne] = await prisma.$transaction([
                        prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                stateId: parseInt(valueId),
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                degree: {
                                    gte: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                                resultId: parseInt(resultId),
                                stateId: parseInt(valueId),
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                stateId: parseInt(valueId),
                                degree: {
                                    lt: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                            }

                        }),
                    ])
                    return {all, admis: (admis + admisException), ajourne: (ajourne - admisException)}
                } else if(nameData === "counties"){
                    const admisException = await getDegreeByExceptions({exceptions: {data: exceptions, status: statusExceptions}, ref: valueTitle, resultId})
                    const [all, admis, ajourne] = await prisma.$transaction([
                        prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                countyId: parseInt(valueId),
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                degree: {
                                    gte: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                                resultId: parseInt(resultId),
                                countyId: parseInt(valueId),
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                countyId: parseInt(valueId),
                                degree: {
                                    lt: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                            }

                        }),
                    ])
                    return {all, admis: (admis + admisException), ajourne: (ajourne - admisException)}
                } else if(nameData === "schools"){
                    const admisException = await getDegreeByExceptions({exceptions: {data: exceptions, status: statusExceptions}, ref: valueTitle, resultId})
                    const [all, admis, ajourne] = await prisma.$transaction([
                        prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                schoolId: parseInt(valueId),
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                degree: {
                                    gte: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                                resultId: parseInt(resultId),
                                schoolId: parseInt(valueId),
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                schoolId: parseInt(valueId),
                                degree: {
                                    lt: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                            }

                        }),
                    ])
                    return {all, admis: (admis + admisException), ajourne: (ajourne - admisException)}
                } else if(nameData === "centers"){
                    const admisException = await getDegreeByExceptions({exceptions: {data: exceptions, status: statusExceptions}, ref: valueTitle, resultId})
                    const [all, admis, ajourne] = await prisma.$transaction([
                        prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                centerId: parseInt(valueId),
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                degree: {
                                    gte: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                                resultId: parseInt(resultId),
                                centerId: parseInt(valueId),
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                resultId: parseInt(resultId),
                                centerId: parseInt(valueId),
                                degree: {
                                    lt: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                            }

                        }),
                    ])
                    return {all, admis: (admis + admisException), ajourne: (ajourne - admisException)}
                }
            }
            default: {
                    if(nameData === "states"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: parseInt(resultId),
                                    stateId: parseInt(valueId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    stateId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    stateId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return { all, admis, ajourne}
                    } else if(nameData === "counties"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: parseInt(resultId),
                                    countyId: parseInt(valueId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    countyId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    countyId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return {all, admis, ajourne}
                    } else if(nameData === "schools"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: parseInt(resultId),
                                    schoolId: parseInt(valueId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    schoolId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    schoolId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return {all, admis, ajourne}
                    } else if(nameData === "centers"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: parseInt(resultId),
                                    centerId: parseInt(valueId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    centerId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    centerId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return {all, admis, ajourne}
                    } else if(nameData === "types"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: parseInt(resultId),
                                    typeId: parseInt(valueId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    typeId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    typeId: parseInt(valueId),
                                    resultId: parseInt(resultId),
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return {all, admis, ajourne}
                    }
            }

        }
    }

}

export async function getPublicTypeSlugByResultId(resultId) {
    const result = await prisma.result.findUnique({
        where: {
            id: parseInt(resultId)
        },
        include: {
            type: true
        }
    })
    return result.type.slug
}

export async function getStatesByResultId({resultId, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})
    let states = []

    const newStates = await prisma.state.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            },
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        orderBy: { results: { _count: sort} }
    })

    await Promise.all(newStates.map( async state => {
        states.push({
            ...state,
            counts: await getCountStudents({nameData: "states", valueId: state.id, valueTitle: state.name, resultId})
        })
    }))

    states = getSortedValues(sort, states)
    if(states.length > 0){
        return sendResponseServer(true, 200, "تم جلب الولايات بنجاح", states)
    }
    return sendResponseServer(false, 400, "لا توجد ولايات")
}
export async function getTypesByResultId({resultId, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})

    let types = []

    const newTypes = await prisma.bacType.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            },
            NOT: {
                results: {
                    none: {}
                },
            },
        },
        select: {
            id: true,
            nameFr: true,
            nameAr: true,
        },
    })

    await Promise.all(newTypes.map( async type => {
        types.push({
            ...type,
            counts: await getCountStudents({nameData: "types", valueId: type.id, valueTitle: type.nameFr, resultId})
        })
    }))

    types = getSortedValues(sort, types)
    if(types.length > 0){
        return sendResponseServer(true, 200, "تم جلب الشعب بنجاح", types)
    }
    return sendResponseServer(false, 400, "لا توجد شعب")
}
export async function getPublicAllStatesByResultId(resultId, url) {
    const result = await getResultById({resultId, url})
    const states = await prisma.state.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            },
            NOT: {
                results: {
                    none: {}
                },
            },
        },
        select: {
            id: true,
            name: true,
        },
    })
    if(states.length > 0){
        return sendResponseServer(true, 200, "تم جلب الولايات بنجاح", states)
    }
    return sendResponseServer(false, 400, "لا توجد ولايات")
}
export async function getSchoolsByResultId({resultId, page = 0, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})

    let schools = []

    const count = await prisma.school.count({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            }
        },
    })

    const newSchools = await prisma.school.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            }
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        take: PAGINATE_LIMIT,
        skip: (parseInt(page) * PAGINATE_LIMIT),
        orderBy: { results: { _count: sort} }
    })



    await Promise.all(newSchools.map( async school => {
        schools.push({
            ...school,
            counts: await getCountStudents({nameData: "schools", valueId: school.id, valueTitle: school.name, resultId})
        })
    }))
    schools = getSortedValues(sort, schools)

    return sendResponseServer(true, 200, "تم جلب المدارس بنجاح", {schools, count: Math.ceil(count / PAGINATE_LIMIT)})
}
export async function getCentersByResultId({resultId, page = 0, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})

    let centers = []

    const count = await prisma.center.count({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            }
        },
    })

    const newCenters = await prisma.center.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            }
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        take: PAGINATE_LIMIT,
        skip: (parseInt(page) * PAGINATE_LIMIT),
        orderBy: { results: { _count: sort} }
    })



    await Promise.all(newCenters.map( async center => {
        centers.push({
            ...center,
            counts: await getCountStudents({nameData: "centers", valueId: center.id, valueTitle: center.name, resultId})
        })
    }))
    centers = getSortedValues(sort, centers)

    return sendResponseServer(true, 200, "تم جلب المراكز بنجاح", {centers, count: Math.ceil(count / PAGINATE_LIMIT)})
}
export async function getPublicResultStudentBySchoolId({resultId, page = 0, schoolId}) {
    const count = await prisma.student.count({
        where: {
            resultId: parseInt(resultId),
            schoolId: parseInt(schoolId),
        },
    })
    const students = await prisma.student.findMany({
        where: {
            resultId: parseInt(resultId),
            schoolId: parseInt(schoolId),
        },
        select: SELECT_DATA_FOR_STUDENT,
        orderBy: {
            degree: 'desc',
        },
        take: PAGINATE_LIMIT,
        skip: (parseInt(page) * PAGINATE_LIMIT),
    })
    if(students.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب بنجاح", {students, count: Math.ceil(count / PAGINATE_LIMIT)})
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب")
}
export async function getPublicResultStudentByCenterId({resultId, page = 0, centerId}) {
    const count = await prisma.student.count({
        where: {
            resultId: parseInt(resultId),
            centerId: parseInt(centerId),
        },
    })
    const students = await prisma.student.findMany({
        where: {
            resultId: parseInt(resultId),
            centerId: parseInt(centerId),
        },
        select: SELECT_DATA_FOR_STUDENT,
        orderBy: {
            degree: 'desc',
        },
        take: PAGINATE_LIMIT,
        skip: (parseInt(page) * PAGINATE_LIMIT),
    })
    if(students.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب بنجاح", {students, count: Math.ceil(count / PAGINATE_LIMIT)})
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب")
}

export async function getPublicResultStudent({resultId, target, value, page = 0, isTitle, searchBy, searchById}) {

    const validated = Validate.searchResult.safeParse({value})
    if(validated.success){
        if(isTitle){
            if(searchBy === "state"){
                const searchByTitle = await getStateById(searchById)
                switch (target) {
                    case "name":
                        const count = await prisma.student.count({
                            where: {
                                resultId: parseInt(resultId),
                                stateId: parseInt(searchById),
                                name: {
                                    contains: value,
                                }
                            },
                        })
                        const students = await prisma.student.findMany({
                            where: {
                                resultId: Number(resultId),
                                stateId: parseInt(searchById),
                                name: {
                                    contains: value,
                                }
                            },
                            select: SELECT_DATA_FOR_STUDENT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(students.length > 0){
                            if(students.length > 1){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {students, count: Math.ceil(count / PAGINATE_LIMIT)})
                            }else {
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", students[0])
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const student = await prisma.student.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    number: Number(value),
                                },
                                select: SELECT_DATA_FOR_STUDENT,
                            })
                            if(student && student.stateId === parseInt(searchById)){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                            } else if(student && student.stateId !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لولاية ${searchByTitle.name}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            } else if(searchBy === "county"){
                const searchByTitle = await getCountyById(searchById)
                switch (target) {
                    case "name":
                        const count = await prisma.student.count({
                            where: {
                                resultId: parseInt(resultId),
                                countyId: parseInt(searchById),
                                name: {
                                    contains: value,
                                }
                            },
                        })
                        const students = await prisma.student.findMany({
                            where: {
                                resultId: Number(resultId),
                                countyId: parseInt(searchById),
                                name: {
                                    contains: value,
                                }
                            },
                            select: SELECT_DATA_FOR_STUDENT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(students.length > 0){
                            if(students.length > 1){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {students, count: Math.ceil(count / PAGINATE_LIMIT)})
                            }else {
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", students[0])
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const student = await prisma.student.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    number: Number(value),
                                },
                                select: SELECT_DATA_FOR_STUDENT
                            })
                            console.log(student.countyId)
                            if(student && student.countyId === parseInt(searchById)){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                            } else if(student && student.countyId !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لبلدية ${searchByTitle.name}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            } else if(searchBy === "school"){
                const searchByTitle = await getSchoolById(searchById)
                switch (target) {
                    case "name":
                        const count = await prisma.student.count({
                            where: {
                                resultId: parseInt(resultId),
                                schoolId: parseInt(searchById),
                                name: {
                                    contains: value,
                                }
                            },
                        })
                        const students = await prisma.student.findMany({
                            where: {
                                resultId: Number(resultId),
                                schoolId: parseInt(searchById),
                                name: {
                                    contains: value,
                                }
                            },
                            select: SELECT_DATA_FOR_STUDENT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(students.length > 0){
                            if(students.length > 1){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {students, count: Math.ceil(count / PAGINATE_LIMIT)})
                            }else {
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", students[0])
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const student = await prisma.student.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    number: Number(value),
                                },
                                select: SELECT_DATA_FOR_STUDENT
                            })
                            if(student && student.schoolId === parseInt(searchById)){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                            } else if(student && student.schoolId !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لمدرسة ${searchByTitle.name}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            } else if(searchBy === "center"){
                const searchByTitle = await getCenterById(searchById)
                switch (target) {
                    case "name":
                        const count = await prisma.student.count({
                            where: {
                                resultId: parseInt(resultId),
                                centerId: parseInt(searchById),
                                name: {
                                    contains: value,
                                }
                            },
                        })
                        const students = await prisma.student.findMany({
                            where: {
                                resultId: Number(resultId),
                                centerId: parseInt(searchById),
                                name: {
                                    contains: value,
                                }
                            },
                            select: SELECT_DATA_FOR_STUDENT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: (parseInt(page) * PAGINATE_LIMIT),
                        })
                        if(students.length > 0){
                            if(students.length > 1){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {students, count: Math.ceil(count / PAGINATE_LIMIT)})
                            }else {
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", students[0])
                            }
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    case "number":
                        if(!isNaN(+value)){
                            const student = await prisma.student.findFirst({
                                where: {
                                    resultId: Number(resultId),
                                    number: Number(value),
                                },
                                select: SELECT_DATA_FOR_STUDENT
                            })
                            if(student && student.centerId === parseInt(searchById)){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                            } else if(student && student.centerId !== parseInt(searchById)){
                                return sendResponseServer(false, 400, `رقم الطالب "${value}" لا ينتمي لمركز ${searchByTitle.name}، رجاء تأكد مرة أخرى.`)
                            }
                            return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                        }
                        return sendResponseServer(false, 400, "رقم الطالب غير صالح")
                }
            }
        }else {
            switch (target) {
                case "name":
                    const count = await prisma.student.count({
                        where: {
                            resultId: parseInt(resultId),
                            name: {
                                contains: value,
                            }
                        },
                    })
                    const students = await prisma.student.findMany({
                        where: {
                            resultId: Number(resultId),
                            name: {
                                contains: value,
                            }
                        },
                        select: SELECT_DATA_FOR_STUDENT,
                        orderBy: {
                            degree: 'desc',
                        },
                        take: PAGINATE_LIMIT,
                        skip: (parseInt(page) * PAGINATE_LIMIT),
                    })
                    if(students.length > 0){
                        if(students.length > 1){
                            return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", {students, count: Math.ceil(count / PAGINATE_LIMIT)})
                        }else {
                            return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", students[0])
                        }
                    }
                    return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                case "number":
                    if(!isNaN(+value)){
                        const student = await prisma.student.findFirst({
                            where: {
                                resultId: Number(resultId),
                                number: Number(value),
                            },
                            select: SELECT_DATA_FOR_STUDENT
                        })
                        if(student){
                            return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                        }
                        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
                    }
                    return sendResponseServer(false, 400, "رقم الطالب غير صالح")
            }
        }
        return sendResponseServer(false, 400, `لم نتمكن من العثور على ${value}، رجاء حاول مرة أخرى.`)
    }
    return sendResponseServer(false, 400, "بعض البيانات مطلوبة.", validated.error.format())

}

export async function searchCounties({value, resultId, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})
    let counties = []
    const newCounties = await prisma.county.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            },
            name: {
                contains: value,
            },
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        orderBy: { results: { _count: sort} }
    })

    await Promise.all(newCounties.map( async county => {
        counties.push({
            ...county,
            counts: await getCountStudents({nameData: "counties", valueId: county.id, valueTitle: county.name, resultId})
        })
    }))
    counties = getSortedValues(sort, counties)

    return sendResponseServer(true, 200, "تم جلب البلديات بنجاح", counties)
}
export async function searchStates({value, resultId, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})
    let states = []
    const newStates = await prisma.state.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            },
            name: {
                contains: value,
            },
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        orderBy: { results: { _count: sort} }
    })

    await Promise.all(newStates.map( async state => {
        states.push({
            ...state,
            counts: await getCountStudents({nameData: "states", valueId: state.id, valueTitle: state.name, resultId})
        })
    }))
    states = getSortedValues(sort, states)

    return sendResponseServer(true, 200, "تم جلب الولايات بنجاح", states)
}
export async function searchSchools({value, resultId, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})
    let schools = []
    const newSchools = await prisma.school.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            },
            name: {
                contains: value,
            },
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        orderBy: { results: { _count: sort} }
    })

    await Promise.all(newSchools.map( async school => {
        schools.push({
            ...school,
            counts: await getCountStudents({nameData: "schools", valueId: school.id, valueTitle: school.name, resultId})
        })
    }))
    schools = getSortedValues(sort, schools)

    return sendResponseServer(true, 200, "تم جلب المدارس بنجاح", schools)
}
export async function searchTypes({value, resultId, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})
    let types = []
    const newTypes = await prisma.bacType.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            },
            OR: [
                {
                    nameAr: {
                        contains: value,
                    },
                },
                {
                    nameFr: {
                        contains: value.toUpperCase(),
                    },
                }
            ]
        },
        select: {
            id: true,
            nameFr: true,
            nameAr: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        orderBy: { results: { _count: sort} }
    })

    await Promise.all(newTypes.map( async type => {
        types.push({
            ...type,
            counts: await getCountStudents({nameData: "types", valueId: type.id, valueTitle: type.nameFr, resultId})
        })
    }))
    types = getSortedValues(sort, types)

    return sendResponseServer(true, 200, "تم جلب الشعب بنجاح", types)
}
export async function searchCenters({value, resultId, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})
    let centers = []
    const newCenters = await prisma.center.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            },
            name: {
                contains: value,
            },
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        orderBy: { results: { _count: sort} }
    })

    await Promise.all(newCenters.map( async center => {
        centers.push({
            ...center,
            counts: await getCountStudents({nameData: "centers", valueId: center.id, valueTitle: center.name, resultId})
        })
    }))
    centers = getSortedValues(sort, centers)

    return sendResponseServer(true, 200, "تم جلب المراكز بنجاح", centers)
}
export async function getCountiesByResultId({resultId, page = 0, url, sort = "desc"}) {
    const result = await getResultById({resultId, url})

    let counties = []

    const count = await prisma.county.count({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            }
        },
    })

    const newCounties = await prisma.county.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id
                }
            }
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    results: true,
                }
            },
        },
        take: PAGINATE_LIMIT,
        skip: (parseInt(page) * PAGINATE_LIMIT),
        orderBy: { results: { _count: sort} }
    })



    await Promise.all(newCounties.map( async county => {
        counties.push({
            ...county,
            counts: await getCountStudents({nameData: "counties", valueId: county.id, valueTitle: county.name, resultId})
        })
    }))
    counties = getSortedValues(sort, counties)

    return sendResponseServer(true, 200, "تم جلب البلديات بنجاح", {counties, count: Math.ceil(count / PAGINATE_LIMIT)})
}
export async function getPublicAllCountiesByStateIdAndResultId({resultId, stateId, url}) {
    const result = await getResultById({resultId, url})
    const counties = await prisma.county.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id,
                    stateId: parseInt(stateId),
                }
            },
            NOT: {
                results: {
                    none: {}
                },
            },
        },
        select: {
            id: true,
            name: true,
        },
    })
    if(counties.length > 0){
        return sendResponseServer(true, 200, "تم جلب المقاطعات بنجاح", counties)
    }
    return sendResponseServer(false, 400, "لا توجد مقاطعات")
}
export async function getPublicAllSchoolsByCountyIdAndResultId({resultId, countyId, url}) {
    const result = await getResultById({resultId, url})
    const schools = await prisma.school.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id,
                    countyId: parseInt(countyId),
                }
            },
            NOT: {
                results: {
                    none: {}
                },
            },
        },
        select: {
            id: true,
            name: true,
        },
    })
    if(schools.length > 0){
        return sendResponseServer(true, 200, "تم جلب المدارس بنجاح", schools)
    }
    return sendResponseServer(false, 400, "لا توجد مدارس")
}
export async function getPublicAllCentersBySchoolIdAndResultId({resultId, schoolId, url}) {
    const result = await getResultById({resultId, url})
    const centers = await prisma.center.findMany({
        where: {
            results: {
                some: {
                    resultId: result.id,
                    schoolId: parseInt(schoolId),
                }
            },
            NOT: {
                results: {
                    none: {}
                },
            },
        },
        select: {
            id: true,
            name: true,
        },
    })
    if(centers.length > 0){
        return sendResponseServer(true, 200, "تم جلب المراكز بنجاح", centers)
    }
    return sendResponseServer(false, 400, "لا توجد مراكز")
}
export async function getDataForElementaryFilter({resultId, by, stateId = 0, countyId = 0, schoolId = 0, centerId = 0, page = 0}) {
    switch (by) {
        case "state": {
            const counties = await prisma.county.findMany({
                where: {
                    results: {
                        some: {
                            resultId: parseInt(resultId),
                            stateId: parseInt(stateId),
                        }
                    },
                    NOT: {
                        results: {
                            none: {}
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                }
            })
            const count = await prisma.resultStudent.count({
                where: {
                    resultId: parseInt(resultId),
                    stateId: parseInt(stateId),
                },
            })
            const results = await prisma.resultStudent.findMany({
                where: {
                    resultId: parseInt(resultId),
                    stateId: parseInt(stateId),
                },
                select: SELECT_DATA_FOR_RESULT,
                take: PAGINATE_LIMIT,
                skip: (parseInt(page) * PAGINATE_LIMIT),
                orderBy: {
                    degree: 'desc',
                },
            })
            if(counties.length > 0){
                return sendResponseServer(true, 200, "تم جلب المقاطعات بنجاح", {counties, type: "county", count, results})
            }
            return sendResponseServer(false, 400, "لا توجد مقاطعات")
        }
        case "county": {
            if(parseInt(stateId) !== 0){
                const schools = await prisma.school.findMany({
                    where: {
                        results: {
                            some: {
                                resultId: parseInt(resultId),
                                countyId: parseInt(countyId),
                                stateId: parseInt(stateId),
                            }
                        },
                        NOT: {
                            results: {
                                none: {}
                            },
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                    }
                })
                const count = await prisma.resultStudent.count({
                    where: {
                        resultId: parseInt(resultId),
                        countyId: parseInt(countyId),
                        stateId: parseInt(stateId),
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: parseInt(resultId),
                        countyId: parseInt(countyId),
                        stateId: parseInt(stateId),
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: (parseInt(page) * PAGINATE_LIMIT),
                    orderBy: {
                        degree: 'desc',
                    },
                })
                if(schools.length > 0){
                    return sendResponseServer(true, 200, "تم جلب المدارس بنجاح", {schools,  type: "school", results, count})
                }
            }else {
                const schools = await prisma.school.findMany({
                    where: {
                        results: {
                            some: {
                                resultId: parseInt(resultId),
                                countyId: parseInt(countyId),
                            }
                        },
                        NOT: {
                            results: {
                                none: {}
                            },
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                    }
                })
                const count = await prisma.resultStudent.count({
                    where: {
                        resultId: parseInt(resultId),
                        countyId: parseInt(countyId),
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: parseInt(resultId),
                        countyId: parseInt(countyId),
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: (parseInt(page) * PAGINATE_LIMIT),
                    orderBy: {
                        degree: 'desc',
                    },
                })
                if(schools.length > 0){
                    return sendResponseServer(true, 200, "تم جلب المدارس بنجاح", {schools,  type: "school", results, count})
                }
            }
            return sendResponseServer(false, 400, "لا توجد مدارس")
        }
        case "school": {
            if(parseInt(stateId) !== 0 && parseInt(countyId) !== 0){
                const centers = await prisma.center.findMany({
                    where: {
                        results: {
                            some: {
                                resultId: parseInt(resultId),
                                countyId: parseInt(countyId),
                                stateId: parseInt(stateId),
                                schoolId: parseInt(schoolId),
                            }
                        },
                        NOT: {
                            results: {
                                none: {}
                            },
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                    }
                })
                const count = await prisma.resultStudent.count({
                    where: {
                        resultId: parseInt(resultId),
                        countyId: parseInt(countyId),
                        stateId: parseInt(stateId),
                        schoolId: parseInt(schoolId),
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: parseInt(resultId),
                        countyId: parseInt(countyId),
                        stateId: parseInt(stateId),
                        schoolId: parseInt(schoolId),
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: (parseInt(page) * PAGINATE_LIMIT),
                    orderBy: {
                        degree: 'desc',
                    },
                })
                if(centers.length > 0){
                    return sendResponseServer(true, 200, "تم جلب المدارس بنجاح", {centers,  type: "center", results, count})
                }
            } else {
                const centers = await prisma.center.findMany({
                    where: {
                        results: {
                            some: {
                                resultId: parseInt(resultId),
                                countyId: parseInt(countyId),
                                schoolId: parseInt(schoolId),
                            }
                        },
                        NOT: {
                            results: {
                                none: {}
                            },
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                    }
                })
                const count = await prisma.resultStudent.count({
                    where: {
                        resultId: parseInt(resultId),
                        schoolId: parseInt(schoolId),
                        countyId: parseInt(countyId),
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: parseInt(resultId),
                        schoolId: parseInt(schoolId),
                        countyId: parseInt(countyId),
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: (parseInt(page) * PAGINATE_LIMIT),
                    orderBy: {
                        degree: 'desc',
                    },
                })
                if(centers.length > 0){
                    return sendResponseServer(true, 200, "تم جلب المدارس بنجاح", {centers,  type: "center", results, count})
                }
            }
            return sendResponseServer(false, 400, "لا توجد مدارس")
        }
        case "center": {
            if(parseInt(stateId) !== 0 && parseInt(countyId) !== 0 && parseInt(schoolId) !== 0){
                const count = await prisma.resultStudent.count({
                    where: {
                        resultId: parseInt(resultId),
                        countyId: parseInt(countyId),
                        stateId: parseInt(stateId),
                        schoolId: parseInt(schoolId),
                        centerId: parseInt(centerId),
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: parseInt(resultId),
                        countyId: parseInt(countyId),
                        stateId: parseInt(stateId),
                        schoolId: parseInt(schoolId),
                        centerId: parseInt(centerId),
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: (parseInt(page) * PAGINATE_LIMIT),
                    orderBy: {
                        degree: 'desc',
                    },
                })
                if(results.length > 0){
                    return sendResponseServer(true, 200, "تم جلب الطلاب بنجاح", {results, type: "finally", count: Math.ceil(count / PAGINATE_LIMIT)})
                }
            } else {
                const count = await prisma.resultStudent.count({
                    where: {
                        resultId: parseInt(resultId),
                        centerId: parseInt(centerId),
                        schoolId: parseInt(schoolId),
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: parseInt(resultId),
                        schoolId: parseInt(schoolId),
                        centerId: parseInt(centerId),
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: (parseInt(page) * PAGINATE_LIMIT),
                    orderBy: {
                        degree: 'desc',
                    },
                })
                if(results.length > 0){
                    return sendResponseServer(true, 200, "تم جلب الطلاب بنجاح", {results, type: "finally", count: Math.ceil(count / PAGINATE_LIMIT)})
                }
            }
            return sendResponseServer(false, 400, "لا توجد طلاب")
        }
        case "onlyCenter": {
            const count = await prisma.resultStudent.count({
                where: {
                    resultId: parseInt(resultId),
                    centerId: parseInt(centerId),
                },
            })
            const results = await prisma.resultStudent.findMany({
                where: {
                    resultId: parseInt(resultId),
                    centerId: parseInt(centerId),
                },
                select: SELECT_DATA_FOR_RESULT,
                take: PAGINATE_LIMIT,
                skip: (parseInt(page) * PAGINATE_LIMIT),
                orderBy: {
                    degree: 'desc',
                },
            })
            if(results.length > 0){
                return sendResponseServer(true, 200, "تم جلب الطلاب بنجاح", {results, type: "finally", count: Math.ceil(count / PAGINATE_LIMIT)})
            }
            return sendResponseServer(false, 400, "لا توجد طلاب")
        }
    }

}

export async function getPublicExceptions(){
    const exceptions = await prisma.exception.findMany({
        where: {
            applied: true
        },
        include: {
            year: true,
            type: true,
            result: true
        },
        orderBy: {
            year: {
                name: 'desc',
            }
        },
    })
    if(exceptions.length > 0){
        return sendResponseServer(true, 200,"تم جلب الاستناءات بنجاح", exceptions)
    }
    return sendResponseServer(false, 200,"لا توجد بيانات.")
}
export async function getPublicAllResults({slug, page = 0, byCategory}) {
    let newResults = []
    const results = await prisma.result.findMany({
        where: {
            type: {
                slug: parseInt(slug),
            },
            isPublished: true,
            isUploaded: true,
            NOT: {
                year: {
                    results: {
                        none: {}
                    },
                }
            },
        },
        select: {
            id: true,
            title: true,
            year: true,
            type: true,
            session: true,
            _count: {
                select: { results: true },
            },
        },
        orderBy: {
            year: {
                name: 'desc',
            }
        },
        take: PAGINATE_LIMIT,
        skip: (parseInt(page) * PAGINATE_LIMIT),
    })
    await Promise.all(results.map( async result => {
        newResults.push({
            ...result,
            counts: await getCountStudents({byCategory, resultId: result.id})
        })
    }))
    if(results.length > 0){
        return sendResponseServer(true, 200, "تم جلب النتائج بنجاح", newResults)
    }
    return sendResponseServer(false, 400, "لا توجد نتائج.")
}