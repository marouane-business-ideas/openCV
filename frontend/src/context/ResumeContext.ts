import { createContext, Dispatch } from "react";
import uniqid from "uniqid";

export type LanguageLevelType = "native" | "fluent" | "intermediate" | "beginner" | "";
export type templateType = "classic" | "professional";

const savedState = typeof window !== "undefined" ? localStorage.getItem("resumeState") : "";


export const defaultContext = savedState ? JSON.parse(savedState) : {
    onGoingResume: {
        resumeTemplate: "classic",
        personalInfo: {
            name: "John Doe",
            title: "Software Developer",
            email: "john.doe@example.com",
            phoneNumber: "+1 (555) 123-4567",
            location: "New York, NY",
            summary: "Experienced software developer with a passion for creating efficient and scalable applications."
        },
        workExperience: [{
            company: "Tech Solutions Inc.",
            jobTitle: "Senior Developer",
            date: "2018 - Present",
            description: "Led a team of 5 developers in creating innovative web applications using React and Node.js.",
            location: "New York, NY",
            id: uniqid(),
        },
        {
            company: "StartUp Innovations",
            jobTitle: "Junior Developer",
            date: "2015 - 2018",
            description: "Developed and maintained various features for the company's main product using Angular and Python.",
            location: "San Francisco, CA",
            id: uniqid(),
        }],
        education: [{
            schoolName: "University of Technology",
            degree: "Bachelor of Science in Computer Science",
            date: "2011 - 2015",
            description: "Graduated with honors. Specialized in software engineering and artificial intelligence.",
            id: uniqid(),
        }],
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Git", "AWS", "Docker"],
        languages: [
            { language: "English", level: "native", id: uniqid() },
            { language: "Spanish", level: "intermediate", id: uniqid() }
        ],
        links: [
            { linkName: "https://github.com/johndoe", linkUrl: "https://github.com/johndoe", id: uniqid() },
            { linkName: "https://linkedin.com/in/johndoe", linkUrl: "https://linkedin.com/in/johndoe", id: uniqid() }
        ],
        themeColor: "#191919"
    },
    resumeBeingEdited: {
        resumeTemplate: "classic",
        personalInfo: {
            name: "",
            title: "",
            email: "",
            phoneNumber: "",
            location: "",
            summary: ""
        },
        workExperience: [{
            company: "",
            jobTitle: "",
            date: "",
            description: "",
            location: "",
            id: uniqid(),
        }],
        education: [{
            schoolName: "",
            degree: "",
            date: "",
            description: "",
            id: uniqid(),
        }],
        skills: [""],
        languages: [{ language: "", level: "", id: uniqid() } as { language: string, level: LanguageLevelType, id: string }],
        links: [{ linkName: "", linkUrl: "", id: uniqid() } as { linkUrl: string, id: string, linkName: string }],
        themeColor: ""
    }
};

export type resumeInfoType = {
    resumeTemplate: templateType;
    personalInfo: {
        name: string;
        title: string;
        email: string;
        phoneNumber: string;
        location: string;
        summary: string;
    };
    workExperience: {
        company: string;
        jobTitle: string;
        date: string;
        description: string;
        location: string;
        id: string;
    }[];
    education: {
        schoolName: string;
        degree: string;
        date: string;
        description: string;
        id: string;
    }[];
    skills: string[];
    languages: {
        language: string;
        level: LanguageLevelType;
        id: string;
    }[];
    links: {
        linkName: string;
        linkUrl: string;
        id: string;
    }[];
    themeColor: string;
};

export type contextStateType = {
    onGoingResume: resumeInfoType;
    resumeBeingEdited: resumeInfoType;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type actionType = { type: string, payload?: any };


export const ResumeContext = createContext(defaultContext as contextStateType);
export const ResumeDispatchContext = createContext<Dispatch<actionType> | null>(null);