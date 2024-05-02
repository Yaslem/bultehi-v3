
import {json, useFetcher, useLoaderData, useNavigation, useRevalidator} from "@remix-run/react";
import {generateIdFromParams, generatePageTitle} from "../helpers/Global.js";
import {SectionCard} from "../components/Results.jsx";
import {
    getCentersByResultId,
    searchCenters
} from "../controllers/public/Result.server.js";
import Nothing from "../components/Nothing.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {paginationActions} from "../redux/slices/paginationSlice.js";
import Pagination from "../components/Pagination.jsx";
import {schoolsActions} from "../redux/slices/schoolsSlice.js";
import Section from "../components/Section.jsx";
import {centersActions} from "../redux/slices/centersSlice.js";

export const loader = async ({request, params}) => {
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "desc";
    const resultId = generateIdFromParams(params.resultId)
    return json(await getCentersByResultId({resultId, sort, url: "/middle/results"}))
}

export const meta = ({ matches }) => {
    return generatePageTitle({matches, current: "المراكز"});
};

export async function action({ request, params }) {
    const resultId = generateIdFromParams(params.resultId)
    const url = new URL(request.url);
    const sort = url.searchParams.get("sort") || "desc";
    const {action, value, page} = Object.fromEntries(await request.formData());
    switch (action) {
        case "pagination": {
            return json(await getCentersByResultId({resultId, page, sort, url: "/middle/results"}));
        }
        case "search": {
            return json(await searchCenters({resultId, value, sort, url: "/middle/results"}));
        }
        default:
            return json({});
    }

}

export default function MiddleResultsResultIdCenters_index() {
    let {data, status} = useLoaderData()
    const centers = useSelector(state => state.centers.data)
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
            dispatch(centersActions.setCenters(data.centers))
            dispatch(paginationActions.setIsPagination(true))
        }
    }, [revalidator.state, navigation.state]);

    useEffect(() => {
        if(res){
            if(res.data){
                dispatch(centersActions.setCenters(res.data))
                dispatch(paginationActions.setIsPagination(false))
            }
        } else {
            dispatch(centersActions.setCenters(data.centers))
            dispatch(paginationActions.setPageIndex(0))
            dispatch(paginationActions.setIsPagination(true))
        }
        
    }, [res]);

    useEffect(() => {
        if(pagination){
            if(pagination.data){
                dispatch(centersActions.setCenters(pagination.data.centers))
            }
        } else {
            dispatch(schoolsActions.setSchools(data.centers))
            dispatch(paginationActions.setPageIndex(0))
            dispatch(paginationActions.setIsPagination(true))
        }

    }, [pagination]);

    return (
        <>
            {
                status === "success"
                    ? <>
                        <SectionCard isControl={true} title={"المراكز"} isState={false} data={centers} />
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
                    : <Nothing title={"عفوا 😔"} desc={"المعذرة منك، لم نتمكن من العثور على مراكز. (:"}/>
            }
        </>
    )
}