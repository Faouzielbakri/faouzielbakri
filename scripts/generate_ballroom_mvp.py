import sys
import os
import re

# Read current English proposal
en_path = "/Users/mac/Documents/code/work/faouzielbakri/public/proposals/concierge-whatsapp-mvp.html"
with open(en_path, "r", encoding="utf-8") as f:
    en_content = f.read()

# Extract styles
style_match = re.search(r"<style>(.*?)</style>", en_content, re.DOTALL)
original_style = style_match.group(1) if style_match else ""

# Extract the inner body of the English sheet
# The sheet starts with <div class="sheet"> and ends with </div> right before </body>
sheet_match = re.search(r'<div class="sheet">(.*?)</div>\s*</body>', en_content, re.DOTALL)
if not sheet_match:
    print("Could not find sheet in en_content!")
    sys.exit(1)

en_sheet_inner = sheet_match.group(1)

# Let us define the French sheet inner content with all 17 sections translated to executive, high-level French.
fr_sheet_inner = """
<header class="cover">
  <div class="brandline">Proposition technique et financière · Réponse au cahier des charges MVP, version 4</div>
  <h1>Un concierge IA sur WhatsApp.</h1>
  <p class="sub">Un pilote complet et opérationnel à Marrakech : les voyageurs s'expriment en langage naturel, les prestataires vérifiés répondent sur WhatsApp, et vos opérateurs supervisent et pilotent l'ensemble.</p>
  <div class="meta">
    <div><span>Préparé pour</span><b>Fred Valezy — Ballroom Prod</b></div>
    <div><span>Préparé par</span><b>Faouzi El Bakri — AI Engineer &amp; Full-Stack Developer</b></div>
    <div><span>Contact</span><b>faouzielbakri.com · +212 6 32 32 38 56</b></div>
    <div><span>Périmètre</span><b>Pilote Marrakech · 25–40 prestataires · 7–9 catégories</b></div>
    <div><span>Délai</span><b>8 semaines jusqu'au pilote en conditions réelles</b></div>
    <div><span>Validité</span><b>30 jours (du 16 septembre au 16 octobre 2026)</b></div>
  </div>
  <p class="confidential">Document confidentiel — propriété de Faouzi El Bakri. Transmis dans le cadre de l'accord de confidentialité (NDA) signé le 13 septembre 2026. L'architecture, le modèle de données et les processus décrits sont communiqués exclusivement dans le cadre de l'évaluation du projet.</p>
</header>

<section id="thread-fr">
  <div class="sec-head">
    <div class="sec-num">0</div>
    <div class="col">
      <h2>Le parcours d'une demande, de bout en bout</h2>
      <p class="lead">Un exemple concret illustrant la répartition des rôles : ce que l'IA prend en charge, ce que la base relationnelle garantit, et l'endroit précis où l'opérateur humain intervient.</p>
    </div>
  </div>
  <div class="thread">
    <div class="turn">
      <div class="bubble in"><span class="who">Voyageur · Scan QR Riad El Fenn</span>Bonsoir ! On cherche une table rooftop pour 4 personnes ce soir, ambiance sympa, pas trop bruyant, environ 300-350 dh par personne. Qu'est-ce que vous nous conseillez ?</div>
      <div class="note"><b>Origine attribuée au scan :</b> le partenaire Riad El Fenn est crédité dès la redirection serveur, avant même la saisie du premier mot. L'IA extrait les variables structurées (date, heure, 4 pers, rooftop, budget 300-350 DH, ambiance calme). Requête déterministe en base : 3 restaurants vérifiés identifiés.</div>
    </div>
    <div class="turn">
      <div class="bubble out"><span class="who">Concierge</span>Bonsoir ! C'est bien noté pour 4 personnes en rooftop ce soir. Je vérifie les disponibilités et les tables calmes auprès de nos adresses partenaires et je reviens vers vous d'ici quelques minutes.</div>
      <div class="note"><b>Sollicitation fournisseurs :</b> le système envoie automatiquement un message structuré WhatsApp (template approuvé Meta) aux 3 restaurants présélectionnés depuis le numéro dédié aux prestataires, avec des boutons de réponse rapide. Demande créée en statut <em>en attente</em>.</div>
    </div>
    <div class="turn">
      <div class="bubble supplier"><span class="who">Rooftop Dar El Bacha · WhatsApp</span>[Bouton : Disponible 20h30 · Table terrasse vue Koutoubia · Menu 320 DH]</div>
      <div class="note"><b>Réponse prestataire capturée :</b> horodatage immédiat (4 minutes après la demande). Statut mis à jour dans le back-office opérateur. Calcul automatique des marges et commissions à titre informatif.</div>
    </div>
    <div class="turn">
      <div class="bubble supplier"><span class="who">Café Arabe · WhatsApp</span>[Bouton : Complet ce soir en terrasse]</div>
      <div class="note"><b>Refus enregistré :</b> le motif et le délai de réponse alimentent l'historique de fiabilité du prestataire pour les futurs arbitrages.</div>
    </div>
    <div class="turn">
      <div class="bubble out"><span class="who">Concierge</span>Excellente nouvelle ! Le Rooftop Dar El Bacha dispose d'une belle table pour 4 à 20h30 sur leur terrasse calme (320 DH/personne). Souhaitez-vous que je vous la réserve ?</div>
      <div class="note"><b>Seules les données confirmées sont citées :</b> disponibilités, horaires et prix proviennent exclusivement des réponses fournisseurs stockées en base. L'IA n'invente aucune disponibilité.</div>
    </div>
    <div class="turn">
      <div class="bubble in"><span class="who">Voyageur</span>C'est parfait, confirmez pour 20h30 s'il vous plaît ! 🙏</div>
      <div class="note"><b>Statut : Réservé.</b> Transaction enregistrée avec prix client, montant fournisseur, marge plateforme et quote-part partenaire. Temps de réponse consolidés pour le tableau de bord pilote.</div>
    </div>
  </div>
</section>

<section id="summary-fr">
  <div class="sec-head">
    <div class="sec-num">1</div>
    <div class="col"><h2>Synthèse</h2></div>
  </div>
  <div class="sec-body">
    <p>Vous recherchez un MVP simple, robuste et évolutif pour tester un service de conciergerie sur WhatsApp à Marrakech avec de vrais voyageurs. Un client scanne le QR code d'un partenaire, exprime son besoin en langage naturel, l'IA structure la demande, le système interroge les prestataires pertinents sur WhatsApp, un opérateur supervise et valide, et le voyageur reçoit une ou plusieurs options vérifiées jusqu'à la confirmation de réservation. Autour de cette boucle : un back-office épuré, une reprise humaine à tout instant, une attribution infalsifiable par partenaire et des métriques claires.</p>
    <p>Ce document répond point par point au cahier des charges V4 : architecture recommandée, explications techniques du choix du code sur-mesure face au no-code, modèle de données complet, découpage V1 / phase 2, planning d'exécution de 8 semaines, chiffrage transparent par lot, analyse du seuil de rentabilité et coûts d'exploitation mensuels.</p>
    <h3 style="margin-top:32px">Quatre recommandations fondamentales</h3>
    <ol class="steps">
      <li><b>Bâtir le produit comme un ensemble unifié, pas en deux moitiés dissociées.</b> Les composants sont interdépendants : une demande n'a de valeur que si un prestataire peut y répondre, les réponses des prestataires sont inutiles sans un back-office pour les arbitrer, et l'ensemble ne sert à rien sans attribution ni mesure. La V1 couvre l'intégralité de la boucle — courses et avances de fonds comprises — dans sa version la plus robuste. La phase 2 est réservée aux arbitrages que seules les données réelles du pilote permettront d'affiner.</li>
      <li><b>Deux numéros WhatsApp distincts, pas un seul.</b> Un numéro dédié aux voyageurs, un numéro dédié aux prestataires. Cela garantit une séparation étanche au niveau le plus critique : les notes de qualité Meta, les limites d'envoi quotidiennes, le nom d'affichage commercial et les templates de messages sont totalement indépendants. Un prestataire mécontent qui signalerait un message ne pourra ainsi jamais dégrader la délivrabilité du numéro client.</li>
      <li><b>Un moteur IA commutable multi-fournisseurs dès le jour 1.</b> Google Gemini, Anthropic Claude, OpenAI et OpenRouter (avec accès aux modèles économiques comme DeepSeek ou Qwen) sont intégrés nativement. Le modèle actif se sélectionne d'un clic dans le back-office, sans aucun redéploiement de code. Zéro dépendance captive, et la possibilité d'arbitrer en temps réel entre coût, rapidité et pertinence.</li>
      <li><b>Mesurer le pilote au cœur même de l'outil.</b> Le dashboard KPI est intégré directement dans la V1. Un pilote sert avant tout à prendre une décision d'investissement éclairée : les taux de conversion, les temps de réponse prestataires et l'attribution par partenaire doivent être visibles chaque matin sur un écran clair pour votre équipe, sans avoir à extraire manuellement des données de la base.</li>
    </ol>
  </div>
</section>

<section id="whoami-fr">
  <div class="sec-head">
    <div class="sec-num">2</div>
    <div class="col"><h2>Qui vous recrutez</h2></div>
  </div>
  <div class="sec-body">
    <p>Vous m'avez interrogé sur mon rôle exact sur le projet RESO Khdma et sur mes arbitrages techniques pour WhatsApp et l'IA. La réponse est directe : <strong>j'ai conçu, développé et déployé l'intégralité du système seul</strong> — l'intégration de l'API WhatsApp Business, l'agent conversationnel, le matching sémantique, la base de données relationnelle et l'interface d'administration.</p>
    <p>Les choix architecturaux qui ont fait le succès de RESO Khdma sont précisément ceux qui structurent cette proposition :</p>
    <ul class="plain">
      <li><b>Tool calling avec schémas JSON stricts plutôt que génération libre.</b> L'agent interroge la base, filtre les profils et enregistre les données exclusivement via des contrats de fonctions typés. C'est exactement le mécanisme proposé ici dans le lot C : c'est la raison pour laquelle l'IA peut rechercher un prestataire dans votre catalogue mais ne peut en aucun cas en inventer un.</li>
      <li><b>Recherche sémantique vectorielle plutôt que simple correspondance de mots-clés.</b> Un candidat décrit son métier avec ses propres expressions et le moteur trouve des opportunités dont la formulation est totalement différente. Dans votre conciergerie, c'est ce qui permet à un voyageur demandant « un endroit calme avec un bon tajine, pas un piège à touristes » d'être mis en relation avec le restaurant idéal catalogué sous des critères formels.</li>
      <li><b>Gestion native du Darija, de l'Arabe et du Français au sein d'un même flux conversationnel.</b> Indispensable pour des utilisateurs qui ne formatent pas leurs phrases pour un robot. Vos prestataires à Marrakech s'exprimeront exactement de cette façon.</li>
    </ul>
    <p>RESO Khdma n'est pas mon seul système WhatsApp en production. <strong>Belmo</strong>, une plateforme e-commerce K-beauty que j'ai développée et que j'héberge moi-même, intègre un agent WhatsApp traitant le support et les commandes — <strong>818 clients enregistrés et 629 commandes traitées sur ses deux premiers mois</strong>. Un système plus linéaire, mais en conditions réelles de production avec des flux financiers et des clients exigeants.</p>
    <p>Trois autres réalisations attestent directement de ma capacité à délivrer votre projet :</p>
    <ul class="plain">
      <li><b>FASL</b> (<a href="https://fasl.ma" target="_blank">fasl.ma</a>), dont je suis co-fondateur et lead engineer : un système multi-agents qui rédige des conclusions d'appel pour les juridictions marocaines, appuyé sur une couche RAG ultra-stricte interrogeant les codes de lois officiels. Conçu dans un univers où une citation erronée est fatale — la même rigueur absolue qui sous-tend la règle « le concierge ne cite que des réponses confirmées par les prestataires ».</li>
      <li><b>Magical Hekaya</b> (<a href="https://magicalhekaya.com" target="_blank">magicalhekaya.com</a>), mon propre produit d'IA grand public générant des revenus : un pipeline multi-modèles avec des contrats de sortie structurés entre chaque étape. La couche d'abstraction multi-fournisseurs du lot C n'est pas un concept théorique, je l'opère au quotidien.</li>
      <li><b>Auto-hébergement &amp; DevOps.</b> Belmo tourne sur Hetzner avec Docker et Dokploy, exactement l'infrastructure préconisée pour votre pilote. Je n'apprends pas votre stack technique sur votre budget.</li>
    </ul>
    <p>Mon parcours : Master en Big Data et Intelligence Artificielle de l'Université Ibn Zohr (mémoire de recherche sur la détection de défauts atteignant 96,96 % mAP50), précédé d'une Licence en Informatique ; 6 ans de développement de logiciels en production ; 16 produits opérationnels en ligne, dont 4 fondés par moi-même. Arabe et Darija natifs, Français et Anglais bilingues.</p>
    <div class="rec">
      <p><b>Ce que je ferais différemment aujourd'hui :</b> Sur RESO Khdma, l'interprétation du texte libre était calibrée sur le comportement d'un modèle unique, ce qui s'est avéré coûteux à réajuster lors des montées de version. C'est précisément pour cela que cette proposition place 4 fournisseurs derrière un switch unique, et qu'une réponse ambiguë d'un prestataire est immédiatement soumise à votre opérateur humain plutôt que résolue par une supposition hasardeuse. Les erreurs d'apprentissage ont déjà été payées.</p>
    </div>
  </div>
</section>

<section id="understanding-fr">
  <div class="sec-head">
    <div class="sec-num">3</div>
    <div class="col"><h2>Compréhension du projet</h2></div>
  </div>
  <div class="sec-body">
    <p>Le produit est une plateforme conversationnelle faisant le lien entre trois populations distinctes : les voyageurs (clients), les prestataires de services (restaurants, excursions, bien-être, transport, coursiers) et les partenaires apporteurs d'affaires (riads, hôtels, commerces) identifiés par QR code. La réelle valeur ajoutée du pilote ne réside pas dans un simple chatbot, mais dans <strong>la boucle opérationnelle complète</strong> : formulation du besoin → sollicitation des prestataires → collecte des réponses → proposition client → confirmation, avec des données vérifiées à chaque étape.</p>
    <p>Trois principes directeurs régissent cette proposition, en parfaite adéquation avec votre cahier des charges :</p>
    <ul class="plain">
      <li><b>L'IA ne décide jamais seule d'une information commerciale.</b> Les tarifs, disponibilités et conditions proviennent exclusivement de la base de données et des réponses réelles horodatées des prestataires.</li>
      <li><b>L'humain reste au centre du dispositif (Human-in-the-loop) :</b> supervision temps réel, bascule instantanée vers un opérateur sur le même fil de discussion, et arbitrage final laissé à l'humain dès qu'il le souhaite.</li>
      <li><b>Le backend est agnostique du canal de communication.</b> WhatsApp est le canal inaugural du MVP, mais le cœur applicatif et la logique métier sont conçus de manière totalement découplée : une application web, une application mobile ou d'autres canaux pourront s'y greffer ultérieurement sans aucune réécriture du moteur central.</li>
    </ul>
    <p>Une réalité opérationnelle propre à Marrakech : vos prestataires locaux répondront souvent en français informel, en darija, ou dans un mélange sans ponctuation. Les réponses libres sont interprétées par l'IA et signalées à l'opérateur avec une alerte visuelle dès qu'une ambiguïté subsiste, plutôt que validées à l'aveugle.</p>
  </div>
</section>

<section id="architecture-fr">
  <div class="sec-head">
    <div class="sec-num">4</div>
    <div class="col"><h2>Architecture recommandée</h2></div>
  </div>
  <div class="sec-body">
    <h3>4.1 La stack technique et ses justifications</h3>
    <table>
      <thead><tr><th style="width:24%">Couche</th><th style="width:34%">Choix technologique</th><th>Pourquoi</th></tr></thead>
      <tbody>
        <tr><td><b>Canal WhatsApp</b></td><td>360dialog (Cloud API officielle Meta) — 2 numéros dédiés</td><td>Abonnement fixe par numéro sans aucune surtaxe sur le prix des messages Meta, onboarding accéléré, support de vérification prioritaire, et Cloud API native en arrière-plan garantissant la portabilité future du code. Comptes et numéros créés à votre nom.</td></tr>
        <tr><td><b>Backend / API</b></td><td>Node.js (TypeScript), API REST &amp; Webhooks</td><td>Un service unique robuste qui intercepte les messages, orchestre les appels IA, exécute la machine à états et alimente le back-office. Totalement indépendant du canal de communication.</td></tr>
        <tr><td><b>Moteur IA</b></td><td>Couche d'abstraction multi-fournisseurs : Google, Anthropic, OpenAI, OpenRouter</td><td>Les quatre acteurs partagent les mêmes primitives (chat, extraction JSON, tool calling). Le choix du modèle actif se fait d'un clic dans le back-office sans redéploiement. OpenRouter donne accès aux modèles ultra-économiques comme DeepSeek ou Qwen pour tester l'arbitrage coût/qualité.</td></tr>
        <tr><td><b>Base de données</b></td><td>PostgreSQL</td><td>Modèle relationnel transactionnel strict, exports tabulaires immédiats, sauvegardes automatiques fiables, et socle parfait pour l'algorithme de scoring automatisé en phase 2.</td></tr>
        <tr><td><b>Back-office</b></td><td>Next.js (Web app responsive)</td><td>Interface rapide, ergonomique sur ordinateur et tablette, gestion multi-opérateurs native avec indicateurs d'urgence.</td></tr>
        <tr><td><b>Hébergement</b></td><td>Serveur Hetzner (Allemagne) + Docker + Dokploy</td><td>Coûts d'hébergement minimes, conteneurs Docker reproductibles, déploiement automatisé en un clic, et architecture standard que tout ingénieur senior peut reprendre. Comptes à votre nom.</td></tr>
        <tr><td><b>Sauvegardes</b></td><td>Snapshots quotidiens de la base + stockage objet distant</td><td>Procédure de restauration testée et documentée en amont de la mise en production, pas après un sinistre.</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">4.2 Pourquoi un BSP (360dialog) plutôt que Meta en direct</h3>
    <p>L'API Cloud de Meta peut techniquement être utilisée en direct, ce qui semble marginalement plus économique sur le papier. En pratique, les blocages se concentrent sur la vérification d'entreprise, l'enregistrement des lignes téléphoniques, l'approbation des templates et la gestion des baisses de qualité — c'est exactement là qu'un projet pilote perd deux à trois semaines d'attente. 360dialog absorbe cette friction pour un forfait fixe mensuel minime et refacture les messages Meta au prix coûtant strict. Comme il s'agit de la véritable Cloud API sous le capot, l'intégration se résume à une URL et un token : basculer vers Meta en direct ou un autre acteur reste une simple modification de configuration, sans aucun impact sur le code.</p>

    <h3 style="margin-top:34px">4.3 Deux numéros : comparatif et recommandation ferme</h3>
    <p>Votre cahier des charges laissait cette option ouverte. Les deux approches fonctionnent techniquement, le moteur reconnaissant un prestataire à son numéro en base. Mais la différence cruciale réside dans <strong>l'isolation de la réputation d'envoi</strong>.</p>
    <table>
      <thead><tr><th style="width:32%">Option</th><th style="width:34%">Avantages</th><th>Inconvénients</th></tr></thead>
      <tbody>
        <tr><td><b>Deux numéros</b><br><span class="badge">Recommandé</span></td><td>Notes de qualité et limites d'envoi Meta indépendantes : les sollicitations fréquentes de prestataires ne peuvent jamais pénaliser le numéro utilisé par les voyageurs. Nom d'affichage distinct (« Concierge Partenaires »), templates dédiés et statistiques séparées. Zéro migration future nécessaire.</td><td>Deux vérifications initiales, un second forfait mensuel minime (360dialog), et quelques jours de travail additionnels en lot B.</td></tr>
        <tr><td><b>Un seul numéro</b><br><span class="muted">Voyageurs et prestataires réunis</span></td><td>Une seule vérification Meta, un seul set de templates, un seul abonnement. Mise en place légèrement plus rapide.</td><td>Voyageurs et prestataires partagent la même note de qualité Meta. Les sollicitations sortantes répétées vers les prestataires constituent précisément le profil à risque de restriction Meta, ce qui bloquerait votre ligne client.</td></tr>
      </tbody>
    </table>
    <p><strong>Recommandation : deux numéros dès le lancement.</strong> L'écart financier est dérisoire par rapport au risque opérationnel. Changer de numéro client une fois que de vrais voyageurs ont scanné des cartes dans les riads est un cauchemar logistique.</p>

    <h3 style="margin-top:34px">4.4 Comment un scan QR est réellement attribué</h3>
    <p>L'erreur classique consiste à faire pointer un QR code directement vers un lien <code>wa.me</code> contenant un message pré-rempli avec le code partenaire. Ce procédé est défaillant : le touriste efface fréquemment ce texte avant d'envoyer son message, faisant perdre immédiatement la traçabilité de l'apporteur. Dans un pilote dont l'objectif premier est de mesurer quels riads génèrent du business, perdre l'attribution, c'est perdre la valeur du test.</p>
    <p>Notre solution repose sur un lien court propriétaire hébergé sur votre domaine — <code>go.votredomaine.com/elfenn</code> — qui opère trois actions en quelques millisecondes :</p>
    <ul class="plain">
      <li><b>Enregistrement immédiat du scan côté serveur :</b> partenaire, horodatage, appareil et langue du navigateur, avec une fenêtre d'anti-rebond (si un client scanne deux fois en 1 minute, un seul scan est comptabilisé). Vous connaissez le nombre exact de scans par riad dès le premier jour, même si le touriste n'envoie finalement aucun message.</li>
      <li><b>Redirection dynamique vers WhatsApp :</b> une redirection HTTP temporaire (302) qui préserve votre contrôle. Vous pouvez modifier la destination ultérieurement (nouveau numéro, landing page web) sans jamais devoir réimprimer un seul QR code physique.</li>
      <li><b>Réconciliation intelligente de la conversation :</b> le message pré-rempli contient un identifiant unique. Si le voyageur efface ce texte, le backend associe automatiquement le premier message reçu d'un nouveau numéro au dernier scan orphelin enregistré dans une fenêtre temporelle courte. En cas de collision rare entre deux scans simultanés, la demande est signalée dans le back-office comme « attribution à confirmer » pour validation humaine. Le système n'attribue jamais une commission au hasard.</li>
    </ul>
  </div>
</section>

<section id="code-vs-nocode-fr">
  <div class="sec-head">
    <div class="sec-num">5</div>
    <div class="col"><h2>Pourquoi du code sur-mesure et non un assemblage n8n / no-code</h2></div>
  </div>
  <div class="sec-body">
    <p>Pour un projet de conciergerie WhatsApp, la tentation existe d'assembler des briques no-code comme n8n ou Make. Ces outils sont parfaits pour des automatisations linéaires simples, mais ils deviennent extrêmement fragiles dès lors qu'il s'agit d'opérer une place de marché tri-partie avec des webhooks concurrents et des états transactionnels.</p>
    <table>
      <thead><tr><th style="width:26%">Critère</th><th style="width:37%">Code sur-mesure (Node / TypeScript / Postgres)</th><th>Assemblage No-Code (n8n / Make)</th></tr></thead>
      <tbody>
        <tr><td><b>Machine à états</b></td><td>Contraintes transactionnelles SQL strictes. Impossible pour une demande de sauter un statut ou d'accepter deux prestataires concurrents par erreur.</td><td>Logique distribuée dans des embranchements visuels complexes. Risque élevé de collisions ou d'états incohérents lors d'événements simultanés.</td></tr>
        <tr><td><b>Gestion des webhooks concurrents</b></td><td>Traitement asynchrone avec files d'attente (queues) garantissant l'ordre strict des messages même en cas de pic de trafic.</td><td>Chaque webhook entrant lance une exécution isolée sans verrouillage mémoire. Deux prestataires répondant à la même seconde peuvent corrompre la demande.</td></tr>
        <tr><td><b>Reprise humaine (Human Handoff)</b></td><td>Bascule instantanée par flag en base : l'IA est désactivée en mémoire en 5 ms, l'opérateur prend la main sur le même canal sans friction.</td><td>Nécessite des contournements complexes et lents via des routeurs de scénarios souvent sujets à des réponses croisées intempestives.</td></tr>
        <tr><td><b>Coûts d'exploitation</b></td><td>Forfait serveur fixe (~20 $/mois) quel que soit le nombre de messages échangés.</td><td>Modèle de tarification par exécution qui explose dès que le volume de conversations et de vérifications croît.</td></tr>
        <tr><td><b>Propriété et transférabilité</b></td><td>Dépôt de code Git standard, entièrement transférable à n'importe quel ingénieur logiciel sans dépendance d'outil tiers.</td><td>Dépendance structurelle envers la plateforme d'automatisation et sa maintenance propriétaire.</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section id="data-fr">
  <div class="sec-head">
    <div class="sec-num">6</div>
    <div class="col"><h2>Modèle de données &amp; Machine à états</h2></div>
  </div>
  <div class="sec-body">
    <p>Le schéma relationnel ci-dessous répond exhaustivement aux spécifications du cahier des charges (sections 6, 7, 8, 9, 10, 12 et 15) et prépare le terrain pour le scoring automatique de la phase 2 sans nécessiter de migration destructive.</p>
    <table>
      <thead><tr><th style="width:24%">Entité</th><th style="width:40%">Attributs clés</th><th>Rôle fonctionnel</th></tr></thead>
      <tbody>
        <tr><td><b>Partenaire</b></td><td>Nom, type (riad, hôtel, boutique), slug unique, URL/QR, contact, actif</td><td>Identification de l'origine du voyageur et attribution des commissions apporteurs.</td></tr>
        <tr><td><b>Client</b></td><td>Numéro WhatsApp, nom/prénom (si communiqué), langue détectée, partenaire d'origine, date de premier contact</td><td>Fiche client consolidée et historique multi-demandes.</td></tr>
        <tr><td><b>Conversation</b></td><td>Client, mode (IA / Humain), opérateur assigné, indicateur « attention requise », horodatages</td><td>Pilotage du dialogue et bascule immédiate vers l'opérateur.</td></tr>
        <tr><td><b>Message</b></td><td>Conversation, direction (entrant/sortant), contenu, auteur (client/IA/opérateur/système), horodatage</td><td>Traçabilité intégrale et archivage des échanges.</td></tr>
        <tr><td><b>Catégorie</b></td><td>Nom, libellé multilingue, ordre, icône, active</td><td>Restauration, transport, activités, bien-être, courses &amp; livraisons...</td></tr>
        <tr><td><b>Fournisseur</b></td><td>Nom, catégorie(s), zone, standing, gamme de prix, capacité, contact WhatsApp, langues, délai cible, commission, statut actif</td><td>Catalogue vérifié (15 champs requis par le cahier des charges).</td></tr>
        <tr><td><b>Prestation</b></td><td>Fournisseur, titre, description, tarif indicatif, conditions particulières</td><td>Détail des offres rattachées à un même prestataire.</td></tr>
        <tr><td><b>Demande</b></td><td>Client, conversation, catégorie, critères structurés (date, heure, pax, budget, zone), prescripteur, statut, opérateur, horodatages</td><td>Cœur du système et pivot de la machine à états.</td></tr>
        <tr><td><b>Sollicitation Fournisseur</b></td><td>Demande, fournisseur, envoyé le, réponse (dispo/indispo/partiel), prix, délai, conditions, reçu le, canal (bouton/texte)</td><td>Mesure des temps de réponse réels et des taux d'acceptation par prestataire.</td></tr>
        <tr><td><b>Offre</b></td><td>Demande, sollicitation retenue, soumise au client le, arbitrage du client</td><td>Historique des propositions commerciales faites au voyageur.</td></tr>
        <tr><td><b>Transaction</b></td><td>Demande, fournisseur, montant client, montant fournisseur, marge plateforme, commission apporteur, statut financier</td><td>Suivi financier analytique (paiement finalisé sur place ou auprès du prestataire).</td></tr>
        <tr><td><b>Avance de fonds</b></td><td>Demande course, coursier, montant avancé, justificatif (photo/reçu), frais de service, statut remboursement</td><td>Module dédié aux courses et livraisons (section 12 du cahier des charges).</td></tr>
        <tr><td><b>Opérateur</b></td><td>Nom, email, mot de passe sécurisé, rôle (admin / superviseur), actif</td><td>Gestion des accès au back-office.</td></tr>
        <tr><td><b>Configuration IA</b></td><td>Fournisseur actif, modèle (Gemini, Claude, OpenAI, DeepSeek), prompts système, versioning</td><td>Ajustement en direct des instructions sans toucher au code.</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">6.2 La machine à états d'une demande</h3>
    <p>Une demande ne peut exister que dans un seul état valide à la fois. Chaque transition est protégée et horodatée, fournissant automatiquement le calcul des temps de traitement et d'intervention :</p>
    <div class="states">
      <div class="state">à traiter</div><span class="trans">→</span>
      <div class="state">envoyé</div><span class="trans">→</span>
      <div class="state">en attente</div><span class="trans">→</span>
      <div class="state">disponible / indisponible</div><span class="trans">→</span>
      <div class="state">offre client envoyée</div><span class="trans">→</span>
      <div class="state">réservé / annulé</div><span class="trans">→</span>
      <div class="state">terminé</div>
    </div>
    <ul class="plain" style="margin-top:16px">
      <li>Si un prestataire répond <em>indisponible</em>, la demande retourne en statut <em>en attente</em> si d'autres prestataires sont sollicités, ou passe en alerte opérateur si aucune alternative n'est trouvée.</li>
      <li>L'état <em>annulé</em> peut intervenir depuis n'importe quelle étape avec enregistrement obligatoire du motif (désistement voyageur, refus prestataire, délai expiré).</li>
      <li>De même pour la conversation : bascule binaire stricte entre <code>Mode IA</code> et <code>Mode Humain</code>. En mode humain, l'IA est muette ; le retour au mode automatique est une action délibérée de l'opérateur.</li>
    </ul>
  </div>
</section>

<section id="scope-fr">
  <div class="sec-head">
    <div class="sec-num">7</div>
    <div class="col"><h2>Périmètre de la V1 par lot</h2></div>
  </div>
  <div class="sec-body">
    <p>La V1 couvre l'intégralité du cahier des charges V4 dans une version robuste, claire et testée. Le découpage suit scrupuleusement votre grille de consultation :</p>
    <table>
      <thead><tr><th style="width:30%">Lot</th><th>Contenu détaillé de la V1</th></tr></thead>
      <tbody>
        <tr><td><b>A. Setup &amp; infrastructure</b></td><td>Provisionnement du serveur Hetzner (Allemagne), configuration Docker et Dokploy, nom de domaine, certificats SSL, environnements de test et production isolés, sauvegardes automatiques. Comptes ouverts à votre nom.</td></tr>
        <tr><td><b>B. Intégration WhatsApp (2 numéros)</b></td><td>Connexion 360dialog sur la Cloud API Meta, webhooks entrants, passerelle d'envoi sortant, configuration des deux lignes (voyageurs et prestataires), soumission des templates interactifs avec boutons, journalisation intégrale des messages.</td></tr>
        <tr><td><b>C. Moteur IA &amp; orchestration</b></td><td>Couche multi-fournisseurs (Google Gemini, Anthropic Claude, OpenAI, OpenRouter / DeepSeek / Qwen) commutable depuis l'admin ; extraction d'entités bilingue FR/EN ; questions ciblées de clarification ; tool calling strict ; formulation des offres sur données vérifiées ; prompts éditables.</td></tr>
        <tr><td><b>D. Backend &amp; machine à états</b></td><td>Architecture Node.js / TypeScript, base PostgreSQL, implémentation stricte de la machine à états des demandes, sollicitation semi-automatique des prestataires, capture et horodatage des réponses, calcul analytique des marges et commissions.</td></tr>
        <tr><td><b>E. Back-office opérateur Next.js</b></td><td>Authentification sécurisée multi-opérateurs, fil des conversations en direct avec indicateur visuel IA/Humain, reprise manuelle et restitution à l'IA, liste des demandes filtrables par statut, vue détaillée d'un dossier, gestion CRUD du catalogue prestataires et services, paramétrage du modèle IA actif.</td></tr>
        <tr><td><b>F. Tracking QR &amp; attribution</b></td><td>Génération des slugs et URLs partenaires uniques, redirection dynamique serveur (`go.votredomaine.com/code`), enregistrement immédiat des scans côté serveur, mécanisme de réconciliation conversationnelle anti-effacement, statistiques de scans par partenaire.</td></tr>
        <tr><td><b>G. Livraison, courses &amp; avances</b></td><td>Catégorie coursiers dédiée, sollicitation multi-coursiers avec comparaison des devis et délais, sélection manuelle par l'opérateur, enregistrement des avances de frais avec photo du justificatif, montant des frais et statut de remboursement (conforme section 12).</td></tr>
        <tr><td><b>H. KPI, exports, doc &amp; transfert</b></td><td>Exports CSV/Excel en un clic sur toutes les tables métiers (clients, prestataires, demandes, offres, transactions, partenaires). Documentation de déploiement et d'exploitation, inventaire des licences et coûts récurrents, procédure de restauration testée, session de passation en direct de 2h enregistrée.</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">7.1 Phase 2 (post-pilote)</h3>
    <p>Fonctionnalités évolutives qu'il est judicieux de calibrer après avoir accumulé les données réelles du pilote :</p>
    <ul class="plain">
      <li><b>Scoring et classement algorithmique automatisé des prestataires</b> combinant réactivité, taux d'acceptation, niveau tarifaire et avis clients.</li>
      <li><b>Relances automatiques programmées</b> (prestataire n'ayant pas répondu sous 10 minutes, client n'ayant pas validé l'offre).</li>
      <li><b>Support de langues supplémentaires</b> (arabe littéraire, espagnol, allemand, italien).</li>
      <li><b>Automatisation financière avancée des commissions partenaires</b> et exports comptables spécifiques.</li>
    </ul>
  </div>
</section>

<section id="planning-fr">
  <div class="sec-head">
    <div class="sec-num">8</div>
    <div class="col"><h2>Planning d'exécution</h2></div>
  </div>
  <div class="sec-body">
    <p>Huit semaines complètes de la signature jusqu'au déploiement du pilote en production avec de vrais voyageurs. Un point hebdomadaire de 30 minutes et un accès permanent à l'environnement de staging pour suivre l'avancement en continu.</p>
    <table>
      <thead><tr><th style="width:14%">Semaine</th><th style="width:50%">Travaux prévus</th><th>Livrable &amp; Jalon</th></tr></thead>
      <tbody>
        <tr><td><b>Semaine 1</b></td><td>Mise en place de l'infrastructure, base PostgreSQL, modèle de données, machine à états ; lancement des démarches 360dialog et vérifications Meta pour les 2 numéros.</td><td>Environnement de staging en ligne</td></tr>
        <tr><td><b>Semaine 2</b></td><td>Intégration WhatsApp côté voyageurs, couche d'abstraction multi-LLM, extraction structurée et création des demandes.</td><td>Premier dialogue voyageur générant une demande sur numéro de test</td></tr>
        <tr><td><b>Semaine 3</b></td><td>Ligne WhatsApp prestataires, templates de sollicitation avec boutons, capture des réponses, renvoi des offres au client.</td><td>Boucle complète fonctionnelle de bout en bout sur numéros de test — <em>Jalon de paiement 2</em></td></tr>
        <tr><td><b>Semaine 4</b></td><td>Back-office opérateur Next.js : messagerie live, reprise humaine, fiches prestataires, modification des statuts, configuration IA.</td><td>Opérateurs opérationnels sur l'interface d'administration</td></tr>
        <tr><td><b>Semaine 5</b></td><td>Moteur d'attribution QR serveur, module livraisons/courses et gestion des avances de fonds.</td><td>Scénarios de courses testés sur plusieurs coursiers</td></tr>
        <tr><td><b>Semaine 6</b></td><td>Dashboard KPI, modules d'export CSV, tests de sauvegardes et restauration.</td><td>Ensemble des tests d'acceptation (section 19) validés</td></tr>
        <tr><td><b>Semaine 7</b></td><td>Tests d'intégration en conditions réelles, affinement des prompts, injection du catalogue prestataires et partenaires, documentation et session de passation.</td><td>Système recette et documenté</td></tr>
        <tr><td><b>Semaine 8</b></td><td>Mise en production officielle, premiers scans réels de voyageurs à Marrakech, surveillance rapprochée des premiers flux.</td><td>Pilote en production — <em>Jalon de paiement 3</em></td></tr>
      </tbody>
    </table>
    <div class="callout">
      <p><strong>Facteur de vigilance externe :</strong> Les délais de validation d'entreprise par Meta et d'approbation des templates peuvent varier de quelques jours à deux semaines. Ces démarches sont enclenchées dès le premier jour et reposent sur vos documents administratifs d'entreprise. Le développement technique avance en parallèle sur numéros de test sans temps mort.</p>
    </div>
  </div>
</section>

<section id="budget-fr">
  <div class="sec-head">
    <div class="sec-num">9</div>
    <div class="col"><h2>Budget &amp; Modalités</h2></div>
  </div>
  <div class="sec-body">
    <h3>9.1 V1 — Le pilote complet</h3>
    <p>Tous les montants sont libellés en dollars américains (USD), hors taxes (HT). La TVA légale s'applique selon la réglementation en vigueur.</p>
    <table>
      <thead><tr><th style="width:52%">Lot</th><th style="width:22%">Délai</th><th class="num">Montant HT</th></tr></thead>
      <tbody>
        <tr><td>A. Setup &amp; infrastructure</td><td>Semaine 1</td><td class="num">350 $</td></tr>
        <tr><td>B. Intégration WhatsApp (2 numéros 360dialog)</td><td>Semaines 2 – 3</td><td class="num">950 $</td></tr>
        <tr><td>C. Moteur IA &amp; orchestration multi-fournisseurs</td><td>Semaines 2 – 3</td><td class="num">1 050 $</td></tr>
        <tr><td>D. Backend, API &amp; machine à états</td><td>Semaines 1 – 3</td><td class="num">1 000 $</td></tr>
        <tr><td>E. Back-office opérateur Next.js</td><td>Semaine 4</td><td class="num">950 $</td></tr>
        <tr><td>F. Tracking QR &amp; attribution serveur</td><td>Semaine 5</td><td class="num">250 $</td></tr>
        <tr><td>G. Livraison, courses &amp; avances de fonds</td><td>Semaine 5</td><td class="num">350 $</td></tr>
        <tr><td>H. KPI, exports, documentation &amp; transfert</td><td>Semaines 6 – 7</td><td class="num">700 $</td></tr>
        <tr class="total"><td>Total V1 (Pilote complet en production)</td><td>8 semaines</td><td class="num">5 600 $</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">9.2 Phase 2 &amp; Options d'engagement</h3>
    <p>Les évolutions détaillées en section 7.1 sont chiffrées à <strong>400 $</strong> si elles sont engagées conjointement avec la V1 (livrées en semaines 7–8 une fois les premières données récoltées). Commandées de manière dissociée après le pilote, leur coût est de <strong>600 $</strong> (en raison du temps nécessaire à la ré-ouverture de l'environnement, aux tests de non-régression et au redéploiement).</p>
    <table>
      <thead><tr><th style="width:72%">Formule retenue</th><th class="num">Total HT</th></tr></thead>
      <tbody>
        <tr><td><b>Engagement séquencé :</b> V1 d'abord (5 600 $), décision sur la phase 2 après le pilote (+ 600 $)</td><td class="num"><b>6 200 $</b> <span class="muted">(en 2 temps)</span></td></tr>
        <tr><td><b>Offre groupée (Bundle) :</b> V1 + Phase 2 engagées ensemble dès la signature</td><td class="num"><b>6 000 $</b> <span class="badge" style="background:#E4F3EC;color:#0F7A57">Remise 200 $</span></td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">9.3 Maintenance et accompagnement opérationnel</h3>
    <p>Le premier mois suivant la mise en production est <strong>totalement inclus sans surcoût</strong> (période de garantie et de stabilisation du pilote). À compter du deuxième mois, la maintenance s'établit à <strong>300 $ HT / mois</strong> (engagement minimum de 3 mois). Un règlement trimestriel anticipé bénéficie d'un tarif préférentiel de <strong>800 $ HT pour 3 mois</strong> (au lieu de 900 $).</p>
    <table>
      <thead><tr><th style="width:34%">Nature de l'intervention</th><th>Délai d'intervention (SLA)</th></tr></thead>
      <tbody>
        <tr><td><b>Incident bloquant</b><br><span class="muted">Interruption de service, messages non traités, panne back-office</span></td><td>Prise en charge sous 3 heures ouvrées, diagnostic et déploiement du correctif sous 5 heures. Support assuré de 08h00 à 22h00 (heure du Maroc), 7j/7.</td></tr>
        <tr><td><b>Surveillance &amp; Maintien</b></td><td>Supervision continue des conteneurs, vérification des sauvegardes, mises à jour de sécurité et affinage régulier des prompts selon les retours clients réels.</td></tr>
        <tr><td><b>Ajustements mineurs</b><br><span class="muted">Modifications de texte/prompts, ajout d'un champ, nouvel export CSV, nouveau compte opérateur</span></td><td>Inclus dans le forfait mensuel, traités sous 2 à 3 jours ouvrés selon le planning convenu.</td></tr>
        <tr><td><b>Évolutions majeures</b><br><span class="muted">Nouvel écran, intégration d'un système tiers, nouveau canal</span></td><td>Chiffrage transparent préalable sur devis d'un commun accord avant tout démarrage.</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">9.4 Modalités de règlement</h3>
    <div class="price-line"><span>À la signature du devis (démarrage immédiat des travaux)</span><b>40 %</b></div>
    <div class="price-line"><span>À la démonstration de la boucle complète sur numéros de test (fin de semaine 3)</span><b>40 %</b></div>
    <div class="price-line"><span>À la mise en production du pilote et transfert des livrables (semaine 8)</span><b>20 %</b></div>
    <p>Le développement démarre dès confirmation du premier versement. Facturation par structure professionnelle, en dirhams au cours officiel de change du jour d'émission.</p>
  </div>
</section>

<section id="roi-fr">
  <div class="sec-head">
    <div class="sec-num">10</div>
    <div class="col"><h2>Ce que le pilote doit générer pour s'amortir</h2></div>
  </div>
  <div class="sec-body">
    <p>Une conciergerie touristique à Marrakech n'est pas un centre de coûts, mais un centre de profits direct. Voici le calcul de rentabilité basé sur des hypothèses réalistes pour le marché local :</p>
    <div class="turn">
      <div class="bubble out" style="background:#fff;border:1px solid var(--rule);margin-left:0;max-width:100%"><span class="who">Hypothèse d'activité pilote (25 riads partenaires)</span>
        • 100 scans de QR codes au total par jour sur l'ensemble des établissements partenaires.<br>
        • Taux d'engagement conversationnel : 10 % (soit 10 demandes formulées par jour).<br>
        • Taux de conversion en réservation ferme : 50 % (soit 5 réservations effectives par jour).<br>
        • Panier moyen par transaction : 800 DH (dîner rooftop, demi-journée d'excursion, transfert van, massage).<br>
        • Commission / marge nette moyenne captée : 18 % (soit 144 DH par transaction).
      </div>
    </div>
    <p style="margin-top:16px"><strong>Marge brute générée :</strong> 5 réservations × 144 DH = <strong>720 DH par jour (~72 $ / jour)</strong>.</p>
    <p>Sur un mois d'activité stabilisée (30 jours), le service génère ainsi environ <strong>21 600 DH de marge nette (~2 150 $)</strong>. Le coût de développement initial du MVP (6 000 $) est par conséquent <strong>intégralement amorti en moins de 3 mois de pilote</strong> (environ 6 à 8 semaines dès que le réseau de partenaires est actif).</p>
  </div>
</section>

<section id="running-fr">
  <div class="sec-head">
    <div class="sec-num">11</div>
    <div class="col"><h2>Coûts d'exploitation mensuels (services tiers)</h2></div>
  </div>
  <div class="sec-body">
    <p>Estimation basée sur un volume pilote d'environ 300 demandes mensuelles et 3 prestataires sollicités en moyenne par demande. Tous les comptes sont créés au nom de votre entreprise et réglés directement par vos soins :</p>
    <table>
      <thead><tr><th style="width:34%">Service tiers</th><th style="width:42%">Usage</th><th class="num">Estimation mensuelle</th></tr></thead>
      <tbody>
        <tr><td><b>Hébergement Hetzner</b></td><td>Serveur dédié Cloud en Allemagne, conteneurs Docker, stockage des snapshots</td><td class="num">15 – 25 $</td></tr>
        <tr><td><b>Nom de domaine &amp; DNS</b></td><td>Domaine principal, sous-domaine de redirection et webhooks</td><td class="num">~2 $</td></tr>
        <tr><td><b>WhatsApp Cloud API &amp; 360dialog</b></td><td>Forfaits 360dialog pour 2 numéros + coût des messages templates sortants vers les prestataires (messages entrants clients gratuits)</td><td class="num">40 – 70 $</td></tr>
        <tr><td><b>API LLM (Gemini / Claude / OpenAI)</b></td><td>Extraction JSON, dialogue voyageur, analyse des réponses libres</td><td class="num">20 – 50 $</td></tr>
        <tr><td><b>Services transactionnels</b></td><td>Alertes serveur, emails de récupération de mot de passe</td><td class="num">0 – 10 $ <span class="muted">(tiers gratuit)</span></td></tr>
        <tr class="total"><td>Total estimé des charges récurrentes</td><td>Exploitation mensuelle du pilote</td><td class="num">77 – 157 $ / mois</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section id="risks-fr">
  <div class="sec-head">
    <div class="sec-num">12</div>
    <div class="col"><h2>Les risques et leurs parades</h2></div>
  </div>
  <div class="sec-body">
    <table>
      <thead><tr><th style="width:28%">Risque identifié</th><th style="width:36%">Impact potentiel</th><th>Mesure préventive intégrée</th></tr></thead>
      <tbody>
        <tr><td><b>Délai de vérification Meta Business</b></td><td>Retard sur l'activation du numéro officiel</td><td>Démarches lancées dès le jour 1. Développement mené sans interruption sur numéros de test.</td></tr>
        <tr><td><b>Réponses prestataires en Darija ou argot</b></td><td>Mauvaise interprétation par l'IA</td><td>Prompts calibrés sur les idiomes marocains + alerte visuelle opérateur en cas de doute, jamais de confirmation à l'aveugle.</td></tr>
        <tr><td><b>Signalement de spam sur WhatsApp</b></td><td>Dégradation de la réputation de la ligne</td><td>Séparation étanche sur deux numéros distincts. Le numéro voyageur ne peut jamais être impacté par les prestataires.</td></tr>
        <tr><td><b>Perte d'attribution partenaire</b></td><td>Voyageur effaçant le code dans le message</td><td>Redirection via lien court serveur (`go.votredomaine.com/code`) enregistrant le scan en amont de WhatsApp.</td></tr>
        <tr><td><b>Dérive des coûts d'API IA</b></td><td>Facture LLM imprévue</td><td>Architecture multi-fournisseurs permettant de basculer sur des modèles économiques (DeepSeek, Gemini Flash) à volonté.</td></tr>
        <tr><td><b>Indisponibilité d'un fournisseur IA</b></td><td>Interruption temporaire du service</td><td>Couche d'abstraction permettant de changer d'API en 10 secondes depuis le back-office sans redéploiement.</td></tr>
        <tr><td><b>Développeur indépendant unique</b></td><td>Pérénité et continuité du code</td><td>Dépôt Git sous votre contrôle dès la semaine 1, stack standard Node/Postgres/Next.js documentée, comptes à votre nom, session de passation en semaine 7 avant tout paiement du solde.</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section id="privacy-fr">
  <div class="sec-head">
    <div class="sec-num">13</div>
    <div class="col"><h2>Données personnelles &amp; Conformité CNDP</h2></div>
  </div>
  <div class="sec-body">
    <p>Le traitement des données personnelles dans le cadre du pilote s'articule autour des principes suivants :</p>
    <ul class="plain">
      <li><b>Localisation des serveurs :</b> Les données sont hébergées au sein de l'Union Européenne (datacenter Hetzner en Allemagne), bénéficiant des normes de sécurité et de conformité RGPD les plus strictes.</li>
      <li><b>Sous-traitants et IA :</b> Les messages transitent par Meta et 360dialog. Les appels aux modèles LLM (Google, Anthropic, OpenAI) sont réalisés via leurs API professionnelles (Business/Enterprise Terms), dont les contrats garantissent explicitement que <strong>vos données ne sont jamais utilisées pour entraîner leurs modèles</strong>.</li>
      <li><b>Conformité marocaine (Loi 09-08) :</b> En tant que responsable de traitement, une déclaration préalable auprès de la <strong>CNDP</strong> (Commission Nationale de contrôle de la protection des Données à caractère Personnel) est requise. Je vous fournis le dossier technique complet prêt à être déposé (finalités, catégories de données, mesures de chiffrement, durées de rétention et liste des sous-traitants).</li>
      <li><b>Consentement des prestataires :</b> Leur acceptation de recevoir des notifications opérationnelles sur WhatsApp est formalisée lors de leur intégration au catalogue.</li>
    </ul>
  </div>
</section>

<section id="deliverables-fr">
  <div class="sec-head">
    <div class="sec-num">14</div>
    <div class="col"><h2>Livrables techniques</h2></div>
  </div>
  <div class="sec-body">
    <ul class="plain">
      <li><b>Code source complet et documenté</b>, transféré sur un dépôt Git vous appartenant en pleine propriété, accompagné des Dockerfiles et fichiers d'orchestration.</li>
      <li><b>Environnements de staging et de production</b> déployés et opérationnels sur votre propre infrastructure Hetzner.</li>
      <li><b>Documentation d'exploitation détaillée :</b> variables d'environnement, procédures de démarrage, maintenance courante et gestion des incidents.</li>
      <li><b>Documentation de la machine à états</b>, du schéma relationnel PostgreSQL et des prompts système.</li>
      <li><b>Inventaire exhaustif des composants open source</b> et de leurs licences (garantissant l'absence de restriction de cession ou commercialisation).</li>
      <li><b>Procédure de sauvegarde et de restauration</b> testée et validée en conditions réelles.</li>
      <li><b>Modules d'exports tabulaires (CSV/Excel)</b> sur l'ensemble des écrans du back-office.</li>
      <li><b>Session de transfert de compétences (2h en direct, enregistrée)</b> avec vous-même et le développeur qui sera amené à reprendre le projet à l'avenir.</li>
    </ul>
  </div>
</section>

<section id="assumptions-fr">
  <div class="sec-head">
    <div class="sec-num">15</div>
    <div class="col"><h2>Hypothèses &amp; Bonnes pratiques</h2></div>
  </div>
  <div class="sec-body">
    <ul class="plain">
      <li>Vous fournissez un compte Meta Business (ou le créez avec mon accompagnement), les documents administratifs de l'entreprise et les deux numéros de téléphone dédiés.</li>
      <li>Vous fournissez le catalogue initial des prestataires et des riads partenaires sous format tableur.</li>
      <li>Les règles de gestion des courses (plafonds d'avances, justificatifs obligatoires) sont définies avant l'ouverture de cette catégorie.</li>
      <li>Tous les comptes tiers (Hetzner, Meta, 360dialog, clés d'API LLM) sont ouverts au nom de votre entreprise et pris en charge directement par celle-ci.</li>
      <li>Une fois le service officiellement lancé publiquement, je pourrai faire mention du projet et de votre enseigne dans mon portfolio professionnel, sous réserve du respect de la confidentialité maintenue jusque-là.</li>
      <li>Cette offre est valable pour une durée de 30 jours.</li>
    </ul>
    <div class="callout">
      <p><strong>Recommandation d'efficacité pour les comptes :</strong> Créer une adresse email dédiée au projet — par exemple <code>operations@votredomaine.com</code> — servant d'identifiant unique pour ouvrir tous les services (Meta, 360dialog, Hetzner, registrars, IA). Vous en partagez l'accès avec moi pour le déploiement technique. Tous les codes de confirmation et alertes arrivent au même endroit, évitant tout blocage nocturne, et la passation future se résume à une simple modification de mot de passe.</p>
    </div>
    <p style="margin-top:24px">Je reste à votre entière disposition pour tout échange technique complémentaire avant notre appel.</p>
    <div class="signoff">
      <b>Faouzi El Bakri</b><br>
      AI Engineer &amp; Full-Stack Developer<br>
      <a href="https://faouzielbakri.com">faouzielbakri.com</a> · +212 6 32 32 38 56
    </div>
  </div>
</section>

<section id="seo-fr">
  <div class="sec-head">
    <div class="sec-num">16</div>
    <div class="col"><h2>Une option pour plus tard : être trouvé plutôt que distribué</h2></div>
  </div>
  <div class="sec-body">
    <p>L'acquisition initiale par QR codes dans les riads est la stratégie idéale pour démarrer : elle ne coûte rien en achat média, cible le voyageur au moment exact où son besoin émerge, et offre une mesure précise. Cependant, elle est naturellement plafonnée par le nombre d'établissements partenaires.</p>
    <p>Le deuxième canal d'accélération naturel est <strong>le référencement organique sur les requêtes à forte intention à Marrakech</strong>. Les touristes planifient leurs activités avant leur départ : réservation d'un transfert aéroport, recherche du meilleur rooftop en médina, excursion dans le désert d'Agafay. Votre catalogue de prestataires structuré en base (zones, prix, catégories, standing) constitue précisément le contenu que Google favorise lorsqu'il est exposé sous forme de pages optimisées. Chaque page intègre un bouton d'action pointant vers le même numéro WhatsApp avec un code de tracking dédié. Les voyageurs organiques se déversent ainsi directement dans le même entonnoir, le même back-office et le même tableau de bord que les clients issus des riads.</p>
    <div class="rec">
      <p>C'est exactement ce mécanisme qui a rendu notre échange possible : vous n'avez pas découvert mon profil via une publicité ou une recommandation tierce, mais en consultant mon portfolio bien positionné, en découvrant l'étude de cas sur RESO Khdma, puis en prenant contact directement.</p>
    </div>
  </div>
</section>
"""

# Now let us construct the bilingual HTML
# We need to add the language switch component styles and markup
switch_css = """
/* Language switch component */
.lang-switch-wrap {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 9999;
}
.lang-switch {
  display: inline-flex;
  align-items: center;
  background: rgba(253, 253, 252, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--rule);
  border-radius: 9999px;
  padding: 3px;
  box-shadow: 0 4px 18px rgba(16, 30, 46, 0.09);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
}
.lang-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  padding: 5px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  outline: none;
}
.lang-btn:hover {
  color: var(--ink);
}
[data-lang="en"] #btn-en,
[data-lang="fr"] #btn-fr {
  background: var(--ink);
  color: #fff;
  font-weight: 600;
}
/* Visibility rules */
[data-lang="en"] .lang-fr {
  display: none !important;
}
[data-lang="fr"] .lang-en {
  display: none !important;
}
@media print {
  .lang-switch-wrap {
    display: none !important;
  }
}
@media (max-width: 640px) {
  .lang-switch-wrap {
    top: 12px;
    right: 14px;
  }
  .lang-btn {
    padding: 4px 11px;
    font-size: 12px;
  }
}
"""

combined_css = original_style + "\n" + switch_css

# Build the complete HTML

header_html = """<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Concierge on WhatsApp — Technical &amp; Financial Proposal · Marrakech Pilot</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet">
<style>
""" + combined_css + """
</style>
<script>
(function() {
  try {
    var params = new URLSearchParams(window.location.search);
    var lang = params.get("lang");
    if (lang !== "fr" && lang !== "en") {
      lang = localStorage.getItem("ballroom_proposal_lang") || "en";
    }
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
  } catch(e) {
    document.documentElement.setAttribute("data-lang", "en");
  }
})();
</script>
</head>
<body>

<div class="lang-switch-wrap" role="region" aria-label="Language selector">
  <div class="lang-switch" role="group">
    <button type="button" class="lang-btn" data-set-lang="en" id="btn-en" aria-label="Switch to English">EN</button>
    <button type="button" class="lang-btn" data-set-lang="fr" id="btn-fr" aria-label="Passer en Français">FR</button>
  </div>
</div>

<!-- ENGLISH VERSION (DEFAULT) -->
<div class="sheet lang-en">
""" + en_sheet_inner + """
</div>

<!-- FRENCH VERSION -->
<div class="sheet lang-fr">
""" + fr_sheet_inner + """
</div>

<script>
(function() {
  function setLanguage(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    if (lang === "fr") {
      document.title = "Concierge IA sur WhatsApp — Proposition Technique & Financière · Pilote Marrakech";
    } else {
      document.title = "AI Concierge on WhatsApp — Technical & Financial Proposal · Marrakech Pilot";
    }
    try {
      localStorage.setItem("ballroom_proposal_lang", lang);
      var url = new URL(window.location.href);
      if (lang === "fr") {
        url.searchParams.set("lang", "fr");
      } else {
        url.searchParams.delete("lang");
      }
      window.history.replaceState({}, "", url.toString());
    } catch(e) {}
  }

  document.querySelectorAll("[data-set-lang]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var targetLang = btn.getAttribute("data-set-lang");
      setLanguage(targetLang);
    });
  });

  if (document.documentElement.getAttribute("data-lang") === "fr") {
    document.title = "Concierge IA sur WhatsApp — Proposition Technique & Financière · Pilote Marrakech";
  }
})();
</script>

</body>
</html>
"""

bilingual_html = header_html

dest_file = "/Users/mac/Documents/code/work/faouzielbakri/public/proposals/ballroom-mvp.html"
with open(dest_file, "w", encoding="utf-8") as f:
    f.write(bilingual_html)

dest_file2 = "/Users/mac/Documents/code/work/faouzielbakri/public/proposals/concierge-whatsapp-mvp.html"
with open(dest_file2, "w", encoding="utf-8") as f:
    f.write(bilingual_html)

print("Successfully wrote bilingual proposal to:", dest_file, "size:", len(bilingual_html))
