import useAutosizeTextareaHeight from "../../lib/hooks/useAutosizeTextareaHeight";

interface TextAreaProps {
    id: string;
    name: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
}

const TextArea = ({ id, name, placeholder, onChange, value }: TextAreaProps) => {
    const textAreaRef = useAutosizeTextareaHeight({ value });
    return (
        <textarea
            ref={textAreaRef}
            onChange={onChange}
            className="text border p-1 rounded-md focus:outline-none border-gray-300"
            id={id} name={name} placeholder={placeholder} value={value} />);
};

export default TextArea;