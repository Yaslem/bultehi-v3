
import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {
    getResultStudent, getSchoolById,
    getTopStudentsBySchoolId,
} from "../controllers/public/Result.server.js";
import Section from "../components/Section.jsx";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const schoolId = generateIdFromParams(params.schoolId)
    return json(({
        school: await getSchoolById({schoolId, url: "/high"}),
        results: await getTopStudentsBySchoolId({schoolId, resultId, url: "/high"})
    }))
}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.school.name});
};


export async function action({ request, params }) {
    const {action, target, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            const resultId = generateIdFromParams(params.resultId)
            const schoolId = generateIdFromParams(params.schoolId)
            const searchBy = "school"
            const isTitle = true
            return json(await getResultStudent({page, resultId, target, value, isTitle, searchBy, searchById: schoolId, url: "/high"}));
        }
        default:
            return json({})
    }

}

export default function HighResultsResultIdSchoolsSchoolId_index() {
    const {school, results: {data}} = useLoaderData()
    return (
        <>
            <Search isTitle={true} currentData={school} />
            <TopResults title={`العشرة الأول في مدرسة ${school.name}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} type={result.type} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}