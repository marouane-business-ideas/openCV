import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col gap-8 justify-center items-center h-[calc(100vh-var(--header-height))]">
            <h1 className="text-2xl text-black">Not Found</h1>
            <Link href="/" className="bg-blue-500 text-white py-2 px-4 hidden lg:block rounded-lg shadow-md
     hover:bg-blue-600 transition duration-200"
                aria-label="Create New Resume">
                Return to the Home page
            </Link>
        </div>
    );
}