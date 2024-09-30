import React from "react";

const Spinner: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${className}`}></div>
        </div>
    );
};

export default Spinner;