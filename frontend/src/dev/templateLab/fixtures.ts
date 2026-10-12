import { getResumeDummyData, LanguageLevelType, resumeInfoType } from "../../context/ResumeContext";

export interface Fixture {
    label: string;
    resume: resumeInfoType;
}

// The resume shown in the picture the modern template was designed from (typos included, to get the same line breaks)
const reference: resumeInfoType = {
    resumeTemplate: "modern",
    personalInfo: {
        name: "Lea Valberg",
        title: "Senior Marketing Executive",
        email: "valberglea@email.com",
        phoneNumber: "1239000009",
        location: "1108 Lenview Dr, Brooklyn, New York 123912",
        nationality: "",
        summary: "I have been in the marketing industry for nearly 9 years. I understand digital marketing, how guerilla marketing " +
            "works and the value in traditional marketing. I can use a host of tools to analyze metrics, measure campaign performance " +
            "and make changes as needed to optimize results",
    },
    workExperience: [
        {
            company: "Blue Media",
            jobTitle: "Digital Media Specialist",
            date: "2016 - Present",
            location: "",
            description: "<ul><li>Assisted with all digital media inquiries.</li>" +
                "<li>Understood each client’s unique needs, and provided solutions specific to their interests and restrictions</li>" +
                "<li>Explained promotions, extended services; used databases to search for productsUsed pump trucks and other equipment</li></ul>",
            id: "reference-job-1",
        },
        {
            company: "Great Buy Canada",
            jobTitle: "Connected Home Specialist",
            date: "2015 - 2016",
            location: "",
            description: "<ul><li>Effective sales associate with strong customer service training and relevant certifications</li>" +
                "<li>Explained promotions, extended services; used databases to search for products</li>" +
                "<li>Used pump trucks and other equipment</li></ul>",
            id: "reference-job-2",
        },
        {
            company: "Home Centre",
            jobTitle: "Seasonal Sales Associate",
            date: "2014 - 2015",
            location: "",
            description: "<ul><li>Learned about various products and provided solutions to customer inquiries.</li>" +
                "<li>Lifted loads of up to 110 lbs, stocked shelves and maintained an organized showroom</li></ul>",
            id: "reference-job-3",
        },
    ],
    education: [
        { schoolName: "University of New York", degree: "Marketing & Psychology", date: "", description: "B.A. (Honours)", id: "reference-school-1" },
        { schoolName: "St. Alves High School", degree: "", date: "", description: "Honours", id: "reference-school-2" },
    ],
    skills: ["Digital Marketing", "Graphic Design", "Campaign Management", "Copy Writing", "Management"],
    languages: [],
    links: [{ linkName: "lvalberg/linkedin", linkUrl: "linkedin.com/in/lvalberg", id: "reference-link-1" }],
    themeColor: "#38bdf8",
};

const longDescription = "<ul>" +
    "<li>Led the redesign of the customer onboarding, cutting the time to first value from two weeks to three days.</li>" +
    "<li>Built and coached a team of eight engineers, two of whom were promoted to senior positions.</li>" +
    "<li>Introduced continuous delivery: from one release a month to several deployments a day, with fewer incidents.</li>" +
    "<li>Négocié et piloté des partenariats avec des éditeurs européens (contrats, intégration, suivi qualité).</li>" +
    "</ul>";

// Stresses the layout: many entries spanning several pages, long unbreakable strings, accents
const long: resumeInfoType = {
    resumeTemplate: "modern",
    personalInfo: {
        name: "Maximilienne Dupont-Fontaine",
        title: "Directrice technique & responsable des plateformes de paiement",
        email: "maximilienne.dupont-fontaine@entreprise-avec-un-nom-tres-long.example.com",
        phoneNumber: "+33612345678",
        location: "12 rue des Petits-Champs, 75002 Paris, France",
        nationality: "Française",
        summary: "Engineering leader with fifteen years of experience building payment platforms used by millions of people. " +
            "I enjoy turning ambiguous business problems into simple, reliable systems, and growing the teams that run them.\n" +
            "Passionnée par la transmission : mentorat, conférences et contributions open source.",
    },
    workExperience: [
        "Fintech Solutions Internationales",
        "Global Payments Corporation",
        "Startup Studio",
        "Banque Européenne d'Investissement Numérique",
        "Consulting Partners",
        "Université Paris-Saclay",
    ].map((company, index) => ({
        company,
        jobTitle: index % 2 ? "Senior Software Engineer" : "Engineering Manager — Payments & Fraud Prevention",
        date: `${2020 - 3 * index} - ${index ? 2023 - 3 * index : "Present"}`,
        location: index % 2 ? "Lyon, France" : "Paris, France",
        description: longDescription,
        id: `long-job-${index}`,
    })),
    education: [
        { schoolName: "École Polytechnique", degree: "Master of Science in Computer Science", date: "2006 - 2008",
            description: "Specialized in distributed systems and cryptography.", id: "long-school-1" },
        { schoolName: "Université Pierre et Marie Curie", degree: "Licence de mathématiques", date: "2003 - 2006",
            description: "Mention très bien.", id: "long-school-2" },
        { schoolName: "Lycée Henri-IV", degree: "Baccalauréat scientifique", date: "2003", description: "", id: "long-school-3" },
    ],
    skills: ["TypeScript", "Node.js", "React", "PostgreSQL", "Kafka", "Kubernetes", "AWS", "Terraform", "Go", "Python",
        "Domain-Driven Design", "Payments (PCI-DSS)", "Hiring & mentoring", "Public speaking",
        // A word without any place to break, longer than the narrow columns of some templates
        "Microsoft.Extensions.DependencyInjection"],
    // Levels as resumes saved before the form saved keys: the label the user picked, in English or in French
    languages: [
        { language: "French", level: "Native" as LanguageLevelType, id: "long-language-1" },
        { language: "English", level: "Fluent" as LanguageLevelType, id: "long-language-2" },
        { language: "German", level: "Intermediate" as LanguageLevelType, id: "long-language-3" },
        { language: "Japanese", level: "Débutant" as LanguageLevelType, id: "long-language-4" },
    ],
    links: [
        { linkName: "github.com/maximilienne-dupont-fontaine", linkUrl: "https://github.com/maximilienne-dupont-fontaine", id: "long-link-1" },
        { linkName: "", linkUrl: "https://www.linkedin.com/in/maximilienne-dupont-fontaine-0123456789", id: "long-link-2" },
        { linkName: "Blog", linkUrl: "https://maximilienne.dev", id: "long-link-3" },
    ],
    themeColor: "#6366f1",
};

// What the form looks like before the user types anything
const empty: resumeInfoType = {
    resumeTemplate: "modern",
    personalInfo: { name: "", title: "", email: "", phoneNumber: "", location: "", nationality: "", summary: "" },
    workExperience: [{ company: "", jobTitle: "", date: "", description: "", location: "", id: "empty-job" }],
    education: [{ schoolName: "", degree: "", date: "", description: "", id: "empty-school" }],
    skills: [""],
    languages: [{ language: "", level: "", id: "empty-language" }],
    links: [{ linkName: "", linkUrl: "", id: "empty-link" }],
    themeColor: "",
};

export const fixtures: Record<string, Fixture> = {
    sample: { label: "Sample (home page)", resume: getResumeDummyData() },
    reference: { label: "Reference picture (Lea Valberg)", resume: reference },
    long: { label: "Long resume (several pages)", resume: long },
    empty: { label: "Empty form", resume: empty },
};
