import { useEffect, useState } from "react";

import i18n from "../../i18n";
import { TemplateType } from "../../context/ResumeContext";
import { buildResumeHtml } from "../../components/ResumeModels/buildResumeHtml";
import { resumeTemplates } from "../../components/ResumeModels/templates";
import { fixtures } from "./fixtures";
import { inspectPdf, PdfPage } from "./inspectPdf";
import { checkPdf, PdfChecks } from "./checks";

interface Settings {
    template: TemplateType;
    fixture: string;
    lang: string;
    // Empty to use the fixture's theme color
    color: string;
}

export interface TemplateLabResult extends PdfChecks {
    pageCount: number;
    pdfBase64: string;
}

declare global {
    interface Window {
        // Set once the PDF of the current settings is displayed. Read by tests/templates/templates.visual.ts
        templateLabResult?: TemplateLabResult;
    }
}

type RenderState =
    | { status: "rendering" }
    | { status: "error", error: string }
    | { status: "done", pages: PdfPage[], checks: PdfChecks, pdfUrl: string, pdfBase64: string, duration: number };

const readSettings = (): Settings => {
    const params = new URLSearchParams(window.location.search);
    return {
        template: (params.get("template") ?? "modern") as TemplateType,
        fixture: params.get("fixture") ?? "reference",
        lang: params.get("lang") ?? "en",
        color: params.get("color") ?? "",
    };
};

const toBase64 = (bytes: Uint8Array) => {
    let binary = "";
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
};

const renderPdf = async ({ template, fixture, lang, color }: Settings) => {
    await i18n.changeLanguage(lang);
    const fixtureResume = fixtures[fixture].resume;
    const resume = { ...fixtureResume, resumeTemplate: template, themeColor: color || fixtureResume.themeColor };

    const start = performance.now();
    // Same HTML as the download button, printed by the backend's renderer (see the plugin in vite.config.ts)
    const response = await fetch("/__template-lab/pdf", { method: "POST", body: await buildResumeHtml(resume) });
    if (!response.ok) throw new Error(await response.text());
    const pdf = new Uint8Array(await response.arrayBuffer());
    const duration = Math.round(performance.now() - start);

    const pages = await inspectPdf(pdf, window.devicePixelRatio);
    return {
        pages,
        checks: checkPdf(resume, pages),
        pdfUrl: URL.createObjectURL(new Blob([pdf], { type: "application/pdf" })),
        pdfBase64: toBase64(pdf),
        duration,
    };
};

const Checks = ({ checks }: { checks: PdfChecks }) => {
    const problems = [
        ...checks.missingTexts.map((text) => `Missing from the PDF: “${text}”`),
        ...checks.textsOutsideSafeArea.map((text) => `Too close to the edge of the page: “${text}”`),
        ...checks.blankPages.map((page) => `Page ${page} is blank`),
    ];

    if (problems.length === 0) {
        return <p className="text-green-700">✓ All the content is in the PDF, within the margins, and no page is blank</p>;
    }
    return (
        <ul className="list-disc pl-5 text-red-700">
            {problems.map((problem) => <li key={problem}>{problem}</li>)}
        </ul>
    );
};

const TemplateLab = () => {
    const [settings, setSettings] = useState(readSettings);
    const [state, setState] = useState<RenderState>({ status: "rendering" });
    const [reference, setReference] = useState<string>();
    const [referenceOpacity, setReferenceOpacity] = useState(0.5);

    const update = (change: Partial<Settings>) => setSettings((current) => ({ ...current, ...change }));

    useEffect(() => {
        const params = new URLSearchParams(Object.entries(settings).filter(([, value]) => value));
        window.history.replaceState(null, "", `?${params}`);

        let cancelled = false;
        window.templateLabResult = undefined;
        setState({ status: "rendering" });
        renderPdf(settings).then(
            (result) => { if (!cancelled) setState({ status: "done", ...result }); },
            (error) => { if (!cancelled) setState({ status: "error", error: String(error) }); },
        );
        return () => { cancelled = true; };
    }, [settings]);

    useEffect(() => {
        if (state.status !== "done") return;

        let cancelled = false;
        const images = [...document.querySelectorAll<HTMLImageElement>("img[data-page]")];
        Promise.all(images.map((image) => image.decode())).then(() => {
            if (!cancelled) {
                window.templateLabResult = { ...state.checks, pageCount: state.pages.length, pdfBase64: state.pdfBase64 };
            }
        });
        return () => {
            cancelled = true;
            URL.revokeObjectURL(state.pdfUrl);
        };
    }, [state]);

    const fixtureColor = fixtures[settings.fixture].resume.themeColor || "#191919";

    return (
        <div className="min-h-screen bg-gray-100 text-sm text-gray-800">
            <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-gray-300 bg-white px-5 py-3">
                <h1 className="text-base font-bold">Template lab</h1>
                <label className="flex items-center gap-2">
                    Template
                    <select className="rounded border border-gray-300 px-1" value={settings.template}
                        onChange={(e) => update({ template: e.target.value as TemplateType })}>
                        {Object.keys(resumeTemplates).map((template) => <option key={template} value={template}>{template}</option>)}
                    </select>
                </label>
                <label className="flex items-center gap-2">
                    Resume
                    <select className="rounded border border-gray-300 px-1" value={settings.fixture}
                        onChange={(e) => update({ fixture: e.target.value })}>
                        {Object.entries(fixtures).map(([name, { label }]) => <option key={name} value={name}>{label}</option>)}
                    </select>
                </label>
                <label className="flex items-center gap-2">
                    Language
                    <select className="rounded border border-gray-300 px-1" value={settings.lang} onChange={(e) => update({ lang: e.target.value })}>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                    </select>
                </label>
                <label className="flex items-center gap-2">
                    Theme color
                    <input type="color" value={settings.color || fixtureColor} onChange={(e) => update({ color: e.target.value })} />
                    {settings.color && <button className="underline" onClick={() => update({ color: "" })}>reset</button>}
                </label>
                <label className="flex items-center gap-2" title="Shown over the first page. Crop the picture to the edges of the page.">
                    Reference picture
                    <input type="file" accept="image/*" className="w-52"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            setReference(file && URL.createObjectURL(file));
                        }} />
                </label>
                {reference && (
                    <label className="flex items-center gap-2">
                        Opacity
                        <input type="range" min={0} max={1} step={0.05} value={referenceOpacity}
                            onChange={(e) => setReferenceOpacity(Number(e.target.value))} />
                    </label>
                )}
                <span className="ml-auto text-gray-500">
                    {state.status === "rendering" && "Rendering…"}
                    {state.status === "done" && `${state.pages.length} page${state.pages.length > 1 ? "s" : ""}, printed in ${state.duration} ms`}
                </span>
                {state.status === "done" && <a className="text-blue-600 underline" href={state.pdfUrl} target="_blank">Open the PDF</a>}
            </header>
            <main className="flex flex-col items-center gap-6 p-6">
                {state.status === "error" && <pre className="whitespace-pre-wrap text-red-700">{state.error}</pre>}
                {state.status === "done" && <Checks checks={state.checks} />}
                {state.status === "done" && state.pages.map((page, index) => (
                    <figure key={index} className="relative bg-white shadow-md">
                        <img data-page={index + 1} src={page.image} alt={`Page ${index + 1}`}
                            style={{ width: page.imageWidth, height: page.imageHeight }} />
                        {reference && index === 0 && (
                            <img src={reference} alt="" className="pointer-events-none absolute left-0 top-0 w-full"
                                style={{ opacity: referenceOpacity }} />
                        )}
                    </figure>
                ))}
            </main>
        </div>
    );
};

export default TemplateLab;
