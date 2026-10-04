import type { Metadata } from "next";
import { Accent, AsideLink, HireLanding, type HireLandingContent } from "@/components/hire/HireLanding";

/**
 * The French page.
 *
 * The August research rejected Morocco/fr and never measured France. Measured
 * in France/fr (DataForSEO, location 2250, Oct 2026): "agence ia" 1,900/mo at
 * difficulty 7, "consultant ia" 720 (difficulty 0), "automatisation ia" 720,
 * "agence automatisation" 480 and "agence automatisation ia" 390 (both 0),
 * "agence n8n" 320 (0), "chatbot entreprise" 110 at €37 a click. Clicks are
 * cheaper than in the US, but nothing here is contested and the work is done
 * in French anyway. One page, written in French, not a translated site.
 */

const TITLE = "Consultant IA & automatisation — agents IA sur mesure pour entreprises";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "Consultant IA freelance : automatisation IA, agents IA sur mesure, chatbots WhatsApp et web, workflows n8n. Un seul ingénieur du cadrage à la mise en production, périmètre et prix fixes.",
  keywords: [
    "consultant ia",
    "agence ia",
    "agence automatisation ia",
    "automatisation ia",
    "agence n8n",
    "agent ia entreprise",
    "chatbot entreprise",
    "développeur ia freelance",
    "développement application web",
  ],
  alternates: { canonical: "/fr/consultant-ia" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: TITLE,
    description:
      "Automatisation IA, agents sur mesure et chatbots d'entreprise, conçus et livrés par l'ingénieur qui écrit le code.",
    url: "/fr/consultant-ia",
    images: [{ url: "/og/default.png" }],
  },
};

const content: HireLandingContent = {
  path: "/fr/consultant-ia",
  breadcrumb: "Consultant IA",
  lang: "fr",
  labels: {
    home: "Accueil",
    hire: "Services",
    work: "Ce que je construis",
    receipts: "Les preuves",
    process: "Le déroulé",
    step: "Étape",
    questions: "Les questions",
    readCaseStudy: (name: string) => `Lire l'étude de cas ${name} (en anglais) →`,
    email: (address: string) => `Écrire à ${address} →`,
  },
  service: {
    name: "Conseil et développement IA pour entreprises",
    description:
      "Consultant IA freelance : automatisation des tâches répétitives, agents IA sur mesure, chatbots WhatsApp et web, workflows n8n et intégration de l'IA dans les outils existants, à périmètre et prix fixes.",
    serviceType: "Conseil en intelligence artificielle",
    audience: "TPE, PME et startups francophones",
    catalogName: "Prestations IA",
  },
  hero: {
    eyebrow: "Consultant IA · automatisation · agents IA sur mesure",
    title: (
      <>
        Pas une agence IA.
        <br />
        L&apos;ingénieur qui <Accent>livre</Accent>
      </>
    ),
    lede: "Vous cherchez une agence IA ou un consultant en automatisation. Ce qu'il vous faut, c'est quelqu'un qui repère la tâche que votre équipe répète chaque jour, y branche un modèle, et la met en production pour de bon. Je fais ce travail moi-même, en français, du premier appel à la mise en ligne.",
    cta: "Réserver un appel gratuit de 30 minutes →",
    mailSubject: "IA pour mon entreprise — premier appel",
    secondary: { label: "English version: AI automation services", href: "/hire/ai-automation" },
  },
  offers: {
    title: "Quatre prestations qui se rentabilisent",
    intro:
      "Chacune est cadrée pour être livrée seule. On commence par celle qui libère le plus d'heures ; les autres attendront que la première soit amortie.",
    items: [
      {
        kicker: "01",
        title: "Automatisation IA de vos processus",
        body: "La suite d'étapes qu'une personne enchaîne à la main : un prospect arrive, il est qualifié, enregistré dans le CRM, relancé. Je l'automatise en code, ou avec n8n quand votre équipe veut pouvoir modifier le workflow elle-même, avec un modèle pour les décisions qu'une règle ne sait pas prendre.",
        fit: "Idéal si une personne fait le lien entre vos outils.",
      },
      {
        kicker: "02",
        title: "Agent IA ou chatbot d'entreprise",
        body: "Sur WhatsApp, sur votre site, ou les deux. Il connaît votre catalogue, vos tarifs et vos règles, pose les bonnes questions, prend la demande et passe la main à un humain avec tout le contexte quand il atteint sa limite.",
        fit: "Idéal si vos clients attendent des réponses que vous retapez chaque jour.",
      },
      {
        kicker: "03",
        title: "Recherche et rédaction sur vos documents",
        body: "Un assistant qui retrouve la bonne information dans vos documents par le sens, cite sa source, et rédige devis, rapports ou courriers à partir de vos modèles. Un humain valide avant tout envoi.",
        fit: "Idéal si la réponse existe mais que personne ne la retrouve.",
      },
      {
        kicker: "04",
        title: "Application web ou SaaS sur mesure",
        body: "Quand il faut d'abord le produit : application web, boutique, back-office, paiements, déploiement. Je construis l'ensemble en Next.js et TypeScript, puis j'ajoute l'IA là où elle apporte vraiment quelque chose.",
        fit: "Idéal si vous partez de zéro.",
      },
    ],
  },
  receipts: {
    title: "Des systèmes en production, pas des démos",
    items: [
      {
        value: "WhatsApp",
        label: "Un agent qui mène l'entretien et fait le rapprochement",
        detail:
          "RESO Khdma : un agent échange avec des travailleurs directement dans WhatsApp, en darija, puis les rapproche des offres par recherche sémantique.",
        slug: "reso-khdma",
      },
      {
        value: "4 agents",
        label: "Un mémoire d'appel rédigé de bout en bout",
        detail:
          "FASL : stratège, rédacteur, associé senior et auditeur transforment un jugement en mémoire d'appel fondé sur le droit marocain. J'en suis le cofondateur.",
        slug: "fasl",
      },
      {
        value: "818 / 629",
        label: "Clients inscrits et commandes en deux mois",
        detail:
          "Belmo : une boutique en ligne construite à partir d'un dépôt vide, en français et en arabe, avec paiement à la livraison et back-office complet.",
        slug: "belmo",
      },
      {
        value: "7 agents",
        label: "D'une photo produit à une publicité vidéo",
        detail:
          "Laqta : sept agents écrivent, doublent et montent une publicité vidéo à partir d'un simple envoi de produit.",
        slug: "laqta",
      },
    ],
  },
  process: {
    title: "Sans abonnement, sans phase d'audit, sans facture surprise",
    items: [
      {
        step: "Un appel, gratuit",
        body: "Trente minutes. Vous me dites où partent les heures ; je vous dis ce qui mérite d'être automatisé et ce qui ne le mérite pas.",
      },
      {
        step: "Un périmètre fixe",
        body: "Une page : ce qui sera construit, ce que ça fera et ne fera pas, la date et le prix. Un seul montant, validé avant la première ligne de code.",
      },
      {
        step: "La réalisation",
        body: "Vous voyez le système fonctionner sur vos vraies données pendant qu'il se construit, pas à la fin.",
      },
      {
        step: "Une livraison qui tient",
        body: "Mise en ligne sur votre hébergement ou le mien, avec la documentation. Le code et les workflows vous appartiennent. Maintenance possible, au mois, si vous le souhaitez.",
      },
    ],
  },
  faq: {
    title: "Avant le premier appel",
    aside: (
      <>
        Les études de cas détaillées sont en anglais sur{" "}
        <AsideLink href="/#work">la page d&apos;accueil</AsideLink>. Les échanges, les documents et
        la livraison se font en français.
      </>
    ),
    items: [
      {
        q: "Êtes-vous une agence IA ?",
        a: "Non. Je suis un ingénieur indépendant : je cadre, je développe, je déploie et je réponds à vos messages. Vous obtenez le travail qu'une agence confierait à son meilleur développeur, sans les intermédiaires.",
      },
      {
        q: "Que peut-on automatiser avec l'IA dans une PME ?",
        a: "Les tâches fréquentes et vérifiables : réponses aux questions récurrentes, qualification des prospects, rédaction de documents à partir de modèles, extraction de données, recherche dans vos propres documents. Une tâche rare, ou dont l'erreur coûte cher sans relecture, est un mauvais candidat, et je vous le dirai.",
      },
      {
        q: "Travaillez-vous avec n8n ?",
        a: "Oui, quand c'est le bon outil : n8n convient lorsque votre équipe veut voir et modifier le workflow. Pour une logique complexe ou de gros volumes, j'écris du code. Beaucoup de projets combinent les deux.",
      },
      {
        q: "Combien coûte une prestation ?",
        a: "Cela dépend du périmètre, donc tout chiffre affiché ici serait inexact. Le cadre, lui, est fixe : un appel gratuit, puis un prix unique validé par écrit avant le début du développement, avec une estimation des coûts mensuels (modèles et hébergement).",
      },
      {
        q: "Où êtes-vous basé ?",
        a: "À Agadir, au Maroc, à une heure de décalage au plus avec la France. Je travaille à distance avec des clients francophones et anglophones, sur les horaires de bureau européens.",
      },
      {
        q: "Comment évitez-vous que l'IA invente des réponses ?",
        a: "Par la conception du système : les réponses s'appuient sur vos documents avec la source affichée, une seconde étape contrôle la première, et un humain valide ce qui part en votre nom. Le système est construit pour dire « je passe la main » plutôt que deviner.",
      },
      {
        q: "Et les données de mes clients ?",
        a: "Le système tourne sur une infrastructure que vous contrôlez, hébergée en Europe si vous le souhaitez, et n'accède qu'aux données nécessaires à sa tâche. Ces points sont écrits dans le document de cadrage.",
      },
      {
        q: "À qui appartient le résultat ?",
        a: "À vous : le code, les workflows, les prompts et les comptes. Rien n'est lié à une plateforme que vous devriez continuer à me louer.",
      },
    ],
  },
  closing: {
    eyebrow: "Appel gratuit · sans présentation commerciale",
    title: (
      <>
        Dites-moi quelle tâche
        <br />
        vous voudriez <Accent>supprimer</Accent>.
      </>
    ),
    body: "Trente minutes, sans engagement, et une réponse honnête à la fin, y compris « ne l'automatisez pas ». Je lis et réponds moi-même à chaque message sous 24 heures.",
  },
};

export default function ConsultantIaPage() {
  return <HireLanding content={content} />;
}
