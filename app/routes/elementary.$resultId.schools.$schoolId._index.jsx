import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {
    getDataForElementaryFilter, getPublicAllCentersBySchoolIdAndResultId, getSchoolById, getTopStudentsByCenterId,
    getTopStudentsBySchoolId,
    searchNameStudent
} from "../controllers/public/Result.server.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {getResultById} from "../controllers/Result.server.js";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const schoolId = generateIdFromParams(params.schoolId)
    const {data: result} =  await getResultById(resultId)
    return json(({
        slug: result.type.slug,
        school: await getSchoolById({schoolId, url: "/elementary/results"}),
        centers: await getPublicAllCentersBySchoolIdAndResultId({resultId, schoolId, url: "/elementary/results"}),
        results: await getTopStudentsBySchoolId({schoolId, resultId, url: "/elementary/results"})
    }))
}

export async function action({ request, params }) {
    const resultId = generateIdFromParams(params.resultId)
    const schoolId = generateIdFromParams(params.schoolId)
    const {action, by, value, centerId, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            return json(await getDataForElementaryFilter({resultId, by, schoolId, centerId, page}));
        }
        case "searchName": {
            return json(await searchNameStudent({resultId, value, schoolId, centerId, page}));
        }
        default:
            return json({})
    }

}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.school.name});
};

export default function ElementaryResultsResultIdSchoolsSchoolId_index() {
    const {school, slug, centers, results: {data}} = useLoaderData()
    return (
        <>
            <Search currentPage={"school"} slug={slug} centersData={{data: centers.data, status: centers.status}} isTitle={true} currentData={school} />
            <TopResults title={`العشرة الأول في مدرسة ${school.name}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}