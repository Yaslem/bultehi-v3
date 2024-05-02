import {useSelector} from "react-redux";
import ResultStudent from "./Result";

export default function Global() {
    const isOpen = useSelector(state => state.result.isOpen)
    return (
        <>
            {
                isOpen &&
                <ResultStudent />
            }
        </>
    )
}