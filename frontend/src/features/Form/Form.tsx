import Profile from "../Profile/Profile"
import WorkExperience from "../WorkExperience/WorkExperience"
import Education from "../Education/Education"
import Skills from "../Skills/Skills"
import Languages from "../Languages/Languages"
import PersonnalLinks from "../PersonnalLinks/PersonnalLinks"
import Theme from "../ResumeTheme/ResumeTheme"

const Form = () => {
    return (
        <div className="h-1/2 2xl:h-full w-5/6 2xl:w-1/2 p-5 flex flex-col gap-5 overflow-y-scroll">
            <Profile />
            <WorkExperience />
            <Education />
            <Skills />
            <Languages />
            <PersonnalLinks />
            <Theme />
        </div>
    )
}

export default Form