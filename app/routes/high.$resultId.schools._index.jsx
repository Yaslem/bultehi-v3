
import {json, Link, useFetcher, useLoaderData, useNavigation, useRevalidator} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {SectionCard} from "../components/Results.jsx";
import {
    getSchoolsByResultId,
    searchSchools
} from "../controllers/public/Result.server.js";
import Nothing from "../components/Nothing.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {paginationActions} from "../redux/slices/paginationSlice.js";
import Pagination from "../components/Pagination.jsx";
import {schoolsActions} from "../redux/slices/schoolsSlice.js";

export const loader = async ({request, params}) => {
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "desc";
    const resultId = generateIdFromParams(params.resultId)
    return json(await getSchoolsByResultId({resultId, sort, url: "/high"}))
}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "المدارس"});
};

export const handle =  {
    breadcrumb: () => <Link className={"text-indigo-700 hover:text-indigo-600"} to="/high/schools">المدارس</Link>,
};
export async function action({ request, params }) {
    const resultId = generateIdFromParams(params.resultId)
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "desc";
    const {action, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "pagination": {
            return json(await getSchoolsByResultId({resultId, page, sort, url: "/high"}));
        }
        case "search": {
            return json(await searchSchools({resultId, value, sort, url: "/high"}));
        }
        default:
            return json({});
    }

}

export default function HighResultsResultIdCounties_index() {
    let {data, status} = useLoaderData()
    const schools = useSelector(state => state.schools.data)
    const navigation = useNavigation();
    const search = useFetcher({ key: "search" })
    const fetcher = useFetcher({ key: "counties-pagination" })
    const res = search.data
    const pagination = fetcher.data
    const revalidator = useRevalidator();
    const isSubmitting = fetcher.state === "submitting";
    const dispatch = useDispatch()
    const [action, setAction] = useState("next")
    let pageIndex = useSelector(state => state.pagination.pageIndex)
    const controls = useSelector(state => state.controls.controls)

    function handelPagination() {
        const formData = new FormData();
        formData.append("page", pageIndex)
        formData.append("orderBy", controls.orderBy)
        formData.append("action", "pagination")
        fetcher.submit(formData, {
            method: "POST",
        });
    }


    useEffect(() => {
        if(revalidator.state === "loading" || navigation.state === "loading"){
            dispatch(schoolsActions.setSchools(data.schools))
            dispatch(paginationActions.setIsPagination(true))
        }
    }, [revalidator.state, navigation.state]);

    useEffect(() => {
        if(res){
            if(res.data){
                dispatch(schoolsActions.setSchools(res.data))
                dispatch(paginationActions.setIsPagination(false))
            }
        } else {
            dispatch(schoolsActions.setSchools(data.schools))
            dispatch(paginationActions.setPageIndex(0))
            dispatch(paginationActions.setIsPagination(true))
        }
        
    }, [res]);

    useEffect(() => {
        if(pagination){
            if(pagination.data){
                dispatch(schoolsActions.setSchools(pagination.data.schools))
            }
        } else {
            dispatch(schoolsActions.setSchools(data.schools))
            dispatch(paginationActions.setPageIndex(0))
            dispatch(paginationActions.setIsPagination(true))
        }

    }, [pagination]);

    return (
        <>
            {
                status === "success"
                    ? <>
                        <SectionCard isControl={true} title={"المدارس"} isState={false} data={schools} />
                        <Pagination
                            onClickPrev={ async () => {
                                setAction("prev")
                                dispatch(paginationActions.setDecrementPageIndex((pageIndex -= 1)))
                                handelPagination()
                            }} onClickNext={async () => {
                            setAction("next")
                            dispatch(paginationActions.setIncrementPageIndex((pageIndex += 1)))
                            handelPagination()
                        }} pageIndex={pageIndex} current={action} isSubmitting={isSubmitting} maxPage={data.count} />
                    </>
                    : <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على مدارس. (:"}/>
            }
        </>
    )
}