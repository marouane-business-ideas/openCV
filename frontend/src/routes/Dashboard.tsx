import { Link } from "react-router-dom";
import { useContext } from "react";
import { ResumeContext } from "../context/ResumeContext";
import Preview from "../features/Preview/Preview";

function Dashboard() {
    const resume = useContext(ResumeContext);
    return (
        <>
            <header className="mb-6 flex justify-between items-center">
                <h2 className="text-3xl font-semibold mb-4">Your Resumes</h2>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                    Create New Resume
                </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col items-center bg-white pt-2 p-6 shadow-md relative overflow-hidden"
                    style={{ minHeight: "450px", maxHeight: "450px", minWidth: "402px", maxWidth: "402px" }} >
                    <div className="flex relative overflow-x-hidden overflow-y-scroll">
                        <Preview
                            customClassName=""
                            customStyle={{ minWidth: "851px", transform: "scale(0.4)", transformOrigin: "top" }} resume={resume} />
                    </div>
                    <p className="mt-2 text-gray-500">Last updated: Aug 25, 2024</p>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md
                         hover:bg-blue-600 transition duration-200">
                        View/Edit
                    </button>
                </div>
                <div className="flex flex-col items-center bg-white pt-2 p-6 shadow-md relative overflow-hidden"
                    style={{ minHeight: "450px", maxHeight: "450px", minWidth: "402px", maxWidth: "402px" }} >
                    <div className="flex relative overflow-x-hidden overflow-y-scroll">
                        <Preview
                            customClassName=""
                            customStyle={{ minWidth: "851px", transform: "scale(0.4)", transformOrigin: "top" }} resume={resume} />
                    </div>
                    <p className="mt-2 text-gray-500">Last updated: Aug 25, 2024</p>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md
                         hover:bg-blue-600 transition duration-200">
                        View/Edit
                    </button>
                </div>
                <div className="flex flex-col items-center bg-white pt-2 p-6 shadow-md relative overflow-hidden"
                    style={{ minHeight: "450px", maxHeight: "450px", minWidth: "402px", maxWidth: "402px" }} >
                    <div className="flex relative overflow-x-hidden overflow-y-scroll">
                        <Preview
                            customClassName=""
                            customStyle={{ minWidth: "851px", transform: "scale(0.4)", transformOrigin: "top" }} resume={resume} />
                    </div>
                    <p className="mt-2 text-gray-500">Last updated: Aug 25, 2024</p>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md
                         hover:bg-blue-600 transition duration-200">
                        View/Edit
                    </button>
                </div>
                <div className="flex flex-col items-center bg-white pt-2 p-6 shadow-md relative overflow-hidden"
                    style={{ minHeight: "450px", maxHeight: "450px", minWidth: "402px", maxWidth: "402px" }} >
                    <div className="flex relative overflow-x-hidden overflow-y-scroll">
                        <Preview
                            customClassName=""
                            customStyle={{ minWidth: "851px", transform: "scale(0.4)", transformOrigin: "top" }} resume={resume} />
                    </div>
                    <p className="mt-2 text-gray-500">Last updated: Aug 25, 2024</p>
                    <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md
                         hover:bg-blue-600 transition duration-200">
                        View/Edit
                    </button>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Account Information</h3>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-xl font-semibold">John Doe</p>
                    <p className="mt-2 text-gray-500">Email: johndoe@example.com</p>
                    <p className="mt-2 text-gray-500">Subscription: Premium</p>
                    <Link to="/dashboard/account">
                        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                            Edit Account
                        </button>
                    </Link>
                </div>
            </div>
        </>

    );
}

export default Dashboard;
