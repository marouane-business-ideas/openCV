import DOMPurify from "isomorphic-dompurify";

import type { resumeInfoType } from "../../context/ResumeContext";

const firstColumnWidth = "115pt";
const rowGap = "30pt";

const Styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "15pt",
        padding: "0 15pt 15pt 15pt",
    },
    personnalInfoContainer: {
        padding: "10pt",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "5pt",
    },
    personnalInfoName: {
        fontSize: "20px",
        fontWeight: 900,
    },
    personnalTitle: {
        fontSize: "16px",
        fontWeight: 500,
    },
    personnalInfoAdresses: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "8pt",
        fontSize: "12pt",
        borderTop: "1pt solid black",
        borderBottom: "1pt solid black",
        padding: "5pt 0",
    },
    resumeContentContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "15pt",
    },
    link: {
        color: "black",
        textDecoration: "none",
    },
    section: {
        display: "flex",
        flexDirection: "column",
    },
    sectionRow: {
        display: "flex",
        flexDirection: "row",
        gap: rowGap,
    },
    SectionTitle: {
        fontSize: "16px",
        fontWeight: 500,
        width: firstColumnWidth,
        minWidth: firstColumnWidth,
        maxWidth: firstColumnWidth,

    },
    SectionText: {
        fontSize: "12pt",
        width: `calc(100% - ${firstColumnWidth} - ${rowGap})`,
        maxWidth: `calc(100% - ${firstColumnWidth} - ${rowGap})`,
        minHeight: `calc(100% - ${firstColumnWidth} - ${rowGap})`,
    },
    experienceDate: {
        fontSize: "12pt",
        minWidth: firstColumnWidth,
    },
    experienceTopSection: {
        display: "flex",
        flexDirection: "column",
        gap: "3pt",
        alignItems: "flex-start",
    }
};

const SectionTitle = ({ children, themeColor }: { children: string, themeColor: string }) => {
    return (
        <div style={{ ...Styles.SectionTitle, color: themeColor }} >{children}</div>
    );
}

const SectionText = ({ children }: { children: string }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(children) }} style={Styles.SectionText} />
    );
}

const ExperienceDate = ({ children, themeColor }: { children: string, themeColor: string }) => {
    return (
        <div style={{ ...Styles.experienceDate, color: themeColor }}>{children}</div>
    );
}

const ExperienceTopSection = ({ children }: { children: JSX.Element[] }) => {
    return (
        <div style={Styles.experienceTopSection}>{children}</div>
    );
}


const Preview = (props: { resume: resumeInfoType }) => {
    const { personalInfo, workExperience, education, skills, languages, links, themeColor } = props.resume;
    return (
        <div>
            <div style={Styles.pageContainer}>
                <div style={Styles.personnalInfoContainer}>
                    <div style={{ ...Styles.personnalInfoName, color: themeColor }}>{personalInfo.name}</div>
                    <div style={{ ...Styles.personnalTitle, color: themeColor }}>{personalInfo.title}</div>
                </div>
                <div style={{
                    ...Styles.personnalInfoAdresses,
                    color: themeColor,
                    borderTop: `1pt solid ${themeColor}`,
                    borderBottom: `1pt solid ${themeColor}`
                }}>
                    <div style={{ fontSize: "12pt" }}>{personalInfo.location}</div>
                    <div style={{ fontSize: 12 }}>•</div>
                    <div>{personalInfo.phoneNumber}</div>
                    <div style={{ fontSize: 12 }}>•</div>
                    <a style={{ ...Styles.link, color: themeColor }} href={`mailto:${personalInfo.email}`}>
                        {personalInfo.email}
                    </a>
                </div>
                <div style={Styles.resumeContentContainer}>
                    <div style={Styles.sectionRow}>
                        <SectionTitle themeColor={themeColor}>PROFILE</SectionTitle>
                        <SectionText>{personalInfo.summary}</SectionText>
                    </div>
                    <div style={Styles.sectionRow}>
                        <SectionTitle themeColor={themeColor}>EXPERIENCE</SectionTitle>
                    </div>
                    {workExperience.map((job, index) => (
                        <div key={`${index}-${job.date}-${job.company}`} style={{ ...Styles.sectionRow, marginTop: `${index === 0 ? "10pt" : "0"}` }}>
                            <ExperienceDate themeColor={themeColor}>{job.date}</ExperienceDate>
                            <ExperienceTopSection>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5pt" }}>
                                    <div style={{ fontSize: "12pt", fontWeight: 900 }}>{job.company}</div>
                                    <div style={{ fontSize: "12pt", fontWeight: 900 }}>•</div>
                                    <div style={{ fontSize: "12pt", fontWeight: 900 }}>{job.location}</div>
                                </div>
                                <div style={{ fontSize: "12pt", fontStyle: "italic" }}>{job.jobTitle}</div>
                                <div style={{ marginTop: "10pt" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }} />
                            </ExperienceTopSection>
                        </div>
                    ))}
                    <div style={Styles.sectionRow}>
                        <SectionTitle themeColor={themeColor}>EDUCATION</SectionTitle>
                    </div>
                    {education.map((school, index) => (
                        <div key={`${index}-${school.date}-${school.schoolName}`} style={{
                            ...Styles.sectionRow,
                            marginTop: `${index === 0 ? "10pt" : "0"}`
                        }}>
                            <ExperienceDate themeColor={themeColor}>{school.date}</ExperienceDate>
                            <ExperienceTopSection>
                                <div style={{ display: "flex", flexDirection: "row", gap: "5pt" }}>
                                    <div style={{ fontSize: "12pt", fontWeight: 900 }}>{school.schoolName}</div>
                                </div>
                                <div style={{ fontSize: "12pt", fontStyle: "italic" }}>{school.degree}</div>
                                <div style={{ marginTop: "10pt" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(school.description) }} />
                            </ExperienceTopSection>
                        </div>
                    ))}
                    <div style={Styles.sectionRow}>
                        <SectionTitle themeColor={themeColor}>SKILLS</SectionTitle>
                        <div style={{ fontWeight: "900" }}>
                            {skills.map((skill, index) => (
                                <span key={`${skill}-${index}`} style={{ fontSize: "12pt" }}>
                                    {skill}{index !== skills.length - 1 ? ", " : ""}
                                </span>))}
                        </div>
                    </div>
                    <div style={Styles.sectionRow}>
                        <SectionTitle themeColor={themeColor}>LANGUAGES</SectionTitle>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5pt", flexWrap: "wrap" }}>
                            {languages.map((language, index) => (
                                <div key={language.id} style={{ fontSize: "12pt", display: "flex", gap: "3pt" }}>
                                    <span>{language.language}</span>
                                    <span>({language.level})</span>
                                    <span style={{ fontWeight: "900", marginLeft: "2pt" }} >{index !== languages.length - 1 ? "•" : ""}</span>
                                </div>))
                            }
                        </div>
                    </div>
                    <div style={Styles.sectionRow}>
                        <SectionTitle themeColor={themeColor}>PERSONAL LINKS</SectionTitle>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5pt", flexWrap: "wrap" }}>
                            {links.map((link, index) => (
                                <div key={link.id} style={{ fontSize: "12pt", display: "flex", gap: "3pt" }}>
                                    <a style={Styles.link} target="_blank" href={link.linkUrl} >{link.linkName}</a>
                                    <span style={{ fontWeight: "900", marginLeft: "2pt" }} >{index !== links.length - 1 ? "•" : ""}</span>
                                </div>))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preview