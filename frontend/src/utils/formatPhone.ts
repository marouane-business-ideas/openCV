/**
 * Formats a phone number by adding spaces every 2 digits
 * Only allows digits and optionally a "+" at the beginning
 * @param phoneNumber - The phone number string to format
 * @returns The formatted phone number with spaces
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) return "";

    // Handle international numbers with + prefix
    const hasPlus = phoneNumber.startsWith("+");
    const digitsOnly = hasPlus ? phoneNumber.slice(1) : phoneNumber;

    // Add spaces every 2 digits
    const formatted = digitsOnly.replace(/(\d{2})(?=\d)/g, "$1 ");

    return hasPlus ? `+${formatted}` : formatted;
};