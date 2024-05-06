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
                    number: parseInt(number),
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
                                resultId: resultId,
                                stateId: searchById,
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: resultId,
                                stateId: searchById,
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
                            skip: ((page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if((page) > 0){
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
                                    resultId: resultId,
                                    student: {
                                        number: parseInt(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT,
                            })
                            if(result && result.state.id === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.state.id !== searchById){
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
                                resultId: resultId,
                                countyId: searchById,
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: resultId,
                                countyId: searchById,
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
                            skip: ((page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if((page) > 0){
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
                                    resultId: resultId,
                                    student: {
                                        number: parseInt(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT
                            })
                            if(result && result.county.id === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.county.id !== searchById){
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
                                resultId: resultId,
                                schoolId: searchById,
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: resultId,
                                schoolId: searchById,
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
                            skip: ((page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if((page) > 0){
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
                                    resultId: resultId,
                                    student: {
                                        number: parseInt(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT
                            })
                            if(result && result.school.id === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.school.id !== searchById){
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
                                resultId: resultId,
                                centerId: searchById,
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: resultId,
                                centerId: searchById,
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
                            skip: ((page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if((page) > 0){
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
                                    resultId: resultId,
                                    student: {
                                        number: parseInt(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT
                            })
                            if(result && result.center.id === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.center.id !== searchById){
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
                                resultId: resultId,
                                typeId: searchById,
                                student: {
                                    name: {
                                        contains: value,
                                    }
                                }
                            },
                        })
                        const results = await prisma.resultStudent.findMany({
                            where: {
                                resultId: resultId,
                                typeId: searchById,
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
                            skip: ((page) * PAGINATE_LIMIT),
                        })
                        if(results.length > 0){
                            if((page) > 0){
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
                                    resultId: resultId,
                                    student: {
                                        number: parseInt(value),
                                    }
                                },
                                select: SELECT_DATA_FOR_RESULT
                            })
                            if(result && result.type.id === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", result)
                            } else if(result && result.type.id !== searchById){
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
                            resultId: resultId,
                            student: {
                                name: {
                                    contains: value,
                                }
                            }
                        },
                    })
                    const results = await prisma.resultStudent.findMany({
                        where: {
                            resultId: resultId,
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
                        skip: ((page) * PAGINATE_LIMIT),
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
                                resultId: resultId,
                                student: {
                                    number: parseInt(value),
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
                    resultId: resultId,
                    stateId: stateId,
                    countyId: countyId,
                    schoolId: schoolId,
                    centerId: centerId,
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
                    resultId: resultId,
                    countyId: countyId,
                    schoolId: schoolId,
                    centerId: centerId,
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
                    resultId: resultId,
                    schoolId: schoolId,
                    centerId: centerId,
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
                    resultId: resultId,
                    centerId: centerId,
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
    const result = await prisma.result.findUnique({
        where: {
            id: resultId
        },
        select: {
            id: true,
            isPublished: true,
            title: true,
            slug: true,
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
                    resultId: resultId,
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
                    resultId: resultId,
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
                    resultId: resultId,
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
                    resultId: resultId,
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
    const school = await prisma.school.findUnique({
        where: {
            id: schoolId
        }
    })
    if(!school) throw redirect(url)
    return school
}
export async function getCenterById({centerId, url}) {
    const center = await prisma.center.findUnique({
        where: {
            id: centerId
        }
    })
    if(!center) throw redirect(url)
    return center
}
export async function getStateById({stateId, url}) {
    const state = await prisma.state.findUnique({
        where: {
            id: stateId
        }
    })
    if(!state) throw redirect(url)
    return state
}

export async function getTypeById({typeId, url}) {
    const type = await prisma.bacType.findUnique({
        where: {
            id: typeId
        }
    })
    if(!type) throw redirect(url)
    return type
}
export async function getCountyById({countyId, url}) {
    const county = await prisma.county.findUnique({
        where: {
            id: countyId
        }
    })
    if(!county) throw redirect(url)
    return county
}
export async function getTopStudentsBySchoolId({schoolId, resultId, url}) {
    const result = await getResultById({resultId, url})
    const top = await prisma.resultStudent.findMany({
        where: {
            schoolId: schoolId,
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
            centerId: centerId,
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
            centerId: centerId,
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
            countyId: countyId,
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
            stateId: stateId,
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

export async function getTopStudentsByTypeId({typeId, resultId, url}) {
    const result = await getResultById({resultId, url})
    const top = await prisma.resultStudent.findMany({
        where: {
            typeId: typeId,
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
                            resultId: resultId,
                        }

                    }),
                    prisma.resultStudent.count({
                        where: {
                            resultId: resultId,
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
                            resultId: resultId,
                        }

                    }),
                    prisma.resultStudent.count({
                        where: {
                            decision: 'Sessionnaire',
                            resultId: resultId,
                        }

                    }),
                    prisma.resultStudent.count({
                        where: {
                            resultId: resultId,
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
                            resultId: resultId,
                        }

                    }),
                    prisma.resultStudent.count({
                        where: {
                            resultId: resultId,
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
                                resultId: resultId,
                                stateId: valueId,
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                degree: {
                                    gte: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                                resultId: resultId,
                                stateId: valueId,
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                resultId: resultId,
                                stateId: valueId,
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
                                resultId: resultId,
                                countyId: valueId,
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                degree: {
                                    gte: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                                resultId: resultId,
                                countyId: valueId,
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                resultId: resultId,
                                countyId: valueId,
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
                                resultId: resultId,
                                schoolId: valueId,
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                degree: {
                                    gte: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                                resultId: resultId,
                                schoolId: valueId,
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                resultId: resultId,
                                schoolId: valueId,
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
                                resultId: resultId,
                                centerId: valueId,
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                degree: {
                                    gte: PASSING_DEGREE_IN_ELEMENTARY,
                                },
                                resultId: resultId,
                                centerId: valueId,
                            }

                        }),
                        prisma.resultStudent.count({
                            where: {
                                resultId: resultId,
                                centerId: valueId,
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
                                    resultId: resultId,
                                    stateId: valueId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    stateId: valueId,
                                    resultId: resultId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    stateId: valueId,
                                    resultId: resultId,
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return { all, admis, ajourne}
                    } else if(nameData === "counties"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: resultId,
                                    countyId: valueId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    countyId: valueId,
                                    resultId: resultId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    countyId: valueId,
                                    resultId: resultId,
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return {all, admis, ajourne}
                    } else if(nameData === "schools"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: resultId,
                                    schoolId: valueId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    schoolId: valueId,
                                    resultId: resultId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    schoolId: valueId,
                                    resultId: resultId,
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return {all, admis, ajourne}
                    } else if(nameData === "centers"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: resultId,
                                    centerId: valueId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    centerId: valueId,
                                    resultId: resultId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    centerId: valueId,
                                    resultId: resultId,
                                    decision: 'Ajourné',
                                }

                            }),
                        ])
                        return {all, admis, ajourne}
                    } else if(nameData === "types"){
                        const [all, admis, ajourne] = await prisma.$transaction([
                            prisma.resultStudent.count({
                                where: {
                                    resultId: resultId,
                                    typeId: valueId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    decision: 'Admis',
                                    typeId: valueId,
                                    resultId: resultId,
                                }

                            }),
                            prisma.resultStudent.count({
                                where: {
                                    typeId: valueId,
                                    resultId: resultId,
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
            id: resultId
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
        skip: ((page) * PAGINATE_LIMIT),
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
        skip: ((page) * PAGINATE_LIMIT),
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
            resultId: resultId,
            schoolId: schoolId,
        },
    })
    const students = await prisma.student.findMany({
        where: {
            resultId: resultId,
            schoolId: schoolId,
        },
        select: SELECT_DATA_FOR_STUDENT,
        orderBy: {
            degree: 'desc',
        },
        take: PAGINATE_LIMIT,
        skip: ((page) * PAGINATE_LIMIT),
    })
    if(students.length > 0){
        return sendResponseServer(true, 200, "تم جلب الطلاب بنجاح", {students, count: Math.ceil(count / PAGINATE_LIMIT)})
    }
    return sendResponseServer(false, 400, "لا يوجد طلاب")
}
export async function getPublicResultStudentByCenterId({resultId, page = 0, centerId}) {
    const count = await prisma.student.count({
        where: {
            resultId: resultId,
            centerId: centerId,
        },
    })
    const students = await prisma.student.findMany({
        where: {
            resultId: resultId,
            centerId: centerId,
        },
        select: SELECT_DATA_FOR_STUDENT,
        orderBy: {
            degree: 'desc',
        },
        take: PAGINATE_LIMIT,
        skip: ((page) * PAGINATE_LIMIT),
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
                                resultId: resultId,
                                stateId: searchById,
                                name: {
                                    contains: value,
                                }
                            },
                        })
                        const students = await prisma.student.findMany({
                            where: {
                                resultId: resultId,
                                stateId: searchById,
                                name: {
                                    contains: value,
                                }
                            },
                            select: SELECT_DATA_FOR_STUDENT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: ((page) * PAGINATE_LIMIT),
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
                                    resultId: resultId,
                                    number: parseInt(value),
                                },
                                select: SELECT_DATA_FOR_STUDENT,
                            })
                            if(student && student.stateId === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                            } else if(student && student.stateId !== searchById){
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
                                resultId: resultId,
                                countyId: searchById,
                                name: {
                                    contains: value,
                                }
                            },
                        })
                        const students = await prisma.student.findMany({
                            where: {
                                resultId: resultId,
                                countyId: searchById,
                                name: {
                                    contains: value,
                                }
                            },
                            select: SELECT_DATA_FOR_STUDENT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: ((page) * PAGINATE_LIMIT),
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
                                    resultId: resultId,
                                    number: parseInt(value),
                                },
                                select: SELECT_DATA_FOR_STUDENT
                            })
                            if(student && student.countyId === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                            } else if(student && student.countyId !== searchById){
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
                                resultId: resultId,
                                schoolId: searchById,
                                name: {
                                    contains: value,
                                }
                            },
                        })
                        const students = await prisma.student.findMany({
                            where: {
                                resultId: resultId,
                                schoolId: searchById,
                                name: {
                                    contains: value,
                                }
                            },
                            select: SELECT_DATA_FOR_STUDENT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: ((page) * PAGINATE_LIMIT),
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
                                    resultId: resultId,
                                    number: parseInt(value),
                                },
                                select: SELECT_DATA_FOR_STUDENT
                            })
                            if(student && student.schoolId === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                            } else if(student && student.schoolId !== searchById){
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
                                resultId: resultId,
                                centerId: searchById,
                                name: {
                                    contains: value,
                                }
                            },
                        })
                        const students = await prisma.student.findMany({
                            where: {
                                resultId: resultId,
                                centerId: searchById,
                                name: {
                                    contains: value,
                                }
                            },
                            select: SELECT_DATA_FOR_STUDENT,
                            orderBy: {
                                degree: 'desc',
                            },
                            take: PAGINATE_LIMIT,
                            skip: ((page) * PAGINATE_LIMIT),
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
                                    resultId: resultId,
                                    number: parseInt(value),
                                },
                                select: SELECT_DATA_FOR_STUDENT
                            })
                            if(student && student.centerId === searchById){
                                return sendResponseServer(true, 200, "تم جلب النتيجة بنجاح", student)
                            } else if(student && student.centerId !== searchById){
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
                            resultId: resultId,
                            name: {
                                contains: value,
                            }
                        },
                    })
                    const students = await prisma.student.findMany({
                        where: {
                            resultId: resultId,
                            name: {
                                contains: value,
                            }
                        },
                        select: SELECT_DATA_FOR_STUDENT,
                        orderBy: {
                            degree: 'desc',
                        },
                        take: PAGINATE_LIMIT,
                        skip: ((page) * PAGINATE_LIMIT),
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
                                resultId: resultId,
                                number: parseInt(value),
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
        skip: ((page) * PAGINATE_LIMIT),
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
                    stateId: stateId,
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
                    countyId: countyId,
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
                    schoolId: schoolId,
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
                            resultId: resultId,
                            stateId: stateId,
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
                    resultId: resultId,
                    stateId: stateId,
                },
            })
            const results = await prisma.resultStudent.findMany({
                where: {
                    resultId: resultId,
                    stateId: stateId,
                },
                select: SELECT_DATA_FOR_RESULT,
                take: PAGINATE_LIMIT,
                skip: ((page) * PAGINATE_LIMIT),
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
            if(stateId !== 0){
                const schools = await prisma.school.findMany({
                    where: {
                        results: {
                            some: {
                                resultId: resultId,
                                countyId: countyId,
                                stateId: stateId,
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
                        resultId: resultId,
                        countyId: countyId,
                        stateId: stateId,
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: resultId,
                        countyId: countyId,
                        stateId: stateId,
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: ((page) * PAGINATE_LIMIT),
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
                                resultId: resultId,
                                countyId: countyId,
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
                        resultId: resultId,
                        countyId: countyId,
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: resultId,
                        countyId: countyId,
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: ((page) * PAGINATE_LIMIT),
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
            if(stateId !== 0 && countyId !== 0){
                const centers = await prisma.center.findMany({
                    where: {
                        results: {
                            some: {
                                resultId: resultId,
                                countyId: countyId,
                                stateId: stateId,
                                schoolId: schoolId,
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
                        resultId: resultId,
                        countyId: countyId,
                        stateId: stateId,
                        schoolId: schoolId,
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: resultId,
                        countyId: countyId,
                        stateId: stateId,
                        schoolId: schoolId,
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: ((page) * PAGINATE_LIMIT),
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
                                resultId: resultId,
                                countyId: countyId,
                                schoolId: schoolId,
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
                        resultId: resultId,
                        schoolId: schoolId,
                        countyId: countyId,
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: resultId,
                        schoolId: schoolId,
                        countyId: countyId,
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: ((page) * PAGINATE_LIMIT),
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
            if((stateId) !== 0 && (countyId) !== 0 && (schoolId) !== 0){
                const count = await prisma.resultStudent.count({
                    where: {
                        resultId: resultId,
                        countyId: countyId,
                        stateId: stateId,
                        schoolId: schoolId,
                        centerId: centerId,
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: resultId,
                        countyId: countyId,
                        stateId: stateId,
                        schoolId: schoolId,
                        centerId: centerId,
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: ((page) * PAGINATE_LIMIT),
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
                        resultId: resultId,
                        centerId: centerId,
                        schoolId: schoolId,
                    },
                })
                const results = await prisma.resultStudent.findMany({
                    where: {
                        resultId: resultId,
                        schoolId: schoolId,
                        centerId: centerId,
                    },
                    select: SELECT_DATA_FOR_RESULT,
                    take: PAGINATE_LIMIT,
                    skip: ((page) * PAGINATE_LIMIT),
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
                    resultId: resultId,
                    centerId: centerId,
                },
            })
            const results = await prisma.resultStudent.findMany({
                where: {
                    resultId: resultId,
                    centerId: centerId,
                },
                select: SELECT_DATA_FOR_RESULT,
                take: PAGINATE_LIMIT,
                skip: ((page) * PAGINATE_LIMIT),
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
            slug: true,
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
        skip: ((page) * PAGINATE_LIMIT),
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