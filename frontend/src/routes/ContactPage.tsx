import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";


const ContactPage: React.FC = () => {
    const [isSuccess, setSuccess] = useState<boolean | null>(null);
    const [isError, setError] = useState<boolean | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const { user, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const { t } = useTranslation();


    const submitForm = async (name: FormDataEntryValue | null, formMessage: FormDataEntryValue | null) => {
        if (!isSignedIn) return;

        try {
            const token = await getToken();
            setIsPending(true);
            const response = await fetch(`/api/users/${user.id}/contact-form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name, userEmailAddress: user.primaryEmailAddress?.emailAddress, formMessage }),
            });

            setIsPending(false);

            if (response.ok) {
                setSuccess(true);
            }

            if (!response.ok) {
                console.error("Error response:", response);
                throw new Error("Something went wrong sumitting the form");
            }

        } catch (error) {
            setError(true);
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name");
        const formMessage = formData.get("formMessage");

        await submitForm(name, formMessage);

    };


    return (
        <div className="h-[calc(100vh-var(--header-height))] flex justify-center items-center">
            {isSuccess ?
                <div className="flex flex-col gap-8">
                    <span className="lg:text-base text-sm text-center">
                        {t("contact.success_message")}
                    </span>
                    <Link className="mx-auto block px-5 py-3 hover:bg-blue-600 bg-blue-500 text-white font-bold rounded-lg" to="/">
                        {t("contact.go_to_home")}
                    </Link>
                </div>
                : <div className="lg:w-6/12 w-4/5">
                    <h1 className="text-3xl font-bold mb-4 text-center">{t("contact.title")}:</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center bg-white shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">
                                {t("contact.name")}:
                            </label>
                            <input
                                id="userName"
                                type="text"
                                name="name"
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                         focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="formMessage" className="block text-gray-700 text-sm font-bold mb-2">{t("contact.message")}:</label>
                            <textarea
                                id="formMessage"
                                name="formMessage"
                                required
                                rows={4}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                         focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="w-full flex flex-col items-center">
                            <button type="submit" className="text-white w-full font-bold py-2 px-4 rounded-2xl
                      focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-600">
                                {t("contact.send")}
                            </button>
                            {isError && !isPending && <p className="text-sm mt-5 text-center text-red-500">
                                {t("contact.error_message")}
                            </p>
                            }
                            {isPending && <ArrowPathIcon className="animate-spin size-7 mt-5 text-blue-400" aria-hidden="true" />}
                        </div>
                    </form>
                </div>
            }
        </div >
    );
};

export default ContactPage;
