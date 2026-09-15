import re

fr_sheet_inner = """
<header class="cover">
  <div class="brandline">Proposition technique et financière · Réponse au cahier des charges MVP, version 4</div>
  <h1>Un concierge IA qui tourne sur WhatsApp.</h1>
  <p class="sub">Un pilote complet et opérationnel à Marrakech : les voyageurs s'expriment en langage naturel, les prestataires vérifiés répondent sur WhatsApp, et vos opérateurs voient et contrôlent tout entre les deux.</p>
  <div class="meta">
    <div><span>Préparé pour</span><b>Fred Valezy — Ballroom Prod</b></div>
    <div><span>Préparé par</span><b>Faouzi El Bakri — AI Engineer &amp; Full-Stack Developer</b></div>
    <div><span>Contact</span><b>faouzielbakri.com · +212 6 32 32 38 56</b></div>
    <div><span>Date</span><b>16 septembre 2026</b></div>
    <div><span>Validité</span><b>30 jours</b></div>
  </div>
  <p class="confidential">Confidentialité réciproque. Préparé dans le cadre de l'accord de confidentialité signé le 13 septembre 2026 et couvrant le projet décrit dans le cahier des charges version 4 — et le contenu technique de ce document, l'architecture, le modèle de données et la conception de l'attribution sont mon propre travail, partagé avec vous dans le seul but d'évaluer cette proposition et non pour utilisation, reproduction ou transmission à un tiers. Aucun de nous ne devrait retrouver ses éléments entre les mains d'un tiers.</p>
</header>

<nav class="toc" aria-label="Sommaire">
  <a href="#thread-fr"><span>0</span>Ce à quoi ressemble le pilote</a>
  <a href="#summary-fr"><span>1</span>Synthèse</a>
  <a href="#whoami-fr"><span>2</span>Qui vous recrutez</a>
  <a href="#understanding-fr"><span>3</span>Comment je lis le projet</a>
  <a href="#architecture-fr"><span>4</span>Architecture recommandée</a>
  <a href="#code-vs-nocode-fr"><span>5</span>Pourquoi du code, et non un outil d'automatisation</a>
  <a href="#data-fr"><span>6</span>Modèle de données</a>
  <a href="#scope-fr"><span>7</span>Ce que contient la V1, lot par lot</a>
  <a href="#planning-fr"><span>8</span>Planning</a>
  <a href="#budget-fr"><span>9</span>Budget</a>
  <a href="#roi-fr"><span>10</span>Ce que le pilote doit générer pour s'amortir</a>
  <a href="#running-fr"><span>11</span>Coûts d'exploitation</a>
  <a href="#risks-fr"><span>12</span>Les risques et leurs parades</a>
  <a href="#privacy-fr"><span>13</span>Données personnelles</a>
  <a href="#deliverables-fr"><span>14</span>Livrables</a>
  <a href="#assumptions-fr"><span>15</span>Hypothèses et conditions</a>
  <a href="#seo-fr"><span>16</span>Une option pour plus tard : être trouvé au lieu d'être distribué</a>
</nav>

<section id="thread-fr">
  <div class="sec-head">
    <div class="sec-num">0</div>
    <div class="col">
      <h2>Ce à quoi ressemble le pilote, de bout en bout</h2>
      <p class="lead" style="margin-top:12px">Une demande, du code QR dans un riad jusqu'à une réservation confirmée. La colonne de gauche montre ce que les personnes voient sur WhatsApp. La colonne de droite montre ce que le système fait derrière chaque échange.</p>
    </div>
  </div>
  <div class="thread">
    <div class="turn">
      <div class="bubble in"><span class="who">Voyageur · a scanné le QR au Riad El Fenn</span>Bonjour ! On cherche un bon rooftop pour 4 ce soir, bonne cuisine, pas trop bruyant, environ 300-350 dh par personne. Que nous recommandez-vous ?</div>
      <div class="note"><b>Attribution enregistrée dès le scan.</b> Le code QR pointe vers notre propre lien, qui enregistre le scan et le partenaire avant de rediriger vers WhatsApp. L'attribution est déjà créditée avant même que le voyageur ne tape un mot.</div>
    </div>
    <div class="turn">
      <div class="bubble out"><span class="who">Concierge · IA</span>Bien reçu — une table en rooftop pour 4 ce soir, bonne cuisine, autour de 300-350 dh. Je vérifie ce qui est ouvert avec des tables disponibles dès maintenant et je vous envoie les deux meilleures options dans deux minutes.</div>
      <div class="note"><b>Demande créée, #1042.</b> Catégorie, date, heure, nombre de personnes, budget et zone extraits dans des champs structurés. L'opérateur la voit apparaître sur son tableau de bord.</div>
    </div>
    <div class="turn">
      <div class="bubble supplier"><span class="who">Prestataire · répondant en français, sur le numéro prestataire</span>Dispo à 20h15, table terrasse, 280 dh/pers hors boissons.</div>
      <div class="note"><b>Trois prestataires ciblés et sollicités.</b> La sélection est une requête en base de données sur la catégorie, la zone, le standing, la fourchette de prix et la capacité — pas une supposition du modèle. Réponse capturée à 4 minutes : disponible, 280 MAD, 20h15.</div>
    </div>
    <div class="turn">
      <div class="bubble out"><span class="who">Concierge · options validées par l'opérateur</span>Deux rooftops peuvent vous accueillir : un à 20h15 à 280 dh par personne, un à 20h30 à 310 dh avec un menu fixe. Lequel souhaitez-vous que je réserve ?</div>
      <div class="note"><b>Seules les données enregistrées sont citées.</b> Les prix, horaires et disponibilités proviennent des réponses des prestataires stockées dans la base de données. L'IA n'en invente jamais.</div>
    </div>
    <div class="turn">
      <div class="bubble in"><span class="who">Voyageur</span>Le premier s'il vous plaît 🙏</div>
      <div class="note"><b>Statut : réservé.</b> Transaction enregistrée avec le prix client, le montant prestataire, la marge plateforme et la part du partenaire. Temps de réponse consignés pour le tableau de bord du pilote.</div>
    </div>
  </div>
</section>

<section id="summary-fr">
  <div class="sec-head">
    <div class="sec-num">1</div>
    <div class="col"><h2>Synthèse</h2></div>
  </div>
  <div class="sec-body">
    <p>Vous recherchez un MVP simple, robuste et évolutif pour tester un service de conciergerie sur WhatsApp à Marrakech avec de vrais voyageurs. Un client scanne le code QR d'un partenaire, décrit ce qu'il souhaite avec ses propres mots, l'IA structure la demande, le système interroge les prestataires pertinents sur WhatsApp, un opérateur supervise, et le client reçoit une ou plusieurs options jusqu'à la réservation. Autour de cette boucle : un back-office léger, une reprise humaine à tout instant, une attribution par partenaire et des chiffres que vous pouvez réellement lire.</p>
    <p>Ce document répond point par point au cahier des charges version 4 — l'architecture recommandée, pourquoi cela est écrit en code plutôt qu'assemblé dans un outil d'automatisation, le modèle de données, ce qui va dans la V1 et ce qui attend la phase 2, un planning de huit semaines jusqu'au pilote en production, un prix par lot, ce que le pilote doit générer pour s'amortir, et le coût d'exploitation mensuel.</p>
    <h3 style="margin-top:32px">Quatre recommandations</h3>
    <ol class="steps">
      <li><b>Bâtir le produit comme un seul ensemble, pas en deux moitiés.</b> Les pièces dépendent les unes des autres — une demande ne sert à rien sans prestataire à interroger, les réponses des prestataires ne servent à rien sans back-office pour les lire, et rien de tout cela n'a de sens sans attribution et mesure. La V1 est la boucle complète, courses comprises, chaque partie dans sa forme robuste la plus simple. La phase 2 ne retient que ce que les données réelles du pilote doivent décider.</li>
      <li><b>Deux numéros WhatsApp, pas un seul.</b> Un pour les voyageurs, un pour les prestataires. Cela sépare les deux publics au niveau qui compte : la note de qualité, les limites d'envoi, le nom d'affichage et les ensembles de templates sont indépendants, de sorte qu'un prestataire qui bloque ou signale le numéro prestataire ne peut jamais affecter le numéro sur lequel vos voyageurs écrivent.</li>
      <li><b>Rendre le moteur IA commutable dès le premier jour.</b> Google, Anthropic, OpenAI et OpenRouter sont tous supportés dans la V1, le modèle actif étant choisi dans le back-office. Aucun verrouillage fournisseur, et vous pouvez comparer la qualité, la latence et le coût sur vos propres conversations pendant le pilote.</li>
      <li><b>Mesurer le pilote au cœur même du produit.</b> Le tableau de bord KPI passe dans la V1. Un pilote existe pour déboucher sur une décision, et cette décision nécessite que la conversion, les temps de réponse et l'attribution soient visibles sur un écran que votre équipe ouvre chaque matin — pas extraits d'une base de données par un développeur.</li>
    </ol>
  </div>
</section>

<section id="whoami-fr">
  <div class="sec-head">
    <div class="sec-num">2</div>
    <div class="col"><h2>Qui vous recrutez</h2></div>
  </div>
  <div class="sec-body">
    <p>Vous m'avez demandé quel était mon rôle exact sur RESO Khdma et ce que j'avais choisi techniquement pour WhatsApp et l'IA. La réponse courte à la première partie : l'intégralité. C'était une livraison en freelance que j'ai conçue, développée et déployée seul — l'intégration de l'API WhatsApp Business, l'agent conversationnel, le matching sémantique, la base de données et la partie opérateur.</p>
    <p>Les choix qui la sous-tendent sont ceux qui ont façonné cette proposition :</p>
    <ul class="plain">
      <li><b>Tool calling avec des contrats JSON stricts plutôt que des réponses libres.</b> L'agent pouvait interroger la base de données, faire correspondre un profil, créer un compte — chacun via une fonction définie avec un schéma défini. C'est le même mécanisme proposé ici dans le lot C, et c'est pourquoi l'IA dans votre système peut rechercher des prestataires mais ne peut pas en inventer un.</li>
      <li><b>Recherche sémantique plutôt que correspondance par mots-clés.</b> Un travailleur décrit ce qu'il fait avec ses propres mots et le système trouve des offres dont la formulation ne correspond pas du tout. Votre version de ce problème est un voyageur demandant « un endroit calme avec un bon tajine, pas touristique » face à un catalogue rédigé en catégories.</li>
      <li><b>Darija, arabe et français dans un flux conversationnel unique,</b> pour des utilisateurs qui ne sont pas techniques et n'adaptent pas leur langage pour une machine. Vos prestataires écriront de la même façon.</li>
    </ul>
    <p>RESO Khdma n'est pas le seul système WhatsApp que j'ai en production. Belmo, une boutique en ligne K-beauty axée sur l'arabe que j'ai construite et que j'auto-héberge, fait tourner un agent WhatsApp plus simple à ses côtés, gérant les questions clients et les commandes — 818 clients enregistrés et 629 commandes au cours de ses deux premiers mois. Plus simple que RESO, mais un vrai système avec de vrais clients à l'autre bout.</p>
    <p>Trois autres éléments sont directement pertinents par rapport à ce que vous demandez :</p>
    <ul class="plain">
      <li><b>FASL</b> (fasl.ma), dont je suis co-fondateur et ingénieur en chef : un pipeline multi-agents qui rédige des recours juridiques marocains, appuyé par une couche RAG sur les codes juridiques. Construit dans un domaine où une citation inventée est une catastrophe — ce qui est exactement la discipline derrière « le concierge ne cite que les réponses enregistrées des prestataires » dans la section 4.3.</li>
      <li><b>Magical Hekaya</b> (magicalhekaya.com), mon propre produit d'IA grand public avec des clients payants : un pipeline multi-modèles avec des contrats de sortie structurés entre les étapes. La couche de changement de fournisseur que je propose dans le lot C n'est pas un diagramme — j'en ai construit et opéré une.</li>
      <li><b>Auto-hébergement.</b> Belmo tourne sur Hetzner avec Docker et Dokploy, la même infrastructure proposée ici. Je n'apprends pas votre stack sur votre budget.</li>
    </ul>
    <p>Formation : Master en Big Data et Intelligence Artificielle de l'Université Ibn Zohr, avec un mémoire sur la détection de défauts atteignant 96,96 % de mAP50, après une Licence en Informatique ; six ans de livraison de logiciels en production ; seize produits en ligne, dont quatre sont les miens. Arabe et Darija natifs, français et anglais courants.</p>
    <div class="rec"><p><b>Et ce que je ferais différemment.</b> Sur RESO Khdma, l'interprétation du texte libre était ajustée au comportement d'un seul modèle, ce qui s'est avéré coûteux à réajuster lorsque le modèle a changé. C'est pourquoi cette proposition place quatre fournisseurs derrière un commutateur unique, et pourquoi une réponse de prestataire ambiguë est signalée à votre opérateur plutôt que résolue par une supposition confiante. Les erreurs sont déjà payées.</p></div>
  </div>
</section>

<section id="understanding-fr">
  <div class="sec-head">
    <div class="sec-num">3</div>
    <div class="col"><h2>Comment je lis le projet</h2></div>
  </div>
  <div class="sec-body">
    <p>Le produit est un intermédiaire conversationnel entre trois populations : les voyageurs, les prestataires de services (restaurants, transport, activités, bien-être) et les partenaires prescripteurs (riads, hôtels, boutiques) identifiés par code QR. La valeur du pilote n'est pas le chatbot. C'est la boucle complète — demande, sollicitation, réponses, offre, réservation — avec des données fiables à chaque étape.</p>
    <p>Trois principes traversent l'ensemble de la proposition, conformément à votre cahier des charges :</p>
    <ul class="plain">
      <li>L'IA ne décide jamais d'un fait commercial. La disponibilité, les prix et les caractéristiques des prestataires proviennent uniquement du catalogue et des réponses enregistrées des prestataires.</li>
      <li>Un humain reste dans la boucle : supervision, prise de contrôle sur le même numéro, et le choix final laissé à l'opérateur dès qu'il le souhaite.</li>
      <li>Le backend est indépendant du canal. WhatsApp est le premier canal ; une application web ou une application mobile peut être branchée sur le même moteur plus tard sans réécriture.</li>
    </ul>
    <p>Un détail local mérite d'être souligné : vos prestataires à Marrakech répondront en français, en darija, parfois dans un mélange des deux, et souvent en une seule ligne sans ponctuation. Les réponses en texte libre sont interprétées par l'IA et signalées à l'opérateur lorsqu'elles sont ambiguës, plutôt que devinées en silence.</p>
  </div>
</section>

<section id="architecture-fr">
  <div class="sec-head">
    <div class="sec-num">4</div>
    <div class="col"><h2>Architecture recommandée</h2></div>
  </div>
  <div class="sec-body">
    <h3 style="margin-top:0">4.1 La stack, et pourquoi</h3>
    <table>
      <thead><tr><th style="width:22%">Couche</th><th style="width:38%">Choix</th><th>Pourquoi</th></tr></thead>
      <tbody>
        <tr><td><b>Canal WhatsApp</b></td><td>360dialog, Business Solution Provider officiel Meta, sur la Cloud API — deux numéros</td><td>Un forfait mensuel fixe par numéro sans aucune surtaxe sur les frais de message de Meta, un onboarding et un support de vérification rapides, et la Cloud API standard en dessous — afin que le code ne soit pas lié à 360dialog et que les numéros restent portables. Comptes et numéros à votre nom.</td></tr>
        <tr><td><b>Backend</b></td><td>Node.js (TypeScript), API REST et webhooks</td><td>Un service unique qui reçoit les messages, orchestre l'IA, exécute la machine à états des demandes et alimente le back-office. Agnostique du canal par conception.</td></tr>
        <tr><td><b>Moteur IA</b></td><td>Couche d'abstraction de fournisseurs sur Google, Anthropic, OpenAI et OpenRouter</td><td>Les quatre exposent les mêmes primitives — conversation, extraction structurée, tool calling. Le fournisseur et le modèle actifs sont définis dans le back-office et peuvent être modifiés sans redéploiement. OpenRouter ouvre également l'accès à des modèles à moindre coût tels que DeepSeek ou Qwen si vous souhaitez tester l'arbitrage coût-qualité pendant le pilote.</td></tr>
        <tr><td><b>Base de données</b></td><td>PostgreSQL</td><td>Un modèle relationnel structuré, des exports directs, des sauvegardes automatisées et la forme requise pour le classement automatique des prestataires en phase 2.</td></tr>
        <tr><td><b>Back-office</b></td><td>Application web Next.js, responsive</td><td>Rapide à construire, utilisable sur ordinateur portable et tablette, comptes opérateurs multiples dès le départ.</td></tr>
        <tr><td><b>Hébergement</b></td><td>Serveur Hetzner (Allemagne) avec images Docker, déployé via Dokploy</td><td>Faible coût mensuel, images reproductibles, déploiements en un clic et une configuration que tout autre développeur peut reprendre. Comptes à votre nom.</td></tr>
        <tr><td><b>Sauvegardes</b></td><td>Snapshots quotidiens de la base de données vers un stockage objet</td><td>Procédure de restauration documentée et testée avant la mise en production, pas après un incident.</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">4.2 Pourquoi un intermédiaire plutôt que d'aller directement chez Meta</h3>
    <p>L'API Cloud de Meta peut être utilisée directement, et c'est légèrement moins cher sur le papier. En pratique, les frictions se situent au niveau de la vérification de l'entreprise, de l'enregistrement des numéros, de l'approbation des modèles de messages et des incidents d'évaluation de la qualité — et c'est exactement là qu'un pilote perd deux semaines. 360dialog gère cette couche pour un forfait fixe par numéro et répercute les frais de message de Meta à prix coûtant. Parce qu'il s'agit de la même API Cloud en dessous, l'intégration est une URL de base et un token : passer à Meta en direct, ou à un autre fournisseur plus tard, est une modification de configuration plutôt qu'une reconstruction.</p>

    <h3 style="margin-top:34px">4.3 Le parcours d'une demande</h3>
    <p>En reprenant l'exemple ci-dessus : une table en rooftop pour quatre ce soir, autour de 300 dh par personne.</p>
    <ol class="steps">
      <li>Le voyageur scanne le code QR du partenaire. Il pointe vers un lien court sur votre propre domaine, qui enregistre le scan puis redirige vers WhatsApp — voir 4.5 ci-dessous. Dès que le voyageur commence à écrire, le partenaire a déjà été crédité.</li>
      <li>L'IA extrait la catégorie, la date, l'heure, le nombre de personnes, le budget, la zone et les préférences, et pose une question ciblée lorsqu'un élément essentiel manque.</li>
      <li>Grâce au tool calling, l'IA crée la demande et interroge le catalogue. Le système filtre les prestataires actifs dans la catégorie par zone, standing, fourchette de prix et capacité. Cette étape est une requête en base de données, pas un arbitrage du modèle.</li>
      <li>Le système envoie aux prestataires présélectionnés un message WhatsApp structuré depuis le numéro prestataire — un template approuvé avec la demande et des boutons de réponse. La demande passe à <em>envoyé</em>, puis <em>en attente</em>. L'opérateur voit la demande et les prestataires contactés, et peut ajouter, retirer ou appeler directement qui que ce soit.</li>
      <li>Les réponses des prestataires sont capturées : des boutons pour disponible ou indisponible, du texte libre interprété par l'IA et confirmé par l'opérateur en cas d'ambiguïté. Chaque réponse est horodatée.</li>
      <li>L'opérateur, ou le système selon la règle que vous choisissez, sélectionne les options à présenter. L'IA les rédige au voyageur en utilisant uniquement les données enregistrées.</li>
      <li>Le voyageur choisit. La demande passe à <em>réservé</em> ou <em>annulé</em>, et la transaction est enregistrée avec les montants et les commissions pour information. Le paiement s'effectue directement auprès du prestataire.</li>
    </ol>

    <h3 style="margin-top:34px">4.4 Deux numéros : ce que cela apporte et ce que cela coûte</h3>
    <p>Votre cahier des charges laisse ce point ouvert. Les deux approches fonctionnent techniquement — le code de routage est le même dans les deux cas, car un prestataire est reconnu par le numéro stocké dans le catalogue. La différence réside dans l'isolation.</p>
    <table>
      <thead><tr><th style="width:25%">Option</th><th style="width:38%">En faveur</th><th>Contre</th></tr></thead>
      <tbody>
        <tr><td><b>Deux numéros</b><br><span class="muted">recommandé</span></td><td>Notes de qualité et limites d'envoi indépendantes, afin que le trafic des prestataires ne puisse jamais dégrader le numéro que vos voyageurs utilisent. Un nom d'affichage distinct pour les prestataires. Des ensembles de modèles séparés, des webhooks séparés et des métriques plus claires par audience. Rien à migrer plus tard si le volume des prestataires augmente.</td><td>Deux vérifications au lieu d'une, un deuxième abonnement mensuel et quelques jours de travail supplémentaires dans le lot B.</td></tr>
        <tr><td><b>Un seul numéro</b><br><span class="muted">voyageurs et prestataires réunis</span></td><td>Une seule vérification, un seul jeu de modèles, un seul abonnement. Marginalement plus rapide et moins cher à lancer.</td><td>Les voyageurs et les prestataires partagent une note de qualité. Le trafic sortant à haute fréquence vers les prestataires est exactement le modèle qui attire la limitation de débit, et si cela se produit, cela atterrit sur votre numéro faisant face aux voyageurs.</td></tr>
      </tbody>
    </table>
    <div class="rec"><p><b>Recommandation : deux numéros dès le départ.</b> La différence de coût est faible et c'est le seul choix architectural ici qui est véritablement douloureux à inverser une fois que de vrais voyageurs dialoguent avec un numéro. Les deux sont enregistrés en semaine 1 afin que les vérifications se fassent en parallèle.</p></div>

    <h3 style="margin-top:34px">4.5 Comment un scan est réellement attribué</h3>
    <p>La façon évidente de suivre un code QR est de le faire pointer directement vers un lien WhatsApp contenant un message pré-rempli avec le code du partenaire. C'est également fragile : le voyageur peut effacer ce texte avant de l'envoyer, et lorsqu'il le fait, le contact arrive sans aucune source. Sur un pilote dont le but entier est de prouver quels partenaires génèrent des affaires, perdre l'attribution revient à perdre le résultat.</p>
    <p>Les codes QR pointent donc vers un lien court sur votre propre domaine — <em>go.votredomaine.com/elfenn</em> — et ce lien effectue trois actions en quelques millisecondes :</p>
    <ol class="steps">
      <li><b>Enregistre le scan côté serveur</b> avant toute autre chose : partenaire, horodatage, appareil et langue, plus une fenêtre de déduplication afin que le même téléphone scannant deux fois en une minute ne compte qu'une seule fois. Vous obtenez le nombre de scans par partenaire dès le premier jour, que le voyageur ouvre ou non une conversation. Un lien WhatsApp direct ne pourra jamais vous fournir ce chiffre.</li>
      <li><b>Redirige vers WhatsApp</b> avec une redirection temporaire, et non permanente, de sorte que chaque futur scan continue d'atteindre votre serveur et que la destination puisse être modifiée ultérieurement — un deuxième numéro, une page d'atterrissage, un chat web — sans réimprimer un seul code QR.</li>
      <li><b>Relie la conversation au scan.</b> Le message pré-rempli comporte un code court, qui gère le cas normal. Lorsqu'un voyageur l'efface, le premier message provenant d'un numéro inconnu est associé au scan non réclamé le plus récent dans une fenêtre courte, ce qui résout presque tout le reste. Si deux scans de partenaires différents entrent en collision dans cette fenêtre, la demande est signalée dans le back-office comme <em>attribution à confirmer</em> et un opérateur tranche. Le système n'invente jamais une attribution en silence — un mauvais crédit partenaire est pire qu'un crédit manquant.</li>
    </ol>
    <p>Ce même mécanisme est ce qui rend un deuxième canal d'acquisition gratuit à ajouter plus tard : n'importe quel lien, de n'importe où, reçoit son propre code et atterrit dans le même tableau de bord à côté des riads partenaires.</p>
  </div>
</section>

<section id="code-vs-nocode-fr">
  <div class="sec-head">
    <div class="sec-num">5</div>
    <div class="col"><h2>Pourquoi ceci est écrit en code, et non assemblé dans n8n</h2></div>
  </div>
  <div class="sec-body">
    <p>Vous recevrez des devis proposant de construire cela dans un outil d'automatisation — n8n, Make, Zapier ou un créateur de chatbot avec un connecteur WhatsApp. Ces devis seront moins chers et plus rapides sur le papier. La comparaison vaut la peine d'être faite explicitement, car la différence n'apparaît pas en semaine 3. Elle apparaît au mois 4, lorsque vous souhaitez modifier quelque chose.</p>
    <p>Les outils d'automatisation sont véritablement bons dans une tâche : connecter des systèmes qui existent déjà. Envoyer une ligne à un tableur, poster une notification, synchroniser deux applications. Ce projet ne relève pas de cette tâche. C'est un produit avec son propre état, sa propre base de données et ses propres opérateurs.</p>
    <table>
      <thead><tr><th style="width:27%">Ce dont le pilote a besoin</th><th style="width:36%">Dans un outil d'automatisation</th><th>Écrit sous forme de code</th></tr></thead>
      <tbody>
        <tr><td><b>État de la conversation à travers des centaines de chats parallèles</b></td><td>Chaque message est une exécution isolée. La mémoire doit être greffée avec un stockage externe, et des messages simultanés provenant du même voyageur produisent des réponses dupliquées ou croisées.</td><td>Un enregistrement de conversation, un état, un ordonnancement garanti. Le problème ne se pose tout simplement pas.</td></tr>
        <tr><td><b>La machine à états des demandes</b></td><td>Les statuts deviennent des champs mis à jour par la branche qui s'est exécutée en dernier. Des transitions invalides sont possibles, et les horodatages dérivent.</td><td>Les transitions sont appliquées en un seul endroit et chacune est horodatée, ce d'où proviennent vos métriques de temps de réponse.</td></tr>
        <tr><td><b>Trois prestataires répondant en même temps</b></td><td>Des exécutions concurrentes écrivant sur le même enregistrement. Les conditions de concurrence (race conditions) sont la défaillance classique, et elles sont très difficiles à reproduire.</td><td>Transactions de base de données. Déterministe sous forte charge.</td></tr>
        <tr><td><b>Le back-office opérateur</b></td><td>Non constructible. Vous avez toujours besoin d'une véritable application web, vous vous retrouvez donc avec deux systèmes et la logique répartie entre eux.</td><td>Le back-office et le moteur partagent un modèle de données unique et une base de code unique.</td></tr>
        <tr><td><b>Mise en correspondance des prestataires</b></td><td>Filtrer par zone, standing, fourchette de prix et capacité nécessite de toute façon une requête en base de données — écrite à l'intérieur d'un nœud, non versionnée et non testable.</td><td>Une requête testée, révisable, avec la logique de classement prête pour la phase 2.</td></tr>
        <tr><td><b>Le faire évoluer plus tard</b></td><td>Un canevas de quatre-vingts nœuds n'est ni révisable, ni comparable par diff, ni testable. Le transmettre à un autre développeur est la passation la plus difficile qui soit.</td><td>Contrôle de version, revue de code, tests, retour arrière. La section 17 de votre cahier des charges demande précisément cela.</td></tr>
        <tr><td><b>Coût d'exploitation</b></td><td>Facturé à l'exécution. Chaque message entrant, chaque réponse de prestataire et chaque tentative est une exécution, donc la facture augmente avec le volume de conversations en plus des frais de Meta.</td><td>Un serveur fixe. Le volume ne modifie que les lignes LLM et Meta.</td></tr>
        <tr><td><b>Licences</b></td><td>n8n est distribué sous une licence d'utilisation durable qui restreint la redistribution commerciale — une vraie question dès lors que cela devient un produit que vous vendez ou concédez sous licence.</td><td>Composants open-source permissifs uniquement, listés avec leurs licences à la livraison.</td></tr>
      </tbody>
    </table>
    <div class="callout">
      <p><strong>Où un outil d'automatisation a sa place.</strong> Pas dans le produit, mais autour de lui — importer le catalogue initial des prestataires depuis un tableur, envoyer un résumé quotidien dans Slack ou par e-mail, connecter le pilote à un outil que votre équipe utilise déjà. C'est un travail de liaison, c'est peu coûteux, et je le mettrai en place si vous le souhaitez. La distinction est simple : l'outil d'automatisation peut être remplacé un mardi après-midi sans que personne ne s'en aperçoive, tandis que le moteur ne le peut pas.</p>
    </div>
    <p>En clair : une version sans code (no-code) de ce pilote coûterait peut-être trente pour cent de moins à mettre sur pied et considérablement plus à modifier, et chaque modification pendant un pilote est précisément toute la raison d'en mener un.</p>
  </div>
</section>

<section id="data-fr">
  <div class="sec-head">
    <div class="sec-num">6</div>
    <div class="col"><h2>Modèle de données</h2></div>
  </div>
  <div class="sec-body">
    <p>Le modèle ci-dessous couvre les sections 6, 7, 9, 10, 12 et 14 de votre cahier des charges et est conçu pour permettre le classement automatisé et les analyses de la phase 2 sans migration destructive.</p>
    <table>
      <thead><tr><th style="width:21%">Entité</th><th style="width:47%">Champs principaux</th><th>Rôle</th></tr></thead>
      <tbody>
        <tr><td><b>Partenaire</b></td><td>Nom, type (riad, hôtel, boutique), identifiant unique, URL et QR, contact, actif</td><td>Origine des clients et attribution.</td></tr>
        <tr><td><b>Client</b></td><td>Numéro WhatsApp, prénom si renseigné, langue détectée, partenaire d'origine, date de premier contact</td><td>Fiche client et historique.</td></tr>
        <tr><td><b>Conversation</b></td><td>Client, mode (IA ou humain), opérateur assigné, indicateur « attention requise », horodatages</td><td>Gestion du dialogue et reprise humaine.</td></tr>
        <tr><td><b>Message</b></td><td>Conversation, direction, contenu, auteur (client, IA, opérateur, système), horodatage</td><td>Historique complet et traçabilité.</td></tr>
        <tr><td><b>Catégorie</b></td><td>Nom, ordre d'affichage, actif</td><td>Restauration, transport, activités, bien-être, courses.</td></tr>
        <tr><td><b>Prestataire</b></td><td>Nom, catégories, zone, standing, fourchette de prix, capacité, horaires d'ouverture, jours de fermeture, contact WhatsApp, langues, délai de réponse cible, prix ou commission négociés, conditions d'annulation, mode de paiement, notes internes, fiabilité, actif</td><td>Le catalogue vérifié — l'ensemble des 15 champs requis par la section 6.</td></tr>
        <tr><td><b>Service</b></td><td>Prestataire, libellé, description, prix indicatif, conditions</td><td>Plusieurs services par prestataire.</td></tr>
        <tr><td><b>Demande</b></td><td>Client, conversation, catégorie, critères structurés (date, heure, nombre de personnes, budget, zone, préférences), partenaire prescripteur, statut, opérateur, un horodatage par statut</td><td>Le cœur du système. Machine à états ci-dessous.</td></tr>
        <tr><td><b>Sollicitation</b></td><td>Demande, prestataire, envoyé le, réponse (disponible, indisponible, partiel), prix, délai, conditions, reçu le, source (bouton, texte, opérateur)</td><td>Une ligne par prestataire sollicité. La base des métriques de temps de réponse et de taux de refus.</td></tr>
        <tr><td><b>Offre</b></td><td>Demande, sollicitations sélectionnées, envoyée au client le, choix du client</td><td>Ce qui a été proposé et ce qui a été choisi.</td></tr>
        <tr><td><b>Transaction</b></td><td>Demande, prestataire, prix client, montant prestataire, marge plateforme, commission partenaire, mode (mise en relation ou réservation), statut, issue</td><td>Suivi financier pour information, sans paiement en ligne.</td></tr>
        <tr><td><b>Avance de fonds</b></td><td>Demande de course, coursier, montant avancé, reçu (photo ou lien), frais de livraison, montant dû par le client, remboursé oui/non, horodatages</td><td>Le cas d'usage livraison et courses, section 12.</td></tr>
        <tr><td><b>Opérateur</b></td><td>Nom, email, rôle (admin ou opérateur), actif</td><td>Comptes multiples, facilement extensible.</td></tr>
        <tr><td><b>Configuration IA</b></td><td>Fournisseur actif, modèle, prompts (accueil, extraction, présentation des offres, relance), langues, version, modifié par</td><td>Prompts modifiables et versionnés depuis le back-office.</td></tr>
        <tr><td><b>Journal d'événements</b></td><td>Type d'événement, entité, données (payload), horodatage</td><td>Alimente le tableau de bord et les exports.</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">6.2 La machine à états des demandes</h3>
    <p>Une demande ne peut être que dans un seul état à la fois, et seules les transitions valides sont autorisées. Chaque transition est horodatée, ce qui donne gratuitement les temps de réponse et de traitement.</p>
    <div class="states">à traiter <i>→</i> envoyé <i>→</i> en attente <i>→</i> disponible / indisponible <i>→</i> offre envoyée <i>→</i> réservé / annulé <i>→</i> terminé</div>
    <ul class="plain">
      <li><em>Indisponible</em> ramène à <em>en attente</em> si d'autres prestataires sont encore sollicités, ou passe à <em>annulé</em> si aucune option n'existe.</li>
      <li><em>Annulé</em> est accessible depuis n'importe quel état actif, avec un motif associé (client, prestataire, opérateur).</li>
      <li><em>Terminé</em> est atteint après confirmation de la prestation, ou après un délai paramétrable sans retour.</li>
    </ul>
    <p>Une conversation suit la même logique avec deux états : IA et humain. En mode humain, l'IA ne répond jamais. Le retour au mode IA est une action explicite de l'opérateur, et l'IA reçoit un résumé de ce qui s'est passé pendant son absence.</p>
  </div>
</section>

<section id="scope-fr">
  <div class="sec-head">
    <div class="sec-num">7</div>
    <div class="col"><h2>Ce que contient la V1, lot par lot</h2></div>
  </div>
  <div class="sec-body">
    <p>Un point de principe avant le tableau. Les pièces de ce produit ne sont pas des modules indépendants pouvant être livrés en moitiés pratiques : une demande ne sert à rien sans prestataire à interroger, les réponses des prestataires ne servent à rien sans back-office pour les lire, et rien de tout cela n'a de valeur sans attribution et mesure pour vous indiquer si cela a fonctionné. La V1 constitue donc la boucle opérationnelle complète, y compris le cas d'usage livraison et courses de la section 12. Ce qui est laissé pour la phase 2 est uniquement ce qui est véritablement détachable — l'intelligence qui ne peut être construite qu'une fois que le pilote aura produit de vraies données.</p>
    <table>
      <thead><tr><th style="width:27%">Lot</th><th>Inclus dans la V1</th></tr></thead>
      <tbody>
        <tr><td><b>A. Mise en place et infrastructure</b></td><td>Serveur Hetzner, Docker, Dokploy, domaine, certificats, environnements de staging et production séparés, sauvegardes automatisées, surveillance de base. Comptes créés à votre nom.</td></tr>
        <tr><td><b>B. Intégration WhatsApp, deux numéros</b></td><td>Onboarding 360dialog et enregistrement des deux numéros, webhooks voyageurs et prestataires, envoi sortant, deux jeux de templates (accueil, demande prestataire, suivi), routage basé sur les rôles, historique complet des messages.</td></tr>
        <tr><td><b>C. Moteur IA et orchestration</b></td><td>Couche d'abstraction sur Google, Anthropic, OpenAI et OpenRouter, commutable depuis le back-office ; extraction structurée en français et en anglais ; questions de suivi ciblées ; tool calling (rechercher des prestataires, créer une demande, lire les réponses, changer le statut, escalader) ; offres rédigées à partir des données enregistrées uniquement ; prompts éditables et versionnés.</td></tr>
        <tr><td><b>D. Backend et modèle de données</b></td><td>PostgreSQL, API, machine à états, sollicitation semi-automatique des prestataires, capture des réponses (boutons et interprétation de texte libre), journal des événements.</td></tr>
        <tr><td><b>E. Back-office opérateur</b></td><td>Connexion, comptes multiples, conversations en direct avec indicateur clair IA/humain, reprise en main et retour contrôlé à l'IA, file d'attente « attention requise », demandes par statut, fiche client, réponses des prestataires par demande, sélection d'options, gestion des prestataires et services, changements de statut, configuration de l'IA.</td></tr>
        <tr><td><b>F. Tracking QR et attribution</b></td><td>Code unique par partenaire, liens courts distincts et codes QR imprimables sur votre propre domaine, scans enregistrés côté serveur avant la redirection vers WhatsApp (section 4.5), rapprochement des conversations et des scans avec recours à l'opérateur en secours, partenaire d'origine distingué du prescripteur d'une transaction donnée, comptabilisation des scans et conversations par partenaire.</td></tr>
        <tr><td><b>G. Livraison et courses</b></td><td>Catégorie coursiers, une demande de course envoyée à plusieurs coursiers à la fois, comparaison de leurs délais et prix côte à côte, sélection par l'opérateur, et avances de fonds enregistrées avec montant, reçu, montant dû par le voyageur et statut de remboursement. Les règles financières restent manuelles pendant le pilote, conformément à votre cahier des charges.</td></tr>
        <tr><td><b>H. Tableau de bord KPI, exports, documentation et passation</b></td><td>Un écran de tableau de bord dans le back-office affichant les métriques du pilote en direct : scans et conversations par partenaire, demandes par catégorie, conversion du scan à la conversation, puis à la demande, à l'offre et à la réservation, points d'abandon, temps de réponse moyen des prestataires et taux de refus, interventions humaines, panier moyen, chiffre d'affaires et commissions par partenaire — filtrables par plage de dates. Export CSV en un clic sur chaque liste. Documentation de déploiement, liste des services tiers et de leurs coûts, liste des licences open source, procédure de sauvegarde et de restauration, session de passation en direct.</td></tr>
      </tbody>
    </table>
    <p class="small muted" style="margin-top:-8px">L'ensemble des treize tests d'acceptation de la section 19 de votre cahier des charges, y compris les trois couvrant les courses et les avances de fonds, font partie de la validation de la V1.</p>

    <h3 style="margin-top:34px">7.1 Phase 2, après le pilote</h3>
    <p>Quatre fonctionnalités délibérément laissées en dehors de la V1, car chacune constitue une décision que les données du pilote doivent guider plutôt qu'une hypothèse intégrée dès maintenant :</p>
    <ul class="plain">
      <li><b>Classement et présélection automatiques des prestataires</b> — ordonnancement des prestataires selon le prix, le temps de réponse, la fiabilité et le taux d'acceptation, avec sollicitation des meilleurs sans intervention de l'opérateur. Chaque champ nécessaire est déjà enregistré en V1 ; ce qui manque, ce sont les éléments factuels pour les pondérer, ce que le pilote produit précisément.</li>
      <li><b>Relances automatiques</b> — relance d'un prestataire sans réponse, d'un client qui n'a pas choisi, et notification des opérateurs. Le bon délai avant une relance est une question à laquelle le pilote répond.</li>
      <li><b>Langues supplémentaires</b> — arabe, espagnol, allemand, ajoutés à l'extraction et aux réponses. La V1 est lancée en français et en anglais ; le pilote vous indique dans quelle langue vous perdez réellement des clients.</li>
      <li><b>Règles de commissions automatisées</b> — calcul et suivi de ce qui est dû à chaque partenaire, au lieu d'enregistrer les montants pour un règlement manuel.</li>
    </ul>
    <p>Tout ce qui n'est pas listé dans ce document — application mobile, paiement en ligne, CRM complet, scoring avancé, identité de marque — est hors périmètre, conformément à la section 18 de votre cahier des charges.</p>
  </div>
</section>

<section id="planning-fr">
  <div class="sec-head">
    <div class="sec-num">8</div>
    <div class="col"><h2>Planning</h2></div>
  </div>
  <div class="sec-body">
    <p>Huit semaines de la signature jusqu'au lancement du pilote en direct avec de vrais voyageurs. Un point hebdomadaire de trente minutes, et un accès permanent à l'environnement de staging pour que vous puissiez voir le produit prendre forme plutôt que d'attendre une démonstration.</p>
    <table>
      <thead><tr><th style="width:14%">Semaine</th><th style="width:52%">Travaux</th><th>Jalon</th></tr></thead>
      <tbody>
        <tr><td><b>1</b></td><td>Infrastructure, base de données, modèle de données, machine à états ; onboarding 360dialog et vérification Meta lancés pour les deux numéros en parallèle (dépend de vos documents)</td><td>Environnement de staging en ligne</td></tr>
        <tr><td><b>2</b></td><td>Intégration WhatsApp côté voyageur, moteur IA multi-fournisseurs, extraction et création des demandes</td><td>Premier dialogue voyageur devenant une demande structurée, sur un numéro de test</td></tr>
        <tr><td><b>3</b></td><td>Numéro fournisseur et sollicitation (modèles, boutons, capture des réponses), offres renvoyées au voyageur</td><td>Boucle complète opérationnelle sur les numéros de test, ouverte pour que vous l'utilisiez vous-même — <em>jalon de paiement 2</em></td></tr>
        <tr><td><b>4</b></td><td>Back-office : conversations, reprise humaine, demandes, fournisseurs, configuration de l'IA</td><td>Vos opérateurs travaillent dans le back-office</td></tr>
        <tr><td><b>5</b></td><td>Attribution QR, livraison et courses avec avances de fonds</td><td>Demandes de courses traitées à travers plusieurs coursiers</td></tr>
        <tr><td><b>6</b></td><td>Tableau de bord KPI, exports, sauvegardes et test de restauration</td><td>Tests d'acceptation de la section 19 validés</td></tr>
        <tr><td><b>7</b></td><td>Tests internes en conditions réelles, ajustement des prompts, corrections, chargement du catalogue fournisseurs et partenaires, documentation et session de passation</td><td>Système accepté et documenté</td></tr>
        <tr><td><b>8</b></td><td>Mise en production, premiers vrais voyageurs, surveillance rapprochée des premières conversations</td><td>Pilote en direct — <em>jalon de paiement 3</em></td></tr>
      </tbody>
    </table>
    <div class="callout">
      <p><strong>Le seul élément hors de mon contrôle.</strong> La vérification d'entreprise Meta et l'approbation des modèles peuvent prendre quelques jours ou quelques semaines. Les deux numéros sont soumis en semaine 1 et le processus dépend des documents de votre société. Le développement se poursuit en parallèle sur des numéros de test, de sorte que cela ne retarde la mise en ligne que dans le pire des cas — mais c'est le seul point qui mérite de démarrer le jour où nous signons. Les jalons se décalent jour pour jour en cas de retard sur les documents, le catalogue ou les validations de votre côté.</p>
    </div>
  </div>
</section>

<section id="budget-fr">
  <div class="sec-head">
    <div class="sec-num">9</div>
    <div class="col"><h2>Budget</h2></div>
  </div>
  <div class="sec-body">
    <h3 style="margin-top:0">9.1 V1 — le pilote complet</h3>
    <p>Tous les montants sont en dollars américains, hors TVA. La TVA est ajoutée sur la facture au taux en vigueur.</p>
    <table>
      <thead><tr><th style="width:48%">Lot</th><th style="width:28%">Délai</th><th class="num">Montant, hors TVA</th></tr></thead>
      <tbody>
        <tr><td>A. Mise en place et infrastructure</td><td>Semaine 1</td><td class="num">350 $</td></tr>
        <tr><td>B. Intégration WhatsApp, deux numéros</td><td>Semaines 2 – 3</td><td class="num">950 $</td></tr>
        <tr><td>C. Moteur IA et orchestration</td><td>Semaines 2 – 3</td><td class="num">1 050 $</td></tr>
        <tr><td>D. Backend et modèle de données</td><td>Semaines 1 – 3</td><td class="num">1 000 $</td></tr>
        <tr><td>E. Back-office opérateur</td><td>Semaine 4</td><td class="num">950 $</td></tr>
        <tr><td>F. Tracking QR et attribution</td><td>Semaine 5</td><td class="num">250 $</td></tr>
        <tr><td>G. Livraison et courses</td><td>Semaine 5</td><td class="num">350 $</td></tr>
        <tr><td>H. Tableau de bord KPI, exports, documentation et passation</td><td>Semaines 6 – 7</td><td class="num">700 $</td></tr>
        <tr class="total"><td>Total V1, opérationnel en semaine 8</td><td>8 semaines</td><td class="num">5 600 $</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">9.2 Phase 2</h3>
    <p>Les quatre fonctionnalités de la section 7.1 sont tarifées à <strong>400 $</strong> lorsqu'elles sont engagées conjointement avec la V1, et livrées au cours du premier mois du pilote dès qu'il y a des données pour les calibrer. Commandées séparément après le pilote, elles sont à <strong>600 $</strong> : le travail est le même, mais ré-ouvrir un projet terminé nécessite de le remobiliser, de le retester et de le redéployer.</p>
    <table>
      <thead><tr><th style="width:70%">Deux façons de l'envisager</th><th class="num">Total, hors TVA</th></tr></thead>
      <tbody>
        <tr><td>V1 maintenant, décision sur la phase 2 après le pilote</td><td class="num">5 600 $ <span class="muted">puis 600 $</span></td></tr>
        <tr><td><b>V1 et phase 2 ensemble</b> — engagement total à la signature</td><td class="num"><b>6 000 $</b></td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">9.3 Maintenance et support</h3>
    <p>Le premier mois après la mise en production est inclus, sans surcoût — ce mois appartient au lancement, pas à un contrat. À partir du deuxième mois, la maintenance s'élève à 300 $ par mois hors TVA, avec un minimum de trois mois, renouvelable par blocs de trois mois. Trois mois payés d'avance reviennent à 800 $ au lieu de 900 $. Chacun de nous peut décliner un renouvellement à la fin d'un bloc, le système, la documentation et les comptes restant entre vos mains.</p>
    <table>
      <thead><tr><th style="width:36%">Ce qui est couvert</th><th>Délai de traitement</th></tr></thead>
      <tbody>
        <tr><td><b>Quelque chose est en panne</b><br><span class="muted">messages qui n'arrivent pas, l'IA qui ne répond pas, le back-office indisponible, données non enregistrées</span></td><td>Pris en charge sous 3 heures et, une fois la cause identifiée, corrigé et déployé sous 5 heures. Signalements reçus entre 08h00 et 22h00 heure du Maroc, n'importe quel jour de la semaine ; tout incident ultérieur est repris le lendemain matin. Lorsque la défaillance incombe à Meta, 360dialog ou un fournisseur de modèle, vous obtenez le diagnostic et une solution de contournement dans la même fenêtre.</td></tr>
        <tr><td><b>Surveillance et entretien</b></td><td>Continu : surveillance du serveur et des sauvegardes, mises à jour de sécurité, tests de restauration et ajustement des prompts et du comportement de l'IA à mesure que le pilote nous apprend ce que les voyageurs demandent réellement.</td></tr>
        <tr><td><b>Modifications mineures</b><br><span class="muted">formulation et prompts, un nouveau champ, une nouvelle colonne de tableau de bord ou un nouvel export, un nouveau modèle de message, une nouvelle catégorie ou un compte opérateur, un filtre ou un seuil</span></td><td>Inclus dans le forfait et planifié plutôt que précipité — généralement sous quelques jours ouvrés après la demande. Celles-ci ne tournent pas sur l'horloge des incidents, car une réponse dans l'heure à une modification de formulation n'aide aucun de nous deux.</td></tr>
        <tr><td><b>Nouvelles fonctionnalités</b><br><span class="muted">un nouvel écran, une nouvelle intégration, un nouveau service ou canal</span></td><td>Dimensionné selon ce que la fonctionnalité est réellement, avec une date et un prix convenus par écrit avant tout démarrage de travaux. Il n'y a pas de compteur d'heures ni de facture surprise.</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:34px">9.4 Modalités de paiement</h3>
    <div class="price-line"><span>À la signature</span><b>40%</b></div>
    <div class="price-line"><span>Lorsque la version de test est opérationnelle sur les numéros de test et que vous pouvez exécuter la boucle complète vous-même, fin de semaine 3</span><b>40%</b></div>
    <div class="price-line"><span>À la mise en production du pilote, contre remise des livrables</span><b>20%</b></div>
    <p>Le travail commence dès réception du premier paiement — j'ai de la disponibilité maintenant et aucune file d'attente devant vous — et le planning de huit semaines démarre à cette date.</p>
    <p class="small muted" style="margin-top:16px">Facturé par une société, en dirhams au taux de change à la date de facturation. Les prix s'entendent hors TVA et hors services tiers de la section 11, que vous souscrivez et réglez directement. Un jalon est considéré comme accepté cinq jours ouvrés après la livraison, sauf si vous formulez une remarque par écrit.</p>
  </div>
</section>

<section id="roi-fr">
  <div class="sec-head">
    <div class="sec-num">10</div>
    <div class="col"><h2>Ce que le pilote doit générer pour s'amortir</h2></div>
  </div>
  <div class="sec-body">
    <p>Le développement est un forfait unique de 5 600 $. L'exploitation ultérieure du service coûte entre 175 $ et 260 $ par mois en services tiers — serveurs, accès WhatsApp, frais de messages, utilisation des modèles — détaillés dans la section 11. La maintenance, si vous la conservez, ajoute 300 $. Le service doit donc couvrir entre 215 $ et 515 $ par mois selon que je reste ou non sous contrat de maintenance.</p>
    <p>Trois hypothèses transforment cela en un chiffre, et toutes trois pourront être ajustées dès que le catalogue sera négocié : une réservation moyenne de <strong>600 MAD</strong> (environ 63 $), une marge plateforme de <strong>15 %</strong>, soit environ <strong>9,50 $ par réservation</strong>, et un entonnoir où 100 scans génèrent environ 70 conversations, 45 demandes et 18 réservations.</p>

    <div class="bignum">170 $ pour 100 scans</div>
    <p>Environ 1,70 $ de marge pour chaque voyageur qui scanne un code QR, qu'il réserve ou non. C'est l'unité qui compte, car les scans sont la seule chose que vos partenaires maîtrisent.</p>

    <div class="bigpair">
      <div>
        <div class="n">54 réservations par mois</div>
        <div class="c">Moins de deux par jour. C'est le point où le service couvre tout ce qu'il coûte à l'exploitation, forfait de maintenance inclus.</div>
      </div>
      <div>
        <div class="n">10 scans par jour</div>
        <div class="c">Le même seuil vu du comptoir du partenaire : 300 scans par mois. Sans maintenance, 4 par jour suffisent.</div>
      </div>
    </div>
    <p>Sur dix riads partenaires, 10 scans par jour représentent un client par riad un jour sur deux.</p>
    <p>Pour donner un ordre de grandeur : le Maroc a enregistré 19,8 millions d'arrivées en 2025 selon le Ministère du Tourisme, et Marrakech concentre à elle seule près de 40 % des séjours touristiques du pays. Le pilote n'a pas besoin d'une part de ce marché. Il a besoin de dix personnes par jour qui scannent un chevalet sur un comptoir de réception.</p>

    <table style="margin-top:30px">
      <thead><tr><th style="width:22%">Scénario</th><th class="num">Scans / mois</th><th class="num">Réservations</th><th class="num">Marge</th><th class="num">Coût d'exploitation</th><th class="num">Net</th><th class="num">Amortissement dev.</th></tr></thead>
      <tbody>
        <tr><td><b>Calme</b><br><span class="muted">peu de partenaires mettent la carte en avant</span></td><td class="num">220 · 7/jour</td><td class="num">40</td><td class="num">380 $</td><td class="num">515 $</td><td class="num">−135 $</td><td class="num">pas encore</td></tr>
        <tr><td><b>Cible pilote</b><br><span class="muted">le scénario de référence sur lequel planifier</span></td><td class="num">660 · 22/jour</td><td class="num">120</td><td class="num">1 140 $</td><td class="num">515 $</td><td class="num">625 $</td><td class="num">~9 mois</td></tr>
        <tr><td><b>Forte dynamique</b><br><span class="muted">catalogue attractif, partenaires engagés</span></td><td class="num">1 300 · 43/jour</td><td class="num">237</td><td class="num">2 250 $</td><td class="num">560 $</td><td class="num">1 690 $</td><td class="num">~3 mois</td></tr>
        <tr><td><b>À l'échelle</b><br><span class="muted">25 partenaires, la carte remise en routine</span></td><td class="num">3 000 · 100/jour</td><td class="num">545</td><td class="num">5 180 $</td><td class="num">700 $</td><td class="num">4 480 $</td><td class="num">~6 semaines</td></tr>
      </tbody>
    </table>

    <p>La dernière ligne n'est pas une illusion, et c'est celle qu'il faut viser. Cent scans par jour répartis sur vingt-cinq riads partenaires, c'est quatre clients par partenaire et par jour — dans une ville où les hôtels et riads accueillent des milliers de voyageurs chaque nuit. À ce volume, le développement est amorti dès les six premières semaines du pilote et le service dégage chaque mois plus qu'il n'a coûté à créer, sur une base de coûts quasiment fixe : les serveurs sont les mêmes, les numéros sont les mêmes, et seuls les frais de messages et l'usage des modèles augmentent avec le trafic. Cet écart entre des coûts fixes et des revenus croissants est tout l'intérêt de concevoir proprement la machine dès le départ.</p>

    <p>Deux leviers influent sur ces chiffres bien plus que n'importe quel détail technique. Le premier est la marge : à 20 % au lieu de 15 %, le scénario cible amortit le développement en environ six mois plutôt que neuf. Le second est le mix — un transfert privé à 1 200 MAD ou une excursion à la journée coûte la même chose à traiter qu'un dîner à 300 MAD tout en générant quatre fois plus de marge, ce qui plaide pour intégrer tôt des catégories à forte valeur plutôt que d'éprouver le concept sur les seules tables de restaurant.</p>

    <div class="callout">
      <p><strong>La deuxième ville est le point où l'économie change d'échelle.</strong> Tout ce qui précède finance la construction initiale de la machine. Ouvrir Agadir, Casablanca ou Essaouira par la suite se résume à une nouvelle liste de partenaires et un nouveau catalogue de prestataires intégrés via le back-office — aucun nouveau développement, aucun second serveur, aucun second numéro WhatsApp. Le coût marginal d'une demande dans une deuxième ville reste les mêmes cinq à douze centimes d'utilisation de modèle plus les frais de message de Meta. C'est la véritable raison de consacrer huit semaines à bâtir ce système rigoureusement plutôt que huit semaines à bricoler un assemblage qui ne fonctionnera qu'à Marrakech.</p>
    </div>

    <div class="callout">
      <p><strong>Et si le scénario calme se produit.</strong> Ce n'est pas un échec, c'est une réponse — obtenue pour environ l'équivalent de deux mois de salaire junior, et le tableau de bord vous indiquera précisément où la boucle s'est brisée : partenaires qui ne distribuent pas la carte, voyageurs qui ne convertissent pas, ou prestataires qui ne répondent pas. Chacun de ces problèmes appelle un correctif différent, et les trois coûtent bien moins cher que de redévelopper le produit deux fois.</p>
    </div>
  </div>
</section>

<section id="running-fr">
  <div class="sec-head">
    <div class="sec-num">11</div>
    <div class="col"><h2>Coûts d'exploitation</h2></div>
  </div>
  <div class="sec-body">
    <p>Les chiffres ci-dessous correspondent au volume attendu du pilote — environ 300 demandes par mois, une moyenne de trois prestataires sollicités par demande, soit environ 900 messages templates sortants. Chaque compte est ouvert à votre nom et vous est facturé directement. La maintenance ne figure pas dans ce tableau : c'est un choix séparé, tarifé à la section 9.3.</p>
    <table>
      <thead><tr><th style="width:30%">Service</th><th style="width:42%">Utilisé pour</th><th class="num">Estimation mensuelle</th></tr></thead>
      <tbody>
        <tr><td><b>Hetzner</b></td><td>Serveur et stockage de sauvegarde : backend, base de données, back-office et tableau de bord</td><td class="num">15 – 35 $</td></tr>
        <tr><td><b>360dialog</b></td><td>Accès à l'API WhatsApp Business, deux numéros, forfait fixe sans majoration sur les frais de Meta</td><td class="num">118 $</td></tr>
        <tr><td><b>Frais de messagerie Meta</b></td><td>Messages templates vers les prestataires. Les réponses dans la fenêtre de 24 heures ouverte par un voyageur sont <strong>gratuites</strong>, et chaque numéro bénéficie d'une franchise mensuelle de 1 000 messages de service <strong>gratuits</strong></td><td class="num">25 – 60 $</td></tr>
        <tr><td><b>APIs LLM</b></td><td>Extraction, dialogue, interprétation des réponses des prestataires — évolue avec les conversations, voir ci-dessous</td><td class="num">15 – 35 $</td></tr>
        <tr><td><b>Surveillance et e-mails transactionnels</b></td><td>Alertes, réinitialisations de mot de passe</td><td class="num">0 – 10 $</td></tr>
        <tr class="total"><td>Total estimé au volume du pilote</td><td></td><td class="num">175 – 260 $</td></tr>
      </tbody>
    </table>
    <p class="small muted" style="margin-top:-8px">Ponctuel et non inclus ci-dessus : le nom de domaine, acheté auprès du registrar de votre choix à son tarif et renouvelé annuellement.</p>

    <h3 style="margin-top:30px">11.1 Comment le coût de l'IA évolue avec l'utilisation</h3>
    <p>Le seul poste qui augmente réellement avec le succès est l'usage des modèles. Une demande complète — message d'accueil, extraction, une ou deux questions de précision, interprétation de trois réponses de prestataires, et présentation de l'offre au voyageur — coûte environ 0,05 $ à 0,12 $ avec un modèle intermédiaire, et environ un tiers de ce montant avec les modèles économiques accessibles via OpenRouter.</p>
    <table>
      <thead><tr><th style="width:38%">Demandes par mois</th><th class="num" style="width:30%">Modèles intermédiaires</th><th class="num">Modèles économiques</th></tr></thead>
      <tbody>
        <tr><td>100 — démarrage progressif</td><td class="num">5 – 12 $</td><td class="num">2 – 4 $</td></tr>
        <tr><td>300 — cible pilote</td><td class="num">15 – 35 $</td><td class="num">5 – 12 $</td></tr>
        <tr><td>600 — mois d'activité soutenue</td><td class="num">30 – 70 $</td><td class="num">10 – 25 $</td></tr>
        <tr><td>1 000 — au-delà du pilote</td><td class="num">50 – 115 $</td><td class="num">18 – 40 $</td></tr>
      </tbody>
    </table>
    <p>C'est la raison d'être pratique du moteur commutable : faire tourner le pilote sur le meilleur modèle disponible, puis basculer les étapes de routine vers un modèle plus économique dès que vous savez quelles conversations exigent réellement cette qualité, en observant directement l'impact sur le tableau de bord. À chaque niveau de volume de ce tableau, la facture des modèles reste inférieure à ce que rapportent deux réservations par mois.</p>

    <div class="callout">
      <p><strong>Une évolution tarifaire de Meta entre en vigueur le 1er octobre 2026, avant le lancement de votre pilote.</strong> Meta commence à facturer les messages de service et les templates d'utilité envoyés dans la fenêtre client, avec une franchise de 1 000 messages de service gratuits par numéro et par mois, et le Maroc bascule sur sa propre grille tarifaire avec des tarifs d'utilité plus élevés. Au volume du pilote, la franchise absorbe l'essentiel des coûts, et l'estimation ci-dessus intègre déjà ce nouveau modèle. Deux choix de conception maintiennent ce poste au plus bas : les échanges avec les voyageurs restent autant que possible dans la fenêtre gratuite, et chaque sollicitation prestataire consiste en un unique template structuré plutôt qu'un va-et-vient de messages. Les chiffres exacts seront confirmés selon les tarifs publiés par Meta au lancement.</p>
    </div>
  </div>
</section>

<section id="risks-fr">
  <div class="sec-head">
    <div class="sec-num">12</div>
    <div class="col"><h2>Les risques et leurs parades</h2></div>
  </div>
  <div class="sec-body">
    <p>Chacun d'eux est réel. Aucun d'entre eux n'est une raison de ne pas mener le pilote ; ils sont tous bien moins coûteux à nommer maintenant qu'à découvrir en semaine six.</p>
    <table>
      <thead><tr><th style="width:30%">Risque</th><th>Ce qui l'absorbe</th></tr></thead>
      <tbody>
        <tr><td><b>La vérification Meta ou l'approbation des modèles s'éternise</b></td><td>Les deux numéros sont soumis en semaine 1, le développement se poursuit sur des numéros de test, et les jalons se décalent jour pour jour plutôt que de comprimer le travail. C'est la cause la plus probable d'un lancement tardif et celle par laquelle nous commençons.</td></tr>
        <tr><td><b>Les prestataires ne répondent pas sur WhatsApp</b></td><td>Les réponses se font d'un simple clic sur un bouton, pas via un message saisi au clavier. L'opérateur peut appeler directement n'importe qui et consigner la réponse manuellement. Et dès la première semaine, vous disposez du temps de réponse, du taux de refus et du taux de silence par prestataire — ainsi, un prestataire qui ne répond jamais devient une donnée sur laquelle agir, pas un mystère.</td></tr>
        <tr><td><b>Une réponse en darija est mal interprétée</b></td><td>Tout ce qui est ambigu est signalé à l'opérateur plutôt que deviné au hasard. Les prompts sont ajustés chaque semaine tout au long du premier mois, ce qui est inclus.</td></tr>
        <tr><td><b>Un fournisseur de modèle tombe en panne, modifie ses tarifs ou se dégrade</b></td><td>Quatre fournisseurs derrière un seul commutateur, modifiables depuis le back-office sans redéploiement ni modification de code.</td></tr>
        <tr><td><b>Les voyageurs ne scannent pas, ou scannent et ne convertissent pas</b></td><td>Les scans sont comptés avant que la conversation n'existe, de sorte que le tableau de bord sépare un problème de partenaire d'un problème de produit dès la première quinzaine. Deux problèmes distincts, deux correctifs différents et bien plus économiques.</td></tr>
        <tr><td><b>Le cadre juridique ou le modèle de paiement évolue en cours de développement</b></td><td>La V1 ne manipule jamais d'argent : le paiement s'effectue auprès du prestataire et le système consigne les montants. Si vos conseils juridiques aboutissent à un autre schéma, il s'agit d'un nouvel élément de périmètre sur une base stable, pas d'une réécriture.</td></tr>
        <tr><td><b>Je suis une seule personne</b></td><td>La question est légitime, alors : votre propre dépôt Git dès la semaine 1, une stack standard que tout développeur Next.js peut lire, aucun compte ni service détenu en mon nom, une documentation et une session de passation en direct en semaine 7 — avant le paiement final. À tout moment à partir de la semaine 1, vous pourriez confier ceci à un autre développeur sans qu'il ne reparte de zéro. C'est la même garantie que demande votre cahier des charges en section 17, et je préfère que vous l'ayez plutôt que de me faire confiance aveuglément.</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section id="privacy-fr">
  <div class="sec-head">
    <div class="sec-num">13</div>
    <div class="col"><h2>Données personnelles</h2></div>
  </div>
  <div class="sec-body">
    <p>Le système conserve les numéros de téléphone et les conversations des voyageurs, et les coordonnées WhatsApp des prestataires. Les choix techniques qui protègent la conformité :</p>
    <ul class="plain">
      <li><b>Ce qui est stocké :</b> numéro WhatsApp, prénom si le voyageur l'indique, contenu des messages, critères de demande, partenaires et transactions. Aucune donnée de paiement, aucune pièce d'identité en dehors de la photo du reçu de course dans le cas des avances de fonds.</li>
      <li><b>Où :</b> un serveur en Allemagne, au sein de l'UE, avec chiffrement au repos et sauvegardes chiffrées vers un stockage objet au sein de l'UE.</li>
      <li><b>Combien de temps :</b> une période de rétention paramétrable, réglée par défaut sur 90 jours pour les conversations complétées, après quoi le texte est supprimé et seuls les enregistrements de métriques anonymisés sont conservés.</li>
      <li><b>Qui d'autre y touche :</b> Meta et 360dialog acheminent les messages WhatsApp ; les fournisseurs de modèles traitent les requêtes textuelles. Les trois sont engagés par contrat d'entreprise standard à ne pas utiliser les données API pour entraîner leurs modèles.</li>
      <li><b>Loi marocaine :</b> le traitement des données personnelles nécessite une déclaration auprès de la CNDP. La documentation du lot H comprend la cartographie exacte des données, les sous-traitants et les durées de rétention pour étayer votre dossier.</li>
      <li><b>Prestataires :</b> leur consentement à recevoir des notifications commerciales WhatsApp est consigné lors de leur intégration dans le catalogue.</li>
    </ul>
    <p>Ceci décrit la manière dont le système est construit, et non un avis juridique. Les comptes étant à votre nom, vous êtes le responsable de traitement.</p>
  </div>
</section>

<section id="deliverables-fr">
  <div class="sec-head">
    <div class="sec-num">14</div>
    <div class="col"><h2>Livrables</h2></div>
  </div>
  <div class="sec-body">
    <ul class="plain">
      <li>Code source complet, transféré dans un dépôt Git qui vous appartient.</li>
      <li>Environnements de staging et de production fonctionnant sur votre propre infrastructure Hetzner, déployés via Dokploy.</li>
      <li>Documentation d'installation, de déploiement, de configuration et d'exploitation.</li>
      <li>Documentation du modèle de données, de la machine à états et de l'architecture du système.</li>
      <li>La liste des services tiers avec leur coût mensuel, la configuration des comptes et les identifiants d'accès.</li>
      <li>Une procédure de sauvegarde et de restauration qui a été testée et démontrée en direct avant la livraison.</li>
      <li>Export CSV sur chaque liste du back-office — prestataires, clients, demandes, offres, transactions, partenaires.</li>
      <li>Une session de passation en direct avec vous et le développeur ou l'opérateur de votre choix, enregistrée pour vos archives.</li>
    </ul>
    <div class="callout">
      <p><strong>Quand la propriété est transférée.</strong> Les livrables ci-dessus — le code, les environnements, la documentation — sont les vôtres à chaque jalon au fur et à mesure de leur achèvement. Vous ne dépendez pas de la fin des huit semaines pour disposer d'un système qui vous appartient.</p>
    </div>
  </div>
</section>

<section id="assumptions-fr">
  <div class="sec-head">
    <div class="sec-num">15</div>
    <div class="col"><h2>Hypothèses et conditions</h2></div>
  </div>
  <div class="sec-body">
    <p>Ce sont les points sur lesquels reposent le devis et le planning. Travailler avec des hypothèses claires évite les surprises pour chacun de nous :</p>
    <ul class="plain">
      <li>Vous fournissez un compte Meta Business, ou le créez avec mon assistance en semaine 1, et vous fournissez les documents légaux d'entreprise que Meta exige pour la vérification.</li>
      <li>Vous fournissez le catalogue initial des prestataires et des partenaires au cours de la semaine 2, au format structuré (un tableur type est fourni).</li>
      <li>Les règles d'exploitation des courses — plafonds d'avance, règles de remboursement, validation de l'opérateur — sont définies avant la semaine 5.</li>
      <li>Les comptes Hetzner, 360dialog, Meta, domaine et LLM sont ouverts à votre nom et vous en réglez directement les frais d'utilisation.</li>
      <li>Le pilote fonctionne avec environ deux opérateurs, et non vingt. Le système supporte des comptes multiples, mais le dimensionnement et la formation sont prévus pour une équipe restreinte.</li>
      <li>Les jalons se décalent jour pour jour en cas de retard sur la fourniture des documents, du catalogue ou des validations de votre côté.</li>
      <li>Tout ce qui sort du périmètre décrit ici est convenu par écrit avant le début des travaux, avec son propre délai et son propre tarif.</li>
      <li>Une fois le service lancé publiquement, je peux mentionner le projet et votre nom en tant que client, sous réserve que la confidentialité soit maintenue jusque-là.</li>
      <li>Cette proposition est valable pendant 30 jours.</li>
    </ul>
    <div class="callout">
      <p><strong>Une recommandation pratique pour les comptes.</strong> Créez un compte Google unique pour le projet — par exemple operations@ votredomaine — et utilisez-le pour ouvrir chaque compte tiers : Meta Business, 360dialog, Hetzner, le registrar de domaine, les fournisseurs de modèles. Partagez-en l'accès avec moi pour la durée du développement. Tout est ainsi enregistré à votre nom dès le premier jour, les e-mails de vérification et codes de récupération arrivent dans une seule boîte, je peux configurer et déboguer sans vous demander de transférer un code à onze heures du soir, et transmettre le projet à un autre développeur plus tard ne nécessite qu'un seul changement de mot de passe plutôt qu'une douzaine de migrations de comptes. L'authentification à deux facteurs reste activée sur ce compte tout au long du processus, et je vous restitue l'accès exclusif à la fin de la mission.</p>
    </div>
    <p>Je reste disponible pour toute question avant notre échange du jeudi 17 septembre.</p>
  </div>
</section>

<section id="seo-fr">
  <div class="sec-head">
    <div class="sec-num">16</div>
    <div class="col"><h2>Une option pour plus tard : être trouvé au lieu d'être distribué</h2></div>
  </div>
  <div class="sec-body">
    <p>L'acquisition du pilote repose sur les codes QR des partenaires. C'est le bon premier canal — il ne coûte rien, met le service dans la main du voyageur au moment exact où il a un besoin, et il est mesurable. Il est également plafonné par le nombre de partenaires qui distribuent le chevalet.</p>
    <p>Le deuxième canal est la recherche organique (SEO), et ce produit est exceptionnellement bien placé pour cela. Les voyageurs préparent Marrakech avant d'atterrir : le rooftop, le transfert aéroport, l'excursion dans l'Atlas, que faire en trois jours. Pendant ce temps, votre catalogue de prestataires constitue déjà un contenu structuré — catégories, zones, gammes de prix, services — ce que les moteurs de recherche récompensent précisément lorsqu'il est publié proprement. Chacune de ces pages débouche sur le même lien WhatsApp avec son propre code de suivi, de sorte que les visiteurs organiques arrivent dans le même entonnoir, le même back-office et le même tableau de bord qu'un client ayant scanné une carte dans un riad. Rien de nouveau à construire dans le produit : le mécanisme d'attribution de la section 4.5 le gère déjà.</p>
    <p>Je n'ai délibérément pas fixé de prix pour cela. Définir ce périmètre honnêtement nécessite de disposer du nom de domaine, d'étudier sur quoi les concurrents se positionnent déjà, et surtout de s'appuyer sur les données réelles du pilote indiquant quelles catégories convertissent réellement — ce qui n'existe pas encore. Proposer un devis aujourd'hui serait un chiffre sorti du chapeau, et vous auriez raison de vous en méfier. Cela mérite d'être abordé une fois que le pilote aura tourné un mois.</p>
    <div class="rec">
      <p>Pour ce que cela vaut, cette proposition existe grâce à ce mécanisme. Vous ne m'avez pas trouvé via une agence, une publicité ou une mise en relation — vous avez trouvé mon portfolio dans un résultat de recherche, lu l'étude de cas sur le projet WhatsApp et IA, et m'avez écrit. C'est exactement le même principe, appliqué à mon propre site.</p>
    </div>
    <div class="signoff">
      <b>Faouzi El Bakri</b>
      AI Engineer &amp; Full-Stack Developer<br/>
      <a href="https://faouzielbakri.com">faouzielbakri.com</a> · +212 6 32 32 38 56
    </div>
  </div>
</section>
"""

with open("scripts/fr_sheet_inner.html", "w", encoding="utf-8") as f:
    f.write(fr_sheet_inner.strip())

print("Saved fr_sheet_inner.html successfully. Length:", len(fr_sheet_inner))
