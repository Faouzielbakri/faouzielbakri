import re

with open("scripts/generate_french_sheet.py", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Fix whoami
code = code.replace(
    '<li><b>FASL</b> (<a href="https://fasl.ma">fasl.ma</a>), dont je suis',
    '<li><b>FASL</b> (fasl.ma), dont je suis'
)
code = code.replace(
    '<li><b>Magical Hekaya</b> (<a href="https://magicalhekaya.com">magicalhekaya.com</a>), mon propre',
    '<li><b>Magical Hekaya</b> (magicalhekaya.com), mon propre'
)
code = code.replace(
    '<p><strong>Et ce que je ferais différemment.</strong> Sur RESO Khdma, l\'interprétation du texte libre était ajustée au comportement d\'un seul modèle, ce qui s\'est avéré coûteux à réajuster lorsque le modèle a changé. C\'est pourquoi cette proposition place quatre fournisseurs derrière un commutateur unique, et pourquoi une réponse de prestataire ambiguë est signalée à votre opérateur plutôt que résolue par une supposition confiante. Les erreurs sont déjà payées.</p>',
    '<div class="rec"><p><b>Et ce que je ferais différemment.</b> Sur RESO Khdma, l\'interprétation du texte libre était ajustée au comportement d\'un seul modèle, ce qui s\'est avéré coûteux à réajuster lorsque le modèle a changé. C\'est pourquoi cette proposition place quatre fournisseurs derrière un commutateur unique, et pourquoi une réponse de prestataire ambiguë est signalée à votre opérateur plutôt que résolue par une supposition confiante. Les erreurs sont déjà payées.</p></div>'
)

# 2. Fix understanding
code = code.replace(
    '<li><strong>L\'IA ne décide jamais d\'un fait commercial.</strong> La disponibilité',
    '<li>L\'IA ne décide jamais d\'un fait commercial. La disponibilité'
)
code = code.replace(
    '<li><strong>Un humain reste dans la boucle.</strong> Supervision',
    '<li>Un humain reste dans la boucle : supervision'
)
code = code.replace(
    '<li><strong>Le backend est indépendant du canal.</strong> WhatsApp',
    '<li>Le backend est indépendant du canal. WhatsApp'
)

# 3. Fix architecture
code = code.replace(
    '<p><strong>Recommandation : deux numéros dès le départ.</strong> La différence de coût est faible et c\'est le seul choix architectural ici qui est véritablement douloureux à inverser une fois que de vrais voyageurs dialoguent avec un numéro. Les deux sont enregistrés en semaine 1 afin que les vérifications se fassent en parallèle.</p>',
    '<div class="rec"><p><b>Recommandation : deux numéros dès le départ.</b> La différence de coût est faible et c\'est le seul choix architectural ici qui est véritablement douloureux à inverser une fois que de vrais voyageurs dialoguent avec un numéro. Les deux sont enregistrés en semaine 1 afin que les vérifications se fassent en parallèle.</p></div>'
)

# 4. Fix budget table 9.1 lot bold tags
for lot in ["A. Mise en place et infrastructure", "B. Intégration WhatsApp, deux numéros", "C. Moteur IA et orchestration", "D. Backend et modèle de données", "E. Back-office opérateur", "F. Tracking QR et attribution", "G. Livraison et courses", "H. Tableau de bord KPI, exports, documentation et passation"]:
    code = code.replace(f"<tr><td><b>{lot}</b></td>", f"<tr><td>{lot}</td>")

with open("scripts/generate_french_sheet.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Applied exact parity adjustments to scripts/generate_french_sheet.py successfully.")
