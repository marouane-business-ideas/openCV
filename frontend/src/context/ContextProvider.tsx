/* eslint-disable no-case-declarations */
import { useImmerReducer } from "use-immer";
import uniqid from "uniqid";
import { actionType, defaultContext, resumeInfoType, ResumeContext, ResumeDispatchContext } from "./ResumeContext";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
}

const ContextProvider: React.FC<Props> = ({ children }) => {
    const [state, dispatch] = useImmerReducer((draft: resumeInfoType, action: actionType) => {
        switch (action.type) {
            case "SET_PERSONAL_INFO":
                draft.personalInfo[Object.keys(action.payload)[0] as keyof resumeInfoType["personalInfo"]]
                    = action.payload[Object.keys(action.payload)[0]];
                break;
            case "ADD_WORK_EXPERIENCE":
                draft.workExperience.push({ company: "", jobTitle: "", date: "", description: "", location: "", id: uniqid() });
                break;
            case "DELETE_WORK_EXPERIENCE":
                draft.workExperience.splice(action.payload as number, 1);
                break;
            case "SET_WORK_EXPERIENCE":
                draft.workExperience[action.payload.index][Object.keys(action.payload)[0] as keyof resumeInfoType["workExperience"][0]]
                    = action.payload[Object.keys(action.payload)[0]];
                break;
            case "MOVE_WORK_EXPERIENCE":
                const { index: workExperienceIndex, direction: workExperienceDirection } = action.payload;
                const tempWorkExperience = draft.workExperience[workExperienceIndex];
                if (workExperienceDirection === "up") {
                    draft.workExperience[workExperienceIndex] = draft.workExperience[workExperienceIndex - 1];
                    draft.workExperience[workExperienceIndex - 1] = tempWorkExperience;
                } else {
                    draft.workExperience[workExperienceIndex] = draft.workExperience[workExperienceIndex + 1];
                    draft.workExperience[workExperienceIndex + 1] = tempWorkExperience;
                }
                break;
            case "MOVE_SCHOOL":
                const { index, direction } = action.payload;
                const temp = draft.education[index];
                if (direction === "up") {
                    draft.education[index] = draft.education[index - 1];
                    draft.education[index - 1] = temp;
                } else {
                    draft.education[index] = draft.education[index + 1];
                    draft.education[index + 1] = temp;
                }
                break;
            case "ADD_SCHOOL":
                draft.education.push({ schoolName: "", degree: "", date: "", description: "", id: uniqid() });
                break;
            case "DELETE_SCHOOL":
                draft.education.splice(action.payload as number, 1);
                break;
            case "SET_SCHOOL":
                draft.education[action.payload.index][Object.keys(action.payload)[0] as keyof
                    resumeInfoType["education"][0]] = action.payload[Object.keys(action.payload)[0]];
                break;
            case "SET_SKILLS":
                draft.skills = action.payload.skills;
                break;
            case "ADD_LANGUAGE":
                draft.languages.push({ language: "", level: "", id: uniqid() });
                break;
            case "SET_LANGUAGE":
                draft.languages[action.payload.index] = {
                    language: action.payload.language,
                    level: "",
                    id: draft.languages[action.payload.index].id
                };
                break;
            case "SET_LANGUAGE_PROFICIENCY_LEVEL":
                draft.languages[action.payload.index].level = action.payload.level;
                break;
            case "DELETE_LANGUAGE":
                draft.languages.splice(action.payload as number, 1);
                break;
            case "ADD_LINK":
                draft.links.push({ linkName: "", linkUrl: "", id: uniqid() });
                break;
            case "SET_LINK":
                draft.links[action.payload.index][Object.keys(action.payload)[0] as keyof
                    resumeInfoType["links"][0]] = action.payload[Object.keys(action.payload)[0]];
                break;
            case "DELETE_LINK":
                draft.links.splice(action.payload as number, 1);
                break;
            case "SET_THEME_COLOR":
                draft.themeColor = action.payload;
                break;
            default:
                break;
        }
    }, defaultContext);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("resumeState", JSON.stringify(state));
    }, [state]);

    return (
        <ResumeContext.Provider value={state}>
            <ResumeDispatchContext.Provider value={dispatch}>
                {children}
            </ResumeDispatchContext.Provider>
        </ResumeContext.Provider>
    );
}

export default ContextProvider;