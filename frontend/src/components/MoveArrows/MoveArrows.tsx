import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { resumeInfoType } from "../../context/ResumeContext";

interface MoveArrowProps {
    items: resumeInfoType['workExperience'] | resumeInfoType['education'];
    index: number;
    handleMovingArround: (index: number, direction: 'up' | 'down') => void;
}

const MoveArrows = ({ items, index, handleMovingArround }: MoveArrowProps) => {
    if (items.length === 1) return null;

    const isFirstItem = index === 0;
    const isLastItem = index === items.length - 1;

    return (
        <div className="flex gap-2">
            {!isFirstItem && (
                <button
                    onClick={() => handleMovingArround(index, 'up')}
                    aria-label="Move up"
                >
                    <ArrowUpIcon className="size-4 text-gray-400" />
                </button>
            )}
            {!isLastItem && (
                <button
                    onClick={() => handleMovingArround(index, 'down')}
                    aria-label="Move down"
                >
                    <ArrowDownIcon className="size-4 text-gray-400" />
                </button>
            )}
        </div>
    );
};

export default MoveArrows;