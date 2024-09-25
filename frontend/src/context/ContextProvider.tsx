/* eslint-disable no-case-declarations */
import { useImmerReducer } from "use-immer";
import uniqid from "uniqid";
import { actionType, defaultContext, resumeInfoType, ResumeContext, ResumeDispatchContext, contextStateType } from "./ResumeContext";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
}

const ContextProvider: React.FC<Props> = ({ children }) => {
    const [state, dispatch] = useImmerReducer((draft: contextStateType, action: actionType) => {
        switch (action.type) {
            case "SET_EDITED_RESUME":
                draft.resumeBeingEdited = action.payload;
                break;
            case "SET_PERSONAL_INFO":
                draft.onGoingResume.personalInfo[Object.keys(action.payload)[0] as keyof resumeInfoType["personalInfo"]]
                    = action.payload[Object.keys(action.payload)[0]];
                break;
            case "ADD_WORK_EXPERIENCE":
                draft.onGoingResume.workExperience.push({ company: "", jobTitle: "", date: "", description: "", location: "", id: uniqid() });
                break;
            case "DELETE_WORK_EXPERIENCE":
                draft.onGoingResume.workExperience.splice(action.payload as number, 1);
                break;
            case "SET_WORK_EXPERIENCE":
                draft.onGoingResume.workExperience[action.payload.index][Object.keys(action.payload)[0] as keyof resumeInfoType["workExperience"][0]]
                    = action.payload[Object.keys(action.payload)[0]];
                break;
            case "MOVE_WORK_EXPERIENCE":
                const { index: workExperienceIndex, direction: workExperienceDirection } = action.payload;
                const tempWorkExperience = draft.onGoingResume.workExperience[workExperienceIndex];
                if (workExperienceDirection === "up") {
                    draft.onGoingResume.workExperience[workExperienceIndex] = draft.onGoingResume.workExperience[workExperienceIndex - 1];
                    draft.onGoingResume.workExperience[workExperienceIndex - 1] = tempWorkExperience;
                } else {
                    draft.onGoingResume.workExperience[workExperienceIndex] = draft.onGoingResume.workExperience[workExperienceIndex + 1];
                    draft.onGoingResume.workExperience[workExperienceIndex + 1] = tempWorkExperience;
                }
                break;
            case "MOVE_SCHOOL":
                const { index, direction } = action.payload;
                const temp = draft.onGoingResume.education[index];
                if (direction === "up") {
                    draft.onGoingResume.education[index] = draft.onGoingResume.education[index - 1];
                    draft.onGoingResume.education[index - 1] = temp;
                } else {
                    draft.onGoingResume.education[index] = draft.onGoingResume.education[index + 1];
                    draft.onGoingResume.education[index + 1] = temp;
                }
                break;
            case "ADD_SCHOOL":
                draft.onGoingResume.education.push({ schoolName: "", degree: "", date: "", description: "", id: uniqid() });
                break;
            case "DELETE_SCHOOL":
                draft.onGoingResume.education.splice(action.payload as number, 1);
                break;
            case "SET_SCHOOL":
                draft.onGoingResume.education[action.payload.index][Object.keys(action.payload)[0] as keyof
                    resumeInfoType["education"][0]] = action.payload[Object.keys(action.payload)[0]];
                break;
            case "SET_SKILLS":
                draft.onGoingResume.skills = action.payload.skills;
                break;
            case "ADD_LANGUAGE":
                draft.onGoingResume.languages.push({ language: "", level: "", id: uniqid() });
                break;
            case "SET_LANGUAGE":
                draft.onGoingResume.languages[action.payload.index] = {
                    language: action.payload.language,
                    level: draft.onGoingResume.languages[action.payload.index].level,
                    id: draft.onGoingResume.languages[action.payload.index].id
                };
                break;
            case "SET_LANGUAGE_PROFICIENCY_LEVEL":
                draft.onGoingResume.languages[action.payload.index].level = action.payload.level;
                break;
            case "DELETE_LANGUAGE":
                draft.onGoingResume.languages.splice(action.payload as number, 1);
                break;
            case "ADD_LINK":
                draft.onGoingResume.links.push({ linkName: "", linkUrl: "", id: uniqid() });
                break;
            case "SET_LINK":
                draft.onGoingResume.links[action.payload.index][Object.keys(action.payload)[0] as keyof
                    resumeInfoType["links"][0]] = action.payload[Object.keys(action.payload)[0]];
                break;
            case "DELETE_LINK":
                draft.onGoingResume.links.splice(action.payload as number, 1);
                break;
            case "SET_THEME_COLOR":
                draft.onGoingResume.themeColor = action.payload;
                break;
            case "SET_TEMPLATE":
                draft.onGoingResume.resumeTemplate = action.payload;
                break;
            case "SET_PERSONAL_INFO_EDITED":
                draft.resumeBeingEdited.personalInfo[Object.keys(action.payload)[0] as keyof resumeInfoType["personalInfo"]]
                    = action.payload[Object.keys(action.payload)[0]];
                break;
            case "ADD_WORK_EXPERIENCE_EDITED":
                draft.resumeBeingEdited.workExperience.push({ company: "", jobTitle: "", date: "", description: "", location: "", id: uniqid() });
                break;
            case "DELETE_WORK_EXPERIENCE_EDITED":
                draft.resumeBeingEdited.workExperience.splice(action.payload as number, 1);
                break;
            case "SET_WORK_EXPERIENCE_EDITED":
                draft.
                    resumeBeingEdited.
                    workExperience[action.payload.index][Object.keys(action.payload)[0] as keyof resumeInfoType["workExperience"][0]]
                    = action.payload[Object.keys(action.payload)[0]];
                break;
            case "MOVE_WORK_EXPERIENCE_EDITED":
                const { index: workExperienceIndexEdited, direction: workExperienceDirectionEdited } = action.payload;
                const tempWorkExperienceEdited = draft.resumeBeingEdited.workExperience[workExperienceIndexEdited];
                if (workExperienceDirectionEdited === "up") {
                    draft.resumeBeingEdited.workExperience[workExperienceIndexEdited]
                        = draft.resumeBeingEdited.workExperience[workExperienceIndexEdited - 1];
                    draft.resumeBeingEdited.workExperience[workExperienceIndexEdited - 1] = tempWorkExperienceEdited;
                } else {
                    draft.resumeBeingEdited.workExperience[workExperienceIndexEdited]
                        = draft.resumeBeingEdited.workExperience[workExperienceIndexEdited + 1];
                    draft.resumeBeingEdited.workExperience[workExperienceIndexEdited + 1] = tempWorkExperienceEdited;
                }
                break;
            case "MOVE_SCHOOL_EDITED":
                const { index: indexEdited, direction: directionEdited } = action.payload;
                const tempEdited = draft.resumeBeingEdited.education[indexEdited];
                if (directionEdited === "up") {
                    draft.resumeBeingEdited.education[indexEdited] = draft.resumeBeingEdited.education[indexEdited - 1];
                    draft.resumeBeingEdited.education[indexEdited - 1] = tempEdited;
                } else {
                    draft.resumeBeingEdited.education[indexEdited] = draft.resumeBeingEdited.education[indexEdited + 1];
                    draft.resumeBeingEdited.education[indexEdited + 1] = tempEdited;
                }
                break;
            case "ADD_SCHOOL_EDITED":
                draft.resumeBeingEdited.education.push({ schoolName: "", degree: "", date: "", description: "", id: uniqid() });
                break;
            case "DELETE_SCHOOL_EDITED":
                draft.resumeBeingEdited.education.splice(action.payload as number, 1);
                break;
            case "SET_SCHOOL_EDITED":
                draft.resumeBeingEdited.education[action.payload.index][Object.keys(action.payload)[0] as keyof
                    resumeInfoType["education"][0]] = action.payload[Object.keys(action.payload)[0]];
                break;
            case "SET_SKILLS_EDITED":
                draft.resumeBeingEdited.skills = action.payload.skills;
                break;
            case "ADD_LANGUAGE_EDITED":
                draft.resumeBeingEdited.languages.push({ language: "", level: "", id: uniqid() });
                break;
            case "SET_LANGUAGE_EDITED":
                draft.resumeBeingEdited.languages[action.payload.index] = {
                    language: action.payload.language,
                    level: draft.resumeBeingEdited.languages[action.payload.index].level,
                    id: draft.resumeBeingEdited.languages[action.payload.index].id
                };
                break;
            case "SET_LANGUAGE_PROFICIENCY_LEVEL_EDITED":
                draft.resumeBeingEdited.languages[action.payload.index].level = action.payload.level;
                break;
            case "DELETE_LANGUAGE_EDITED":
                draft.resumeBeingEdited.languages.splice(action.payload as number, 1);
                break;
            case "ADD_LINK_EDITED":
                draft.resumeBeingEdited.links.push({ linkName: "", linkUrl: "", id: uniqid() });
                break;
            case "SET_LINK_EDITED":
                draft.resumeBeingEdited.links[action.payload.index][Object.keys(action.payload)[0] as keyof
                    resumeInfoType["links"][0]] = action.payload[Object.keys(action.payload)[0]];
                break;
            case "DELETE_LINK_EDITED":
                draft.resumeBeingEdited.links.splice(action.payload as number, 1);
                break;
            case "SET_THEME_COLOR_EDITED":
                draft.resumeBeingEdited.themeColor = action.payload;
                break;
            case "SET_TEMPLATE_EDITED":
                draft.resumeBeingEdited.resumeTemplate = action.payload;
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