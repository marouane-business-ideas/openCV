"use client";

import Link from "next/link";

const ErrorPage: React.FC = () => {
    return (
        <div className="flex flex-col gap-8 justify-center items-center h-screen">
            <h1 className="text-4xl font-bold">Oopsssss!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <Link href="/" className="bg-blue-500 text-white py-2 px-4 hidden lg:block rounded-lg shadow-md
                 hover:bg-blue-600 transition duration-200"
                aria-label="Create New Resume">
                Return to the Home page
            </Link>
        </div>
    );
};

export default ErrorPage;