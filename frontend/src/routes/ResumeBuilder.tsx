import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuth, useUser } from "@clerk/clerk-react";

import { ResumeDispatchContext } from "../context/ResumeContext";
import Form from "../features/Form/Form";
import PdfViewer from "../features/PdfViewer/PdfViewer";
import Spinner from "../components/Spinner/Spinner";
import useIsSmallScreen from "../lib/hooks/useIsSmallScreen";


const ResumeBuilder = () => {
    const { resumeId } = useParams();
    const { user, isSignedIn } = useUser();
    const [edited, setEdited] = useState(false);
    const { getToken } = useAuth();
    const dispatch = useContext(ResumeDispatchContext);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isSmallScreen = useIsSmallScreen();

    useEffect(() => {
        if (!isSignedIn) {
            setIsLoading(false);
            return;
        }

        (async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = await getToken();

                if (resumeId && !Number.isNaN(+resumeId)) {
                    const response = await fetch(`/api/users/${user?.id}/pdfs/${resumeId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch resume data");
                    }

                    const data = await response.json();
                    const parsedData = JSON.parse(data.jsonContent);
                    setEdited(true);
                    if (dispatch) {
                        dispatch({ type: "SET_EDITED_RESUME", payload: parsedData });
                    }
                } else {
                    setEdited(false);
                }
            } catch (error) {
                console.error("Error fetching PDF:", error);
                setError("Failed to load resume data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [dispatch, getToken, isSignedIn, resumeId, user?.id]);

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center" role="status">
                <Spinner />
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row relative overflow-y-hidden items-center w-full h-screen lg:h-[calc(100vh-var(--header-height))]">
            <Form edited={edited} />
            {!isSmallScreen && <PdfViewer edited={edited} />}
        </div>
    );
};

export default ResumeBuilder;