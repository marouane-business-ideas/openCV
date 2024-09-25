"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
    const pathname = usePathname();
    return (
        <div className="md:p-6 p-2">
            <nav className="md:hidden">
                <Link href="/dashboard" className={`inline-block py-2 px-4 rounded transition duration-200
             ${pathname === "/dashboard" ? "bg-gray-200" : ""}`}>
                    Resume Previews
                </Link>
                <Link href="/dashboard/account" className={`inline-block py-2 px-4 rounded transition duration-200
             ${pathname === "/dashboard/account" ? "bg-gray-200" : ""}`}>
                    Account
                </Link>
            </nav>
            <nav className="hidden md:flex flex-col gap-3">
                <Link href="/dashboard" className={`block py-2.5 px-4 rounded transition duration-200
             ${pathname === "/dashboard" ? "bg-gray-200" : ""}`}>
                    Resume Previews
                </Link>
                <Link href="/dashboard/account" className={`block py-2.5 px-4 rounded transition duration-200
             ${pathname === "/dashboard/account" ? "bg-gray-200" : ""}`}>
                    Account
                </Link>
            </nav>
        </div >
    )
};

export default NavBar;