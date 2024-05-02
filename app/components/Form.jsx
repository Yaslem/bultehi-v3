
export default function Form(
    {
        onSubmit,
        children,
    }){

    return (
        <form
            onSubmit={onSubmit}
            className={"flex flex-col gap-3"}>
            { children }
        </form>
    )
}