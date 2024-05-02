import prisma from "../helpers/db.js";
import {exclude} from "~/helpers/Global.js";
import {redirect} from "@remix-run/node";
import {commitSession, destroySession, getSession} from "~/services/session.server.js";

export async function signIn(request,{email}){
    const session = await getSession(
        request.headers.get("Cookie")
    )
    const user = await prisma.user.findUnique({where: {email}})
    const userWithoutPassword = exclude(user, ['password', "deletedAt"])
    session.set("user", userWithoutPassword);
    throw redirect("/dash", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export async function logOut(request){
    const session = await getSession(
        request.headers.get("Cookie")
    )

    throw redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}
export async function isAuthenticated(request){
    const session = await getSession(
        request.headers.get("Cookie")
    )
    return session.has("user")
}

export async function getUserAuthenticated(request){
    const session = await getSession(
        request.headers.get("Cookie")
    )
    return session.get("user")
}