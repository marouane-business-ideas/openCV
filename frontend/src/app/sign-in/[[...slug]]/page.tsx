import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
    return <div className="absolute w-full h-full flex justify-center items-center"><SignIn path="/sign-in" /></div>
}