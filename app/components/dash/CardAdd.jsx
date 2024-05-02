
import HeaderSection from "../../components/HeaderSection";
import {Form} from "@remix-run/react";
import Button from "../Button.jsx";

export default function CardAdd(
    {
        children,
        title,
        onSubmit,
        isSubmitting,
        onClick
    }) {

    return (
        <section className={"fixed z-50 w-screen h-screen bg-black/50 top-0 right-0 bottom-0 left-0"}>
            <div className={"flex flex-col md:max-h-[350px] overflow-y-auto gap-3 border bg-white rounded-lg mt-10 md:w-[400px] mx-4 md:mx-auto"}>
                <div className={"shadow-lg"}>
                    <HeaderSection onClick={onClick} title={title} />
                </div>
                <div
                    className={"p-2 flex flex-col gap-3"}>
                    <Form onSubmit={onSubmit} className={"flex flex-col gap-3"}>
                        <div className={"flex flex-col gap-3"}>
                            { children }
                        </div>
                        <Button title={title} isLoading={isSubmitting} />
                    </Form>
                </div>
            </div>
        </section>
    )
}