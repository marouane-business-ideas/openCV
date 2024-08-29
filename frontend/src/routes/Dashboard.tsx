import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

import Preview from "../features/Preview/Preview";
import { resumeInfoType } from "../context/ResumeContext";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;

interface IPdf {
    content: string;
    createdAt: string;
    filename: string;
    id: number;
}

function Dashboard() {
    const { user, isSignedIn } = useUser();
    const [pdfs, setPdfs] = useState<(IPdf)[]>([]);
    const { getToken } = useAuth();



    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        let token;

        (async () => {
            token = await getToken();

            fetch(`http://localhost:${BACKEND_PORT}/users/${user.id}/pdfs`, {
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
                })
                .catch(error => {
                    console.error("Error fetching PDFs:", error);
                });
        })()


    }
        , [getToken, isSignedIn, user?.id]);


    return (
        <>
            <header className="mb-6 flex justify-between items-center">
                <h2 className="text-3xl font-semibold mb-4">Your Resumes</h2>
                <Link to="/resume" className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                    Create New Resume
                </Link>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pdfs.map((pdf: IPdf) => {
                    const resumeData = JSON.parse(pdf.content) as resumeInfoType;
                    return (<div key={pdf.createdAt} className="flex flex-col items-center bg-white pt-2 p-6 shadow-md relative overflow-hidden"
                        style={{ minHeight: "450px", maxHeight: "450px", minWidth: "402px", maxWidth: "402px" }} >
                        <div className="flex relative overflow-x-hidden overflow-y-scroll">
                            <Preview
                                customClassName=""
                                customStyle={{ minWidth: "851px", transform: "scale(0.4)", transformOrigin: "top" }}
                                resume={resumeData} />
                        </div>
                        {/* Last updated is in GMT time, not user's locale time. Watch out ! */}
                        <p className="mt-2 text-gray-500">Last updated: {pdf.createdAt}</p>
                        <Link to={`/resume/${pdf.id}`} className="flex items-center justify-center mt-4 w-full bg-blue-500 text-white py-2
                         px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                            View/Edit
                        </Link>
                    </div>
                    )
                }
                )}
            </div>
            <div className="mt-8 w-2/4">
                <h3 className="text-2xl font-semibold mb-4">Account Information</h3>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-xl font-semibold">John Doe</p>
                    <p className="mt-2 text-gray-500">Email: johndoe@example.com</p>
                    <p className="mt-2 text-gray-500">Subscription: Premium</p>
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
