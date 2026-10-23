import { ReactNode } from "react";

export const SUPPORT_EMAIL = "support@onlineresume.dev";

export const SupportEmail = () => <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

/** A detail only the publisher can give (identity, registration...), highlighted until it's filled in */
export const ToFill = ({ children }: { children: ReactNode }) => (
    <mark className="rounded bg-yellow-200 px-1">{children}</mark>
);

/** A part of the page other pages can link to (/legal#privacy), not hidden under the sticky header when scrolled to */
export const LegalSection = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
    <section id={id} className="scroll-mt-(--header-height) pt-6">
        <h2>{title}</h2>
        {children}
    </section>
);
