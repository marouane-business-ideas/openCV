import { useContext } from "react";
import Frame from "react-frame-component"
import Preview from "../Preview/Preview"
import { ResumeContext, resumeInfoType } from "../../context/ResumeContext";
import DownloadPdf from "../../components/DownloadPdf/DownloadPdf";

const PdfViewer = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);

    const resume = edited ? (resumeBeingEdited as resumeInfoType) : onGoingResume;

    return (
        <div className="w-full lg:w-5/6 2xl:w-1/2 h-1/2 2xl:h-full flex justify-center p-5 2xl:pt-5 2xl:pb-5 shadow-xl shadow-blue-500/60">
            <div className='h-full w-full flex flex-col gap-5 items-center' >
                <div id="pdf-viewer-iframe-container" className="flex justify-center h-full w-full overflow-y-scroll 2xl:overflow-y-hidden
                 relative @container/Iframe-container">
                    <Frame id="pdf-viewer-iframe" title="pdf-viewer-iframe" className='bg-white h-full w-full'
                        style={{ minHeight: "700px", minWidth: "804px", maxWidth: "804px" }}
                    >
                        <Preview resume={resume} />
                    </Frame>
                </div>
                <DownloadPdf resume={resume} isEditing={edited} />
            </div>
        </div>

    )
}

export default PdfViewer