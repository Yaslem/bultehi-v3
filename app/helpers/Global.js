import {getStudentsDegreeByCategoryName} from "../controllers/public/Result.server.js";
import TimeAgo from "javascript-time-ago";
import ar from "javascript-time-ago/locale/ar";
import {useLocation} from "@remix-run/react";
export const PAGINATE_LIMIT = 8
export const PASSING_DEGREE_IN_ELEMENTARY = 85
export const PASSING_DEGREE_IN_HIGH = parseInt("process.env.PASSING_DEGREE_IN_HIGH")
export const DEFAULT_IMAGE_FOR_GRANT = "default_grant_image.png"


export const SELECT_DATA_FOR_STUDENT = {
    id: true,
    number: true,
    name: true,
    birth: true,
    degree: true,
    decision: true,
    rankingInCountry: true,
    rankingInState: true,
    rankingInCounty: true,
    rankingInSchool: true,
    year: {
        select: {
            id: true,
            name: true,
        }
    },
    state: {
        select: {
            id: true,
            name: true,
        }
    },
    county: {
        select: {
            id: true,
            name: true,
        }
    },
    school: {
        select: {
            id: true,
            name: true,
        }
    },
    unknown: {
        select: {
            id: true,
            nameAr: true,
            nameFr: true,
        }
    },
    center: {
        select: {
            id: true,
            name: true,
        }
    },
    type: {
        select: {
            id: true,
            nameAr: true,
            nameFr: true,
        }
    },
    typeResult: {
        select: {
            id: true,
            name: true,
            slug: true,
        }
    },
    result: {
        select: {
            id: true,
            title: true,
            isPublished: true,
        }
    }
}
export const SELECT_DATA_FOR_RESULT = {
    id: true,
    degree: true,
    decision: true,
    rankingInCountry: true,
    rankingInState: true,
    rankingInCounty: true,
    rankingInSchool: true,
    rankingInCenter: true,
    student: {
        select: {
            id: true,
            number: true,
            name: true,
            birth: true,
        }
    },
    session: {
        select: {
            id: true,
            name: true,
            slug: true,
        }
    },
    year: {
        select: {
            id: true,
            name: true,
        }
    },
    state: {
        select: {
            id: true,
            name: true,
        }
    },
    county: {
        select: {
            id: true,
            name: true,
        }
    },
    school: {
        select: {
            id: true,
            name: true,
        }
    },
    center: {
        select: {
            id: true,
            name: true,
        }
    },
    type: {
        select: {
            id: true,
            nameAr: true,
            nameFr: true,
        }
    },
    typeResult: {
        select: {
            id: true,
            name: true,
            slug: true,
        }
    },
    result: {
        select: {
            id: true,
            title: true,
            isPublished: true,
        }
    }
}
export function getNumberFormat(number) {
    return new Intl.NumberFormat("en-US").format(Number(number))
}
export function getNumberForHuman(number) {
    switch (Number(number)) {
        case 1: {
            return `الأول`
        }
        case 2: {
            return `الثاني`
        }
        case 3: {
            return `الثالث`
        }
        case 4: {
            return `الرابع`
        }
        case 5: {
            return `الخامس`
        }
        case 6: {
            return `السادس`
        }
        case 7: {
            return `السابع`
        }
        case 8: {
            return `الثامن`
        }
        case 9: {
            return `التاسع`
        }
        case 10: {
            return `العاشر`
        }
        default:
            return getNumberFormat(number)
    }
}
export function getDecisionStudent({exceptions, result}) {
    function getDecision({degree, ref, by = "", value}){
        switch (by) {
            case "exception": {
                if(Number(degree) >= Number(ref) && Number(degree) < Number(PASSING_DEGREE_IN_ELEMENTARY)){
                    return {value, degree: ref, special: true}
                } else if(Number(degree) >= Number(PASSING_DEGREE_IN_ELEMENTARY)){
                    return  {value: "ناجح", degree: ref, special: false}
                } else {
                    return  {value: "راسب", degree: ref, special: false}
                }
            }
            default : {
                if(Number(degree) >= Number(ref)){
                    return  {value: "ناجح", degree: ref, special: false}
                } else {
                    return  {value: "راسب", degree: ref, special: false}
                }
            }
        }
    }
    switch (result.typeResult.slug) {
        case 1: {
            if(exceptions.status === "success"){
                return exceptions.data.map(exception => {
                    if(exception.ref === String("state").toLowerCase()){
                        if(exception.name === result.state.name){
                            return getDecision({degree: result.degree, ref: exception.degree, by: "exception", value: exception.value})
                        } else {
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                        }
                    }

                    if(exception.ref === String("county").toLowerCase()){
                        if(exception.name === result.county.name || exception.name === result.county.name){
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY, by: "exception", value: exception.value})
                        } else {
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                        }
                    }

                    if(exception.ref === String("school").toLowerCase()){
                        if(exception.name === result.school.name || exception.name === result.school.name){
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY, by: "exception", value: exception.value})
                        } else {
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                        }
                    }

                    if(exception.ref === String("school").toLowerCase()){
                        if(exception.name === result.center.name || exception.name === result.center.name){
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY, by: "exception", value: exception.value})
                        } else {
                            return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                        }
                    }
                    return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
                })
            } else {
               return getDecision({degree: result.degree, ref: PASSING_DEGREE_IN_ELEMENTARY})
            }
        }
        default : {
            switch (result.decision.trim()) {
                case 'Ajourné':
                    return  {value: "راسب", special: false}
                case 'Absent':
                case 'Abscent':
                    return  {value: "غائب", special: false}
                case 'Admis':
                case 'Delibérable':
                    return  {value: "ناجح", special: false}
                case 'Examen annulé':
                    return  {value: "مُلغى", special: false}
                case 'Sessionnaire':
                    return  {value: "الدورة التكميلية", special: false}
                default:
                    return  {value: "---", special: false}
            }
        }
    }
}
export async function getDegreeByExceptions({exceptions, ref, resultId}) {
    if(exceptions.status === "success"){
        const admis = await Promise.all(exceptions.data.map( async exception => {
            if(exception.name === ref){
                return await getStudentsDegreeByCategoryName({by: exception.ref, name: exception.name, resultId, degree: exception.degree})
            } else {
                return 0
            }
        }))
        return admis[0]
    } else {
        return 0
    }
}

export async function getCountDegreeByExceptions({exceptions, resultId}) {
    if(exceptions.status === "success"){
        const admis = await Promise.all(exceptions.data.map( async exception => {
            switch (exception.ref) {
                case "state": {
                    return await getStudentsDegreeByCategoryName({by: "state", name: exception.name, resultId, degree: exception.degree})
                }
                case "county": {
                    return await getStudentsDegreeByCategoryName({by: "county", name: exception.name, resultId, degree: exception.degree})
                }
                case "school": {
                    return await getStudentsDegreeByCategoryName({by: "school", name: exception.name, resultId, degree: exception.degree})
                }
                case "center": {
                    return await getStudentsDegreeByCategoryName({by: "center", name: exception.name, resultId, degree: exception.degree})
                }
            }
        }))
        return admis[0]
    } else {
        return 0
    }
}
export function getGradeStudent(degree, {exceptions, result}) {
    const largestDegree = 200
    const currentNumber = largestDegree - PASSING_DEGREE_IN_ELEMENTARY
    const grade = currentNumber / 8
    if(Number(degree) > (largestDegree - grade) && Number(degree) <= largestDegree){
        return "أ+ - +A"
    } else if(Number(degree) >= (largestDegree - (grade * 2)) && Number(degree) <= (largestDegree - grade)){
        return "أ - A"
    } else if(Number(degree) >= (largestDegree - (grade * 3)) && Number(degree) < (largestDegree - (grade * 2))){
        return "ب+ - +B"
    } else if(Number(degree) >= (largestDegree - (grade * 4)) && Number(degree) < (largestDegree - (grade * 3))){
        return "ب - B"
    } else if(Number(degree) >= (largestDegree - (grade * 5)) && Number(degree) < (largestDegree - (grade * 4))){
        return "ج+ - +C"
    } else if(Number(degree) >= (largestDegree - (grade * 6)) && Number(degree) < (largestDegree - (grade * 5))){
        return "ج - C"
    } else if(Number(degree) >= (largestDegree - (grade * 7)) && Number(degree) < (largestDegree - (grade * 6))){
        return "د+ - +D"
    } else if(Number(degree) >= (largestDegree - (grade * 8)) && Number(degree) < (largestDegree - (grade * 7))){
        return "د - D"
    } else {
        if(getDecisionStudent({exceptions, result})[0]?.special || getDecisionStudent({exceptions, result}).special){
            return "معدل خاص"
        } else {
            return "هـ - F"
        }
    }
}
export function getUnique(values) {
    let newUnique = []
    values.map( (x, index) => {
        if (!newUnique.some(y => JSON.stringify(y.title) === JSON.stringify(x.title))) {
            newUnique.push(x)
        }
    })
    return newUnique
}

export function generateIdFromParams(param) {
    return param.toString().split("-").pop()
}
export function generateSlug({slug, id}) {
    const pathName = useLocation().pathname
    const parseSlug = slug?.toString().replaceAll("-", "").replaceAll("  ", "-").replaceAll(" ", "-")
    return pathName + `/${parseSlug}-${id}`
}
export function generateIdFromSlug({slug, id}) {
    return `${slug.toString().replaceAll("-", "").replaceAll("  ", "-").replaceAll(" ", "-")}-${id}`
}
export function getUrlForTypeResults(slug) {
    switch (slug) {
        case 1:
            return "elementary"
        case 2:
            return "middle"
        case 5:
            return "high"
    }
}

export function getGlobalResultStudent({result, exceptions}) {
    return {
        id: result.id,
        result: result.result,
        type: result.typeResult.slug === 5 ? result.type : null,
        slug: result.typeResult.slug,
        grade: result.typeResult.slug === 1 ? getGradeStudent(result.degree, {exceptions, result}) : null,
        decision: getDecisionStudent({exceptions, result})[0]?.value || getDecisionStudent({exceptions, result}).value,
        degree: getDegreeStudent(result.degree),
        rankingInCountry: result.rankingInCountry,
        rankingInCounty: result.rankingInCounty,
        rankingInState: result.rankingInState,
        rankingInSchool: result.rankingInSchool,
        rankingInCenter: result.rankingInCenter,
        student: result.student,
        center: result.center,
        county: result.county,
        school: result.school,
        state: result.state,
        session: result.session,
        typeResult: result.typeResult,
        year: result.year,
    }
}

export function getValueForStudentResult({category, target}){
    switch (target) {
        case "id": {
            return category.id
        }
        case "name": {
            return category.name
        }
    }
}
export function generateBreadcrumbs({pathName, params, slug}) {
    let breadcrumbs = []

    function getTitleBySlug() {
        switch (slug) {
            case 1: {
                return "التعليم الابتدائي"
            }
            case 2: {
                return "التعليم الإعدادي"
            }
            case 5: {
                return "التعليم الثانوي"
            }
        }
    }
    const generatePathParts = pathStr => {
        const pathWithoutQuery = pathStr.split("?")[0];
        return pathWithoutQuery.split("/")
            .filter(v => v.length > 0);
    }
    const asPathNestedRoutes = generatePathParts(pathName);
    function getTitleFromParams(param) {
        const paramTitle = param.toString().split("-")
        paramTitle.pop()
        return decodeURIComponent(paramTitle.join(" "))
    }
    asPathNestedRoutes.map((subPath, idx) => {
        const href = "/" + asPathNestedRoutes.slice(0, idx + 1).join("/");
        console.log(Object.entries(params).includes("resultId"))
        switch (subPath) {
            case "results":
                if(!breadcrumbs.includes({title: getTitleBySlug(), href: href})){
                    return  breadcrumbs.push({
                        title: getTitleBySlug(),
                        href: href
                    })
                }
                return;
            case "states":
                if(!breadcrumbs.includes({title: "الولايات", href: href})){
                    return  breadcrumbs.push({
                        title: "الولايات",
                        href: href
                    })
                }
                return;
            case "types":
                if(!breadcrumbs.includes({title: "الشّعب", href: href})){
                    return  breadcrumbs.push({
                        title: "الشّعب",
                        href: href
                    })
                }
                return;
            case "counties":
                if(!breadcrumbs.includes({title: "المقاطعات", href: href})){
                    return  breadcrumbs.push({
                        title: "المقاطعات",
                        href: href
                    })
                }
                return;
            case "schools":
                if(!breadcrumbs.includes({title: "المدارس", href: href})){
                    return  breadcrumbs.push({
                        title: "المدارس",
                        href: href
                    })
                }
                return;
            case "centers":
                if(!breadcrumbs.includes({title: "المراكز", href: href})){
                    return  breadcrumbs.push({
                        title: "المراكز",
                        href: href
                    })
                }
                return;
            case "high":
                if(!breadcrumbs.includes({title: "التعليم الثانوي", href: href})){
                    return  breadcrumbs.push({
                        title: "التعليم الثانوي",
                        href: href
                    })
                }
                return;
            case "elementary":
                if(!breadcrumbs.includes({title: "التعليم الابتدائي", href: href})){
                    return  breadcrumbs.push({
                        title: "التعليم الابتدائي",
                        href: href
                    })
                }
                return;
            case "middle":
                if(!breadcrumbs.includes({title: "التعليم الإعدادي", href: href})){
                    return  breadcrumbs.push({
                        title: "التعليم الإعدادي",
                        href: href
                    })
                }
                return;
            case params.stateId:
                if(!breadcrumbs.includes({title: getTitleFromParams(params.stateId), href: href})){
                    return  breadcrumbs.push({
                        title: getTitleFromParams(params.stateId),
                        href: href
                    })
                }
                return;
            case params.resultId:
                console.log("yes")
                if(!breadcrumbs.includes({title: getTitleFromParams(params.resultId), href: href})){
                    return  breadcrumbs.push({
                        title: getTitleFromParams(params.resultId),
                        href: href
                    })
                }
                return;
            case params.countyId:
                if(!breadcrumbs.includes({title: getTitleFromParams(params.countyId), href: href})){
                    return  breadcrumbs.push({
                        title: getTitleFromParams(params.countyId),
                        href: href
                    })
                }
                return;
            case params.schoolId:
                if(!breadcrumbs.includes({title: getTitleFromParams(params.schoolId), href: href})){
                    return  breadcrumbs.push({
                        title: getTitleFromParams(params.schoolId),
                        href: href
                    })
                }
                return;
            case params.centerId:
                if(!breadcrumbs.includes({title: getTitleFromParams(params.centerId), href: href})){
                    return  breadcrumbs.push({
                        title: getTitleFromParams(params.centerId),
                        href: href
                    })
                }
                return;
            case params.typeId:
                if(!breadcrumbs.includes({title: getTitleFromParams(params.typeId), href: href})){
                    return  breadcrumbs.push({
                        title: getTitleFromParams(params.typeId),
                        href: href
                    })
                }
                return;
            case params.studentNumber:
                if(!breadcrumbs.includes({title: getTitleFromParams(params.studentNumber), href: href})){
                    return  breadcrumbs.push({
                        title: getTitleFromParams(params.studentNumber),
                        href: href
                    })
                }
                return;
        }
    })

    breadcrumbs = [{ href: "/", title: "الرئيسية" }, ...breadcrumbs]
    return breadcrumbs
}

export async function csvToJSON(csvText) {
    const lines = [];
    const linesArray = csvText.split('\n');
    linesArray.forEach((e) => {
        const row = e.replace(/[\s]+[,]+|[,]+[\s]+/g, ',').trim();
        lines.push(row);
    });
    // console.log(lines)
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {

        const obj = {};
        const currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}
export function getImageStates(name) {
    switch (name.toString().trim()) {
        case "اترارزه":
        case "Trarza":
            return "/uploads/global/states/trarza.jpg"
        case "ادرار":
        case "آدرار":
        case "أدرار":
        case "Adrar":
            return "/uploads/global/states/adrar.jpeg"
        case "الحوض الشرقي":
        case "Hod Charghy":
            return "/uploads/global/states/hod_charghy.jpeg"
        case "الحوض الغربي":
        case "Hod Gharby":
            return "/uploads/global/states/hod_gharby.jpg"
        case "انواكشوط  الغربية":
        case "نواكشوط  الغربية":
        case "نواكشوط الجنوبية":
        case "انواكشوط الجنوبية":
        case "انواكشوط الشمالية":
        case "نواكشوط الشمالية":
        case "Nouakchott Ouest":
        case "Nouakchott Sud":
        case "Nouakchott Nord":
            return "/uploads/global/states/nouakchott.jpeg"
        case "اينشيري":
        case "انشيري":
        case "Inchiri":
            return "/uploads/global/states/inchiri.jpeg"
        case "تكانت":
        case "Tagant":
            return "/uploads/global/states/tagant.jpeg"
        case "تيرس ازمور":
        case "تيرس زمور":
        case "Tiris Zemour":
            return "/uploads/global/states/tiris_zemour.jpeg"
        case "داخلت انواذيب":
        case "داخلت انواديبو":
        case "داخلت نواديبو":
        case "Dakhlet NDB":
            return "/uploads/global/states/dakhlet_ndb.jpg"
        case "كوركل":
        case "Gorgol":
            return "/uploads/global/states/gorgol.jpeg"
        case "كيدي ماغه":
        case "كيديماغا":
        case "Guidimagha":
            return "/uploads/global/states/guidimagha.jpeg"
        case "لبراكن":
        case "لبراكنه":
        case "Brakna":
            return "/uploads/global/states/brakna.jpeg"
        case "لعصابه":
        case "Assaba":
            return "/uploads/global/states/assaba.jpg"
        default:
            return "/uploads/global/states/adrar.jpeg"
    }
}

export function getNameStudent(name) {
    if(name.match(/^[a-z0-9_.,'"!?;:& ]+$/i)){
        return <h2 dir={"ltr"} className={"font-bold text-left text-base text-slate-700"}>{name.length <= 30 ? name : name.slice(0, 29) + "..."}</h2>
    } else {
        return <h2 className={"font-bold text-base text-slate-700"}>{name.length <= 30 ? name : name.slice(0, 29) + "..."}</h2>
    }
}

export function getDegreeStudent(degree) {
    if(degree.toString().trim().split(".").length === 1){
        return degree.toString().trim().split(".")[0]
    }else {
        return  degree.toString().trim().split(".")[0] + '.' + degree.toString().trim().split(".")[1].slice(0, 2)
    }
}

export function getDateForHuman(date) {
    TimeAgo.addDefaultLocale(ar)
    const timeAgo = new TimeAgo('en-US')
    return timeAgo.format(new Date(date))
}
export function Canvas({right = 0, top = 0, left = 0, bottom = 0, width = 400}) {
    const canvas = document.createElement("canvas")
    canvas.position = "absolute"
    canvas.right = right
    canvas.top = top
    canvas.left = left
    canvas.bottom = bottom
    canvas.width = width
    return canvas
}

export function generatePageTitle({matches, current}) {
    let parentMeta = matches.flatMap(
        (match) => match.meta ?? []
    );
    parentMeta.push({ title: current })
    const meta = parentMeta.map(meta => meta.title)
    let newMeta = []
    meta.forEach((meta) => {
        if(!newMeta.includes(meta)){
            if(meta.includes("-")){
                newMeta.push(meta.split("-")[1].trim())
            } else {
                newMeta.push(meta)
            }
        }

    })
    return [{
        title: newMeta.join(" - ")
    }]
}

export const mergeMeta = (leafMetaFn) => {
    return (arg) => {
        let leafMeta = leafMetaFn(arg)

        return arg.matches.reduceRight((acc, match) => {
            for (let parentMeta of match.meta) {
                let index = acc.findIndex(
                    (meta) =>
                        ('name' in meta &&
                            'name' in parentMeta &&
                            meta.name === parentMeta.name) ||
                        ('property' in meta &&
                            'property' in parentMeta &&
                            meta.property === parentMeta.property) ||
                        ('title' in meta && 'title' in parentMeta)
                )
                if (index == -1) {
                    // Parent meta not found in acc, so add it
                    acc.push(parentMeta)
                }
            }
            return acc
        }, leafMeta)
    }
}

export function exclude(user, keys) {
    return Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key))
    );
}
export function getName(name) {
    if(name && name.length > 1){
        return name.replaceAll("ـ", "")
    }
    return "unknown"
}

export function generateRef({number, yearId, typeId, sessionId = "null", ref}) {
    if(ref === "student"){
        return `${number}-${typeId}-${yearId}`
    }else if(ref === "result"){
        return `${number}-${typeId}-${yearId}-${sessionId}`
    }
    return ""
}
export function generateResultTitle({title, session}) {
    return `${title} - ${session}`
}
export function getType(name) {
    switch (name.trim().toUpperCase()){
        case 'SN':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'العلوم الطبيعية',
            }
        case 'SNE':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'العلوم الطبيعية التجريبية',
            }
        case 'LM':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'الآداب العصرية',
            }
        case 'LME':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'الآداب العصرية التجريبية',
            }
        case 'LO':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'الآداب الأصلية',
            }
        case 'M':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'الرياضيات',
            }
        case 'ME':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'الرياضيات التجريبية',
            }
        case 'TM':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'التقنية',
            }
        case 'LA':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'اللغات',
            }
        case 'TS':
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: 'الهندسة الكهربائية',
            }
        default:
            return {
                nameFr: name.trim().toUpperCase(),
                nameAr: '---',
            }
    }
}

export function getSortedValues(sort, data){
    if(sort === "asc"){
        return data.sort((a, b) => {
            return a.counts.all - b.counts.all;
        })
    }
    return data.sort((a, b) => {
        return b.counts.all - a.counts.all;
    })
}