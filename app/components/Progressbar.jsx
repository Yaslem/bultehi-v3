import {useNavigation} from "@remix-run/react";
import {useEffect, useRef, useState} from "react";
import classNames from "classnames";

export const Progressbar = () => {
    const navigation = useNavigation();
    const active = navigation.state !== "idle";

    const ref = useRef(null);
    const [animationComplete, setAnimationComplete] = useState(true);

    useEffect(() => {
        if (!ref.current) return;
        if (active) setAnimationComplete(false);

        Promise.allSettled(
            ref.current.getAnimations().map(({ finished }) => finished)
        ).then(() => !active && setAnimationComplete(true));
    }, [active]);

    return (
        <div
            role="progressbar"
            aria-hidden={!active}
            aria-valuetext={active ? "Loading" : undefined}
            className="fixed inset-x-0 top-0 right-0 z-50 h-1 animate-pulse"
        >
            <div
                ref={ref}
                className={classNames({
                    "h-full bg-gradient-to-l from-indigo-500 to-indigo-700 transition-all duration-500 ease-in-out": true,
                    "w-0 opacity-0 transition-none": navigation.state === "idle" && animationComplete,
                    "w-4/12": navigation.state === "submitting",
                    "w-10/12": navigation.state === "loading",
                    "w-full": navigation.state === "idle" && !animationComplete
                })}
            />
        </div>
    );
}