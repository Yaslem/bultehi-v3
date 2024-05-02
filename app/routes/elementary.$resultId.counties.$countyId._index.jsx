import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {
    getCountyById,
    getDataForElementaryFilter,
    getPublicAllSchoolsByCountyIdAndResultId,
    getTopStudentsByCountyId,
    searchNameStudent
} from "../controllers/public/Result.server.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {getResultById} from "../controllers/Result.server.js";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const countyId = generateIdFromParams(params.countyId)
    const {data: result} =  await getResultById(resultId)
    return json(({
        slug: result.type.slug,
        county: await getCountyById({countyId, url: "/elementary/results"}),
        schools: await getPublicAllSchoolsByCountyIdAndResultId({resultId, countyId, url: "/elementary/results"}),
        results: await getTopStudentsByCountyId({countyId, resultId, url: "/elementary/results"})
    }))
}

export async function action({ request, params }) {
    const resultId = generateIdFromParams(params.resultId)
    const countyId = generateIdFromParams(params.countyId)
    const {action, schoolId, by, value, centerId, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            return json(await getDataForElementaryFilter({resultId, by, countyId, schoolId, centerId, page}));
        }
        case "searchName": {
            return json(await searchNameStudent({resultId, value, countyId, schoolId, centerId, page}));
        }
        default:
            return json({})
    }

}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.county.name});
};

export default function ElementaryResultsResultIdCountiesStateId_index() {
    const {county, slug, schools, results: {data}} = useLoaderData()
    return (
        <>
            <Search currentPage={"county"} slug={slug} schoolsData={{data: schools.data, status: schools.status}} isTitle={true} currentData={county} />
            <TopResults title={`العشرة الأول في مقاطعة ${county.name}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}