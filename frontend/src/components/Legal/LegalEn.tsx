import { LegalSection, SupportEmail, ToFill } from "./LegalParts";

// A translation of the binding French version (LegalFr.tsx): keep both in line
const LegalEn = () => (
    <>
        <h1>Legal notice, terms and privacy</h1>
        <p className="text-sm text-gray-500">Last updated: October 22, 2026</p>

        <nav aria-label="Contents">
            <ol>
                <li><a href="#legal-notice">Legal notice</a></li>
                <li><a href="#terms">Terms of sale and use</a></li>
                <li><a href="#privacy">Privacy policy</a></li>
            </ol>
        </nav>

        <LegalSection id="legal-notice" title="1. Legal notice">
            <h3>Publisher</h3>
            <p>
                The website onlineresume.dev (“OnlineResume”) is published by: <ToFill>[TO FILL IN: full name followed by
                “EI”, or company name, legal form and share capital]</ToFill>.
            </p>
            <ul>
                <li>Address: <ToFill>[TO FILL IN: registered office or domiciliation address]</ToFill></li>
                <li>Email: <SupportEmail /></li>
                <li>Phone: <ToFill>[TO FILL IN: phone number]</ToFill></li>
                <li>Registration: <ToFill>[TO FILL IN: SIREN number, and RCS or RNE depending on the activity]</ToFill></li>
                <li>
                    VAT: <ToFill>[TO FILL IN: EU VAT number, or “TVA non applicable, article 293 B du CGI”]</ToFill>
                </li>
            </ul>
            <p>Publication director: <ToFill>[TO FILL IN: name of the publication director]</ToFill></p>

            <h3>Host</h3>
            <p>
                OVH SAS, 2 rue Kellermann, 59100 Roubaix, France, +33 9 72 10 10 07. The website’s servers are located
                in Canada.
            </p>

            <h3>Intellectual property</h3>
            <p>
                The website, its texts, logo and resume templates are protected by intellectual property law: they may
                not be reproduced without permission, beyond the use the service is for, creating and using your own
                resumes. What you write in your resumes belongs to you.
            </p>
        </LegalSection>

        <LegalSection id="terms" title="2. Terms of sale and use">
            <h3>Purpose</h3>
            <p>
                OnlineResume is an online service to create resumes and download them as PDF files. These terms apply to
                its use and to the Premium subscription. Creating an account or subscribing means accepting them.
            </p>

            <h3>Account</h3>
            <p>
                Downloading or saving a resume requires an account. You are responsible for your credentials and for the
                content of your resumes.
            </p>

            <h3>Free plan</h3>
            <p>With a free account, you can download 5 resumes as PDF files, without a credit card.</p>

            <h3>Premium subscription</h3>
            <ul>
                <li><strong>What it includes:</strong> unlimited resume downloads for as long as the subscription lasts.</li>
                <li>
                    <strong>Price:</strong> the one shown on the subscription page, in euros, all taxes included. The
                    exact total is shown on the payment page, before you confirm the order.
                </li>
                <li>
                    <strong>Payment:</strong> by card, when you subscribe, through our payment provider Stripe. We never
                    have access to your card numbers.
                </li>
                <li>
                    <strong>Duration and renewal:</strong> the subscription lasts one year. It renews automatically for
                    one year, at the price then in force, unless you cancel it. We inform you by email, no earlier than
                    three months and no later than one month before each renewal date, that you can choose not to renew
                    it (article L215-1 of the French Consumer Code).
                </li>
                <li>
                    <strong>Cancellation:</strong> at any time and online, from the Account page (“Manage or cancel my
                    subscription”). It takes effect at the end of the period already paid for: Premium stays active until
                    then, after which your account goes back to the free plan, with 5 new downloads. The current period
                    isn’t refunded pro rata.
                </li>
            </ul>

            <h3>Right of withdrawal</h3>
            <p>
                If you are a consumer, you have 14 days from subscribing to withdraw, without giving a reason or paying
                any fee (article L221-18 of the French Consumer Code). To do so, tell us your decision by email at
                {" "}<SupportEmail /> or through the contact form, for example: “I withdraw from my Premium subscription
                taken on [date] with the account [email address]”. We refund the full amount paid no later than 14 days
                after your request, with the payment method you used, and your account goes back to the free plan.
            </p>

            <h3>Deleting your account</h3>
            <p>
                You can delete your account at any time, from the Account page or by writing to us. Deleting it erases
                your account and your saved resumes, and ends your Premium subscription immediately, without a refund of
                the remaining period, unless you are still within the withdrawal period.
            </p>

            <h3>Legal guarantee of conformity</h3>
            <p>
                If you are a consumer, you benefit from the legal guarantee of conformity for digital content and services
                (articles L224-25-12 and following of the French Consumer Code). If the service doesn’t work as it
                should, write to us at <SupportEmail />.
            </p>

            <h3>Availability of the service</h3>
            <p>
                We do our best to keep the service available at all times, but it may be interrupted, for maintenance in
                particular. You remain responsible for the content of your resumes and for how you use them.
            </p>

            <h3>Changes to these terms</h3>
            <p>
                These terms may change. The ones that apply to your subscription are those in force when you subscribed
                or when it last renewed. We inform you by email of any significant change.
            </p>

            <h3>Complaints and mediation</h3>
            <p>
                For any complaint, write to us at <SupportEmail />. If we can’t find a solution, you can turn, free of
                charge, to the following consumer mediator, within a year of your written complaint: <ToFill>[TO FILL IN:
                name, address and website of the consumer mediator]</ToFill>.
            </p>

            <h3>Applicable law</h3>
            <p>
                These terms are governed by French law. In case of dispute, and failing an amicable solution, the French
                courts have jurisdiction. A consumer may bring the case before the court of their place of residence.
            </p>
        </LegalSection>

        <LegalSection id="privacy" title="3. Privacy policy">
            <h3>Data controller</h3>
            <p>
                The publisher of the website, described in the legal notice above. For any question about your data:
                {" "}<SupportEmail />.
            </p>

            <h3>What data, why, and on what basis</h3>
            <ul>
                <li>
                    <strong>Account:</strong> email address, first and last name, password or the sign-in service you
                    use (Google, for example). To create and manage your account. Basis: performance of the contract.
                </li>
                <li>
                    <strong>Resumes:</strong> what you write in them (contact details, experience, education, skills,
                    languages, links). While you edit it, a resume stays in your browser. When you download it, a copy is
                    saved on our server, so that you find it in your dashboard. Basis: performance of the contract.
                </li>
                <li>
                    <strong>Subscription and payment:</strong> your subscription status and billing history. Your card
                    details are entered on Stripe’s page and processed by Stripe: we never receive them. Basis:
                    performance of the contract, and our legal obligations for invoices.
                </li>
                <li>
                    <strong>Contact form:</strong> your name, your message and your account identifier, to answer you.
                    Basis: our legitimate interest in handling your requests.
                </li>
                <li>
                    <strong>Security and operation:</strong> IP address and technical information about your browser, in
                    the server logs. Basis: our legitimate interest in protecting the service and fixing its errors.
                </li>
                <li>
                    <strong>Backups:</strong> encrypted copies of the database, so that your data isn’t lost if something
                    goes wrong. Basis: our legitimate interest.
                </li>
            </ul>
            <p>
                An email address is needed to create an account, and payment details to subscribe: without them, these
                features aren’t available. The website shows no ads, uses no audience measurement tool, doesn’t sell
                your data and makes no automated decision about you.
            </p>

            <h3>Recipients</h3>
            <p>Your data is only accessible to the publisher and to the following providers, for the needs of the service:</p>
            <ul>
                <li>Clerk (Clerk, Inc., United States): account creation and sign-in;</li>
                <li>Stripe (Stripe Payments Europe, Ltd., Ireland): payment and billing;</li>
                <li>OVHcloud (OVH SAS, France): hosting of the website and its database, in Canada;</li>
                <li>
                    Cloudflare (Cloudflare, Inc., United States): protection and routing of the website’s traffic, and
                    storage of the encrypted backups (in the European Union);
                </li>
                <li>Google (Gmail): sending and receiving the contact form’s messages.</li>
            </ul>

            <h3>Transfers outside the European Union</h3>
            <p>
                Canada, where our servers are, is covered by an adequacy decision of the European Commission. The
                providers based in the United States frame transfers with the EU-US Data Privacy Framework or with the
                European Commission’s standard contractual clauses.
            </p>

            <h3>How long data is kept</h3>
            <ul>
                <li>Account and resumes: until you delete your account;</li>
                <li>Backups: 30 days, so deleted data disappears from the backups within 30 days;</li>
                <li>Invoices: 10 years, as required by accounting rules (article L123-22 of the French Commercial Code);</li>
                <li>Contact form messages: as long as needed to handle your request, then 3 years at most;</li>
                <li>Server logs: 12 months at most.</li>
            </ul>

            <h3>Cookies and browser storage</h3>
            <p>The website only uses cookies it needs to work, which don’t require consent:</p>
            <ul>
                <li>Clerk’s session cookies (such as __session and __client_uat), to keep you signed in;</li>
                <li>the “lang” cookie, to remember the language you chose, for one year;</li>
                <li>the browser’s local storage (“resumeState”), to keep the resume you’re editing on your device.</li>
            </ul>
            <p>
                The payment and subscription management pages, hosted by Stripe, use their own cookies, to prevent fraud
                in particular.
            </p>

            <h3>Your rights</h3>
            <p>
                You can access your data, correct it, erase it, restrict or object to its processing, and get a copy of
                it in a reusable format. Write to us at <SupportEmail />: we answer within one month. You can also delete
                your account and your resumes yourself from the Account page. If you believe your rights aren’t
                respected, you can lodge a complaint with the CNIL, the French data protection authority
                (<a href="https://www.cnil.fr/en" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
        </LegalSection>

        <LegalSection id="language" title="Reference version">
            <p>This page exists in French and in English. In case of difference, the French version prevails.</p>
        </LegalSection>
    </>
);

export default LegalEn;
