import { useContext } from "react";
import Card from "../../components/Card/Card";
import { resumeInfoType, ResumeContext, ResumeDispatchContext } from "../../context/ResumeContext";
import TextArea from "../../components/TextArea/TextArea";

const Profile = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const personalInfo = edited ? (resumeBeingEdited as resumeInfoType).personalInfo : onGoingResume.personalInfo;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: keyof resumeInfoType["personalInfo"]) => {
        if (dispatch)
            dispatch({ type: `SET_PERSONAL_INFO${edited ? "_EDITED" : ""}`, payload: { [property]: e.target.value } });
    };

    return (
        <Card>
            <div className=" flex flex-col  gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Profile</h2>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="name">Name</label>
                    <input onChange={(e) => handleInputChange(e, "name")}
                        className="border p-1 rounded-md focus:outline-none border-gray-300" type="text"
                        id="name" name="name" required placeholder="Name" value={personalInfo.name} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="title">Title</label>
                    <TextArea id="title" name="title" placeholder="Frontend Developer"
                        onChange={(e) => handleInputChange(e, "title")} value={personalInfo.title} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="summary">Summary</label>
                    <TextArea id="summary" name="summary" placeholder="Conquer the world"
                        onChange={(e) => handleInputChange(e, "summary")} value={personalInfo.summary} />
                </div>
                <div className="flex gap-2 justify-between">
                    <div className="flex flex-col gap-2 w-3/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="email">Email</label>
                        <input onChange={(e) => handleInputChange(e, "email")}
                            className="border p-1 rounded-md focus:outline-none border-gray-300" type="email"
                            id="email" name="email" required placeholder="email@email.com" value={personalInfo.email} />
                    </div>
                    <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="number">Phone Number</label>
                        <input onChange={(e) => handleInputChange(e, "phoneNumber")}
                            className="border p-1 rounded-md focus:outline-none border-gray-300" type="tel"
                            id="number" name="number" required placeholder="+33(0) 6 39 33 33 44" value={personalInfo.phoneNumber} />
                    </div>
                </div>
                <div className="flex gap-2 justify-between">
                    <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="location">Location</label>
                        <input onChange={(e) => handleInputChange(e, "location")}
                            className="border p-1 rounded-md focus:outline-none border-gray-300" type="text"
                            id="location" name="location" required placeholder="Paris, France" value={personalInfo.location} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Profile;