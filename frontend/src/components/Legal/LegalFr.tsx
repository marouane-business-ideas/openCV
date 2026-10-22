import { LegalSection, SupportEmail, ToFill } from "./LegalParts";

// The binding version: the English one (LegalEn.tsx) is a translation, keep both in line
const LegalFr = () => (
    <>
        <h1>Mentions légales, conditions générales et confidentialité</h1>
        <p className="text-sm text-gray-500">Dernière mise à jour : 22 octobre 2026</p>

        <nav aria-label="Sommaire">
            <ol>
                <li><a href="#legal-notice">Mentions légales</a></li>
                <li><a href="#terms">Conditions générales de vente et d’utilisation</a></li>
                <li><a href="#privacy">Politique de confidentialité</a></li>
            </ol>
        </nav>

        <LegalSection id="legal-notice" title="1. Mentions légales">
            <h3>Éditeur</h3>
            <p>
                Le site onlineresume.dev (« OnlineResume ») est édité par : <ToFill>[À COMPLÉTER : nom et prénom suivis
                de « EI », ou dénomination sociale, forme juridique et capital de la société]</ToFill>.
            </p>
            <ul>
                <li>Adresse : <ToFill>[À COMPLÉTER : adresse du siège ou de domiciliation]</ToFill></li>
                <li>Email : <SupportEmail /></li>
                <li>Téléphone : <ToFill>[À COMPLÉTER : numéro de téléphone]</ToFill></li>
                <li>Immatriculation : <ToFill>[À COMPLÉTER : numéro SIREN, et RCS ou RNE selon l’activité]</ToFill></li>
                <li>
                    TVA : <ToFill>[À COMPLÉTER : numéro de TVA intracommunautaire, ou « TVA non applicable, article
                    293 B du CGI »]</ToFill>
                </li>
            </ul>
            <p>Directeur de la publication : <ToFill>[À COMPLÉTER : nom du directeur de la publication]</ToFill></p>

            <h3>Hébergeur</h3>
            <p>
                OVH SAS, 2 rue Kellermann, 59100 Roubaix, France, +33 9 72 10 10 07. Les serveurs du site sont situés
                au Canada.
            </p>

            <h3>Propriété intellectuelle</h3>
            <p>
                Le site, ses textes, son logo et ses modèles de CV sont protégés par le droit de la propriété
                intellectuelle : ils ne peuvent pas être reproduits sans autorisation, en dehors de l’usage prévu par le
                service, créer et utiliser vos propres CV. Le contenu que vous saisissez dans vos CV vous appartient.
            </p>
        </LegalSection>

        <LegalSection id="terms" title="2. Conditions générales de vente et d’utilisation">
            <h3>Objet</h3>
            <p>
                OnlineResume est un service en ligne qui permet de créer des CV et de les télécharger au format PDF. Ces
                conditions s’appliquent à son utilisation et à l’abonnement Premium. Créer un compte ou souscrire un
                abonnement implique de les accepter.
            </p>

            <h3>Compte</h3>
            <p>
                Télécharger ou enregistrer un CV nécessite un compte. Vous êtes responsable de vos identifiants et du
                contenu de vos CV.
            </p>

            <h3>Offre gratuite</h3>
            <p>Avec un compte gratuit, vous pouvez télécharger 5 CV au format PDF, sans carte bancaire.</p>

            <h3>Abonnement Premium</h3>
            <ul>
                <li><strong>Contenu :</strong> téléchargements de CV illimités pendant toute la durée de l’abonnement.</li>
                <li>
                    <strong>Prix :</strong> celui affiché sur la page d’abonnement, en euros toutes taxes comprises. Le
                    montant total exact est indiqué sur la page de paiement, avant que vous ne validiez la commande.
                </li>
                <li>
                    <strong>Paiement :</strong> par carte bancaire, à la souscription, via notre prestataire de paiement
                    Stripe. Nous n’avons jamais accès à vos numéros de carte.
                </li>
                <li>
                    <strong>Durée et renouvellement :</strong> l’abonnement dure un an. Il se renouvelle automatiquement
                    pour un an, au prix alors en vigueur, sauf si vous le résiliez. Nous vous informons par email, au plus
                    tôt trois mois et au plus tard un mois avant chaque échéance, de la possibilité de ne pas le
                    renouveler (article L215-1 du Code de la consommation).
                </li>
                <li>
                    <strong>Résiliation :</strong> à tout moment et en ligne, depuis la page Compte (« Gérer ou résilier
                    mon abonnement »). Elle prend effet à la fin de la période déjà payée : Premium reste actif jusque-là,
                    puis votre compte repasse à l’offre gratuite, avec 5 nouveaux téléchargements. La période en cours
                    n’est pas remboursée au prorata.
                </li>
            </ul>

            <h3>Droit de rétractation</h3>
            <p>
                Si vous êtes un consommateur, vous disposez de 14 jours à compter de la souscription pour vous rétracter,
                sans avoir à vous justifier ni à payer de frais (article L221-18 du Code de la consommation). Pour
                l’exercer, informez-nous de votre décision par email à <SupportEmail /> ou via le formulaire de contact,
                par exemple : « Je me rétracte de mon abonnement Premium souscrit le [date] avec le compte [adresse
                email] ». Nous vous remboursons l’intégralité du montant payé au plus tard 14 jours après votre demande,
                avec le moyen de paiement utilisé, et votre compte repasse à l’offre gratuite.
            </p>

            <h3>Suppression du compte</h3>
            <p>
                Vous pouvez supprimer votre compte à tout moment, depuis la page Compte ou en nous écrivant. La
                suppression efface votre compte et vos CV enregistrés, et met fin immédiatement à votre abonnement
                Premium, sans remboursement de la période restante, sauf si vous êtes encore dans le délai de
                rétractation.
            </p>

            <h3>Garantie légale de conformité</h3>
            <p>
                Si vous êtes un consommateur, vous bénéficiez de la garantie légale de conformité des contenus et services
                numériques (articles L224-25-12 et suivants du Code de la consommation). Si le service ne fonctionne pas
                comme prévu, écrivez-nous à <SupportEmail />.
            </p>

            <h3>Disponibilité du service</h3>
            <p>
                Nous faisons notre possible pour que le service soit accessible en permanence, mais il peut être
                interrompu, notamment pour des opérations de maintenance. Vous restez responsable du contenu de vos CV et
                de l’usage que vous en faites.
            </p>

            <h3>Modification des conditions</h3>
            <p>
                Ces conditions peuvent évoluer. Celles qui s’appliquent à votre abonnement sont celles en vigueur à sa
                souscription ou à son dernier renouvellement. Nous vous informons par email de tout changement important.
            </p>

            <h3>Réclamations et médiation</h3>
            <p>
                Pour toute réclamation, écrivez-nous à <SupportEmail />. Si nous ne trouvons pas de solution, vous pouvez
                recourir gratuitement au médiateur de la consommation suivant, dans l’année qui suit votre réclamation
                écrite : <ToFill>[À COMPLÉTER : nom, adresse et site internet du médiateur de la consommation]</ToFill>.
            </p>

            <h3>Droit applicable</h3>
            <p>
                Ces conditions sont soumises au droit français. En cas de litige, et à défaut de solution amiable, les
                tribunaux français sont compétents. Un consommateur peut saisir le tribunal de son domicile.
            </p>
        </LegalSection>

        <LegalSection id="privacy" title="3. Politique de confidentialité">
            <h3>Responsable du traitement</h3>
            <p>
                L’éditeur du site, présenté dans les mentions légales ci-dessus. Pour toute question sur vos données :
                {" "}<SupportEmail />.
            </p>

            <h3>Données traitées, pourquoi et sur quelle base</h3>
            <ul>
                <li>
                    <strong>Compte :</strong> adresse email, nom et prénom, mot de passe ou service de connexion utilisé
                    (par exemple Google). Pour créer et gérer votre compte. Base : l’exécution du contrat.
                </li>
                <li>
                    <strong>CV :</strong> ce que vous y saisissez (coordonnées, expériences, formations, compétences,
                    langues, liens). Pendant l’édition, le CV reste dans votre navigateur. Quand vous le téléchargez, une
                    copie est enregistrée sur notre serveur, pour que vous le retrouviez dans votre tableau de bord. Base :
                    l’exécution du contrat.
                </li>
                <li>
                    <strong>Abonnement et paiement :</strong> statut de votre abonnement et historique de facturation. Vos
                    données de carte sont saisies sur la page de Stripe et traitées par Stripe : nous ne les recevons
                    jamais. Base : l’exécution du contrat, et nos obligations légales pour les factures.
                </li>
                <li>
                    <strong>Formulaire de contact :</strong> votre nom, votre message et l’identifiant de votre compte,
                    pour vous répondre. Base : notre intérêt légitime à traiter vos demandes.
                </li>
                <li>
                    <strong>Sécurité et fonctionnement :</strong> adresse IP et informations techniques sur votre
                    navigateur, dans les journaux du serveur. Base : notre intérêt légitime à protéger le service et à
                    corriger ses erreurs.
                </li>
                <li>
                    <strong>Sauvegardes :</strong> des copies chiffrées de la base de données, pour ne pas perdre vos
                    données en cas d’incident. Base : notre intérêt légitime.
                </li>
            </ul>
            <p>
                L’adresse email est nécessaire pour créer un compte, et les données de paiement pour s’abonner : sans
                elles, ces fonctionnalités ne sont pas disponibles. Le site n’affiche pas de publicité, n’utilise aucun
                outil de mesure d’audience, ne vend pas vos données et ne prend aucune décision automatisée à votre sujet.
            </p>

            <h3>Destinataires</h3>
            <p>Vos données ne sont accessibles qu’à l’éditeur et aux prestataires suivants, pour les besoins du service :</p>
            <ul>
                <li>Clerk (Clerk, Inc., États-Unis) : création de compte et connexion ;</li>
                <li>Stripe (Stripe Payments Europe, Ltd., Irlande) : paiement et facturation ;</li>
                <li>OVHcloud (OVH SAS, France) : hébergement du site et de la base de données, au Canada ;</li>
                <li>
                    Cloudflare (Cloudflare, Inc., États-Unis) : protection et acheminement du trafic du site, et stockage
                    des sauvegardes chiffrées (dans l’Union européenne) ;
                </li>
                <li>Google (Gmail) : envoi et réception des messages du formulaire de contact.</li>
            </ul>

            <h3>Transferts hors de l’Union européenne</h3>
            <p>
                Le Canada, où se trouvent nos serveurs, fait l’objet d’une décision d’adéquation de la Commission
                européenne. Les prestataires établis aux États-Unis encadrent les transferts par le Data Privacy Framework
                UE-États-Unis ou par les clauses contractuelles types de la Commission européenne.
            </p>

            <h3>Durées de conservation</h3>
            <ul>
                <li>Compte et CV : jusqu’à la suppression de votre compte ;</li>
                <li>Sauvegardes : 30 jours, donc une donnée supprimée disparaît des sauvegardes au plus tard 30 jours après ;</li>
                <li>Factures : 10 ans, durée imposée par les obligations comptables (article L123-22 du Code de commerce) ;</li>
                <li>Messages du formulaire de contact : le temps de traiter votre demande, puis 3 ans au plus ;</li>
                <li>Journaux du serveur : 12 mois au plus.</li>
            </ul>

            <h3>Cookies et stockage dans le navigateur</h3>
            <p>
                Le site n’utilise que des cookies nécessaires à son fonctionnement, qui ne demandent pas de consentement :
            </p>
            <ul>
                <li>les cookies de session de Clerk (par exemple __session et __client_uat), pour vous garder connecté ;</li>
                <li>le cookie « lang », pour retenir la langue que vous avez choisie, pendant un an ;</li>
                <li>
                    le stockage local du navigateur (« resumeState »), pour conserver sur votre appareil le CV en cours
                    d’édition.
                </li>
            </ul>
            <p>
                Les pages de paiement et de gestion de l’abonnement, hébergées par Stripe, utilisent leurs propres
                cookies, notamment pour prévenir la fraude.
            </p>

            <h3>Vos droits</h3>
            <p>
                Vous pouvez accéder à vos données, les rectifier, les effacer, en limiter le traitement, vous y opposer et
                en demander une copie dans un format réutilisable. Écrivez-nous à <SupportEmail /> : nous vous répondons
                dans un délai d’un mois. Vous pouvez aussi supprimer vous-même votre compte et vos CV depuis la page
                Compte. Si vous estimez que
                vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL
                (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
        </LegalSection>

        <LegalSection id="language" title="Version de référence">
            <p>Cette page existe en français et en anglais. En cas de différence, la version française prévaut.</p>
        </LegalSection>
    </>
);

export default LegalFr;
