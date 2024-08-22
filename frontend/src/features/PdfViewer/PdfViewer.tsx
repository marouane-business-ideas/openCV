import { useContext } from "react";
import Frame from "react-frame-component"
import Preview from "../Preview/Preview"
import { ResumeContext } from "../../context/ResumeContext";
import useSuppressResumePDFErrorMessages from "../../lib/hooks/useSuppressResumePDFErrors";
import DownloadPdf from "../../components/DownloadPdf/DownloadPdf";

const PdfViewer = () => {
    useSuppressResumePDFErrorMessages();
    const resume = useContext(ResumeContext);

    return (
        <div className="w-1/2 h-full flex justify-center pt-5 pb-5">
            <div className='h-full w-5/6 flex flex-col gap-5 items-center' >
                <Frame id="pdf-viewer-iframe" title="Marouane-iframe" className='h-full w-full shadow-xl' style={{ minHeight: "700px" }}>
                    <Preview resume={resume} />
                </Frame>
                <DownloadPdf resume={resume} />
            </div>
        </div>

    )
}

export default PdfViewer