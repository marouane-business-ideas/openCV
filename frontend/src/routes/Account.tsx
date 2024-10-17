import { useContext } from "react";
import { useUser } from "@clerk/clerk-react";

import { ResumeContext } from "../context/ResumeContext";

const AccountPage = () => {
    const { accountType } = useContext(ResumeContext);
    const { user } = useUser();

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Account Page</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Your Current Plan</h2>
                <p className="text-md uppercase">
                    {accountType.type}
                </p>
            </div>
            {
                accountType.type === "free" && <>
                    <form action={`/api/users/${user?.id}/create-checkout-session`} method="POST">
                        <input type="hidden" id="clerck_user_id" name="clerck_user_id" value={user?.id} />
                        <input type="hidden" id="clerck_user_email" name="clerck_user_email"
                            value={user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0].emailAddress}
                        />
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            type="submit"
                        >
                            Upgrade to Premium
                        </button>
                    </form>
                </>
            }
        </div >
    );
};

export default AccountPage;
