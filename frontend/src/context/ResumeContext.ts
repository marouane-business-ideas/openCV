import { createContext, Dispatch } from "react";
import uniqid from "uniqid";

export type LanguageLevelType = "native" | "fluent" | "intermediate" | "beginner" | "";

const savedState = localStorage.getItem("resumeState");


export const defaultContext = savedState ? JSON.parse(savedState) : {
    onGoingResume: {
        personalInfo: {
            name: "",
            title: "",
            email: "",
            phoneNumber: "",
            location: "",
            summary: "",
            isValid: undefined,
        },
        workExperience: [{
            company: "",
            jobTitle: "",
            date: "",
            description: "",
            location: "",
            id: uniqid(),
            isValid: undefined,
        }],
        education: [{
            schoolName: "",
            degree: "",
            date: "",
            description: "",
            id: uniqid(),
            isValid: undefined,
        }],
        skills: [""],
        languages: [{ language: "", level: "", id: uniqid() } as { language: string, level: LanguageLevelType, id: string }],
        links: [{ linkName: "", linkUrl: "", id: uniqid() } as { linkUrl: string, id: string, linkName: string }],
        themeColor: "#191919"
    },

    resumeBeingEdited: {
        personalInfo: {
            name: "",
            title: "",
            email: "",
            phoneNumber: "",
            location: "",
            summary: "",
            isValid: undefined,
        },
        workExperience: [{
            company: "",
            jobTitle: "",
            date: "",
            description: "",
            location: "",
            id: uniqid(),
            isValid: undefined,
        }],
        education: [{
            schoolName: "",
            degree: "",
            date: "",
            description: "",
            id: uniqid(),
            isValid: undefined,
        }],
        skills: [""],
        languages: [{ language: "", level: "", id: uniqid() } as { language: string, level: LanguageLevelType, id: string }],
        links: [{ linkName: "", linkUrl: "", id: uniqid() } as { linkUrl: string, id: string, linkName: string }],
        themeColor: ""
    }
};

export type resumeInfoType = {
    personalInfo: {
        name: string;
        title: string;
        email: string;
        phoneNumber: string;
        location: string;
        summary: string;
        isValid: undefined | boolean;
    };
    workExperience: {
        company: string;
        jobTitle: string;
        date: string;
        description: string;
        location: string;
        id: string;
        isValid: undefined | boolean;
    }[];
    education: {
        schoolName: string;
        degree: string;
        date: string;
        description: string;
        id: string;
        isValid: undefined | boolean;
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