import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { ReactNode, useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isLoaded, isSignedIn } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center" role="status">
                <Spinner />
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/sign-in" />;
    }

    return <>{children}</>

};

export default ProtectedRoute;
