import { TemplateType } from "../context/ResumeContext";

export interface IPdf {
    jsonContent: string;
    htmlContent: string;
    createdAt: string;
    filename: string;
    id: number;
    template: TemplateType;
}