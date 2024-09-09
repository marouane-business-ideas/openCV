import { useContext, useState } from "react";
import classNames from "classnames";
import Card from "../../components/Card/Card";
import { ResumeContext, ResumeDispatchContext, resumeInfoType } from "../../context/ResumeContext";
import { TrashIcon } from "@heroicons/react/24/solid";

type LinkKeyType = Exclude<keyof resumeInfoType["links"][0], "id">;

const PersonalLinks = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const links = edited ? (resumeBeingEdited as resumeInfoType).links : onGoingResume.links;

    const [errors, setErrors] = useState<{ [key: number]: { [key: string]: string } }>({});
    const [touchedFields, setTouchedFields] = useState<{ [key: number]: { [key: string]: boolean } }>({});

    const isValidUrl = (url: string) => {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(url);
    };

    const validateField = (property: string, value: string, index: number) => {
        if (index === 0 && links.length === 1) {
            // For the default link, only validate if both fields are non-empty
            if (value.trim() === "") return "";
            if (property === "linkUrl" && !isValidUrl(value)) {
                return "Please enter a valid URL";
            }
            return "";
        }
        if (property === "linkName" && value.trim() === "") {
            return "Link name is required";
        }
        if (property === "linkUrl") {
            if (value.trim() === "") {
                return "Link URL is required";
            }
            if (!isValidUrl(value)) {
                return "Please enter a valid URL";
            }
        }
        return "";
    };

    const validateLink = (link: resumeInfoType["links"][0], index: number) => {
        if (index === 0 && links.length === 1) {
            if (link.linkName.trim() === "" && link.linkUrl.trim() === "") return true;
            return link.linkName.trim() !== "" && isValidUrl(link.linkUrl);
        }
        return (
            link.linkName.trim() !== "" &&
            link.linkUrl.trim() !== "" &&
            isValidUrl(link.linkUrl)
        );
    };

    const handleLinkChange = (key: LinkKeyType, value: string, index: number) => {
        if (dispatch) {
            dispatch({ type: `SET_LINK${edited ? "_EDITED" : ""}`, payload: { [key]: value, index } });
        }

        if (touchedFields[index] && touchedFields[index][key]) {
            const error = validateField(key, value, index);
            setErrors(prev => ({
                ...prev,
                [index]: { ...prev[index], [key]: error }
            }));
        }

        // Check validity of the current link
        const currentLink = { ...links[index], [key]: value };
        const isLinkValid = validateLink(currentLink, index);

        // Update link validity
        if (dispatch) {
            dispatch({
                type: `SET_LINK_VALIDITY${edited ? "_EDITED" : ""}`,
                payload: { index, isValid: isLinkValid }
            });
        }
    };

    const handleBlur = (property: "linkName" | "linkUrl", index: number) => {
        setTouchedFields(prev => ({
            ...prev,
            [index]: { ...prev[index], [property]: true }
        }));
        const value = links[index][property];
        const error = validateField(property, value, index);
        setErrors(prev => ({
            ...prev,
            [index]: { ...prev[index], [property]: error }
        }));

        // Check validity of the current link
        const currentLink = links[index];
        const isLinkValid = validateLink(currentLink, index);

        // Update link validity
        if (dispatch) {
            dispatch({
                type: `SET_LINK_VALIDITY${edited ? "_EDITED" : ""}`,
                payload: { index, isValid: isLinkValid }
            });
        }
    };

    const canAddNewLink = () => {
        if (links.length === 1) {
            // For the initial default link, allow adding if it's empty or valid
            return links[0].linkName.trim() !== "" && isValidUrl(links[0].linkUrl);
        }
        // For additional links, the last link must be valid
        return links[links.length - 1].isValid;
    };

    const handleAddLink = () => {
        if (canAddNewLink()) {
            if (dispatch) {
                dispatch({ type: `ADD_LINK${edited ? "_EDITED" : ""}` });
            }
        } else {
            console.log("Please complete the current link before adding a new one.");
        }
    };

    const handleDeleteLink = (index: number) => {
        if (dispatch) {
            dispatch({ type: `DELETE_LINK${edited ? "_EDITED" : ""}`, payload: index });
        }

        // Clean up errors and touchedFields for the deleted link
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[index];
            return newErrors;
        });
        setTouchedFields(prev => {
            const newTouchedFields = { ...prev };
            delete newTouchedFields[index];
            return newTouchedFields;
        });
    };

    const inputClassName = (value: string, index: number, fieldName: string) => `
        border p-1 rounded-md focus:outline-none
        ${touchedFields[index] && touchedFields[index][fieldName] && errors[index]?.[fieldName]
            ? "border-red-500 border-2"
            : "border-gray-300"
        }
    `;

    return (
        <Card>
            <div className="flex flex-col gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Personal Links</h2>
                {links.map((link, index) => (
                    <div key={link.id} className="flex w-full gap-10">
                        <div className="flex flex-col gap-2 w-2/5">
                            <label className="text-base font-medium text-gray-700" htmlFor={`link-name-${index}`}>Name</label>
                            <input
                                onChange={(e) => handleLinkChange("linkName", e.target.value, index)}
                                onBlur={() => handleBlur("linkName", index)}
                                className={inputClassName(link.linkName, index, "linkName")}
                                type="text"
                                id={`link-name-${index}`}
                                placeholder="Github"
                                value={link.linkName}
                                aria-label={`Link name ${index + 1}`}
                            />
                            {errors[index]?.linkName && touchedFields[index]?.linkName && (
                                <span className="text-red-500 text-sm">{errors[index].linkName}</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 w-2/5">
                            <div className="flex justify-between">
                                <label className="text-base font-medium text-gray-700" htmlFor={`link-url-${index}`}>Link URL</label>
                                {links.length > 1 && (
                                    <button onClick={() => handleDeleteLink(index)} aria-label="Delete link">
                                        <TrashIcon className="size-4 text-gray-400" />
                                    </button>
                                )}
                            </div>
                            <input
                                onChange={(e) => handleLinkChange("linkUrl", e.target.value, index)}
                                onBlur={() => handleBlur("linkUrl", index)}
                                className={inputClassName(link.linkUrl, index, "linkUrl")}
                                type="text"
                                id={`link-url-${index}`}
                                placeholder="https://github.com/username"
                                value={link.linkUrl}
                                aria-label={`Link URL ${index + 1}`}
                            />
                            {errors[index]?.linkUrl && touchedFields[index]?.linkUrl && (
                                <span className="text-red-500 text-sm">{errors[index].linkUrl}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-end">
                <button
                    aria-label="Add link"
                    disabled={!canAddNewLink()}
                    onClick={handleAddLink}
                    className={classNames(
                        "text-lg font-bold text-gray-900 rounded-lg border-solid border-gray-300 border p-2",
                        { "cursor-not-allowed": !canAddNewLink() },
                        { "hover:bg-gray-400": canAddNewLink() }
                    )}
                >
                    + Add Link
                </button>
            </div>
        </Card>
    );
};

export default PersonalLinks;