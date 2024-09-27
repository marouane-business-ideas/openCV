"use client";
import { useContext } from "react";
import useSWR from "swr";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ResumeDispatchContext } from "../../../context/ResumeContext";
import Form from "../../../features/Form/Form";
import PdfViewer from "../../../features/PdfViewer/PdfViewer";
import Spinner from "../../../components/Spinner/Spinner";
import { useParams } from "next/navigation";
import fetcher from "../../../lib/fetcher/fetcher";


const ResumeBuilder = () => {
    const { resumeId } = useParams<{ resumeId: string }>();
    const { user } = useUser();
    const { getToken } = useAuth();
    const dispatch = useContext(ResumeDispatchContext);

    const { data, error, isLoading } = useSWR(`/api/users/${user?.id}/pdfs/${resumeId}`, async (url: string) => {
        if (resumeId && !Number.isNaN(+resumeId)) {
            const token = await getToken();
            return fetcher(url, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
        }
    },
        {
            onErrorRetry: (error) => {
                // Never retry on 404.
                if (error.status === 404) return;
            }
        }
    );

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center" role="status">
                <Spinner />
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (error) {
        if (error.status === 404) {
            return (
                <div className="flex justify-center flex-col items-center h-[calc(100vh-var(--header-height))]">
                    <p className="text-xl text-black">The resume you are looking for does not exist.</p>
                    <Link href="/" className="mt-5 bg-blue-500 text-white py-2 px-4 lg:block rounded-lg shadow-md
                     hover:bg-blue-600 transition duration-200">
                        Return to the Home page
                    </Link>
                </div>
            );
        }
        return (
            <div className="flex justify-center flex-col items-center h-[calc(100vh-var(--header-height))]">
                <p className="text-lg text-gray-500">Something went wrong requesting your resume :(</p>
                <Link href="/" className="mt-5 bg-blue-500 text-white py-2 px-4 lg:block rounded-lg shadow-md
                     hover:bg-blue-600 transition duration-200">
                    Return to the Home page
                </Link>
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
};

export default ResumeBuilder;