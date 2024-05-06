import prisma from "../helpers/db";
import upload, {deleteFile, isFileExist} from "../helpers/Upload";
import sendResponseServer from "../helpers/SendResponse.server.js";
import Validate from "../helpers/Validate";
import excelToJson from 'convert-excel-to-json'
import GetUnique from "./helpres/getUnique";
import {
    generateRef, generateResultSlug,
    generateResultTitle,
    getName,
    getNameStudentOnServer,
    getType,
    SELECT_DATA_FOR_RESULT
} from "../helpers/Global.js";

export async function getResults(){
    const results = await prisma.result.findMany({
        select: {
            id: true,
            title: true,
            isPublished: true,
            isUploaded: true,
            file: true,
            yearId: true,
            typeId: true,
            sessionId: true,
            updatedAt: true,
            _count: {
                select: { results: true },
            },
            year: true,
            type: true,
            session: true
        },
        orderBy: {
            year: {
                name: 'desc',
            }
        },
    })
    if(results.length > 0){
        return sendResponseServer(true, 200,"تم جلب النتائج بنجاح", results)
    }
    return sendResponseServer(false, 400,"لا توجد بيانات.")
}
export async function getExceptions(){
    const exceptions = await prisma.exception.findMany({
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
export async function uploadResults(id){
    const result = await prisma.result.findUnique({
        where: { id },
        include: {
            type: true
        },
    })
    if(result){
        const data = excelToJson({
            sourceFile: `public/uploads/results/${result.file}`,
            columnToKey: {
                '*': '{{columnHeader}}'
            }
        });
        const results = new GetUnique({
            results: data.results,
            states: data.states,
            counties: data.counties,
            schools: data.schools,
            centers: data.centers,
            types: data.types,
            yearId: result.yearId,
            typeId: result.typeId,
            sessionId: result.sessionId,
            slug: result.type.slug,
            resultId: result.id
        })
        await results.processor()

        if(results.allIsReady){
            await prisma.result.update({
                where: { id },
                data: {
                    updatedAt: new Date()
                }
            })
            return sendResponseServer(true, 200,"تم رفع النتائج بنجاح")
        } else {
            return sendResponseServer(false, 400,"حدث خطأ ما أثناء رفع النتائج.")
        }
    }
    return sendResponseServer(false, 400,"ملف النتائج غير موجود")
}

export async function getResultByTitle(title, yearId){
    return await prisma.result.findFirst({ where: { title, yearId } })
}

export async function getExceptionByName(name, yearId){
    return await prisma.exception.findFirst({ where: { name, yearId } })
}
export async function getExceptionById(id){
    return await prisma.exception.findFirst({ where: { id } })
}
export async function deleteResult(id, file){

    if(await isFileExist('results', file)){
        await deleteFile('results', file)
    }
    await prisma.result.delete({
        where: {
            id
        }
    })
    return sendResponseServer(true, 200,"تم حذف النتائج بنجاح")
}
export async function deleteException(id){

    await prisma.exception.delete({
        where: {
            id
        }
    })
    return sendResponseServer(true, 200,"تم حذف الاستنثاء بنجاح")
}

export async function getResultById(id){
    const result = await prisma.result.findUnique({
        where: { id },
        include: {
            year: true,
            type: true,
            session: true
        }
    })
    return sendResponseServer(true, 200,"تم جلب النتيجة بنجاح", result)
}

export async function createStates(states){
    try {
        await Promise.all(states.map(async (state, index) => {
            if(index > 0){
                const stateExisting = await prisma.state.findFirst({ where: {name: getName(state?.state)}})
                if(!stateExisting){
                    await prisma.state.create({
                        data: {
                            name: getName(state?.state),
                        },
                    })
                }
            }
        }))
        return true
    } catch (e) {
        console.log("error at states, and it is:", e)
        return false
    }
}


export async function createTypes(types){
    try {
        await Promise.all(types.map(async (type, index) => {
            if(index !== 0){
                const existingType = await prisma.bacType.findFirst({
                    where: {
                        nameFr: getType(type.type).nameFr,
                    }})
                if(!existingType) {
                    await prisma.bacType.create({
                        data: {
                            nameFr: getType(type.type).nameFr,
                            nameAr: getType(type.type).nameAr,
                        },
                    })
                }
            }
        }))
        return true
    } catch (e) {
        console.log("error at types, and it is:", e)
        return false
    }
}

export async function createSchools(schools){
    try {
        await Promise.all(schools.map(async (school, index) => {
            if(index > 0){
                const schoolExisting = await prisma.school.findFirst({ where: {name: getName(school?.school)}})
                if(!schoolExisting){
                    await prisma.school.create({
                        data: {
                            name: getName(school?.school),
                        },
                    })
                }
            }
        }))
        return true
    } catch (e) {
        console.log("error at schools, and it is:", e)
        return false
    }
}

export async function createCenters(centers){
    try {
        await Promise.all(centers.map(async (center, index) => {
            if(index > 0){
                const centerExisting = await prisma.center.findFirst({ where: {name: getName(center?.center)}})
                if(!centerExisting){
                    await prisma.center.create({
                        data: {
                            name: getName(center?.center),
                        },
                    })
                }
            }
        }))
        return true
    } catch (e) {
        console.log("error at centers, and it is:", e)
        return false
    }
}

export async function createStudent3({students, yearId, slug}){
    function getBirth(birth) {
        if(birth){
            if(slug === 1){
                const newBirth = `${birth.toString().trim()}-01-01`
                return new Date(newBirth)
            }
            return birth
        }
        return null
    }
    try {
        await Promise.all(students.map(async (student, index) => {
            if(index > 0){
                if(!await isNotExistingStudent(generateRef({number: student.number, yearId}))){
                    await prisma.student.create({
                        data: {
                            name: student.name.replaceAll("ـ", ""),
                            number: parseInt(student.number),
                            idNumber: parseInt(student.idNumber),
                            ref: generateRef({number: student.number, yearId}),
                            birth: getBirth(student.birth),
                        },
                    })
                }
            }
        }))
        return true
    } catch (e) {
        console.log("error at states, and it is:", e)
        return false
    }
}
export async function createStudents({students, typeId, slug, yearId, resultId, sessionId}){
    console.log("count students is:", students.length)
    function getBirth(birth) {
        if(birth){
            if(slug === 1){
                const newBirth = `${birth.toString().trim()}-01-01`
                return new Date(newBirth)
            }
            return birth
        }
        return null
    }
    const {unknownState, unknownCounty, unknownSchool, unknownCenter} = await getCategoriesUnknown()
    switch (slug) {
        case 5: {
            try {
                await Promise.all(students.map( async (student, index) => {
                    const {state, county, school, center, type} = await getCategoriesForStudents({result: student})
                    if(index !== 0){
                        if(await isNotExistingStudent(generateRef({number: student.number, typeId, yearId, ref: "student"}))){
                            await prisma.student.create({
                                data: {
                                    name: student.name.replaceAll("ـ", ""),
                                    number: parseInt(student.number),
                                    idNumber: parseInt(student.idNumber),
                                    ref: generateRef({number: student.number, typeId, yearId, ref: "student"}),
                                    birth: getBirth(student.birth),
                                    result: {
                                        connect: { id: resultId },
                                    },
                                    results: {
                                        connectOrCreate: {
                                            create: {
                                                ref: generateRef({number: student.number, typeId, yearId, ref: "result", sessionId}),
                                                rankingInCountry: student.rankingInCountry,
                                                rankingInState: student.rankingInState,
                                                rankingInCounty: student.rankingInCounty,
                                                rankingInSchool: student.rankingInSchool,
                                                rankingInCenter: student.rankingInCenter,
                                                degree: student.degree,
                                                decision: student.decision,
                                                typeResult: {
                                                    connect: { id: typeId },
                                                },
                                                result: {
                                                    connect: { id: resultId },
                                                },
                                                year: {
                                                    connect: { id: yearId },
                                                },
                                                session: {
                                                    connect: { id: sessionId },
                                                },
                                                state: {
                                                    connect: { id: state ? state.id : unknownState.id },
                                                },
                                                county: {
                                                    connect: { id: county ? county.id : unknownCounty.id },
                                                },
                                                school: {
                                                    connect: { id: school ? school.id : unknownSchool.id },
                                                },
                                                center: {
                                                    connect: { id: center ? center.id : unknownCenter.id },
                                                },
                                                type: {
                                                    connect: { id: type?.id },
                                                },
                                            },
                                            where: {
                                                ref: generateRef({number: student.number, typeId, yearId, ref: "result", sessionId}),
                                            },
                                        },
                                    }
                                }
                            })
                        } else if(await isNotExistingStudentResult(generateRef({number: student.number, yearId, ref: "result", sessionId}))) {
                            const existingStudent = await prisma.student.findUnique({
                                where: {
                                    ref: generateRef({number: student.number, typeId, yearId, ref: "student"}),
                                },
                                select: {
                                    id: true,
                                    results: {
                                        select: SELECT_DATA_FOR_RESULT
                                    }
                                }
                            })
                            await prisma.resultStudent.create({
                                data: {
                                    ref: generateRef({number: student.number, typeId, yearId, ref: "result", sessionId}),
                                    rankingInCountry: student.rankingInCountry,
                                    rankingInState: student.rankingInState,
                                    rankingInCounty: student.rankingInCounty,
                                    rankingInSchool: student.rankingInSchool,
                                    rankingInCenter: student.rankingInCenter,
                                    degree: student.degree,
                                    decision: student.decision,
                                    typeResult: {
                                        connect: { id: typeId },
                                    },
                                    student: {
                                        connect: { id: existingStudent.id },
                                    },
                                    result: {
                                        connect: { id: resultId },
                                    },
                                    year: {
                                        connect: { id: yearId },
                                    },
                                    session: {
                                        connect: { id: sessionId },
                                    },
                                    state: {
                                        connect: { id: state && state.name !== "unknown" ? state.id : existingStudent.results[0].state.id },
                                    },
                                    county: {
                                        connect: { id: county && county.name !== "unknown" ? county.id : existingStudent.results[0].county.id },
                                    },
                                    center: {
                                        connect: { id: center && center.name !== "unknown" ? center.id : existingStudent.results[0].center.id },
                                    },
                                    school: {
                                        connect: { id: school && school.name !== "unknown" ? school.id : existingStudent.results[0].school.id },
                                    },
                                    type: {
                                        connect: { id: type?.id },
                                    },
                                }
                            })
                        }

                    }
                }))
                return true
            } catch (e) {
                console.log("error at students, and it is:", e)
                return false
            }
        }
        default:
            try {
                await Promise.all(students.map( async (student, index) => {
                    const {state, county, school, center} = await getCategoriesForStudents({result: student})
                    if(index !== 0){
                        if(await isNotExistingStudent(generateRef({number: student.number, typeId, yearId, ref: "student"}))){
                            await prisma.student.create({
                                data: {
                                    name: student.name.replaceAll("ـ", ""),
                                    number: parseInt(student.number),
                                    idNumber: parseInt(student?.idNumber),
                                    ref: generateRef({number: student.number, typeId, yearId, ref: "student"}),
                                    birth: getBirth(student?.birth),
                                    result: {
                                        connect: { id: resultId },
                                    },
                                    results: {
                                        connectOrCreate: {
                                            create: {
                                                ref: generateRef({number: student.number, typeId, yearId, ref: "result"}),
                                                rankingInCountry: student.rankingInCountry,
                                                rankingInState: student.rankingInState,
                                                rankingInCounty: student.rankingInCounty,
                                                rankingInSchool: student.rankingInSchool,
                                                rankingInCenter: student.rankingInCenter,
                                                degree: student.degree,
                                                decision: student.decision,
                                                typeResult: {
                                                    connect: { id: typeId },
                                                },
                                                result: {
                                                    connect: { id: resultId },
                                                },
                                                year: {
                                                    connect: { id: yearId },
                                                },
                                                state: {
                                                    connect: { id: state ? state.id : unknownState.id },
                                                },
                                                county: {
                                                    connect: { id: county ? county.id : unknownCounty.id },
                                                },
                                                school: {
                                                    connect: { id: school ? school.id : unknownSchool.id },
                                                },
                                                center: {
                                                    connect: { id: center ? center.id : unknownCenter.id },
                                                },
                                            },
                                            where: {
                                                ref: generateRef({number: student.number, typeId, yearId, ref: "result", sessionId}),
                                            },
                                        },
                                    }
                                }
                            })
                        }

                    }
                }))
                return true
            } catch (e) {
                console.log("error at students, and it is:", e)
                return false
            }
    }
}

export async function isNotExistingStudent(ref) {
    const student = await prisma.student.findUnique({ where: { ref}})
    if(student){
        return false
    }
    return true
}

export async function isNotExistingStudentResult(ref) {
    const result = await prisma.resultStudent.findUnique({ where: { ref}})
    if(result){
        return false
    }
    return true
}

export async function getCategoriesForStudents({result}) {
    const [state, county, school, center, type] = await prisma.$transaction([
        prisma.state.findFirst({
            where: {
                name: getName(result?.state),
            },
            select: {
                id: true,
                name: true
            }
        }),
        prisma.county.findFirst({
            where: {
                name: getName(result?.county),
            },
            select: {
                id: true,
                name: true
            }
        }),
        prisma.school.findFirst({
            where: {
                name: getName(result?.school),
            },
            select: {
                id: true,
                name: true
            }
        }),
        prisma.center.findFirst({
            where: {
                name: getName(result?.center),
            },
            select: {
                id: true,
                name: true
            }
        }),
        prisma.bacType.findFirst({
            where: {
                nameFr: getType(result?.type || "").nameFr,
            },
            select: {
                id: true
            }
        }),
    ])
    return {state, county, school, center, type}
}
export async function getCategoriesUnknown() {
    const [unknownState, unknownCounty, unknownSchool, unknownCenter] = await prisma.$transaction([
        prisma.state.findFirst({
            where: {
                name: "unknown",
            },
            select: {
                id: true
            }
        }),
        prisma.county.findFirst({
            where: {
                name: "unknown",
            },
            select: {
                id: true
            }
        }),
        prisma.school.findFirst({
            where: {
                name: "unknown",
            },
            select: {
                id: true
            }
        }),
        prisma.center.findFirst({
            where: {
                name: "unknown",
            },
            select: {
                id: true
            }
        }),
    ])
    return {unknownState, unknownCounty, unknownSchool, unknownCenter}
}
export async function getUnknown() {
    return await prisma.unknown.findFirst({
        where: {
            nameFr: "unknown"
        },
    })

}
export async function getStateByName(name){
    return await prisma.state.findFirst({
        where: {
            name,
        },
    })
}

export async function getCountyByName(name){
    return await prisma.county.findFirst({
        where: {
            name,
        },
    })
}

export async function getSchoolByName(name){
    return await prisma.school.findFirst({
        where: {
            name,
        },
    })
}

export async function getCenterByName(name){
    return await prisma.center.findFirst({
        where: {
            name,
        },
    })
}

export async function getTypeByName(nameFr){
    return await prisma.bacType.findFirst({
        where: {
            nameFr: nameFr
        }
    })
}

export async function createCounties(counties){
    try {
        await Promise.all(counties.map(async (county, index) => {
            if(index > 0){
                const countyExisting = await prisma.county.findFirst({ where: {name: getName(county?.county)}})
                if(!countyExisting){
                    await prisma.county.create({
                        data: {
                            name: getName(county?.county),
                        },
                    })
                }
            }
        }))
        return true
    } catch (e) {
        console.log("error at counties, and it is:", e)
        return false
    }
}

export async function createResult(data) {

    const validated = !data.isBac ?  Validate.createResult.safeParse({title: data.title, typeId: data.typeId, yearId: data.yearId, file: data.fileResult}) : Validate.createResult.safeParse({title: data.title, typeId: data.typeId, yearId: data.yearId, sessionId: data.sessionId, file: data.fileResult})
    const existingResult = await getResultByTitle(data.title, data.yearId)
    if(existingResult) return sendResponseServer(false, 400, "النتيجة موجودة بالفعل.")
    if(validated.success){
        const session = await prisma.session.findUnique({where: { id: data.sessionId }})
        const year = await prisma.year.findUnique({where: { id: data.yearId }})
        const type = await prisma.reslutType.findUnique({where: { id: data.typeId }})

        if(data.isBac){
            const fileName = await upload("results", data.fileResult, data.isBac, session.slug)
            await prisma.result.create({
                data: {
                    title: generateResultTitle({title: data.title, session: session.name}),
                    slug: generateResultSlug({slug: type.slug, year: year.name, session: session.slug}),
                    file: fileName,
                    yearId: data.yearId,
                    sessionId: data.sessionId,
                    typeId: data.typeId,
                }
            })
        } else {
            const fileName = await upload("results", data.fileResult)
            await prisma.result.create({
                data: {
                    title: data.title,
                    slug: generateResultSlug({slug: type.slug, year: year.name, session: session.slug}),
                    file: fileName,
                    yearId: data.yearId,
                    typeId: data.typeId,
                }
            })
        }

        return sendResponseServer(true, 200, "تم إضافة النتيجة بنجاح")
    } else {
        return sendResponseServer(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}
export async function createException(data) {
    const validated = Validate.createException.safeParse({name: data.name, value: data.value, degree: data.degree, ref: data.ref, typeId: data.typeId, yearId: data.yearId, resultId: data.resultId})
    const existingException = await getExceptionByName(data.name, data.yearId)
    if(existingException) return sendResponseServer(false, 400, "الاستثناء موجود بالفعل.")
    if(validated.success){
        await prisma.exception.create({
            data: {
                name: data.name,
                value: data.value,
                degree: data.degree,
                ref: data.ref,
                yearId: data.yearId,
                resultId: data.resultId,
                typeId: data.typeId,
            }
        })
        return sendResponseServer(true, 200, "تم إضافة الاستثناء بنجاح")
    } else {
        return sendResponseServer(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}
export async function updateException(id, data) {
    const validated = Validate.updateException.safeParse({name: data.name, value: data.value, degree: data.degree, ref: data.ref, exceptionId: id, typeId: data.typeId, yearId: data.yearId, resultId: data.resultId})
    const existingException = await getExceptionById(id)
    if(existingException && existingException.id !== id) return sendResponseServer(false, 400, "الاستثناء موجود بالفعل.")
    if(validated.success){
        await prisma.exception.update({
            where: {
              id: id
            },
            data: {
                name: data.name,
                value: data.value,
                degree: data.degree,
                ref: data.ref,
                yearId: data.yearId,
                resultId: data.resultId,
                typeId: data.typeId,
            }
        })
        return sendResponseServer(true, 200, "تم تحديث الاستثناء بنجاح")
    } else {
        return sendResponseServer(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}
export async function updateExceptionApplied(id, value) {
    await prisma.exception.update({
        where: {
          id: id
        },
        data: {
            applied: value,
        }
    })
    return sendResponseServer(true, 200, "تم تحديث حالة الاستثناء بنجاح")

}
export async function updateResultPublished(id, value) {
    await prisma.result.update({
        where: {
            id: id
        },
        data: {
            isPublished: value === "true",
        }
    })
    return sendResponseServer(true, 200, "تم تحديث حالة نشر النتائج بنجاح")

}
export async function updateResultUploaded(id, value) {
    await prisma.result.update({
        where: {
            id: id
        },
        data: {
            isUploaded: value === "true",
        }
    })
    return sendResponseServer(true, 200, "تم تحديث حالة رفع النتائج بنجاح")

}
export async function updateResult(id, data) {
    const validated = !data.isBac ? Validate.updateResult.safeParse({title: data.title, typeId: data.typeId, yearId: data.yearId}) : Validate.updateResult.safeParse({title: data.title, typeId: data.typeId, yearId: data.yearId, sessionId: data.sessionId})
    const existingResult = await getResultByTitle(data.title, data.yearId)
    if(existingResult && existingResult.id !== id) return sendResponseServer(false, 400, "النتيجة موجودة بالفعل.")
    if(validated.success){
        const session = await prisma.session.findUnique({where: { id: data.sessionId }})
        const year = await prisma.year.findUnique({where: { id: data.yearId }})
        const type = (await prisma.result.findUnique({
            where: { id },
            select: {
                type: true
            }
        }))?.type
        if(data.fileResult !== "undefined"){
            if(await isFileExist('results', data.file)){
                await deleteFile('results', data.file)
            }
            if(data.isBac) {
                const fileName = await upload("results", data.fileResult, data.isBac, session.slug)
                await prisma.result.update({
                    where: {
                        id,
                    },
                    data: {
                        title: generateResultTitle({title: data.title, session: session.name}),
                        slug: generateResultSlug({slug: type.slug, year: year.name, session: session.slug}),
                        file: fileName,
                        yearId: data.yearId,
                        sessionId: data.sessionId,
                    }
                })
            } else {
                const fileName = await upload("results", data.fileResult)
                await prisma.result.update({
                    where: {
                        id
                    },
                    data: {
                        title: data.title,
                        slug: generateResultSlug({slug: type.slug, year: year.name, session: session.slug}),
                        file: fileName,
                        yearId: data.yearId
                    }
                })
            }

            return sendResponseServer(true, 200, "تم تحديث النتيجة بنجاح")
        } else {
            await prisma.result.update({
                where: {
                    id
                },
                data: {
                    title: !data.isBac ?  data.title : generateResultTitle({title: data.title, session: session.name}),
                    slug: generateResultSlug({slug: type.slug, year: year.name, session: session.slug}),
                    yearId: data.yearId,
                    sessionId: !data.isBac ? null : data.sessionId,
                }
            })
            return sendResponseServer(true, 200, "تم تحديث النتيجة بنجاح")
        }

    } else {
        return sendResponseServer(false, 400, "بعض البيانات مطلوبة.", validated.error.format())
    }

}
