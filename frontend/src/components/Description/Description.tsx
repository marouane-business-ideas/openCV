import Editor, { ContentEditableEvent } from "react-simple-wysiwyg";


interface DescriptionProps {
    html: string;
    className?: string;
    index: number;
    onChange: (e: ContentEditableEvent, property: "description", index: number) => void;
}

function Description({ html, onChange, index }: DescriptionProps) {

    function handleChange(e: ContentEditableEvent) {
        onChange(e, "description", index);
    }

    return (
        <Editor className='list-disc' name='description' value={html} onChange={handleChange} />
    );
}


export default Description