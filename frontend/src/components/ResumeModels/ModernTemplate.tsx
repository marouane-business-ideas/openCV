import React from "react";
import classNames from "classnames";
import DOMPurify from "isomorphic-dompurify";
import { useTranslation } from "react-i18next";

import Schemify from "../../utils/schemify";
import { formatPhoneNumber } from "../../utils/formatPhone";
import { ResumeTemplateProps } from "../../Types/CommonTypes";
import { fontFaceCss } from "./templateFonts";
import { modernTemplateFonts } from "./modernTemplateFonts";
// Imported as a string: the styles are rendered with the markup (see the comment at the top of the file)
import templateCss from "./ModernTemplate.css?raw";

const styles = `${fontFaceCss(modernTemplateFonts)}\n${templateCss}`;

// Fields written in the editors can contain markup without any text, like "<div><br></div>"
const hasText = (html: string) => html.replace(/<[^>]*>|&nbsp;/g, "").trim() !== "";

const RichText = ({ html, className }: { html: string, className?: string }) => (
    <div className={classNames("rt-rich", className)} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="rt-section">
        <h2 className="rt-heading">{title}</h2>
        {children}
    </section>
);

const ModernTemplate = ({
    resume,
    customStyle,
    customClassName,
    customThemeColor,
    inert = true
}: ResumeTemplateProps) => {
    const { t } = useTranslation();
    const { personalInfo, workExperience, education, skills, languages, links, themeColor: tempThemeColor } = resume;
    const themeColor = customThemeColor ?? tempThemeColor;

    const jobs = workExperience.filter((job) =>
        job.company || job.jobTitle || job.date || job.location || hasText(job.description));
    const schools = education.filter((school) =>
        school.schoolName || school.degree || school.date || hasText(school.description));
    const filledSkills = skills.filter((skill) => skill.trim());
    const filledLanguages = languages.filter((language) => language.language.trim());
    const filledLinks = links.filter((link) => link.linkName || link.linkUrl);

    const hasMainContacts = personalInfo.phoneNumber || personalInfo.email;
    const hasOtherContacts = personalInfo.location || personalInfo.nationality;

    return (
        <div inert={inert} className={classNames("rt-modern", customClassName)}
            style={{ ...customStyle, ...(themeColor ? { "--rt-accent": themeColor } as React.CSSProperties : {}) }}>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <header className="rt-header">
                <h1 className="rt-name">{personalInfo.name}</h1>
                {personalInfo.title && <p className="rt-title">{personalInfo.title}</p>}
            </header>
            {hasText(personalInfo.summary) && (
                <Section title={t("resume.profile")}>
                    <RichText className="rt-rich-pre" html={personalInfo.summary} />
                </Section>
            )}
            <div className="rt-columns">
                <div>
                    {jobs.length > 0 && (
                        <Section title={t("resume.professional_experience")}>
                            {jobs.map((job, index) => (
                                <article key={job.id ?? index} className="rt-entry rt-job">
                                    <div className="rt-job-title">
                                        <p className="rt-strong rt-upper">
                                            {job.company}
                                            {job.location && <span className="rt-muted">{job.company && " · "}{job.location}</span>}
                                        </p>
                                        {(job.jobTitle || job.date) && (
                                            <p>
                                                <span className="rt-role">{job.jobTitle}</span> <span className="rt-date">{job.date}</span>
                                            </p>
                                        )}
                                    </div>
                                    {hasText(job.description) && <RichText html={job.description} />}
                                </article>
                            ))}
                        </Section>
                    )}
                </div>
                <div className="rt-side">
                    {(hasMainContacts || hasOtherContacts) && (
                        <Section title={t("resume.contact")}>
                            <div className="rt-contact">
                                {hasMainContacts && (
                                    <ul className="rt-contact-group rt-strong">
                                        {personalInfo.phoneNumber && <li>{formatPhoneNumber(personalInfo.phoneNumber)}</li>}
                                        {personalInfo.email && <li><a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a></li>}
                                    </ul>
                                )}
                                {hasOtherContacts && (
                                    <ul className="rt-contact-group rt-muted">
                                        {personalInfo.location && <li>{personalInfo.location}</li>}
                                        {personalInfo.nationality && (
                                            <li>{t("form.profile.nationality")}: {personalInfo.nationality}</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </Section>
                    )}
                    {schools.length > 0 && (
                        <Section title={t("resume.education")}>
                            {schools.map((school, index) => (
                                <article key={school.id ?? index} className="rt-entry">
                                    {school.degree && <p className="rt-strong rt-upper">{school.degree}</p>}
                                    {school.schoolName && <p className="rt-strong">{school.schoolName}</p>}
                                    {school.date && <p className="rt-date">{school.date}</p>}
                                    {hasText(school.description) && <RichText className="rt-muted" html={school.description} />}
                                </article>
                            ))}
                        </Section>
                    )}
                    {filledSkills.length > 0 && (
                        <Section title={t("resume.expertise")}>
                            <ul className="rt-list">
                                {filledSkills.map((skill, index) => <li key={`${skill}-${index}`}>{skill}</li>)}
                            </ul>
                        </Section>
                    )}
                    {filledLanguages.length > 0 && (
                        <Section title={t("resume.languages")}>
                            <ul className="rt-list">
                                {filledLanguages.map((language) => (
                                    <li key={language.id}>
                                        {language.language}
                                        {language.level && (
                                            <span className="rt-muted"> · {t(`form.languages.levels.${language.level}`)}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}
                    {filledLinks.length > 0 && (
                        <Section title={t("resume.links")}>
                            <ul className="rt-list rt-links">
                                {filledLinks.map((link) => (
                                    <li key={link.id}>
                                        <a target="_blank" href={Schemify(link.linkUrl, "https")}>{link.linkName || link.linkUrl}</a>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModernTemplate;
