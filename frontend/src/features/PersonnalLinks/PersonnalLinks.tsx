import { useContext } from "react";
import classNames from "classnames";
import Card from "../../components/Card/Card";
import { ResumeContext, ResumeDispatchContext, resumeInfoType } from "../../context/ResumeContext";
import { TrashIcon } from "@heroicons/react/24/solid";

type LinkKeyType = Exclude<keyof resumeInfoType["links"][0], "id">;

const PersonalLinks = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const links = edited ? (resumeBeingEdited as resumeInfoType).links : onGoingResume.links;

    const handleAddLink = () => {
        if (dispatch)
            dispatch({ type: `ADD_LINK${edited ? "_EDITED" : ""}` });
    };

    const handleLinkChange = (key: LinkKeyType, value: string, index: number) => {
        if (dispatch)
            dispatch({ type: `SET_LINK${edited ? "_EDITED" : ""}`, payload: { [key]: value, index } })
    }

    const handleDeleteLink = (index: number) => {
        if (dispatch)
            dispatch({ type: `DELETE_LINK${edited ? "_EDITED" : ""}`, payload: index });
    };

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
                                className="border p-1 rounded-md focus:outline-none border-gray-300"
                                type="text"
                                id={`link-name-${index}`}
                                placeholder="Github"
                                value={links[index].linkName}
                                aria-label={`Link name ${index + 1}`}
                            />
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
                                className="border p-1 rounded-md focus:outline-none border-gray-300"
                                type="text"
                                id={`link-url-${index}`}
                                placeholder="https://github.com/wanderleisilva"
                                value={links[index].linkUrl}
                                aria-label={`Link URL ${index + 1}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-end">
                <button
                    aria-label="Add link"
                    disabled={!links[links.length - 1].linkName}
                    onClick={handleAddLink}
                    className={classNames(
                        "text-lg font-bold text-gray-900 rounded-lg border-solid border-gray-300 border p-2",
                        { "cursor-not-allowed": !links[links.length - 1].linkName },
                        { "hover:bg-gray-400": links[links.length - 1].linkName },
                    )}
                >
                    + Add Link
                </button>
            </div>
        </Card>
    );
};

export default PersonalLinks;