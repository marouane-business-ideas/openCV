import React from "react";
import { Link } from "react-router";

import { useHomePath } from "../../lib/homePath";

const ErrorPage: React.FC = () => {
    const homePath = useHomePath();

    return (
        <div id='error-page' className='flex flex-col gap-8 justify-center items-center h-screen'>
            <h1 className='text-4xl font-bold'>Oopsssss!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <Link className="mx-auto block px-5 py-3 hover:bg-blue-600 bg-blue-500 text-white font-bold rounded-lg" to={homePath}>
                Go to home page
            </Link>
        </div>
    );
};

export default ErrorPage;