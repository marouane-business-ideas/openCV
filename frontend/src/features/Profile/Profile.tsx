import { useContext } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/Card/Card";
import { resumeInfoType, ResumeContext, ResumeDispatchContext } from "../../context/ResumeContext";
import TextArea from "../../components/TextArea/TextArea";
import RichTextEditor from "../../components/RichTextEditor/LazyRichTextEditor";

const Profile = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);
    const { t } = useTranslation();

    const personalInfo = edited ? (resumeBeingEdited as resumeInfoType).personalInfo : onGoingResume.personalInfo;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: keyof resumeInfoType["personalInfo"]) => {
        // Validate phone number input: only allow digits and + at the beginning
        if (property === "phoneNumber") {
            const isValid = /^\+?\d*$/.test(e.target.value);
            if (!isValid) {
                // Prevent invalid characters from being entered
                return;
            }
        }
        
        if (dispatch)
            dispatch({ type: `SET_PERSONAL_INFO${edited ? "_EDITED" : ""}`, payload: { [property]: e.target.value } });
    };

    return (
        <Card>
            <div className=" flex flex-col  gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t("form.profile.profile")}</h2>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="name">{t("form.profile.name")}</label>
                    <input onChange={(e) => handleInputChange(e, "name")}
                        className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="text"
                        id="name" name="name" required placeholder="Name" value={personalInfo.name} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="title">{t("form.profile.title")}</label>
                    <TextArea id="title" name="title" placeholder="Frontend Developer"
                        onChange={(e) => handleInputChange(e, "title")} value={personalInfo.title} />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-base font-medium text-gray-700">{t("form.profile.summary")}</span>
                    <RichTextEditor id="summary" ariaLabel={t("form.profile.summary")} placeholder="Conquer the world" value={personalInfo.summary}
                        onChange={(summary) => dispatch?.({ type: `SET_PERSONAL_INFO${edited ? "_EDITED" : ""}`, payload: { summary } })} />
                </div>
                <div className="flex gap-2 justify-between">
                    <div className="flex flex-col gap-2 w-3/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="email">{t("form.profile.email")}</label>
                        <input onChange={(e) => handleInputChange(e, "email")}
                            className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="email"
                            id="email" name="email" required placeholder="email@email.com" value={personalInfo.email} />
                    </div>
                    <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="number">{t("form.profile.phone_number")}</label>
                        <input onChange={(e) => handleInputChange(e, "phoneNumber")}
                            className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="tel"
                            id="number" name="number" required placeholder="+33(0) 6 39 33 33 44" value={personalInfo.phoneNumber} />
                    </div>
                </div>
                <div className="flex gap-2 justify-between">
                    <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="location">{t("form.profile.location")}</label>
                        <input onChange={(e) => handleInputChange(e, "location")}
                            className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="text"
                            id="location" name="location" required placeholder="Paris, France" value={personalInfo.location} />
                    </div>
                    <div className="flex flex-col gap-2 w-3/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="nationality">{t("form.profile.nationality")}</label>
                        <input onChange={(e) => handleInputChange(e, "nationality")}
                            className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="text"
                            id="nationality" name="nationality" placeholder="American" value={personalInfo.nationality} />
                    </div>
                </div>
                <div className="flex gap-2 justify-between items-end">
                    <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="birthDate">{t("form.profile.birth_date")}</label>
                        <input onChange={(e) => handleInputChange(e, "birthDate")}
                            className="border p-1 rounded-md focus:outline-hidden border-gray-300" type="date"
                            id="birthDate" name="birthDate" aria-describedby="birthDate-hint" value={personalInfo.birthDate ?? ""} />
                    </div>
                    <p id="birthDate-hint" className="w-3/5 pb-1 text-sm text-gray-500">{t("form.profile.birth_date_hint")}</p>
                </div>
            </div>
        </Card>
    );
};

export default Profile;