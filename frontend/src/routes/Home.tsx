import { Link } from "react-router-dom";

const Home: React.FC = () => {
    return (
        <div className="h-full px-3 py-36">
            <section className="mx-auto max-w-screen-lg">
                <h1 className="text-center text-5xl font-bold tracking-tight">Build amazing resumes in minutes</h1>
                <h2 className="mx-auto mt-5 max-w-screen-md text-center text-xl">
                    Land your dream job with our amazing resume templates.
                </h2>
            </section>
            <section className="mt-20">
                <Link className="mx-auto w-32 block px-5 py-3 hover:bg-blue-600 bg-blue-500 text-white font-bold rounded-lg" to="/resume">
                    Get started
                </Link>
            </section>
        </div>
    );
};

export default Home;