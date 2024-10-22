import { useUser } from "@clerk/clerk-react";

import CheckMark from "../components/CheckMark/CheckMark";

const Subscribe = () => {
    const { user } = useUser();
    return (
        <div className="w-full bg-gradient-to-b from-blue-50 to-white">
            <div className="w-full max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Upgrade to Premium
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Stop worrying about downloads limit
                    </p>
                </div>

                <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-lg rounded-2xl shadow-xl border-2 
                     hover:border-blue-500/40 transition-all duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Premium Plan</h2>
                                    <p className="mt-2 text-gray-500">Everything you need to succeed</p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <p className="flex items-baseline">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900">$6</span>
                                    <span className="ml-2 text-gray-500">/year *</span>
                                </p>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {[
                                    "Unlimited access to all features",
                                    "Priority customer support",
                                    "Exclusive access to all new resume templates",
                                    "Exclusive access to all upcoming new features  (Download in .docx format, AI resume analysis, ...)",
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center space-x-3">
                                        <CheckMark />
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                <form action={`/api/users/${user?.id}/create-checkout-session`} method="POST">
                                    <input type="hidden" id="clerck_user_id" name="clerck_user_id" value={user?.id} />
                                    <input type="hidden" id="clerck_user_email" name="clerck_user_email"
                                        value={user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses[0].emailAddress}
                                    />
                                    <button
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-xl font-semibold rounded-xl
                                         shadow-lg hover:shadow-xl transition-all duration-300"
                                        type="submit"
                                    >
                                        Upgrade
                                    </button>
                                </form>
                            </div>
                            <p className="mt-4 text-sm text-center text-gray-500">
                                * Price available for first 100 subscribers only !
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscribe;

