import { useState, useEffect } from "react";

const AccountPage = () => {
    const [user, setUser] = useState({ accountType: "free" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     // Fetch user data and subscription status
    //     const fetchUserData = async () => {
    //         try {
    //             const response = await axios.get('/api/users/me'); // Replace with your user endpoint
    //             setUser(response.data);
    //             setIsLoading(false);
    //         } catch (err) {
    //             setError(err.message);
    //             setIsLoading(false);
    //         }
    //     };
    //     fetchUserData();
    // }, []);

    const handleSubscribe = async () => {
        // try {
        //     await axios.post("/api/subscribe"); // Replace with your subscription endpoint
        //     setUser({ ...user, accountType: "premium" });
        // } catch (err) {
        //     setError(err.message);
        // }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Account Page</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Your Current Plan</h2>
                <p className="text-lg">
                    {user.accountType === "premium" ? "Premium" : "Free"} Plan
                </p>
            </div>
            {user.accountType === "free" && (
                <button
                    onClick={handleSubscribe}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Upgrade to Premium
                </button>
            )}
            {user.accountType === "premium" && (
                <div className="mt-4">
                    <p className="text-green-600">You are already on the Premium Plan!</p>
                </div>
            )}
        </div>
    );
};

export default AccountPage;
