import Form from "../features/Form/Form"
import PdfViewer from "../features/PdfViewer/PdfViewer";

const ResumeBuilder = () => (
    <div className="flex flex-col 2xl:flex-row relative overflow-y-hidden items-center w-full bg-gray-50 h-screen
     2xl:h-[calc(100vh-var(--header-height))]"
    >
        <Form />
        <PdfViewer />
    </ div >
)

export default ResumeBuilder;