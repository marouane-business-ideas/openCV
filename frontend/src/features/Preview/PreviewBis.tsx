import React from "react";
import DOMPurify from "isomorphic-dompurify";

const firstColumnWidth = "200px";
const rowGap = "20px";

const Styles: { [key: string]: React.CSSProperties } = {
    pageContainer: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "35px 70px",
        fontFamily: "Arial, sans-serif",
    },
    personnalInfoContainer: {
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "5px",
    },
    personnalInfoName: {
        fontSize: "28px",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        fontWeight: 900,
    },
    personnalTitle: {
        fontSize: "18px",
        textTransform: "uppercase",
        letterSpacing: "0.10em",
        fontWeight: 500,
    },
    personnalInfoAdresses: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "15px",
        fontSize: "12px",
        letterSpacing: "0.4px",
        marginTop: "10px",
    },
    resumeContentContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "20px",
    },
    link: {
        color: "black",
        textDecoration: "none",
    },
    section: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    sectionTitle: {
        fontSize: "18px",
        fontWeight: 700,
        letterSpacing: "0.10em",
        borderBottom: "2px solid currentColor",
        marginBottom: "10px",
        paddingBottom: "5px",
    },
    experienceItem: {
        marginBottom: "15px",
    },
    companyName: {
        fontWeight: "bold",
    },
    jobTitle: {
        fontStyle: "italic",
    },
    bulletPoint: {
        margin: "5px 0 5px 20px",
    },
};

const SectionTitle = ({ children, themeColor }: { children: string, themeColor: string }) => {
    return (
        <div style={{ ...Styles.sectionTitle, color: themeColor }}>{children}</div>
    );
}

const ExperienceItem = ({ company, title, date, description }: { company: string, title: string, date: string, description: string }) => (
    <div style={Styles.experienceItem}>
        <div style={Styles.companyName}>{company}</div>
        <div style={Styles.jobTitle}>{title}</div>
        <div>{date}</div>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
    </div>
);

const Preview = () => {
    const themeColor = "#0056b3";

    return (
        <div style={Styles.pageContainer}>
            <div style={Styles.personnalInfoContainer}>
                <div style={{ ...Styles.personnalInfoName, color: themeColor }}>ABOUBAKR EL ALJ</div>
                <div style={{ ...Styles.personnalTitle, color: themeColor }}>MANAGEMENT CONSULTANT MANAGER</div>
                <div style={{
                    ...Styles.personnalInfoAdresses,
                    color: themeColor,
                }}>
                    <span>102 Avenue Marceau Courbevoie, 92400</span>
                    <span>•</span>
                    <span>+33 7 62 06 38 43</span>
                    <span>•</span>
                    <a style={{ ...Styles.link, color: themeColor }} href="mailto:elalj.bakr@gmail.com">
                        elalj.bakr@gmail.com
                    </a>
                    <span>•</span>
                    <span>LinkedIn Profile</span>
                </div>
            </div>
            <div style={Styles.resumeContentContainer}>
                <div style={Styles.section}>
                    <SectionTitle themeColor={themeColor}>EXPERTISE</SectionTitle>
                    <p>Experienced management consultant with more than 8 years of proven track record of delivering strategic projects. Focus on digital transformation and operational excellence harnessing the potential of Low code & Automation and AI. I had the opportunity to work on different industries: Public sector, Airlines, Rail, Insurance & Banking, FMCG... Worked with leading clients in the EMEA region, CAC40, S&P500, Governments. Some of my achievements:</p>
                    <ul>
                        <li style={Styles.bulletPoint}>Generated 800K€ billable revenue generated in Q1 in 2024</li>
                        <li style={Styles.bulletPoint}>Closed multiple contracts with leading Airlines in EMEA, Banking sector and in the mining & engineering industry.</li>
                        <li style={Styles.bulletPoint}>Built Low Code practice at TNP consulting</li>
                    </ul>
                </div>
                <div style={Styles.section}>
                    <SectionTitle themeColor={themeColor}>WORK EXPERIENCE</SectionTitle>
                    <ExperienceItem
                        company="TNP CONSULTANTS"
                        title="Project Lead"
                        date="2020-2024"
                        description="Worked on multiple digital transformation projects, main focus is on Low Code & Automation Platform coupled with AI capabilities. Helped developing the Low Code Practice within TNP Consultants and also contributed to business development in the EMEA region including closing some major deals (CRM software deployment for a major Airline, Digitalization Platform for a leading player in the construction & mining industries, IT department operational excellence transformation for a major banking institution, Business Partnership with a leading GAFAM company)"
                    />
                    <ExperienceItem
                        company="TALAN CONSULTING"
                        title="Senior Consultant"
                        date="2018-2020"
                        description="Digital & organizational transformation within the IT department to increase productivity via Low Code & RPA, managing the deployment of Low Code solutions on a scope of 100 IT personnel, 11 000 customers impacted"
                    />
                    <ExperienceItem
                        company="JURIS.MA"
                        title="PROJECT MANAGER"
                        date="2018"
                        description="Assisting founders in managing &quot;Juris.ma&quot; a leading legaltech in Mena region reshaping its business and driving growth: Established a full analysis of the business target customers and competitive landscape. Assisted in defining and the transition to a new business model. Managed a team of business developers, community managers, and designers."
                    />
                    <ExperienceItem
                        company="IDC"
                        title="ANALYST"
                        date="2018"
                        description="Conducted research and survey, assisted large Hardware & Software vendors. Conducted surveys and qualitative and quantitative research on digital & IT market Europe & France. Worked with major software & device vendors helping them addressing their market (market sizing, trends analysis, consumer insights …). Worked on improving IDC internal report tools."
                    />
                    <ExperienceItem
                        company="SAEGUS"
                        title="CONSULTANT"
                        date="2017 - 2018"
                        description="Assisted large companies in their digital transformation, working with agile method in a Startup-mindset consultancy boutique: Conducted a POC of digital transformation focused on workplace solutions in a major CAC 40 company. Elaborated an adoption program for new digital usages, conducting workshops and training sessions. Assessed process automation potential using low code technology Power Apps & Power Automate."
                    />
                    <ExperienceItem
                        company="KEARNEY"
                        title="RESEARCH ANALYST"
                        date="2015 - 2016"
                        description="Conducted strategic studies and researches on Industry trends, competitive benchmarks, client profiling and due diligences. Participated in numerous consultancy projects including: Global benchmark for a new plant implantation in the chemical industry. Elaborating a market entry strategy for a global snacking & beverages player in MENA region. Conducting a study on travel retail business opportunities for a major European transportation operator. Several projects in the public sector in GCC countries."
                    />
                </div>
                <div style={Styles.section}>
                    <SectionTitle themeColor={themeColor}>EDUCATION</SectionTitle>
                    <ExperienceItem
                        company="EPICREACT.DEV"
                        title="Epic React course by Ken C. Dodds"
                        date="Jun 2023 - Sep 2023"
                        description="Completed Epic React by Kent C. Dodds, an advanced online course designed for experienced developers. Deepened expertise in React.js, focusing on: Advanced state management techniques and custom hooks, Performance optimization strategies for large-scale applications, Implementing robust testing practices using React Testing Library, Architecting complex, scalable React applications, Advanced patterns for component composition and code reuse"
                    />
                    <ExperienceItem
                        company="UDACITY"
                        title="React Nanodegree"
                        date="Dec 2017 - Feb 2018"
                        description=""
                    />
                    <ExperienceItem
                        company="KEDGE BUSINESS SCHOOL"
                        title="Master in Management - Corporate Finance Specialisation"
                        date="2012 - 2016"
                        description=""
                    />
                </div>
                <div style={Styles.section}>
                    <SectionTitle themeColor={themeColor}>SKILLS</SectionTitle>
                    <p>Next JS, React JS, Typescript, Javascript, Redux, CSS, SCSS/SASS, Tailwind, PWA, Jest, React Testing Library, Node JS, PHP, SQL, GIT</p>
                </div>
                <div style={Styles.section}>
                    <SectionTitle themeColor={themeColor}>LANGUAGES</SectionTitle>
                    <p>English (fluent) • French (native) • Arabic (native)</p>
                </div>
                <div style={Styles.section}>
                    <SectionTitle themeColor={themeColor}>VOLUNTEERING & HOBBIES</SectionTitle>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        <li>Responsible of partnership and training at Technomaide, a digital student association at Kedge business school</li>
                        <li>Student ambassador at the UN General Assembly</li>
                        <li>Sports (Football, Karate), backpacking, chess</li>
                        <li>Tutoring in mathematics and science high school students</li>
                    </ul>
                </div>
                <div style={Styles.section}>
                    <SectionTitle themeColor={themeColor}>PERSONAL LINKS</SectionTitle>
                    <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
                        <a style={Styles.link} href="https://github.com/FarisMarouane" target="_blank" rel="noopener noreferrer">https://github.com/FarisMarouane</a>
                        <a style={Styles.link} href="https://marouanefaris.dev/" target="_blank" rel="noopener noreferrer">https://marouanefaris.dev/</a>
                        <a style={Styles.link} href="https://www.malt.fr/profile/marouanefaris" target="_blank" rel="noopener noreferrer">https://www.malt.fr/profile/marouanefaris</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preview;