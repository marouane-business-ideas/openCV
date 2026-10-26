// Age in whole years on a given day, from a date of birth as the form's date input saves it ("1990-04-23").
// No age for an empty or invalid date, or a date after that day
export const ageFromBirthDate = (birthDate: string | undefined, today: Date = new Date()): number | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate ?? "");
    if (!match) return null;

    const [year, month, day] = match.slice(1).map(Number);
    // Rejects days that don't exist ("2023-02-30"), which Date would move to the next month
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;

    const hadBirthdayThisYear = today.getMonth() > month - 1 || (today.getMonth() === month - 1 && today.getDate() >= day);
    const age = today.getFullYear() - year - (hadBirthdayThisYear ? 0 : 1);
    return age >= 0 ? age : null;
};
