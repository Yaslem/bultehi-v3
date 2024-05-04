import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {
    getResultStudent, getTopStudentsByTypeId,
    getTypeById
} from "../controllers/public/Result.server.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import Section from "../components/Section.jsx";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const typeId = generateIdFromParams(params.typeId)
    return json(({
        type: await getTypeById({typeId, url: "/high"}),
        results: await getTopStudentsByTypeId({typeId, resultId, url: "/high"})
    }))
}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.type.nameAr});
};
export async function action({ request, params }) {
    const {action, target, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            const resultId = generateIdFromParams(params.resultId)
            const typeId = generateIdFromParams(params.typeId)
            const searchBy = "type"
            const isTitle = true
            return json(await getResultStudent({page, resultId, target, value, isTitle, searchBy, searchById: typeId, url: "/high"}));
        }
        default:
            return json({})
    }

}

export default function HighResultsResultIdStatesStateId_index() {
    const {type, results: {data}} = useLoaderData()
    return (
        <>
            <Search isTitle={true} currentData={type} />
            <TopResults title={`العشرة الأول في شعبة ${type.nameAr}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} type={result.type} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}