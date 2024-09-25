import classNames from "classnames";

export const dynamic = "force-static";

const AccountPage = () => {
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Account Page</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Your Current Plan</h2>
                <p className="text-lg">
                    Free Plan
                </p>
            </div>
            <>
                <button
                    disabled
                    title="Premium plan is not available yet"
                    className={classNames(
                        "px-4 py-2 bg-blue-500 text-white rounded-lg",
                        { "hover:bg-blue-600 transition duration-200": false },
                        { "bg-gray-300": true },
                        { "cursor-not-allowed": true }
                    )}
                >
                    Upgrade to Premium
                </button>
                <p className="text-sm text-gray-500 mt-2">
                    Premium plan is not available yet.
                </p>
            </>
        </div >
    );
};

export default AccountPage;
