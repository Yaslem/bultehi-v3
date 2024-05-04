
import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {
    getCenterById,
    getResultStudent,
    getTopStudentsByCenterId,
} from "../controllers/public/Result.server.js";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const centerId = generateIdFromParams(params.centerId)
    return json(({
        center: await getCenterById({centerId, url: "/high"}),
        results: await getTopStudentsByCenterId({centerId, resultId, url: "/high"})
    }))
}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.center.name});
};


export async function action({ request, params }) {
    const {action, target, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            const resultId = generateIdFromParams(params.resultId)
            const centerId = generateIdFromParams(params.centerId)
            const searchBy = "center"
            const isTitle = true
            return json(await getResultStudent({page, resultId, target, value, isTitle, searchBy, searchById: centerId, url: "/high/results"}));
        }
        default:
            return json({})
    }

}

export default function HighResultsResultIdSchoolsSchoolId_index() {
    const {center, results: {data}} = useLoaderData()
    return (
        <>
            <Search isTitle={true} currentData={center} />
            <TopResults title={`العشرة الأول في مركز ${center.name}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} type={result.type} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}