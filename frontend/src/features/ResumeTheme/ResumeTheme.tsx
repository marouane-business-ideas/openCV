import { useContext } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import Card from "../../components/Card/Card";
import { ResumeContext, ResumeDispatchContext, resumeInfoType } from "../../context/ResumeContext";

const Theme = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const themeColor = edited ? (resumeBeingEdited as resumeInfoType).themeColor : onGoingResume.themeColor;

    const handleThemeClick = (themeColor: string) => {
        if (dispatch)
            dispatch({ type: `SET_THEME_COLOR${edited ? "_EDITED" : ""}`, payload: themeColor })
    }
    return (
        <Card>
            <div className=" flex flex-col  gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">THEME</h2>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="skills">Select a color theme for the resume:</label>
                    <div className="flex gap-5 items-center flex-wrap">
                        <button onClick={() => handleThemeClick("#0ea5e9")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#0ea5e9" }}>
                            {themeColor === "#0ea5e9" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#38bdf8")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#38bdf8" }} >
                            {themeColor === "#38bdf8" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#6366f1")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#6366f1" }}>
                            {themeColor === "#6366f1" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#818cf8")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#818cf8" }}>
                            {themeColor === "#818cf8" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#191919")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#191919" }}>
                            {themeColor === "#191919" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#6D7278")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#6D7278" }}>
                            {themeColor === "#6D7278" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#8C9399")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#8C9399" }}>
                            {themeColor === "#8C9399" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#C2C3C3")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#C2C3C3" }}>
                            {themeColor === "#C2C3C3" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#7A6C55")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#7A6C55" }}>
                            {themeColor === "#7A6C55" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#877A66")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#877A66" }}>
                            {themeColor === "#877A66" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#968C77")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#968C77" }}>
                            {themeColor === "#968C77" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#C2C7CC")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#C2C7CC" }}>
                            {themeColor === "#C2C7CC" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#D0D4D8")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#D0D4D8" }}>
                            {themeColor === "#D0D4D8" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                        <button onClick={() => handleThemeClick("#D9DCDF")} className={"w-10 h-10 flex items-center justify-center"}
                            style={{ backgroundColor: "#D9DCDF" }}>
                            {themeColor === "#D9DCDF" && <CheckIcon className="w-6 h-6 text-white" />}
                        </button>
                    </div>
                </div>
            </div>
        </Card>)
};

export default Theme;