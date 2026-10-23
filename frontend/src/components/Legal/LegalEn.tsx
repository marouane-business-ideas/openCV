import { LegalSection, SupportEmail, ToFill } from "./LegalParts";

// A translation of the binding French version (LegalFr.tsx): keep both in line
const LegalEn = () => (
    <>
        <h1>Legal notice, terms and privacy</h1>
        <p className="text-sm text-gray-500">Last updated: October 23, 2026</p>

        <nav aria-label="Contents">
            <ol>
                <li><a href="#legal-notice">Legal notice</a></li>
                <li><a href="#terms">Terms of use</a></li>
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

        <LegalSection id="terms" title="2. Terms of use">
            <h3>Purpose</h3>
            <p>
                OnlineResume is a free online service to create resumes and download them as PDF files. These terms apply
                to its use and to tips. Creating an account means accepting them.
            </p>

            <h3>Account</h3>
            <p>
                Downloading or saving a resume requires an account. You are responsible for your credentials and for the
                content of your resumes.
            </p>

            <h3>Free of charge</h3>
            <p>
                The service is free: creating, saving and downloading resumes costs nothing, with no download limit. If a
                paid plan is ever offered, we will tell you in advance, and nothing will be charged without your
                consent.
            </p>

            <h3>Tips</h3>
            <ul>
                <li>
                    <strong>Optional:</strong> you can leave a tip from the website, of the amount you choose, to support
                    OnlineResume. It gives access to no extra feature: the service is the same with or without a tip.
                </li>
                <li>
                    <strong>Payment:</strong> once, in euros, on the page of our payment provider Stripe. It isn’t a
                    subscription: nothing is charged afterwards. We never have access to your card numbers.
                </li>
                <li>
                    <strong>Mistakes:</strong> if you entered the wrong amount or paid twice, write to us at
                    {" "}<SupportEmail /> within 14 days of the payment: we refund you, with the payment method you used.
                </li>
            </ul>

            <h3>Deleting your account</h3>
            <p>
                You can delete your account at any time by writing to us at <SupportEmail />. Deleting it erases your
                account and your saved resumes.
            </p>

            <h3>Availability of the service</h3>
            <p>
                We do our best to keep the service available at all times and working as it should, but it may be
                interrupted, for maintenance in particular. If something doesn’t work, write to us at <SupportEmail />.
                You remain responsible for the content of your resumes and for how you use them.
            </p>

            <h3>Changes to these terms</h3>
            <p>
                These terms may change. We inform you by email of any significant change, before it applies.
            </p>

            <h3>Complaints</h3>
            <p>For any complaint, write to us at <SupportEmail />.</p>

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
                    <strong>Tips:</strong> if you leave one, you pay on Stripe’s page. We see in our Stripe account the
                    amount, the date and the details you enter there (email address, name), never your card numbers. A
                    tip isn’t linked to your OnlineResume account. Stripe also processes this data on its own behalf, to
                    prevent fraud in particular (see its <a href="https://stripe.com/privacy" target="_blank"
                    rel="noopener noreferrer">privacy policy</a>). Basis: performance of your payment, and our
                    accounting obligations.
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
                An email address is needed to create an account, and payment details to leave a tip: without them,
                these features aren’t available. The website shows no ads, uses no audience measurement tool, doesn’t sell
                your data and makes no automated decision about you.
            </p>

            <h3>Recipients</h3>
            <p>Your data is only accessible to the publisher and to the following providers, for the needs of the service:</p>
            <ul>
                <li>Clerk (Clerk, Inc., United States): account creation and sign-in;</li>
                <li>Stripe (Stripe Payments Europe, Ltd., Ireland): payment of tips;</li>
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
                <li>Records of tips: 10 years, as required by accounting rules (article L123-22 of the French Commercial Code);</li>
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
                The tip payment page, hosted by Stripe, uses its own cookies, to prevent fraud in particular.
            </p>

            <h3>Your rights</h3>
            <p>
                You can access your data, correct it, erase it, restrict or object to its processing, and get a copy of
                it in a reusable format. Write to us at <SupportEmail />: we answer within one month. If you believe your
                rights aren’t respected, you can lodge a complaint with the CNIL, the French data protection authority
                (<a href="https://www.cnil.fr/en" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
        </LegalSection>

        <LegalSection id="language" title="Reference version">
            <p>This page exists in French and in English. In case of difference, the French version prevails.</p>
        </LegalSection>
    </>
);

export default LegalEn;
