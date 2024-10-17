import { TemplateType } from "../context/ResumeContext";

export interface IPdf {
    content: string;
    createdAt: string;
    filename: string;
    id: number;
    template: TemplateType;
}