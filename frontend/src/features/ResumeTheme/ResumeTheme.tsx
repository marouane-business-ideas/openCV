import { useContext } from "react";
import Card from "../../components/Card/Card";
import { ResumeDispatchContext } from "../../context/ResumeContext";

const Theme = () => {
    // const { themeColor } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const handleThemeClick = (themeColor: string) => {
        if (dispatch)
            dispatch({ type: "SET_THEME_COLOR", payload: themeColor })
    }
    return (
        <Card>
            <div className=" flex flex-col  gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">THEME</h2>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="skills">Select a color theme for the resume:</label>
                    <div className="flex gap-5 items-center flex-wrap">
                        <button onClick={() => handleThemeClick("#0ea5e9")} className="w-10 h-10" style={{ backgroundColor: "#0ea5e9" }} />
                        <button onClick={() => handleThemeClick("#38bdf8")} className="w-10 h-10" style={{ backgroundColor: "#38bdf8" }} />
                        <button onClick={() => handleThemeClick("#6366f1")} className="w-10 h-10" style={{ backgroundColor: "#6366f1" }} />
                        <button onClick={() => handleThemeClick("#818cf8")} className="w-10 h-10" style={{ backgroundColor: "#818cf8" }} />
                        <button onClick={() => handleThemeClick("#191919")} className="w-10 h-10" style={{ backgroundColor: "#191919" }} />
                        <button onClick={() => handleThemeClick("#6D7278")} className="w-10 h-10" style={{ backgroundColor: "#6D7278" }} />
                        <button onClick={() => handleThemeClick("#8C9399")} className="w-10 h-10" style={{ backgroundColor: "#8C9399" }} />
                        <button onClick={() => handleThemeClick("#C2C3C3")} className="w-10 h-10" style={{ backgroundColor: "#C2C3C3" }} />
                        <button onClick={() => handleThemeClick("#7A6C55")} className="w-10 h-10" style={{ backgroundColor: "#7A6C55" }} />
                        <button onClick={() => handleThemeClick("#877A66")} className="w-10 h-10" style={{ backgroundColor: "#877A66" }} />
                        <button onClick={() => handleThemeClick("#968C77")} className="w-10 h-10" style={{ backgroundColor: "#968C77" }} />
                        <button onClick={() => handleThemeClick("#C2C7CC")} className="w-10 h-10" style={{ backgroundColor: "#C2C7CC" }} />
                        <button onClick={() => handleThemeClick("#D0D4D8")} className="w-10 h-10" style={{ backgroundColor: "#D0D4D8" }} />
                        <button onClick={() => handleThemeClick("#D9DCDF")} className="w-10 h-10" style={{ backgroundColor: "#D9DCDF" }} />
                    </div>
                </div>
            </div>
        </Card>)
};

export default Theme;