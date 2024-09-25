"use client";
import { useContext } from "react";
import useSWR from "swr";
import { ResumeDispatchContext } from "../../../context/ResumeContext";
import Form from "../../../features/Form/Form"
import PdfViewer from "../../../features/PdfViewer/PdfViewer";
import { useAuth, useUser } from "@clerk/nextjs";
import Spinner from "../../../components/Spinner/Spinner";
import { useParams } from "next/navigation";
import fetcher from "../../../lib/fetcher/fetcher";


const ResumeBuilder = () => {
    const { resumeId } = useParams<{ resumeId: string }>();
    const { user } = useUser();
    const { getToken } = useAuth();
    const dispatch = useContext(ResumeDispatchContext);

    const { data, error, isLoading } = useSWR(`http://localhost:1337/api/users/${user?.id}/pdfs/${resumeId}`, async (url: string) => {
        if (resumeId && !Number.isNaN(+resumeId)) {
            const token = await getToken();
            return fetcher(url, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
        }
    });

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

    if (dispatch && !!data?.content) {
        dispatch({ type: "SET_EDITED_RESUME", payload: JSON.parse(data.content) });
    }

    return (
        <div className="flex flex-col 2xl:flex-row relative overflow-y-hidden items-center w-full h-screen 2xl:h-[calc(100vh-var(--header-height))]">
            <Form edited={true} />
            <PdfViewer edited={true} />
        </div>
    );
}

export default ResumeBuilder;