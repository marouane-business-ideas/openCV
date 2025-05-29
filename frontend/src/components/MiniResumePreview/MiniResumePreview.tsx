import { ReactNode } from "react";

interface IProps {
    children: ReactNode
}

const MiniResumePreview = ({ children }: IProps) => {
    return (
        <div className="flex flex-col items-center bg-white m-8 shadow-gray-200 shadow-xl relative overflow-hidden"
            style={{ minWidth: "320px", maxWidth: "320px", minHeight: "450px", maxHeight: "450px" }} >
            <div aria-description="Classical resume template" className="flex relative overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default MiniResumePreview;