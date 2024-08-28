import { useContext, useEffect, useState } from "react";
import { ResumeDispatchContext } from "../context/ResumeContext";
import Form from "../features/Form/Form"
import PdfViewer from "../features/PdfViewer/PdfViewer";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;

const ResumeBuilder = () => {
    const { resumeId } = useParams();
    const { user } = useUser();
    const [edited, setEdited] = useState(false);

    const dispatch = useContext(ResumeDispatchContext);


    useEffect(() => {
        if (resumeId && !Number.isNaN(+resumeId)) {
            fetch(`http://localhost:${BACKEND_PORT}/users/${user?.id}/pdfs/${resumeId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    const parsedData = JSON.parse(data.content);
                    setEdited(true)
                    if (dispatch)
                        dispatch({ type: "SET_EDITED_RESUME", payload: parsedData })
                })
                .catch(error => {
                    console.error("Error fetching PDF:", error);
                });
        } else {
            setEdited(false);
        }
    }, [dispatch, resumeId, user?.id]);

    return (
        <div className="flex flex-col 2xl:flex-row relative overflow-y-hidden items-center w-full h-screen 2xl:h-[calc(100vh-var(--header-height))]">
            <Form edited={edited} />
            <PdfViewer edited={edited} />
        </div>
    );
}

export default ResumeBuilder;