import {IoNotificationsOutline} from "react-icons/io5";
import {getDateForHuman} from "../helpers/Global.js";

export default function NotificationCard({notifications}) {
    return (
        <div className={"p-5 flex flex-col gap-4 bg-stone-100"}>
            {
                notifications.map((notification, i) =>
                    <div key={i} className={"border rounded-lg p-4 bg-white flex gap-4"}>
                        <div className={"flex items-center rounded-lg self-start justify-center p-2 bg-amber-100"}>
                            <IoNotificationsOutline className={"text-2xl text-amber-600"}/>
                        </div>
                        <div className={"flex flex-grow flex-col gap-3"}>
                            <div className={"flex gap-2 justify-between flex-col md:flex-row md:items-center"}>
                                <h2 className={"text-lg font-semibold"}>{notification.title}</h2>
                                <p className={"text-sm font-medium text-black/80"}>{getDateForHuman(notification.updatedAt, false)}</p>
                            </div>
                            <p className={"text-sm leading-8 font-medium text-black/80"}>{notification.body}</p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}