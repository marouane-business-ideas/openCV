/* eslint-disable max-len */
import React from "react";
import DOMPurify from "isomorphic-dompurify";
import { useTranslation } from "react-i18next";

import { languageLevelLabel } from "../../utils/languageLevel";
import Schemify, { withoutScheme } from "../../utils/schemify";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { ResumeTemplateProps } from "../../Types/CommonTypes";

const Styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "0px 60px",
    },
    personnalInfoContainer: {
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "5px",
    },
    personnalInfoName: {
        fontSize: "24px",
        textTransform: "uppercase",
        fontWeight: 900,
    },
    personnalTitle: {
        fontSize: "14px",
        letterSpacing: "0.10em",
        fontWeight: 500,
    },
    personnalInfoAdresses: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        fontSize: "14px",
        letterSpacing: "0.4px",
    },
    resumeContentContainer: {
        marginTop: "20px",
        display: "grid",
        // The columns keep their width whatever the content: a word longer than its column is broken instead of
        // widening the column (which would squeeze the other one)
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 3fr)",
        gridColumnGap: "0px",
        overflowWrap: "anywhere",
    },

    sectionColumnLeft: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",

    },
    sectionColumnRight: {
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        flex: 1,
    },
    link: {
        color: "black",
    },
    SectionTitle: {
        display: "flex",
        alignItems: "center",
        fontSize: "16px",
        fontWeight: 900,
        letterSpacing: "0.10em",

    },
    SectionTextRow: {
        fontSize: "14px",
        letterSpacing: "0.175px",
    },
    SectionTextColumn: {
        display: "flex",
        flexDirection: "column",
        fontSize: "14px",
        letterSpacing: "0.175px",
        gap: "5px",
        alignItems: "center",
        // An entry longer than the column wraps: its lines are centered too
        textAlign: "center",
    },
    experienceDate: {
        fontSize: "14px",
        letterSpacing: "0.175px",
        fontStyle: "italic",
        display: "flex",
    }
};

const SectionTitle = ({ children, customStyle }: { children: React.ReactNode, customStyle?: React.CSSProperties }) => {
    return (
        <div style={{ ...Styles.SectionTitle, ...customStyle }} >{children}</div>
    );
};

const SectionTextRow = ({ children, customStyle }: { children: string, customStyle?: React.CSSProperties }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(children) }} style={{ ...Styles.SectionTextRow, ...customStyle }} />
    );
};

const SectionTextColumn = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={Styles.SectionTextColumn} >{children}</div>
    );
};

const ExperienceDate = ({ children }: { children: string }) => {
    return (
        <div style={{ ...Styles.experienceDate }}>
            <span className="w-6 flex justify-center items-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                    className="icon-custom fill-current flex-none inline-flex"
                    style={{ height: "1rem", width: "0.875rem", marginRight: "5px" }}>
                    <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" data-v-9d11e1e2="" />
                </svg>
            </span>
            {children}
        </div>
    );
};


const ProfessionalTemplate = ({
    resume,
    customStyle,
    customClassName,
    customThemeColor,
    inert = true
}: ResumeTemplateProps) => {
    const { t } = useTranslation();

    const { personalInfo, workExperience, education, skills, languages, links, themeColor: tempThemeColor } = resume;
    const themeColor = customThemeColor ?? tempThemeColor;

    // The form keeps empty entries: a section without any filled entry isn't shown
    const filledSkills = skills.filter((skill) => skill.trim());
    const filledLanguages = languages.filter((language) => language.language.trim());
    const filledLinks = links.filter((link) => link.linkName || link.linkUrl);

    return (
        <div inert={inert} className={customClassName} style={{ ...Styles.pageContainer, ...customStyle, color: themeColor }}>
            <div style={Styles.personnalInfoContainer}>
                <div style={{ ...Styles.personnalInfoName }}>{personalInfo.name}</div>
                <div style={{ ...Styles.personnalTitle }}>
                    <div style={{
                        ...Styles.personnalInfoAdresses
                    }}>
                        {/* Only the title is in capitals: the location and the phone number keep the case they were typed in */}
                        {personalInfo.title && <span style={{ textTransform: "uppercase" }}>{personalInfo.title}</span>}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <svg style={{ height: "12px", width: "12px" }} xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642
                         4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <div>{personalInfo.location}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <svg style={{ height: "12px", width: "12px" }} xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25
                         0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25
                         0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                            <div>{formatPhoneNumber(personalInfo.phoneNumber)}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={Styles.resumeContentContainer}>
                <div style={Styles.sectionColumnLeft}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <SectionTitle>
                                <div style={{
                                    width: "2px", height: "2px", borderRadius: "50%", border: `2px solid ${themeColor}`,
                                    marginRight: "5px"
                                }} />
                                {t("resume.details")}
                                <div style={{
                                    width: "2px", height: "2px", borderRadius: "50%", border: `2px solid ${themeColor}`,
                                    marginLeft: "5px"
                                }} />
                            </SectionTitle>
                        </div>
                        <SectionTextColumn>
                            <span style={{ lineBreak: "anywhere" }} >{personalInfo.location}</span>
                            <span style={{ lineBreak: "anywhere" }} >{formatPhoneNumber(personalInfo.phoneNumber)}</span>
                            <a style={{ ...Styles.link, lineBreak: "anywhere", color: themeColor, }} href={`mailto:${personalInfo.email}`}>
                                {personalInfo.email}
                            </a>
                            {personalInfo.nationality && <span style={{ lineBreak: "anywhere" }} >{t("resume.nationality", { nationality: personalInfo.nationality })}</span>}
                        </SectionTextColumn>
                    </div>
                    {filledLinks.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <SectionTitle>
                                    <div style={{
                                        width: "2px", height: "2px", borderRadius: "50%", border: `2px solid ${themeColor}`,
                                        marginRight: "5px"
                                    }} />
                                    {t("resume.links")}
                                    <div style={{
                                        width: "2px", height: "2px", borderRadius: "50%", border: `2px solid ${themeColor}`,
                                        marginLeft: "5px"
                                    }} />
                                </SectionTitle>
                            </div>
                            <SectionTextColumn>
                                {filledLinks.map((link) => (
                                    <div key={link.id}
                                        style={{ lineBreak: "anywhere" }}
                                    >
                                        <a style={{ ...Styles.link, color: themeColor }} target="_blank" href={Schemify(link.linkUrl, "https")} >{withoutScheme(link.linkName || link.linkUrl)}</a>
                                    </div>))
                                }
                            </SectionTextColumn>
                        </div>
                    )}
                    {filledLanguages.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <SectionTitle>
                                    <div style={{
                                        width: "2px", height: "2px", borderRadius: "50%", border: `2px solid ${themeColor}`,
                                        marginRight: "5px"
                                    }} />
                                    {t("resume.languages")}
                                    <div style={{
                                        width: "2px", height: "2px", borderRadius: "50%", border: `2px solid ${themeColor}`,
                                        marginLeft: "5px"
                                    }} />
                                </SectionTitle>
                            </div>
                            <SectionTextColumn>
                                {filledLanguages.map((language) => (
                                    <div key={language.id} style={{ display: "flex", gap: "3px" }}>
                                        <span>{language.language}</span>
                                        {language.level && <span>({languageLevelLabel(language.level, t)})</span>}
                                    </div>))
                                }
                            </SectionTextColumn>
                        </div>
                    )}
                    {filledSkills.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <SectionTitle>
                                    <div style={{
                                        width: "2px", height: "2px", borderRadius: "50%", border: `2px solid ${themeColor}`,
                                        marginRight: "5px"
                                    }} />
                                    {t("resume.skills")}
                                    <div style={{
                                        width: "2px", height: "2px", borderRadius: "50%", border: `2px solid ${themeColor}`,
                                        marginLeft: "5px"
                                    }} />
                                </SectionTitle>
                            </div>
                            <SectionTextColumn>
                                {filledSkills.map((skill, index) => (
                                    <span key={`${skill}-${index}`}>
                                        {skill}
                                    </span>))}
                            </SectionTextColumn>
                        </div>
                    )}
                </div>
                <div style={Styles.sectionColumnRight}>
                    <div style={{ display: "flex", flexDirection: "column", }}>
                        <SectionTitle customStyle={{ gap: "30px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="currentColor" style={{ height: "14px", width: "14px", marginLeft: "1px" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            {t("resume.profile")}
                        </SectionTitle>
                        <div
                            style={{
                                borderLeft: `2px solid ${themeColor}`,
                                marginLeft: "7px",
                                paddingLeft: "34px",
                                position: "relative",
                            }}
                        >
                            <div style={{ height: "15px" }} />
                            <div style={{
                                width: "4px",
                                height: "4px",
                                borderRadius: "50%",
                                border: `2px solid ${themeColor}`,
                                position: "absolute",
                                backgroundColor: "white",
                                left: "-5px",
                                top: "18px"
                            }} />
                            <SectionTextRow>
                                {personalInfo.summary}
                            </SectionTextRow>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <SectionTitle customStyle={{ gap: "30px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ height: "14px", width: "14px", paddingLeft: "1px" }}>
                                <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                            </svg>
                            {t("resume.work_experience_professional")}
                        </SectionTitle>
                        {workExperience.map((job, index) => (
                            <div key={`${index}-${job.date}-${job.company}`}
                                style={{
                                    display: "flex",
                                    gap: "30px",
                                    borderLeft: `2px solid ${themeColor}`,
                                    marginLeft: "7px",
                                    position: "relative",
                                    width: "100%",
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    paddingLeft: "4px",
                                }}>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <div
                                        style={{
                                            width: "4px",
                                            height: "4px",
                                            borderRadius: "50%",
                                            border: `2px solid ${themeColor}`,
                                            position: "absolute",
                                            backgroundColor: "white",
                                            left: "-5px",
                                            top: `${index === 0 ? "30" : "48"}px`,
                                        }} />
                                    <div style={{
                                        backgroundColor: `${themeColor}08`,
                                        border: `2px solid ${themeColor}`,
                                        borderRadius: "8px",
                                        padding: "12px",
                                        marginTop: `${index === 0 ? "15" : "30"}px`,
                                        marginBottom: "10px",
                                        position: "relative"
                                    }}>
                                        <div style={{ fontSize: "16px", fontWeight: 900, color: themeColor, marginBottom: "4px" }}>{job.company}</div>
                                        <div style={{ fontStyle: "italic", fontSize: "15px", fontWeight: 700, color: themeColor, marginBottom: "6px" }}>{job.jobTitle} • {job.location}</div>
                                        {job.date && <ExperienceDate>{job.date}</ExperienceDate>}
                                    </div>
                                    <div style={{ fontSize: "14px", letterSpacing: "0.175px" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
                        <SectionTitle customStyle={{ gap: "30px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ height: "14px", width: "14px", paddingLeft: "1px" }}>
                                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                                <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                            </svg>
                            {t("resume.education")}
                        </SectionTitle>
                        {education.map((education, index) => (
                            <div key={`${index}-${education.date}-${education.schoolName}`}
                                style={{
                                    display: "flex",
                                    gap: "30px",
                                    borderLeft: `2px solid ${themeColor}`,
                                    marginLeft: "7px",
                                    position: "relative",
                                    width: "100%",
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    paddingLeft: "4px",
                                }}>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <div
                                        style={{
                                            width: "4px",
                                            height: "4px",
                                            borderRadius: "50%",
                                            border: `2px solid ${themeColor}`,
                                            position: "absolute",
                                            backgroundColor: "white",
                                            left: "-5px",
                                            top: `${index === 0 ? "30" : "33"}px`,
                                        }} />
                                    <div style={{
                                        backgroundColor: `${themeColor}08`,
                                        border: `2px solid ${themeColor}`,
                                        borderRadius: "8px",
                                        padding: "12px",
                                        marginTop: "15px",
                                        marginBottom: "10px",
                                        position: "relative"
                                    }}>
                                        <div style={{ fontSize: "16px", fontWeight: 900, color: themeColor, marginBottom: "4px" }}>{education.schoolName}</div>
                                        <div style={{ fontStyle: "italic", fontSize: "15px", fontWeight: 700, color: themeColor, marginBottom: "6px" }}>{education.degree}</div>
                                        {education.date && <ExperienceDate>{education.date}</ExperienceDate>}
                                    </div>
                                    <div style={{ fontSize: "14px", letterSpacing: "0.175px" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(education.description) }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProfessionalTemplate;