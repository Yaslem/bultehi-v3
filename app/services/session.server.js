import { createCookieSessionStorage } from "@remix-run/node";

export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_auth",
        sameSite: "lax",
        maxAge: 60 * 60,
        path: "/",
        httpOnly: true,
        secrets: [process.env.AUTH_SECRET],
        secure: process.env.NODE_ENV === "production",
    },
});

export let { getSession, commitSession, destroySession } = sessionStorage;