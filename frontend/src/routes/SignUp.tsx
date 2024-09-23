import { SignUp } from "@clerk/clerk-react"

export default function SignUpPage() {
    return <div className="absolute w-full h-full flex justify-center items-center"><SignUp path="/sign-up" /></div >
}