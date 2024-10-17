const SkeletonLoader = () => (
    <div className="bg-white p-6 shadow-md animate-pulse" style={{ minHeight: "450px", maxHeight: "450px", minWidth: "402px", maxWidth: "402px" }}>
        <div className="h-64 bg-gray-200 mb-4"></div>
        <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
        <div className="h-10 bg-gray-200 w-full"></div>
    </div>
);

export default SkeletonLoader;