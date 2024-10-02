import { useContext, useRef, useState, useEffect, createElement, useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import { ResumeContext, resumeInfoType } from "../../context/ResumeContext";
import DownloadPdf from "../../components/DownloadPdf/DownloadPdf";
import ClassicalTemplate from "../../components/ResumeModels/ClassicalTemplate";
import ProfessionalTemplate from "../../components/ResumeModels/ProfessionalTemplate";


const PdfViewer = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);

    const resume = edited ? (resumeBeingEdited as resumeInfoType) : onGoingResume;
    const resumeTemplateSelected = resume.resumeTemplate;

    const ResumeTemplateComponent = resumeTemplateSelected === "professional" ? ProfessionalTemplate : ClassicalTemplate;

    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const resumeWidth = 790;
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Only update scale if container width is less than iframe width
                if (containerWidth < resumeWidth) {
                    setScale(containerWidth / resumeWidth);
                } else {
                    setScale(1); // Reset scale to 1 if container is wider
                }
            }
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    const iframeSrcUrl = useMemo(() => {
        const htmlContent = ReactDOMServer.renderToStaticMarkup(createElement(ResumeTemplateComponent, { resume: resume }));
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        return url;
    }, [ResumeTemplateComponent, resume])



    return (
        <div className="w-full lg:w-5/6 2xl:w-1/2 h-1/2 2xl:h-full flex justify-center p-5 2xl:pt-5 2xl:pb-5 shadow-xl shadow-blue-500/60">
            <div className='h-full w-full flex flex-col gap-5 items-center' >
                <div ref={containerRef} id="pdf-viewer-iframe-container" className="flex justify-center h-full w-full overflow-y-scroll relative
                    @container/Iframe-container" >
                    <iframe src={iframeSrcUrl} id="pdf-viewer-iframe" title="pdf-viewer-iframe" className='bg-white h-full w-full'
                        style={{
                            minHeight: `${containerRef?.current?.offsetWidth as number < resumeWidth ? 700 : ""}px`,
                            width: `${containerRef?.current?.offsetWidth as number < resumeWidth ? resumeWidth : ""}px`,
                            transform: `scale(${scale})`,
                            transformOrigin: "left top",
                        }}
                    >
                    </iframe>
                </div>
                <DownloadPdf resume={resume} resumeTemplate={resumeTemplateSelected} isEditing={edited} />
            </div>
        </div >

    )
}

export default PdfViewer