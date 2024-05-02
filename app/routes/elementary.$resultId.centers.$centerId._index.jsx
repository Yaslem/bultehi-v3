import {json, useLoaderData} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {
    getCenterById,
    getDataForElementaryFilter, getPublicAllCentersBySchoolIdAndResultId, getSchoolById, getTopStudentsByCenterId,
    getTopStudentsBySchoolId,
    searchNameStudent
} from "../controllers/public/Result.server.js";
import {Search, TopResults, TopStudent} from "../components/Results.jsx";
import {getResultById} from "../controllers/Result.server.js";
import {useEffect} from "react";
import {paginationActions} from "../redux/slices/paginationSlice.js";
import {useDispatch} from "react-redux";

export const loader = async ({params}) => {
    const resultId = generateIdFromParams(params.resultId)
    const centerId = generateIdFromParams(params.centerId)
    const {data: result} =  await getResultById(resultId)
    return json(({
        slug: result.type.slug,
        center: await getCenterById({centerId, url: "/elementary/results"}),
        students: await getDataForElementaryFilter({resultId, by: "onlyCenter", centerId}),
        results: await getTopStudentsByCenterId({centerId, resultId, url: "/elementary/results"})
    }))
}

export async function action({ request, params }) {
    const resultId = generateIdFromParams(params.resultId)
    const centerId = generateIdFromParams(params.centerId)
    const {action, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "search": {
            return json(await getDataForElementaryFilter({resultId, by: "onlyCenter", centerId, page}));
        }
        case "searchName": {
            return json(await searchNameStudent({resultId, value, centerId, page}));
        }
        default:
            return json({})
    }

}

export const meta = ({ matches, data }) => {
    return generatePageTitle({matches, current: data.center.name});
};

export default function ElementaryResultsResultIdCentersCenterId_index() {
    const {center, students, slug, results: {data}} = useLoaderData()
    const dispatch = useDispatch()
    useEffect(() => {
        if(students.data.count){
            dispatch(paginationActions.setMaxPage(students.data.count))
            if (students.data.count >= 2) {
                dispatch(paginationActions.setIsPagination(true))
            } else {
                dispatch(paginationActions.setIsPagination(false))
            }
        }
    }, []);
    return (
        <>
            <Search resultsData={students.data.results} currentPage={"center"} slug={slug} isTitle={true} currentData={center} />
            <TopResults title={`العشرة الأول في مركز ${center.name}`}>
                {
                    data.map((result, index) =>
                        <TopStudent key={index} result={result} index={index} />
                    )
                }
            </TopResults>
        </>
    )
}