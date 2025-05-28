import { useEffect, useState } from "react";

// 1024px corresponds to tailwind's "lg" width, used in frontend/src/routes/ResumeBuilder.tsx
function useIsSmallScreen(breakpoint = 1024) {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < breakpoint);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < breakpoint);

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return isSmallScreen;
}


export default useIsSmallScreen;