import { JSX } from "react";

import { TemplateType } from "../../context/ResumeContext";
import { ResumeTemplateProps } from "../../Types/CommonTypes";
import ClassicalTemplate from "./ClassicalTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import ModernTemplate from "./ModernTemplate";
import { modernTemplateFonts } from "./modernTemplateFonts";
import { TemplateFont } from "./templateFonts";

interface ResumeTemplateDefinition {
    Component: (props: ResumeTemplateProps) => JSX.Element;
    // i18n key of the template's name
    labelKey: string;
    // Embedded in the HTML sent for PDF generation
    fonts: TemplateFont[];
}

export const resumeTemplates: Record<TemplateType, ResumeTemplateDefinition> = {
    classic: { Component: ClassicalTemplate, labelKey: "form.template.classic", fonts: [] },
    professional: { Component: ProfessionalTemplate, labelKey: "form.template.professional", fonts: [] },
    modern: { Component: ModernTemplate, labelKey: "form.template.modern", fonts: modernTemplateFonts },
};

// Like before the registry existed, an unknown template falls back to the classic one
export const getResumeTemplate = (template: TemplateType) => resumeTemplates[template] ?? resumeTemplates.classic;
