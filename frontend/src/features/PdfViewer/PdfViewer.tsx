import { useContext, useRef, useState, useEffect } from "react";
import Frame from "react-frame-component";
import { useLocation } from "react-router";
import classNames from "classnames";
import { ResumeContext, resumeInfoType } from "../../context/ResumeContext";
import DownloadPdf from "../../components/DownloadPdf/DownloadPdf";
import ClassicalTemplate from "../../components/ResumeModels/ClassicalTemplate";
import ProfessionalTemplate from "../../components/ResumeModels/ProfessionalTemplate";


const PdfViewer = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const location = useLocation();

    const resume = edited ? (resumeBeingEdited as resumeInfoType) : onGoingResume;
    const resumeTemplate = resume.resumeTemplate;

    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const resumeIntrinsicWidth = 790;
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                // Only update scale if container width is less than iframe width
                if (containerWidth < resumeIntrinsicWidth) {
                    setScale(containerWidth / resumeIntrinsicWidth);
                } else {
                    setScale(1); // Reset scale to 1 if container is wider
                }
            }
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    return (
        <div className={classNames(
            "w-full lg:w-1/2 h-1/2 lg:h-full flex justify-center p-5 lg:pt-5 lg:pb-5",
            {
                "shadow-xl shadow-blue-500/60": !location.pathname.includes("preview")
            }
        )}>
            <div className='h-full w-full flex flex-col gap-5 items-center' >
                <div ref={containerRef} id="pdf-viewer-iframe-container"
                    className="flex justify-center h-full w-full overflow-y-scroll relative
                    @container/Iframe-container"
                    style={{
                        height: location.pathname.includes("preview") ? "70vh" : ""
                    }}
                >
                    <Frame id="pdf-viewer-iframe" title="pdf-viewer-iframe" className='bg-white h-full w-full'
                        style={{
                            minHeight: "130vh",
                            width: `${containerRef?.current?.offsetWidth as number < resumeIntrinsicWidth ? resumeIntrinsicWidth : ""}px`,
                            transform: `scale(${scale})`,
                            transformOrigin: "left top",
                        }}
                    >
                        {resumeTemplate === "professional" ?
                            <ProfessionalTemplate resume={resume} />
                            :
                            <ClassicalTemplate resume={resume} />
                        }
                    </Frame>
                </div>
                <DownloadPdf resume={resume} resumeTemplate={resumeTemplate} isEditing={edited} />
            </div>
        </div>

    );
};

export default PdfViewer;