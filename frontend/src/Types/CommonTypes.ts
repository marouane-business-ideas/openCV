import { resumeInfoType, TemplateType } from "../context/ResumeContext";

export interface IPdf {
    jsonContent: string;
    htmlContent: string;
    createdAt: string;
    filename: string;
    id: number;
    template: TemplateType;
}

export interface ResumeTemplateProps {
    resume: resumeInfoType,
    customStyle?: React.CSSProperties,
    customClassName?: string,
    customThemeColor?: string,
    inert?: boolean,
}