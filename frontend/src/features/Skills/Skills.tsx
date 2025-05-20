import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BulletListTextarea } from "../../components/BulletListTextArea/BulletListTextArea";
import Card from "../../components/Card/Card";
import { ResumeContext, ResumeDispatchContext, resumeInfoType } from "../../context/ResumeContext";

const Skills = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);
    const { t } = useTranslation();

    const skills = edited ? (resumeBeingEdited as resumeInfoType).skills : onGoingResume.skills;

    const handleInputChange = (skills: string[]) => {
        if (dispatch)
            dispatch({ type: `SET_SKILLS${edited ? "_EDITED" : ""}`, payload: { skills: skills } });
    };
    return (
        <Card>
            <div className=" flex flex-col  gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                    {t("form.skills.skills")}
                </h2>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="skills">
                        {t("form.skills.skills_list")}
                    </label>
                    <BulletListTextarea ariaLabel="Skills list" onChange={handleInputChange} name="skills" value={skills} placeholder={t("form.skills.add_skill_placeholder")} />
                </div>
            </div>
        </Card>);
};

export default Skills;