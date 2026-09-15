import json

with open("scratch_units.json") as f:
    data = json.load(f)

T = {}

# RISKS (18 items)
T["risks_0"] = "Les risques, et ce qui absorbe chacun"
T["risks_1"] = "Chacun d'eux est réel. Aucun d'entre eux n'est une raison de ne pas lancer le pilote ; tous sont moins chers à nommer maintenant qu'à découvrir en semaine six."
T["risks_2"] = "Risque"
T["risks_3"] = "Ce qui l'absorbe"
T["risks_4"] = "<b>La vérification Meta ou l'approbation des modèles traîne en longueur</b>"
T["risks_5"] = "Les deux numéros sont soumis en semaine 1, le développement se poursuit sur des numéros de test, et les jalons se déplacent jour pour jour plutôt que de comprimer le travail. C'est la cause la plus probable d'un lancement tardif et celle que nous démarrons en premier."
T["risks_6"] = "<b>Les fournisseurs ne répondent pas sur WhatsApp</b>"
T["risks_7"] = "Les réponses se font d'un simple clic sur un bouton, pas par un message rédigé. L'opérateur peut appeler qui que ce soit directement et enregistrer la réponse à la main. Et dès la première semaine, vous disposez du temps de réponse, du taux de refus et du taux de silence par fournisseur — un fournisseur qui ne répond jamais est donc une donnée sur laquelle vous agissez, pas un mystère."
T["risks_8"] = "<b>Une réponse en darija est mal interprétée</b>"
T["risks_9"] = "Tout ce qui est ambigu est signalé à l'opérateur plutôt que deviné. Les prompts sont ajustés chaque semaine tout au long du premier mois, ce qui est inclus."
T["risks_10"] = "<b>Un fournisseur de modèle tombe en panne, change ses prix ou se dégrade</b>"
T["risks_11"] = "Quatre fournisseurs derrière un seul commutateur, modifiables depuis le back-office sans redéploiement. Si Anthropic a un problème, vous passez sur OpenAI ou Gemini en dix secondes."
T["risks_12"] = "<b>Les voyageurs ne scannent pas, ou scannent et ne convertissent pas</b>"
T["risks_13"] = "Les scans sont comptés avant que la conversation n'existe, de sorte que le tableau de bord montre où la perte se produit : les partenaires ne distribuent pas, les voyageurs ne scannent pas, ils ouvrent WhatsApp mais n'écrivent pas, ou ils écrivent mais ne réservent pas. Vous voyez le goulot d'étranglement dès la semaine 8."
T["risks_14"] = "<b>Le modèle juridique ou de paiement change en cours de développement</b>"
T["risks_15"] = "La V1 ne manipule jamais d'argent : le paiement s'effectue auprès du fournisseur et le système enregistre les montants pour information. Si le conseil juridique valide une marge ou un modèle de paiement centralisé plus tard, cela devient un lot de phase 2 sans rien défaire de ce qui est construit ici."
T["risks_16"] = "<b>Je suis une seule personne</b>"
T["risks_17"] = "La question légitime, donc : votre propre dépôt de code dès la semaine 1, une stack standard (Node, PostgreSQL, Docker) que tout développeur peut lire, aucun compte personnel ni identifiant à mon nom, et la session de passation en semaine 7 avant l'échéance du paiement final. Je préfère que vous l'ayez plutôt que vous deviez me faire confiance."

# PRIVACY (9 items)
T["privacy_0"] = "Données personnelles"
T["privacy_1"] = "Le système détient les numéros de téléphone et les conversations des voyageurs, et une grande partie de vos voyageurs seront européens. C'est une section courte car le pilote est conçu pour en détenir le moins possible, mais ce n'est pas une section à ignorer."
T["privacy_2"] = "<b>Ce qui est stocké :</b> numéro WhatsApp, prénom si le voyageur en donne un, historique des conversations, demandes, réponses des fournisseurs et montants des transactions. Aucun numéro de carte, aucun document d'identité, aucune donnée de paiement — le pilote ne traite jamais de paiement."
T["privacy_3"] = "<b>Où :</b> un serveur en Allemagne, au sein de l'UE, avec transport chiffré, sauvegardes quotidiennes et accès limité aux comptes opérateurs nommés, chaque action étant attribuable à une personne."
T["privacy_4"] = "<b>Combien de temps :</b> une période de rétention configurable, définie à la livraison. Douze mois pour les conversations est une valeur par défaut raisonnable pour le pilote, avec une procédure documentée pour supprimer les données d'un voyageur individuel sur demande — un voyageur européen peut le demander, et vous devrez être en mesure de le faire."
T["privacy_5"] = "<b>Qui d'autre y touche :</b> Meta et 360dialog acheminent les messages, et le fournisseur de modèle actif reçoit le texte de la conversation pour générer une réponse. En vertu des conditions commerciales standard des fournisseurs proposés ici, ce contenu n'est pas utilisé pour entraîner leurs modèles. Tous sont répertoriés comme sous-traitants dans la documentation de livraison."
T["privacy_6"] = "<b>Loi marocaine :</b> le traitement des données personnelles nécessite une déclaration à la CNDP en vertu de la loi 09-08. Cette démarche vous incombe en tant que responsable du traitement ; je fournis la description technique dont elle a besoin — catégories de données, finalité, rétention, lieu d'hébergement et liste des sous-traitants — dans le cadre de la documentation."
T["privacy_7"] = "<b>Fournisseurs :</b> leur consentement à recevoir des messages professionnels WhatsApp est recueilli lorsqu'ils rejoignent le catalogue, et consigné dans leur fiche."
T["privacy_8"] = "Ceci décrit la manière dont le système est construit, et non un conseil juridique. Votre conseil juridique devra confirmer la déclaration et la durée de rétention avant que le pilote ne s'ouvre à de vrais voyageurs."

# DELIVERABLES (10 items)
T["deliverables_0"] = "Livrables"
T["deliverables_1"] = "Code source complet, transféré dans un dépôt Git qui vous appartient, avec les images Docker et les fichiers de déploiement."
T["deliverables_2"] = "Environnements de staging et de production fonctionnant sur votre propre infrastructure et vos propres comptes."
T["deliverables_3"] = "Documentation d'installation, de déploiement, de configuration et d'exploitation — variables d'environnement, comptes, procédures et conduite à tenir en cas de panne."
T["deliverables_4"] = "Documentation du modèle de données, de la machine à états et des prompts."
T["deliverables_5"] = "La liste des services tiers avec leur coût mensuel, et la liste des composants open source avec leurs licences — chaque framework et bibliothèque sur lequel le système est construit, nommé avec sa licence, afin que votre conseil juridique puisse confirmer que rien dans la stack ne vous empêche de vendre ou de concéder sous licence le produit plus tard."
T["deliverables_6"] = "Une procédure de sauvegarde et de restauration qui a été testée, pas seulement rédigée."
T["deliverables_7"] = "Export CSV sur chaque liste du back-office — fournisseurs, clients, demandes, offres, réservations, transactions, partenaires — afin que votre équipe obtienne ses données à partir d'un bouton plutôt qu'à partir de la base de données."
T["deliverables_8"] = "Une session de passation en direct avec vous et le développeur qui reprendra le système, passant en revue l'architecture, le déploiement et les procédures opérationnelles, avec du temps pour leurs questions. Organisée en semaine 7, et répétée si vous intégrez quelqu'un de nouveau sur le projet pendant la période de maintenance."
T["deliverables_9"] = "<strong>Quand la propriété est transférée.</strong> Les livrables ci-dessus — propriété du dépôt, documentation et session de passation — sont transférés à réception du paiement final lors de la mise en production. Jusque-là, le système fonctionne sur votre infrastructure et vous pouvez l'utiliser et le tester librement ; ce qui change de mains à la fin, c'est la propriété du code et tout ce qui est nécessaire pour l'emmener ailleurs. Le code spécifique au projet devient entièrement vôtre ; les composants génériques que j'apporte avec moi, y compris la couche d'IA multi-fournisseurs, restent les miens et sont assortis d'une licence perpétuelle d'utilisation, de modification et d'extension au sein de ce projet."

# ASSUMPTIONS (13 items)
T["assumptions_0"] = "Hypothèses et conditions"
T["assumptions_1"] = "Ce sont les points sur lesquels reposent le devis et le planning. À lire une fois maintenant plutôt qu'à découvrir plus tard."
T["assumptions_2"] = "Vous fournissez un compte Meta Business, ou le créez avec mon aide, ainsi que deux numéros de téléphone dédiés, et démarrez la vérification d'entreprise en semaine 1."
T["assumptions_3"] = "Vous fournissez le catalogue initial des fournisseurs et des partenaires sous la forme d'un tableur, et obtenez le consentement des fournisseurs à recevoir des messages WhatsApp du système."
T["assumptions_4"] = "Les règles d'exploitation des courses — plafonds d'avances, qui autorise, que se passe-t-il en cas de refus ou de justificatif manquant — sont définies par vous avant que ce service ne soit activé avec de vrais voyageurs."
T["assumptions_5"] = "Les comptes Hetzner, 360dialog, Meta, domaine et LLM sont ouverts à votre nom et payés directement par vous."
T["assumptions_6"] = "Le pilote fonctionne avec environ deux opérateurs, pas 24h/24. Le système prend en charge plusieurs comptes d'opérateurs dès la V1."
T["assumptions_7"] = "Les jalons se décalent jour pour jour en cas de retard de votre côté — documents, catalogue, approbations ou retours."
T["assumptions_8"] = "Tout ce qui sort du périmètre décrit ici est convenu par écrit et chiffré avant que le travail ne commence."
T["assumptions_9"] = "Une fois le service lancé publiquement, je peux mentionner le projet et votre nom en tant que client, sous réserve que la confidentialité soit maintenue jusque-là."
T["assumptions_10"] = "Cette proposition est valable pendant 30 jours."
T["assumptions_11"] = "<strong>Une recommandation pratique pour les comptes.</strong> Créez un compte Google unique pour le projet — quelque chose comme operations@ votre domaine — et utilisez-le pour ouvrir chaque compte tiers : Meta Business, 360dialog, Hetzner, le registrar de domaine, les fournisseurs de modèles. Partagez-en l'accès avec moi pour la durée de la réalisation. Tout est alors enregistré à votre nom dès le premier jour, les e-mails de vérification et les codes de récupération atterrissent tous dans une seule boîte de réception, je peux configurer et déboguer sans vous demander de transférer un code à onze heures du soir, et transmettre le projet à un autre développeur plus tard se résume à un simple changement de mot de passe plutôt qu'à une douzaine de migrations de comptes. L'authentification à deux facteurs reste activée sur ce compte tout au long du projet, et je vous restitue l'accès à la fin de la mission."
T["assumptions_12"] = "Je reste disponible pour toute question avant notre échange du jeudi 17 septembre."

# SEO (5 items)
T["seo_0"] = "Une option pour plus tard : être trouvé au lieu d'être distribué"
T["seo_1"] = "L'acquisition du pilote repose sur les codes QR des partenaires. C'est le bon premier canal — il ne coûte rien, il met le service entre les mains du voyageur au moment où il a besoin de quelque chose, et il est mesurable. Il est également plafonné par le nombre de partenaires qui distribuent le nombre de cartes."
T["seo_2"] = "Le deuxième canal est la recherche, et ce produit est exceptionnellement bien placé pour cela. Les voyageurs planifient Marrakech avant d'atterrir : le rooftop, le transfert aéroport, l'excursion d'une journée dans l'Atlas, que faire en trois jours. Pendant ce temps, votre catalogue de fournisseurs est déjà un contenu structuré — catégories, zones, fourchettes de prix, services — ce qui est exactement ce que les moteurs de recherche récompensent lorsqu'il est publié correctement. Chacune de ces pages se termine sur le même lien WhatsApp avec son propre code de suivi, de sorte que les visiteurs organiques arrivent dans le même entonnoir, le même back-office et le même tableau de bord qu'un voyageur ayant scanné une carte dans un riad. Rien de nouveau à construire dans le produit ; le mécanisme d'attribution de la section 4.5 le gère déjà."
T["seo_3"] = "Je n'ai délibérément pas fixé de prix pour cela. Le dimensionner honnêtement nécessite le nom de domaine, un examen de ce sur quoi les concurrents se positionnent déjà, et surtout les données propres au pilote sur les catégories qui convertissent réellement — rien de tout cela n'existe encore. Le chiffrer maintenant serait un chiffre sorti de nulle part, et vous auriez raison de ne pas vous y fier. Cela mérite d'être discuté une fois que le pilote aura tourné pendant un mois."
T["seo_4"] = "Pour ce que cela vaut, cette proposition existe grâce à ce travail. Vous ne m'avez pas trouvé par le biais d'une agence, d'une publicité ou d'une recommandation — vous avez trouvé mon portfolio dans un résultat de recherche, lu l'étude de cas sur le projet WhatsApp et IA, et m'avez écrit. C'est tout le mécanisme, appliqué à mon propre site."

print(f"Part 5 done: {len(T)} items.")
with open("scripts/i18n_data/part5.json", "w", encoding="utf-8") as f:
    json.dump(T, f, ensure_ascii=False, indent=2)
