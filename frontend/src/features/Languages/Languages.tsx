import { Fragment, useContext } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import Card from "../../components/Card/Card";
import { ResumeContext, ResumeDispatchContext, resumeInfoType } from "../../context/ResumeContext";
import classNames from "classnames";

const Languages = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const languages = edited ? (resumeBeingEdited as resumeInfoType).languages : onGoingResume.languages;

    const handleAddLanguage = () => {
        if (dispatch)
            dispatch({ type: `ADD_LANGUAGE${edited ? "_EDITED" : ""}` });
    };

    const handleLanguageChange = (language: string, index: number) => {
        if (dispatch)
            dispatch({ type: `SET_LANGUAGE${edited ? "_EDITED" : ""}`, payload: { language, index } })
    }

    const handleLanguageProficiencyLevelChange = (level: string, index: number) => {
        if (dispatch)
            dispatch({ type: `SET_LANGUAGE_PROFICIENCY_LEVEL${edited ? "_EDITED" : ""}`, payload: { level, index } })
    }

    const handleDeleteLanguage = (index: number) => {
        if (dispatch)
            dispatch({ type: `DELETE_LANGUAGE${edited ? "_EDITED" : ""}`, payload: index });
    };

    return (
        <Card>
            <div className=" flex flex-col  gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">LANGUAGES</h2>
                {languages.map((language, index) => (
                    <div key={language.id} className="flex flex-col 2x-l:flex-row w-full gap-5 2xl:gap-10">
                        <div className="flex flex-col gap-2 w-2/5">
                            <label className="text-base font-medium text-gray-700" htmlFor={`language-${index}`}>Language</label>
                            <input onChange={(e) => handleLanguageChange(e.target.value, index)}
                                aria-label="Language name"
                                className="border p-1 rounded-md focus:outline-none border-gray-300" type="text"
                                id={`language-${index}`} placeholder="English" value={languages[index].language} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between">
                                <span className="text-base font-medium text-gray-700">Proficiency level:</span>
                                <button className="" onClick={() => handleDeleteLanguage(index)} aria-label="Delete language">
                                    {languages.length > 1 && <TrashIcon className="size-4 text-gray-400" />}
                                </button>
                            </div>
                            <div className="flex gap-3 text-base font-medium flex-wrap">
                                {["native", "fluent", "intermediate", "beginner"].map((level) => (
                                    <Fragment key={level}>
                                        <input
                                            onChange={() => handleLanguageProficiencyLevelChange(level, index)}
                                            type="radio"
                                            id={`${level}-${index}`}
                                            name={`languageProficiencyLevel-${index}`}
                                            value={level}
                                            checked={language.level === level}
                                            aria-label={`${level} proficiency`}
                                        />
                                        <label htmlFor={`${level}-${index}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</label>
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-end">
                <button aria-label="Add language" disabled={!languages[languages.length - 1]?.language} onClick={handleAddLanguage}
                    className={classNames(
                        "text-lg font-bold text-gray-900 rounded-lg border-solid border-gray-300 border p-2",
                        { "cursor-not-allowed": !languages[languages.length - 1]?.language },
                        { "hover:bg-gray-400": languages[languages.length - 1]?.language }
                    )}>+ Add Language</button>
            </div>
        </Card >)
};

export default Languages