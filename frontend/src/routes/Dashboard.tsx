import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

import SkeletonLoader from "../components/Skeleton";
import PdfCard from "../components/PdfCard/PdfCard";
import { IPdf } from "../Types/CommonTypes";


function Dashboard() {
    const { user, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const [pdfs, setPdfs] = useState<IPdf[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isSignedIn) {
            setIsLoading(false);
            return;
        }

        (async () => {
            setIsLoading(true);
            const token = await getToken();

            fetch(`/api/users/${user.id}/pdfs`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    setPdfs(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching PDFs:", error);
                    setError("Failed to load your resumes. Please try again later.");
                    setIsLoading(false);
                });
        })()
    }, [getToken, isSignedIn, user?.id]);

    return (
        <>
            <header className="mb-6 flex justify-between items-center">
                <h2 className="text-3xl text-center md:text-left w-full md:w-fit font-semibold mb-4">Your Resumes</h2>
                <Link to="/resume" className="bg-blue-500 text-white py-2 px-4 hidden lg:block rounded-lg shadow-md
                 hover:bg-blue-600 transition duration-200"
                    aria-label="Create New Resume">
                    Create New Resume
                </Link>
            </header>
            {error ? <p className="text-sm text-center text-red-500">{error}</p> :
                <div className="dashboard-grid flex flex-wrap justify-center xl:justify-normal">
                    {isLoading ? (
                        Array(3).fill(0).map((_, index) => (
                            <SkeletonLoader key={index} />
                        ))
                    ) : pdfs.length > 0 ? (
                        pdfs.map((pdf: IPdf) => (
                            <PdfCard key={pdf.id} pdf={pdf} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">No resumes found. <Link to="/resume" className="underline underline-offset-2 hover:underline-offset-4" aria-label="Create New Resume">Create your first resume!</Link></p>
                    )}
                </div>
            }

            <div className="mt-8 w-full flex flex-col lg:w-2/4">
                <h3 className="text-2xl text-center lg:text-left font-semibold mb-4">Account Information</h3>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {user && <p className="text-xl font-semibold">{user.fullName}</p>}
                    {user && <p className="mt-2 text-gray-500">Email: {user.emailAddresses[0].emailAddress}</p>}
                    <p className="mt-2 text-gray-500">Subscription: Free plan</p>
                    <Link to="/dashboard/account" className="flex items-center justify-center mt-4 w-full bg-blue-500 text-white py-2
                         px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                        Edit Account
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
