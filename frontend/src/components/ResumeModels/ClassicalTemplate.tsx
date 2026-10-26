import React, { type JSX } from "react";
import DOMPurify from "isomorphic-dompurify";
import { useTranslation } from "react-i18next";

import { languageLevelLabel } from "../../utils/languageLevel";
import Schemify, { withoutScheme } from "../../utils/schemify";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { ageFromBirthDate } from "../../utils/age";
import { ResumeTemplateProps } from "../../Types/CommonTypes";

const firstColumnWidth = "160px";
const rowGap = "30px";

const Styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "0px 70px",
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
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.10em",
        fontWeight: 500,
    },
    personnalInfoAdresses: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        fontSize: "12px",
        letterSpacing: "0.4px",
        borderTop: "1px solid black",
        borderBottom: "1px solid black",
        padding: "5px 0",
    },
    resumeContentContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "15px",
        paddingTop: "10px"
    },
    link: {
        color: "black",
        textDecoration: "none",
    },
    section: {
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid currentColor",
        paddingBottom: "15px",
    },
    sectionRow: {
        display: "flex",
        flexDirection: "row",
        gap: rowGap,
    },
    SectionTitle: {
        fontSize: "16px",
        fontWeight: 900,
        letterSpacing: "0.10em",
        width: firstColumnWidth,
        minWidth: firstColumnWidth,
        maxWidth: firstColumnWidth,
        // The accents of bold capitals (Ô, É) rise above the line: when a title starts a page, Chrome would print
        // them at the bottom of the previous page. The padding keeps them in the title, on its page
        paddingTop: "3px",
    },
    SectionText: {
        fontSize: "14px",
        letterSpacing: "0.175px",
        width: `calc(100% - ${firstColumnWidth} - ${rowGap})`,
        maxWidth: `calc(100% - ${firstColumnWidth} - ${rowGap})`,
        minHeight: `calc(100% - ${firstColumnWidth} - ${rowGap})`,
    },
    experienceDate: {
        fontSize: "14px",
        letterSpacing: "0.175px",
        // A long date wraps: next to a short text, it would otherwise widen the column and shift the entry's text
        width: firstColumnWidth,
        minWidth: firstColumnWidth,
        maxWidth: firstColumnWidth,
        fontWeight: 900,
    },
    experienceTopSection: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        alignItems: "flex-start",
        fontSize: "15px",
        letterSpacing: "0.175px",
    }
};

const SectionTitle = ({ children }: { children: string }) => {
    return (
        <div style={{ ...Styles.SectionTitle }} >{children}</div>
    );
};

const SectionText = ({ children }: { children: string }) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(children) }} style={Styles.SectionText} />
    );
};

const ExperienceDate = ({ children }: { children: string }) => {
    return (
        <div style={{ ...Styles.experienceDate }}>{children}</div>
    );
};

const ExperienceTopSection = ({ children }: { children: JSX.Element[] }) => {
    return (
        <div style={Styles.experienceTopSection}>{children}</div>
    );
};

const ClassicalTemplate = ({
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
    const age = ageFromBirthDate(personalInfo.birthDate);

    return (
        <div inert={inert} className={customClassName} style={{ ...Styles.pageContainer, ...customStyle, color: themeColor }}>
            <div style={Styles.personnalInfoContainer}>
                <div style={{ ...Styles.personnalInfoName }}>{personalInfo.name}</div>
                <div style={{ ...Styles.personnalTitle }}>{personalInfo.title}</div>
            </div>
            <div style={{
                ...Styles.personnalInfoAdresses,
                borderTop: `1px solid ${themeColor}`,
                borderBottom: `1px solid ${themeColor}`
            }}>
                <svg style={{ height: "12px", width: "12px" }} xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642
                         4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>

                <div>{personalInfo.location}</div>
                <div>•</div>
                <svg style={{ height: "12px", width: "12px" }} xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25
                         0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25
                          0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>

                <div>{formatPhoneNumber(personalInfo.phoneNumber)}</div>
                <div>•</div>
                <svg style={{ height: "12px", width: "12px" }} xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9
                         0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                </svg>

                <a style={{ ...Styles.link, color: themeColor }} href={`mailto:${personalInfo.email}`}>
                    {personalInfo.email}
                </a>
                {personalInfo.nationality && (
                    <>
                        <div>•</div>
                        <div>{t("resume.nationality", { nationality: personalInfo.nationality })}</div>
                    </>
                )}
                {age !== null && (
                    <>
                        <div>•</div>
                        {/* Short: kept on one line when the other details squeeze the row */}
                        <div style={{ whiteSpace: "nowrap" }}>{t("resume.age", { count: age })}</div>
                    </>
                )}
            </div>
            <div style={Styles.resumeContentContainer}>
                <div style={Styles.sectionRow}>
                    <SectionTitle>{t("resume.profile")}</SectionTitle>
                    <SectionText>{personalInfo.summary}</SectionText>
                </div>
                <div style={Styles.sectionRow}>
                    <SectionTitle>{t("resume.work_experience_classic")}</SectionTitle>
                </div>
                {workExperience.map((job, index) => (
                    <div key={`${index}-${job.date}-${job.company}`} style={{
                        ...Styles.sectionRow,
                        marginTop: `${index === 0 ? "10px" : "20px"}`
                    }}>
                        <ExperienceDate>{job.date}</ExperienceDate>
                        <ExperienceTopSection>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                <div style={{ fontWeight: 900 }}>{job.company}</div>
                                {/* The bullet only separates two filled fields */}
                                {job.company.trim() && job.location.trim() && <div>•</div>}
                                <div style={{ fontWeight: 900 }}>{job.location}</div>
                            </div>
                            <div style={{ fontStyle: "italic" }}>{job.jobTitle}</div>
                            <div style={{ marginTop: "10px" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }} />
                        </ExperienceTopSection>
                    </div>
                ))}
                <div style={Styles.sectionRow}>
                    <SectionTitle>{t("resume.education")}</SectionTitle>
                </div>
                {education.map((school, index) => (
                    <div key={`${index}-${school.date}-${school.schoolName}`} style={{
                        ...Styles.sectionRow,
                        marginTop: `${index === 0 ? "10px" : "0"}`
                    }}>
                        <ExperienceDate>{school.date}</ExperienceDate>
                        <ExperienceTopSection>
                            <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                                <div style={{ fontWeight: 900 }}>{school.schoolName}</div>
                            </div>
                            <div style={{ fontStyle: "italic" }}>{school.degree}</div>
                            <div style={{ marginTop: "10px" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(school.description) }} />
                        </ExperienceTopSection>
                    </div>
                ))}
                {filledSkills.length > 0 && (
                    <div style={Styles.sectionRow}>
                        <SectionTitle>{t("resume.skills")}</SectionTitle>
                        <div style={{ fontWeight: "900" }}>
                            {filledSkills.map((skill, index) => (
                                <span key={`${skill}-${index}`}>
                                    {skill}{index !== filledSkills.length - 1 ? ", " : ""}
                                </span>))}
                        </div>
                    </div>
                )}
                {filledLanguages.length > 0 && (
                    <div style={Styles.sectionRow}>
                        <SectionTitle>{t("resume.languages")}</SectionTitle>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5px", flexWrap: "wrap" }}>
                            {filledLanguages.map((language, index) => (
                                <div key={language.id} style={{ display: "flex", gap: "3px" }}>
                                    <span>{language.language}</span>
                                    {language.level && <span>({languageLevelLabel(language.level, t)})</span>}
                                    <span style={{ fontWeight: "900", marginLeft: "2px" }} >{index !== filledLanguages.length - 1 ? "•" : ""}</span>
                                </div>))
                            }
                        </div>
                    </div>
                )}
                {filledLinks.length > 0 && (
                    <div style={Styles.sectionRow}>
                        <SectionTitle>{t("resume.links")}</SectionTitle>
                        <div style={{ display: "flex", flexDirection: "row", gap: "5px", flexWrap: "wrap" }}>
                            {filledLinks.map((link, index) => (
                                <div key={link.id} style={{ display: "flex", gap: "3px" }}>
                                    <a style={{ ...Styles.link, color: themeColor }} target="_blank" href={Schemify(link.linkUrl, "https")} >
                                        {withoutScheme(link.linkName || link.linkUrl)}
                                    </a>
                                    <span style={{ fontWeight: "900", marginLeft: "2px" }} >{index !== filledLinks.length - 1 ? "•" : ""}</span>
                                </div>))
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassicalTemplate;