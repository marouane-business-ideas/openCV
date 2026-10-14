import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False while the page is rendered by the build and while React takes over that HTML in the browser, true after.
// Content that the build can't know (what the browser saved, for example) must wait for it, or React reports that the
// HTML and its own render differ.
const useIsHydrated = () => useSyncExternalStore(subscribe, () => true, () => false);

export default useIsHydrated;
