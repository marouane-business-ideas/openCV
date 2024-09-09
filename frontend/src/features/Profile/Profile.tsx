import { useState, useContext, useEffect } from "react";
import Card from "../../components/Card/Card"
import { resumeInfoType, ResumeContext, ResumeDispatchContext } from "../../context/ResumeContext";
import TextArea from "../../components/TextArea/TextArea";

const Profile = ({ edited }: { edited: boolean }) => {
    const { onGoingResume, resumeBeingEdited } = useContext(ResumeContext);
    const dispatch = useContext(ResumeDispatchContext);

    const personalInfo = edited ? (resumeBeingEdited as resumeInfoType).personalInfo : onGoingResume.personalInfo;

    const [errors, setErrors] = useState({ email: "", phone: "", name: "", location: "" });
    const [touchedFields, setTouchedFields] = useState({
        name: false,
        email: false,
        phoneNumber: false,
        location: false,
    });

    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone: string) => {
        // Remove all non-digit characters
        const digitsOnly = phone.replace(/\D/g, "");
        // Check if the number of digits is between 7 and 15
        return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    };

    const validateField = (property: keyof resumeInfoType["personalInfo"], value: string) => {
        switch (property) {
            case "email":
                setErrors(prev => ({ ...prev, email: validateEmail(value) ? "" : "Invalid email format" }));
                break;
            case "phoneNumber":
                setErrors(prev => ({ ...prev, phone: validatePhone(value) ? "" : "Invalid phone number format" }));
                break;
            case "name":
            case "location":
                setErrors(prev => ({ ...prev, [property]: value.trim() === "" ? `${property} is required` : "" }));
                break;
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        property: keyof Omit<resumeInfoType["personalInfo"], "isValid">) => {
        const value = e.target.value;
        if (dispatch) {
            dispatch({
                type: `SET_PERSONAL_INFO${edited ? "_EDITED" : ""}`,
                payload: { [property]: value }
            });
        }

        if (property !== "title" && property !== "summary" && touchedFields[property]) {
            validateField(property, value);
        }
    }


    const handleBlur = (property: keyof typeof touchedFields) => {
        setTouchedFields(prev => ({ ...prev, [property]: true }));
        validateField(property, personalInfo[property]);
    }

    const isEmptyField = (value: string) => value.trim() === "";

    const inputClassName = (value: string, fieldName: string) => `
        border p-1 rounded-md focus:outline-none
        ${touchedFields[fieldName as keyof typeof touchedFields] && isEmptyField(value)
            ? "border-red-500 border-2"
            : "border-gray-300"
        }
    `;

    useEffect(() => {
        const isProfileValid = (
            personalInfo.name.trim() !== "" &&
            personalInfo.email.trim() !== "" &&
            personalInfo.phoneNumber.trim() !== "" &&
            personalInfo.location.trim() !== "" &&
            validateEmail(personalInfo.email) &&
            validatePhone(personalInfo.phoneNumber)
        );

        if (dispatch) {
            dispatch({
                type: `SET_PROFILE_VALIDITY${edited ? "_EDITED" : ""}`,
                payload: isProfileValid
            });
        }
    }, [personalInfo, dispatch, edited]);

    return (
        <Card>
            <div className="flex flex-col gap-2 pb-12">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Profile</h2>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="name">Name</label>
                    <input
                        onChange={(e) => handleInputChange(e, "name")}
                        onBlur={() => handleBlur("name")}
                        className={inputClassName(personalInfo.name, "name")}
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Name"
                        value={personalInfo.name}
                    />
                    {touchedFields.name && errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="title">Title (Optional)</label>
                    <TextArea
                        id="title"
                        name="title"
                        placeholder="Frontend Developer"
                        onChange={(e) => handleInputChange(e, "title")}
                        value={personalInfo.title}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-base font-medium text-gray-700" htmlFor="summary">Summary (Optional)</label>
                    <TextArea
                        id="summary"
                        name="summary"
                        placeholder="Conquer the world"
                        onChange={(e) => handleInputChange(e, "summary")}
                        value={personalInfo.summary}
                    />
                </div>
                <div className="flex gap-2 justify-between">
                    <div className="flex flex-col gap-2 w-3/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => handleInputChange(e, "email")}
                            onBlur={() => handleBlur("email")}
                            className={inputClassName(personalInfo.email, "email")}
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="email@email.com"
                            value={personalInfo.email}
                        />
                        {touchedFields.email && errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>
                    <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="number">Phone Number</label>
                        <input
                            onChange={(e) => handleInputChange(e, "phoneNumber")}
                            onBlur={() => handleBlur("phoneNumber")}
                            className={inputClassName(personalInfo.phoneNumber, "phoneNumber")}
                            type="tel"
                            id="number"
                            name="number"
                            required
                            placeholder="+33(0) 6 39 33 33 44"
                            value={personalInfo.phoneNumber}
                        />
                        {touchedFields.phoneNumber && errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                    </div>
                </div>
                <div className="flex gap-2 justify-between">
                    <div className="flex flex-col gap-2 w-2/5">
                        <label className="text-base font-medium text-gray-700" htmlFor="location">Location</label>
                        <input
                            onChange={(e) => handleInputChange(e, "location")}
                            onBlur={() => handleBlur("location")}
                            className={inputClassName(personalInfo.location, "location")}
                            type="text"
                            id="location"
                            name="location"
                            required
                            placeholder="Paris, France"
                            value={personalInfo.location}
                        />
                        {touchedFields.location && errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default Profile