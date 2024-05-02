import {authRoutes, DEFAULT_LOGIN_REDIRECT, privateRoutes} from "./routes.server.js";
import {redirect} from "@remix-run/node";
import {isAuthenticated} from "~/services/auth.server.js";
export default async function middleware(request) {
    let url = new URL(request.url);
    const isLoggedIn = await isAuthenticated(request)
    const isPrivateRoute = url.pathname.startsWith(privateRoutes)
    const isAuthRoute = authRoutes.includes(url.pathname)


    if(isAuthRoute){
        if(isLoggedIn){
            throw redirect(DEFAULT_LOGIN_REDIRECT)
        }
        return null
    }

    if(!isLoggedIn && isPrivateRoute){
        throw redirect("/auth/login")
    }

    return null
}