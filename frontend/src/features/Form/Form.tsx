import Profile from "../Profile/Profile"
import WorkExperience from "../WorkExperience/WorkExperience"
import Education from "../Education/Education"
import Skills from "../Skills/Skills"
import Languages from "../Languages/Languages"
import PersonnalLinks from "../PersonnalLinks/PersonnalLinks"
import Theme from "../ResumeTheme/ResumeTheme"

const Form = () => {
    return (
        <div className="h-full w-1/2 p-5 flex flex-col gap-5 overflow-scroll">
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