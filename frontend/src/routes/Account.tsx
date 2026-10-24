import { useContext } from "react";
import { Navigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";

import { AccountType_Type, ResumeContext } from "../context/ResumeContext";
import { FREE_FOR_EVERYONE } from "../lib/pricing";

const AccountPage = () => {
    const { accountType } = useContext(ResumeContext);
    const { user } = useUser();
    const { t, i18n } = useTranslation();

    const formatAccountType = (accountType: AccountType_Type) => {
        switch (accountType) {
            case "free":
                return t("account.free_account_type");
            case "premium":
                return t("account.premium_account_type");
            default:
                return accountType;
        }
    };

    // No plan to show or change while the app is free for everyone: e.g. an old link
    if (FREE_FOR_EVERYONE) return <Navigate to="/dashboard" replace />;

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">
                {t("account.title")}
            </h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    {t("account.current_plan")}
                </h2>
                <p className="text-md">
                    {formatAccountType(accountType.type)}
                </p>
            </div>
            {
                accountType.type === "free" && !FREE_FOR_EVERYONE && <>
                    <form action={`/api/users/${user?.id}/create-checkout-session`} method="POST">
                        <input type="hidden" id="clerck_user_id" name="clerck_user_id" value={user?.id} />
                        <input type="hidden" id="clerck_user_email" name="clerck_user_email"
                            value={user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0].emailAddress}
                        />
                        <input type="hidden" name="language" value={i18n.language} />
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            type="submit"
                        >
                            {t("account.upgrade_button")}
                        </button>
                    </form>
                </>
            }
            {
                accountType.type === "premium" && <>
                    <p className="text-md text-gray-600 mb-4">{t("account.manage_subscription_hint")}</p>
                    <form action={`/api/users/${user?.id}/manage-subscription`} method="POST">
                        <input type="hidden" name="language" value={i18n.language} />
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                            type="submit"
                        >
                            {t("account.manage_subscription_button")}
                        </button>
                    </form>
                </>
            }
        </div >
    );
};

export default AccountPage;
