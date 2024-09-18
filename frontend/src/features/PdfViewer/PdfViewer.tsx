import { useContext, useRef, useState, useEffect, lazy, Suspense } from "react";
import Frame, { FrameContextConsumer } from "react-frame-component"
import { ResumeContext, resumeInfoType } from "../../context/ResumeContext";
import DownloadPdf from "../../components/DownloadPdf/DownloadPdf";
import ClassicalTemplate from "../ResumeModels/ClassicalTemplate";

/*
   Can't use Spinner component because we can't use tailwind classes in iframe,
   so we need to define the spinner styles here

 **/
const CustomIframeSpinner = () => {
    return (
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }}>
            <div
                className="spinner animate-spin rounded-full border-b-2 border-blue-500"
                style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderBottomStyle: "solid",
                }}
            />
        </div>
    );
};

const ProfessionalTemplate = lazy(() => import("../ResumeModels/ProfessionalTemplate"));

const PdfViewer = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);

    const resume = edited ? (resumeBeingEdited as resumeInfoType) : onGoingResume;
    const resumeTemplate = resume.resumeTemplate;

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

    return (
        <div className="w-full lg:w-5/6 2xl:w-1/2 h-1/2 2xl:h-full flex justify-center p-5 2xl:pt-5 2xl:pb-5 shadow-xl shadow-blue-500/60">
            <div className='h-full w-full flex flex-col gap-5 items-center' >
                <div ref={containerRef} id="pdf-viewer-iframe-container" className="flex justify-center h-full w-full overflow-y-scroll relative
                    @container/Iframe-container" >
                    <Frame id="pdf-viewer-iframe" title="pdf-viewer-iframe" className='bg-white h-full w-full'
                        style={{
                            minHeight: `${containerRef?.current?.offsetWidth as number < resumeWidth ? 700 : ""}px`,
                            width: `${containerRef?.current?.offsetWidth as number < resumeWidth ? resumeWidth : ""}px`,
                            transform: `scale(${scale})`,
                            transformOrigin: "left top",
                        }}
                    >
                        <FrameContextConsumer>
                            {
                                ({ document }) => {
                                    if (document) {
                                        const style = document.createElement("style");
                                        style.innerHTML = `
                                            @keyframes spin {
                                              to {
                                                transform: rotate(360deg);
                                              }
                                            }

                                            .animate-spin {
                                              animation: spin 1s linear infinite;
                                            }

                                            .rounded-full {
                                                 border-radius: 9999px;
                                                }

                                                .border-b-2 {
                                                    border-bottom-width: 2px;
                                                }

                                                .border-blue-500 {
                                                    --tw-border-opacity: 1;
                                                    border-color: rgb(59 130 246 / var(--tw-border-opacity));
                                                }
}
                                        `;
                                        document.head.appendChild(style);

                                        return <Suspense fallback={<CustomIframeSpinner />}>
                                            {resumeTemplate === "professional" ?
                                                <ProfessionalTemplate resume={resume} />
                                                :
                                                <ClassicalTemplate resume={resume} />}
                                        </Suspense>
                                    }
                                }
                            }
                        </FrameContextConsumer>

                    </Frame>
                </div>
                <DownloadPdf resume={resume} isEditing={edited} />
            </div>
        </div >

    )
}

export default PdfViewer