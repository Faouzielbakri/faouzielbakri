import re

# 1. Read original English source of truth
orig_path = "public/proposals/Proposal_AI_Concierge_WhatsApp_MVP_Marrakech (1).html"
with open(orig_path, "r", encoding="utf-8") as f:
    orig_content = f.read()

# Extract styles
style_match = re.search(r"<style>(.*?)</style>", orig_content, re.DOTALL)
original_style = style_match.group(1).strip() if style_match else ""

# Extract English sheet inner content
sheet_match = re.search(r'<div class="sheet">(.*?)</div>\s*</body>', orig_content, re.DOTALL)
if not sheet_match:
    raise ValueError("Could not extract sheet from original HTML")

en_sheet_inner = sheet_match.group(1).strip()

# 2. Read French sheet inner content
with open("scripts/fr_sheet_inner.html", "r", encoding="utf-8") as f:
    fr_sheet_inner = f.read().strip()

# Wrap all <table> elements in <div class="table-wrap">...</div>
wrapped_en, count_en = re.subn(r"(<table\b[^>]*>.*?</table>)", r'<div class="table-wrap">\n\1\n</div>', en_sheet_inner, flags=re.DOTALL)
wrapped_fr, count_fr = re.subn(r"(<table\b[^>]*>.*?</table>)", r'<div class="table-wrap">\n\1\n</div>', fr_sheet_inner, flags=re.DOTALL)
print(f"Wrapped tables: EN={count_en}, FR={count_fr}")
en_sheet_inner = wrapped_en
fr_sheet_inner = wrapped_fr

# Contact & signoff interactive links (email and whatsapp)
contact_old = "<b>faouzielbakri.com · +212 6 32 32 38 56</b>"
contact_new = '<b><a href="https://faouzielbakri.com" target="_blank" rel="noopener">faouzielbakri.com</a> · <a href="mailto:faouzielbakri@gmail.com">faouzielbakri@gmail.com</a> · <a href="https://wa.me/212632323856" target="_blank" rel="noopener" title="WhatsApp">+212 6 32 32 38 56</a></b>'

signoff_old = '<a href="https://faouzielbakri.com">faouzielbakri.com</a> · +212 6 32 32 38 56'
signoff_new = '<a href="https://faouzielbakri.com" target="_blank" rel="noopener">faouzielbakri.com</a> · <a href="mailto:faouzielbakri@gmail.com">faouzielbakri@gmail.com</a> · <a href="https://wa.me/212632323856" target="_blank" rel="noopener" title="WhatsApp">+212 6 32 32 38 56</a>'

en_sheet_inner = en_sheet_inner.replace(contact_old, contact_new).replace(signoff_old, signoff_new)
fr_sheet_inner = fr_sheet_inner.replace(contact_old, contact_new).replace(signoff_old, signoff_new)

# --- FEATURE 1: Reading Time in Cover Meta ---
en_sheet_inner = en_sheet_inner.replace(
    "<div><span>Valid for</span><b>30 days</b></div>",
    "<div><span>Valid for</span><b>30 days</b></div>\n    <div><span>Reading time</span><b>⏱️ ~7 min · 17 sections</b></div>"
)
fr_sheet_inner = fr_sheet_inner.replace(
    "<div><span>Validité</span><b>30 jours</b></div>",
    "<div><span>Validité</span><b>30 jours</b></div>\n    <div><span>Temps de lecture</span><b>⏱️ ~7 min · 17 sections</b></div>"
)

# --- FEATURE 2: Section 0 Chat Replay Toolbar & Voice Note Mockup ---
replay_bar_en = """<div class="chat-replay-bar" role="toolbar" aria-label="Conversation simulation controls">
  <button type="button" class="btn-replay" id="btn-replay-en" aria-label="Replay simulated conversation">
    <svg class="play-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    <span>Replay Chat Flow</span>
  </button>
  <span class="replay-hint">Live simulated guest &amp; supplier interaction · 5 steps</span>
</div>
<div class="thread">"""

replay_bar_fr = """<div class="chat-replay-bar" role="toolbar" aria-label="Contrôles de la simulation">
  <button type="button" class="btn-replay" id="btn-replay-fr" aria-label="Rejouer la conversation">
    <svg class="play-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    <span>Rejouer l'échange</span>
  </button>
  <span class="replay-hint">Simulation temps réel voyageur &amp; prestataire · 5 étapes</span>
</div>
<div class="thread">"""

voice_note_en = """<div class="voice-note-mockup" role="region" aria-label="WhatsApp voice note preview">
  <button type="button" class="btn-voice-play" aria-label="Play sample voice note">
    <svg class="v-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
    <svg class="v-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
  </button>
  <div class="voice-waveform" aria-hidden="true">
    <span style="height:35%"></span><span style="height:60%"></span><span style="height:90%"></span><span style="height:45%"></span><span style="height:80%"></span><span style="height:55%"></span><span style="height:100%"></span><span style="height:70%"></span><span style="height:40%"></span><span style="height:85%"></span><span style="height:65%"></span><span style="height:95%"></span><span style="height:50%"></span><span style="height:75%"></span><span style="height:40%"></span><span style="height:60%"></span><span style="height:30%"></span><span style="height:70%"></span><span style="height:50%"></span><span style="height:40%"></span>
  </div>
  <span class="voice-timer">0:14</span>
  <span class="voice-badge">Audio WhatsApp · Whisper</span>
</div>"""

voice_note_fr = """<div class="voice-note-mockup" role="region" aria-label="Note vocale WhatsApp">
  <button type="button" class="btn-voice-play" aria-label="Écouter l'extrait vocal">
    <svg class="v-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
    <svg class="v-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display:none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
  </button>
  <div class="voice-waveform" aria-hidden="true">
    <span style="height:35%"></span><span style="height:60%"></span><span style="height:90%"></span><span style="height:45%"></span><span style="height:80%"></span><span style="height:55%"></span><span style="height:100%"></span><span style="height:70%"></span><span style="height:40%"></span><span style="height:85%"></span><span style="height:65%"></span><span style="height:95%"></span><span style="height:50%"></span><span style="height:75%"></span><span style="height:40%"></span><span style="height:60%"></span><span style="height:30%"></span><span style="height:70%"></span><span style="height:50%"></span><span style="height:40%"></span>
  </div>
  <span class="voice-timer">0:14</span>
  <span class="voice-badge">Audio WhatsApp · Whisper</span>
</div>"""

en_sheet_inner = en_sheet_inner.replace('<div class="thread">', replay_bar_en, 1)
fr_sheet_inner = fr_sheet_inner.replace('<div class="thread">', replay_bar_fr, 1)

en_first_bubble_target = "Maybe 300 dh a head?</div>"
en_first_bubble_replace = f"Maybe 300 dh a head?{voice_note_en}</div>"
en_sheet_inner = en_sheet_inner.replace(en_first_bubble_target, en_first_bubble_replace, 1)

fr_first_bubble_target = "Que nous recommandez-vous ?</div>"
fr_first_bubble_replace = f"Que nous recommandez-vous ?{voice_note_fr}</div>"
fr_sheet_inner = fr_sheet_inner.replace(fr_first_bubble_target, fr_first_bubble_replace, 1)

# --- FEATURE 3: Section 10 Interactive Payback & ROI Simulator ---
sim_html_en = """<div class="roi-simulator" id="roi-sim-en" role="region" aria-label="Interactive ROI Simulator">
  <div class="sim-head">
    <div class="sim-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      <span>Interactive Break-Even &amp; Revenue Simulator</span>
    </div>
    <span class="sim-badge">Test Your Pilot Metrics</span>
  </div>
  <div class="sim-grid">
    <div class="sim-inputs">
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-riads-en">Partner Riads / Hotels</label>
          <span class="sim-num" id="val-riads-en">10 riads</span>
        </div>
        <input type="range" class="sim-slider" id="sim-riads-en" min="3" max="30" value="10" step="1">
        <div class="sim-ticks"><span>3</span><span>10 (Target)</span><span>20</span><span>30</span></div>
      </div>
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-scans-en">Daily Scans per Partner</label>
          <span class="sim-num" id="val-scans-en">3 scans/day</span>
        </div>
        <input type="range" class="sim-slider" id="sim-scans-en" min="1" max="10" value="3" step="0.5">
        <div class="sim-ticks"><span>1</span><span>3 (Realistic)</span><span>6</span><span>10</span></div>
      </div>
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-margin-en">Avg. Commission / Booking</label>
          <span class="sim-num" id="val-margin-en">$9.50 (~100 MAD)</span>
        </div>
        <input type="range" class="sim-slider" id="sim-margin-en" min="5" max="25" value="9.5" step="0.5">
        <div class="sim-ticks"><span>$5 (Dining)</span><span>$9.5 (Mix)</span><span>$18 (Tours)</span><span>$25 (Private)</span></div>
      </div>
    </div>
    <div class="sim-outputs">
      <div class="sim-kpi">
        <span class="kpi-label">Monthly Volume</span>
        <b class="kpi-val" id="kpi-vol-en">900 scans · 162 bookings</b>
        <span class="kpi-sub">~18% scan-to-booking conversion</span>
      </div>
      <div class="sim-kpi">
        <span class="kpi-label">Monthly Gross Margin</span>
        <b class="kpi-val highlight" id="kpi-gross-en">$1,539 / mo</b>
        <span class="kpi-sub" id="kpi-gross-mad-en">~16,200 MAD / mo</span>
      </div>
      <div class="sim-kpi">
        <span class="kpi-label">Net Profit after Operations</span>
        <b class="kpi-val positive" id="kpi-net-en">+$1,024 / mo</b>
        <span class="kpi-sub">Deducting -$515/mo running costs</span>
      </div>
      <div class="sim-kpi payoff-kpi">
        <span class="kpi-label">Development Amortization</span>
        <b class="kpi-val payoff" id="kpi-payoff-en">~5.5 months</b>
        <span class="kpi-sub" id="kpi-payoff-sub-en">Recovers $5,600 initial dev investment</span>
      </div>
    </div>
  </div>
</div>"""

sim_html_fr = """<div class="roi-simulator" id="roi-sim-fr" role="region" aria-label="Simulateur de rentabilité">
  <div class="sim-head">
    <div class="sim-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      <span>Simulateur d'Amortissement &amp; Rentabilité en Direct</span>
    </div>
    <span class="sim-badge">Testez vos chiffres réels</span>
  </div>
  <div class="sim-grid">
    <div class="sim-inputs">
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-riads-fr">Riads / Hôtels partenaires</label>
          <span class="sim-num" id="val-riads-fr">10 riads</span>
        </div>
        <input type="range" class="sim-slider" id="sim-riads-fr" min="3" max="30" value="10" step="1">
        <div class="sim-ticks"><span>3</span><span>10 (Cible)</span><span>20</span><span>30</span></div>
      </div>
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-scans-fr">Scans / riad / jour</label>
          <span class="sim-num" id="val-scans-fr">3 scans/jour</span>
        </div>
        <input type="range" class="sim-slider" id="sim-scans-fr" min="1" max="10" value="3" step="0.5">
        <div class="sim-ticks"><span>1</span><span>3 (Réaliste)</span><span>6</span><span>10</span></div>
      </div>
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-margin-fr">Marge moy. / réservation</label>
          <span class="sim-num" id="val-margin-fr">9,50 $ (~100 MAD)</span>
        </div>
        <input type="range" class="sim-slider" id="sim-margin-fr" min="5" max="25" value="9.5" step="0.5">
        <div class="sim-ticks"><span>5 $ (Resto)</span><span>9,5 $ (Mix)</span><span>18 $ (Excursions)</span><span>25 $ (Privé)</span></div>
      </div>
    </div>
    <div class="sim-outputs">
      <div class="sim-kpi">
        <span class="kpi-label">Volume Mensuel</span>
        <b class="kpi-val" id="kpi-vol-fr">900 scans · 162 résas</b>
        <span class="kpi-sub">Taux de conversion ~18%</span>
      </div>
      <div class="sim-kpi">
        <span class="kpi-label">Marge Brute Mensuelle</span>
        <b class="kpi-val highlight" id="kpi-gross-fr">1 539 $/mois</b>
        <span class="kpi-sub" id="kpi-gross-mad-fr">~16 200 MAD / mois</span>
      </div>
      <div class="sim-kpi">
        <span class="kpi-label">Bénéfice Net après Exploitation</span>
        <b class="kpi-val positive" id="kpi-net-fr">+1 024 $/mois</b>
        <span class="kpi-sub">Après déduction de 515 $/mois d'exploitation</span>
      </div>
      <div class="sim-kpi payoff-kpi">
        <span class="kpi-label">Amortissement du Développement</span>
        <b class="kpi-val payoff" id="kpi-payoff-fr">~5,5 mois</b>
        <span class="kpi-sub" id="kpi-payoff-sub-fr">Remboursement intégral des 5 600 $ de dev.</span>
      </div>
    </div>
  </div>
</div>"""

roi_table_target = '<div class="table-wrap">\n<table style="margin-top:30px">'
en_sheet_inner = en_sheet_inner.replace(roi_table_target, f"{sim_html_en}\n{roi_table_target}", 1)
fr_sheet_inner = fr_sheet_inner.replace(roi_table_target, f"{sim_html_fr}\n{roi_table_target}", 1)

# --- FEATURE 4: One-Click Kickoff Action Deck ---
action_deck_en = """<div class="action-deck" id="action-deck-en" role="region" aria-label="Proposal acceptance and kickoff">
  <div class="action-deck-inner">
    <div class="action-deck-header">
      <span class="deck-tag">Marrakech Pilot · Q4 2026</span>
      <h3>Ready to Deploy Your AI Concierge?</h3>
      <p class="deck-sub">The 8-week timeline begins immediately upon signature and receipt of the initial milestone. I have immediate availability.</p>
    </div>
    <div class="action-deck-buttons">
      <a href="https://wa.me/212632323856?text=Hi%20Faouzi%2C%20we%20approve%20the%20Ballroom%20MVP%20proposal.%20Let%27s%20schedule%20the%20kickoff%20call." target="_blank" rel="noopener" class="btn-deck-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"></path></svg>
        <span>Approve &amp; Schedule Kickoff (WhatsApp)</span>
      </a>
      <a href="mailto:faouzielbakri@gmail.com?subject=Approval%20-%20Ballroom%20MVP%20Proposal&amp;body=Hi%20Faouzi%2C%0A%0AWe%20would%20like%20to%20approve%20the%20Ballroom%20MVP%20proposal%20and%20schedule%20the%20kickoff." class="btn-deck-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <span>Ask a Question / Approve via Email</span>
      </a>
    </div>
    <div class="action-deck-footer">
      <span>Valid for 30 days</span>
      <span class="dot">·</span>
      <span>8-Week Delivery Guarantee</span>
      <span class="dot">·</span>
      <span>100% Code &amp; IP Ownership</span>
    </div>
  </div>
</div>"""

action_deck_fr = """<div class="action-deck" id="action-deck-fr" role="region" aria-label="Validation de la proposition et lancement">
  <div class="action-deck-inner">
    <div class="action-deck-header">
      <span class="deck-tag">Pilote Marrakech · T4 2026</span>
      <h3>Prêt à déployer votre concierge IA ?</h3>
      <p class="deck-sub">Le délai de 8 semaines démarre dès réception de l'acompte initial. J'ai de la disponibilité immédiate.</p>
    </div>
    <div class="action-deck-buttons">
      <a href="https://wa.me/212632323856?text=Bonjour%20Faouzi%2C%20nous%20validons%20la%20proposition%20technique%20%26%20financi%C3%A8re%20Ballroom%20MVP.%20Planifions%20le%20kickoff." target="_blank" rel="noopener" class="btn-deck-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"></path></svg>
        <span>Valider &amp; Planifier le Kickoff (WhatsApp)</span>
      </a>
      <a href="mailto:faouzielbakri@gmail.com?subject=Validation%20Proposition%20Ballroom%20MVP&amp;body=Bonjour%20Faouzi%2C%0A%0ANous%20souhaitons%20valider%20la%20proposition%20Ballroom%20MVP%20et%20planifier%20le%20kickoff." class="btn-deck-secondary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <span>Poser une question / Valider par Email</span>
      </a>
    </div>
    <div class="action-deck-footer">
      <span>Validité : 30 jours</span>
      <span class="dot">·</span>
      <span>Livraison garantie sous 8 semaines</span>
      <span class="dot">·</span>
      <span>Transfert 100% de propriété</span>
    </div>
  </div>
</div>"""

en_sheet_inner = en_sheet_inner + "\n" + action_deck_en
fr_sheet_inner = fr_sheet_inner + "\n" + action_deck_fr

# --- FEATURE 5: Currency Conversion Tooltips ---
en_cur_maps = [
    ("$5,600", '<span class="has-cur" data-cur-mad="~56 000 MAD" data-cur-eur="~5 200 €">$5,600</span>'),
    ("$175 and $260", '<span class="has-cur" data-cur-mad="~1 750 – 2 600 MAD" data-cur-eur="~160 – 240 €">$175 and $260</span>'),
    ("$300", '<span class="has-cur" data-cur-mad="~3 000 MAD" data-cur-eur="~280 €">$300</span>'),
    ("600 MAD", '<span class="has-cur" data-cur-mad="600 MAD" data-cur-eur="~56 €">600 MAD</span>'),
]
for o, n in en_cur_maps:
    en_sheet_inner = en_sheet_inner.replace(o, n)

fr_cur_maps = [
    ("5 600 $", '<span class="has-cur" data-cur-mad="~56 000 MAD" data-cur-eur="~5 200 €">5 600 $</span>'),
    ("175 $ et 260 $", '<span class="has-cur" data-cur-mad="~1 750 – 2 600 MAD" data-cur-eur="~160 – 240 €">175 $ et 260 $</span>'),
    ("300 $", '<span class="has-cur" data-cur-mad="~3 000 MAD" data-cur-eur="~280 €">300 $</span>'),
    ("600 MAD", '<span class="has-cur" data-cur-mad="600 MAD" data-cur-eur="~56 €">600 MAD</span>'),
]
for o, n in fr_cur_maps:
    fr_sheet_inner = fr_sheet_inner.replace(o, n)

# Additional CSS for switcher, print button, bilingual toggle, and mobile responsiveness
additional_css = """
/* Reading progress bar */
#reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, #2B47C8, #6366F1);
  z-index: 10001;
  pointer-events: none;
  transition: width 0.08s ease-out;
}

/* Responsive foundation: absolute containment of page width */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
  position: relative;
}

/* Contact & Signoff Interactive Links on Screen */
.meta b a, .signoff a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid rgba(43, 71, 200, 0.35);
  transition: all 0.15s ease;
}
.meta b a:hover, .signoff a:hover {
  color: var(--indigo);
  border-bottom-color: var(--indigo);
}

/* Currency hints on pricing */
.has-cur {
  position: relative;
  cursor: help;
  border-bottom: 1px dotted rgba(43, 71, 200, 0.45);
}
.has-cur:hover::after,
.has-cur:focus::after {
  content: attr(data-cur-mad) " · " attr(data-cur-eur);
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #101E2E;
  color: #FFFFFF;
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(16, 30, 46, 0.2);
  z-index: 1000;
  pointer-events: none;
}

/* Table wrapping: smooth horizontal scroll strictly contained inside wrapper */
.table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 14px 0 28px;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 4px 16px 10px;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: var(--rule) transparent;
}
.table-wrap table {
  margin: 0;
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}

#roi .table-wrap table,
#roi-fr .table-wrap table {
  min-width: 760px;
}

#scope .table-wrap table,
#scope-fr .table-wrap table,
#risks .table-wrap table,
#risks-fr .table-wrap table {
  min-width: 460px;
}

.table-wrap::-webkit-scrollbar {
  height: 6px;
}
.table-wrap::-webkit-scrollbar-track {
  background: transparent;
}
.table-wrap::-webkit-scrollbar-thumb {
  background: var(--rule);
  border-radius: 3px;
}

/* Section 0: Chat Replay Toolbar & Voice Note Mockup */
.chat-replay-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(43, 71, 200, 0.04);
  border: 1px solid rgba(43, 71, 200, 0.15);
  border-radius: 8px;
  padding: 8px 14px;
  margin: 18px 0 16px;
  font-family: var(--sans);
}
.btn-replay {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-replay:hover {
  background: var(--indigo);
  transform: translateY(-1px);
}
.replay-hint {
  font-size: 12px;
  color: var(--muted);
}
.voice-note-mockup {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(16, 30, 46, 0.12);
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 10px;
}
.btn-voice-play {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--indigo);
  color: #fff;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}
.btn-voice-play:hover {
  transform: scale(1.08);
}
.voice-waveform {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 20px;
  flex: 1;
}
.voice-waveform span {
  display: inline-block;
  width: 3px;
  background: rgba(43, 71, 200, 0.45);
  border-radius: 2px;
  transition: height 0.15s ease, background 0.15s ease;
}
.voice-waveform.playing span {
  background: var(--indigo);
  animation: wavePulse 0.8s infinite ease-in-out alternate;
}
@keyframes wavePulse {
  0% { height: 25%; }
  100% { height: 95%; }
}
.voice-timer {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  flex-shrink: 0;
}
.voice-badge {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--indigo);
  background: rgba(43, 71, 200, 0.08);
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
}

/* Section 10: Interactive ROI Simulator */
.roi-simulator {
  background: rgba(253, 253, 252, 0.94);
  border: 1px solid var(--rule);
  border-radius: 12px;
  padding: 22px 24px;
  margin: 28px 0 28px;
  box-shadow: 0 8px 32px rgba(16, 30, 46, 0.06);
}
.sim-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 20px;
}
.sim-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--sans);
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}
.sim-title svg {
  color: var(--indigo);
}
.sim-badge {
  font-family: var(--sans);
  font-size: 11.5px;
  font-weight: 600;
  background: rgba(43, 71, 200, 0.09);
  color: var(--indigo);
  padding: 3px 9px;
  border-radius: 999px;
}
.sim-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 28px;
}
.sim-inputs {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.sim-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sim-row-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
}
.sim-num {
  font-family: var(--mono);
  font-weight: 600;
  color: var(--indigo);
  font-size: 13.5px;
}
.sim-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: #E2E8F0;
  border-radius: 4px;
  outline: none;
}
.sim-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--indigo);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(43, 71, 200, 0.35);
  transition: transform 0.1s ease;
}
.sim-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
.sim-ticks {
  display: flex;
  justify-content: space-between;
  font-family: var(--sans);
  font-size: 10.5px;
  color: var(--muted);
}
.sim-outputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  background: rgba(16, 30, 46, 0.02);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 14px;
}
.sim-kpi {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.kpi-label {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
}
.kpi-val {
  font-family: var(--mono);
  font-size: 17px;
  font-weight: 700;
  color: var(--ink);
}
.kpi-val.highlight {
  color: var(--indigo);
}
.kpi-val.positive {
  color: #059669;
}
.kpi-val.payoff {
  color: #D97706;
}
.kpi-sub {
  font-family: var(--sans);
  font-size: 10.5px;
  color: var(--muted);
}
.payoff-kpi {
  grid-column: 1 / -1;
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 6px;
  padding: 8px 12px;
}

/* Action Deck at Bottom */
.action-deck {
  margin-top: 52px;
  background: #101E2E;
  color: #FFFFFF;
  border-radius: 12px;
  padding: 38px 32px;
  box-shadow: 0 20px 48px rgba(16, 30, 46, 0.22);
}
.action-deck-header h3 {
  color: #FFFFFF;
  font-size: 25px;
  line-height: 1.25;
  margin: 6px 0 10px;
}
.deck-tag {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #60A5FA;
}
.deck-sub {
  color: #94A3B8;
  font-size: 15px;
  line-height: 1.5;
  margin: 0 0 24px;
  max-width: 680px;
}
.action-deck-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 22px;
}
.btn-deck-primary {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: #22C55E;
  color: #064E3B;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  padding: 12px 22px;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
  transition: all 0.15s ease;
}
.btn-deck-primary:hover {
  background: #16A34A;
  color: #FFFFFF;
  transform: translateY(-1px);
}
.btn-deck-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #F8FAFC;
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s ease;
}
.btn-deck-secondary:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.3);
}
.action-deck-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-family: var(--sans);
  font-size: 12px;
  color: #64748B;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
}
.action-deck-footer .dot {
  color: #475569;
}

/* Top-Right Header Controls Cluster */
.header-controls {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  animation: clusterMount 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: top 0.25s cubic-bezier(0.16, 1, 0.3, 1), gap 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes clusterMount {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.header-controls.scrolled {
  top: 12px;
}

.jump-pill-wrap,
.share-pill-wrap,
.print-pill-wrap,
.lang-switch-wrap {
  display: inline-flex;
  position: relative;
}

.jump-btn,
.share-btn,
.print-btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(253, 253, 252, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 6px 14px;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(16, 30, 46, 0.08);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1.2;
}

.jump-btn:hover,
.share-btn:hover,
.print-btn:hover {
  color: var(--ink);
  background: #FFFFFF;
  border-color: rgba(16, 30, 46, 0.25);
  box-shadow: 0 6px 20px rgba(16, 30, 46, 0.12);
}

.jump-btn:active,
.share-btn:active,
.print-btn:active {
  transform: scale(0.96);
}

.jump-btn .key-hint {
  font-size: 10px;
  font-weight: 700;
  background: rgba(16, 30, 46, 0.07);
  padding: 1px 5px;
  border-radius: 4px;
  color: var(--muted);
}

.jump-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 250px;
  background: rgba(253, 253, 252, 0.98);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(16, 30, 46, 0.15);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(16, 30, 46, 0.16);
  padding: 8px;
  display: none;
  flex-direction: column;
  gap: 2px;
  z-index: 10002;
  transform-origin: top right;
  animation: jumpDropIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.jump-dropdown.open {
  display: flex;
}
@keyframes jumpDropIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.jump-dropdown-title {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted);
  padding: 6px 10px 4px;
}
.jump-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.12s ease;
}
.jump-item:hover {
  background: rgba(43, 71, 200, 0.08);
  color: var(--indigo);
}
.jump-item span:first-child {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  width: 16px;
}
.jump-action-link {
  border-top: 1px solid var(--rule);
  margin-top: 4px;
  padding-top: 8px;
  color: var(--indigo);
  font-weight: 600;
}

.share-btn .share-icon,
.share-btn svg,
.print-btn .print-icon,
.print-btn svg,
.jump-btn svg {
  color: var(--indigo);
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.share-btn:hover .share-icon,
.share-btn:hover svg,
.print-btn:hover .print-icon,
.print-btn:hover svg,
.jump-btn:hover svg {
  transform: translateY(-1px);
}

.lang-switch {
  display: inline-flex;
  background: rgba(253, 253, 252, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 3px;
  box-shadow: 0 4px 16px rgba(16, 30, 46, 0.08);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.lang-btn {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  padding: 5px 13px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.2;
}

.lang-btn:hover {
  color: var(--ink);
}

.lang-btn.active {
  background: var(--ink);
  color: #FFFFFF;
  box-shadow: 0 1px 4px rgba(16, 30, 46, 0.15);
}

.label-short,
.share-label-short,
.jump-label-short {
  display: none;
}

/* Scroll state elevation */
.header-controls.scrolled .jump-btn,
.header-controls.scrolled .share-btn,
.header-controls.scrolled .print-btn,
.header-controls.scrolled .lang-switch {
  background: rgba(253, 253, 252, 0.98);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-color: rgba(16, 30, 46, 0.18);
  box-shadow: 0 8px 28px rgba(16, 30, 46, 0.12), 0 1px 3px rgba(16, 30, 46, 0.06);
}

/* Toast Notification for Clipboard Copy */
.share-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #101E2E;
  color: #FFFFFF;
  padding: 9px 18px;
  border-radius: 999px;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(16, 30, 46, 0.25);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  z-index: 10000;
}

.share-toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.share-toast svg {
  color: #34D399;
  flex-shrink: 0;
}

/* Visibility rules based on data-lang attribute */
html[data-lang="en"] .sheet.lang-fr {
  display: none !important;
}
html[data-lang="fr"] .sheet.lang-en {
  display: none !important;
}

/* Mobile Responsiveness (< 640px) */
@media (max-width: 640px) {
  body {
    font-size: 16px;
    line-height: 1.6;
  }
  .sheet {
    padding: 0 18px 80px;
    max-width: 100%;
    overflow: hidden;
  }
  .cover {
    padding: 48px 0 36px;
  }
  .brandline {
    margin-bottom: 28px;
    padding-right: 140px;
    font-size: 13px;
  }
  .cover h1 {
    font-size: 32px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    max-width: none;
    word-break: break-word;
  }
  .cover .sub {
    font-size: 16.5px;
    line-height: 1.45;
    margin-top: 14px;
    max-width: none;
  }
  .meta {
    gap: 18px 24px;
    margin-top: 32px;
    font-size: 13.5px;
  }
  .meta div {
    min-width: 135px;
  }
  .confidential {
    margin-top: 28px;
    font-size: 12.5px;
    padding-left: 12px;
  }
  section {
    padding-top: 38px;
  }
  h2 {
    font-size: 22px;
    line-height: 1.25;
  }
  h3 {
    font-size: 18px;
    line-height: 1.3;
  }
  .lead {
    font-size: 17.5px;
    line-height: 1.5;
  }
  .callout {
    padding: 16px 18px;
  }
  .rec {
    padding: 2px 0 2px 14px;
  }
  .states {
    font-size: 13px;
    line-height: 1.8;
    padding: 12px 14px;
    word-break: break-word;
  }
  .bignum {
    font-size: 32px;
  }
  .bigpair {
    margin: 20px 0 8px;
    padding: 16px 0;
  }
  .bigpair .n {
    font-size: 28px;
  }
  .table-wrap {
    margin: 10px 0 22px;
    padding: 4px 12px 10px;
    border-radius: 4px;
    box-shadow: inset -10px 0 10px -10px rgba(16, 30, 46, 0.2);
  }
  th, td {
    padding-right: 14px;
    font-size: 13px;
  }
  th {
    white-space: nowrap;
  }
  .signoff {
    margin-top: 48px;
    padding-top: 20px;
    font-size: 14px;
  }
  .signoff b {
    font-size: 16px;
  }
  .header-controls {
    top: 10px;
    right: 12px;
    gap: 5px;
  }
  .header-controls.scrolled {
    top: 8px;
  }
  .jump-btn,
  .share-btn,
  .print-btn {
    padding: 5px 8px;
    font-size: 11.5px;
    gap: 4px;
  }
  .lang-switch {
    padding: 2px;
  }
  .jump-label-full,
  .share-label-full,
  .label-full,
  .jump-btn .key-hint {
    display: none;
  }
  .jump-label-short,
  .share-label-short,
  .label-short {
    display: inline;
    font-weight: 600;
  }
  .lang-btn {
    padding: 4px 7px;
    font-size: 11.5px;
  }
  .brandline {
    padding-right: 0;
  }
  .sim-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .sim-outputs {
    grid-template-columns: 1fr;
  }
  .action-deck {
    padding: 26px 20px;
  }
  .action-deck-buttons {
    flex-direction: column;
  }
  .btn-deck-primary,
  .btn-deck-secondary {
    width: 100%;
    justify-content: center;
    text-align: center;
  }
  .jump-dropdown {
    right: -10px;
    width: calc(100vw - 28px);
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .price-line {
    flex-wrap: wrap;
    gap: 4px 16px;
    padding: 10px 0;
  }
}

/* Print Stylesheet: MUST strictly reproduce the clean, pristine original version */
@media print {
  #reading-progress,
  .header-controls,
  .jump-dropdown,
  .jump-pill-wrap,
  .share-pill-wrap,
  .print-pill-wrap,
  .lang-switch-wrap,
  .share-toast,
  .chat-replay-bar,
  .voice-note-mockup,
  .roi-simulator,
  .action-deck {
    display: none !important;
  }
  .has-cur {
    border-bottom: none !important;
    cursor: inherit !important;
  }
  .has-cur::after {
    display: none !important;
  }
  .meta b a, .signoff a, a {
    color: var(--ink) !important;
    border: none !important;
    border-bottom: none !important;
    text-decoration: none !important;
  }
  .table-wrap {
    overflow: visible !important;
    max-width: none !important;
    width: 100% !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 6px 0 16px !important;
    background: transparent !important;
  }
  .table-wrap table {
    min-width: 0 !important;
    width: 100% !important;
  }
  th, td {
    padding: 6px 8px 6px 0 !important;
    font-size: 9.5pt !important;
  }
  html[data-lang="en"] .sheet.lang-fr {
    display: none !important;
  }
  html[data-lang="fr"] .sheet.lang-en {
    display: none !important;
  }
}
"""

combined_css = original_style + "\n" + additional_css

template = """<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Concierge on WhatsApp — Technical &amp; Financial Proposal · Marrakech Pilot</title>
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet">

<!-- Open Graph / Social Media Cards -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Faouzi El Bakri">
<meta property="og:title" content="AI Concierge on WhatsApp — Technical &amp; Financial Proposal">
<meta property="og:description" content="Technical &amp; Financial Proposal for Marrakech Pilot · Autonomous guest interactions, PMS sync, and bilingual Arabic/French/English support.">
<meta property="og:image" content="https://faouzielbakri.com/og/ballroom-mvp.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="AI Concierge on WhatsApp Proposal · Marrakech Pilot">
<meta property="og:url" content="https://faouzielbakri.com/proposals/ballroom-mvp">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AI Concierge on WhatsApp — Technical &amp; Financial Proposal">
<meta name="twitter:description" content="Technical &amp; Financial Proposal for Marrakech Pilot · Autonomous guest interactions, PMS sync, and bilingual Arabic/French/English support.">
<meta name="twitter:image" content="https://faouzielbakri.com/og/ballroom-mvp.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet">
<style>
__COMBINED_CSS__
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
    if (lang === "fr") {
      document.title = "Concierge IA sur WhatsApp — Proposition Technique & Financière · Pilote Marrakech";
    }
  } catch(e) {}
})();
</script>
</head>
<body>

<div id="reading-progress" aria-hidden="true"></div>

<div class="header-controls" id="header-controls">
  <!-- QUICK JUMP NAVIGATION -->
  <div class="jump-pill-wrap" role="region" aria-label="Section navigation">
    <button type="button" class="jump-btn" id="btn-jump" aria-label="Quick jump to section" title="Jump to section (J)" aria-expanded="false" aria-haspopup="true">
      <svg class="jump-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
      <span class="jump-label">
        <span class="jump-label-full" id="jump-label-full">Jump</span>
        <span class="jump-label-short">Jump</span>
      </span>
      <span class="key-hint" aria-hidden="true">J</span>
    </button>
    <div class="jump-dropdown" id="jump-dropdown" role="menu" aria-hidden="true">
      <div class="jump-dropdown-title" id="jump-title">Quick Navigation</div>
      <a href="#thread" class="jump-item" role="menuitem" data-jump-sec="thread"><span>0</span> <span class="jump-name">Demo Chat Flow</span></a>
      <a href="#architecture" class="jump-item" role="menuitem" data-jump-sec="architecture"><span>4</span> <span class="jump-name">Architecture</span></a>
      <a href="#planning" class="jump-item" role="menuitem" data-jump-sec="planning"><span>8</span> <span class="jump-name">Planning (8 Weeks)</span></a>
      <a href="#budget" class="jump-item" role="menuitem" data-jump-sec="budget"><span>9</span> <span class="jump-name">Budget &amp; Milestones</span></a>
      <a href="#roi" class="jump-item" role="menuitem" data-jump-sec="roi"><span>10</span> <span class="jump-name">ROI &amp; Simulator</span></a>
      <a href="#running" class="jump-item" role="menuitem" data-jump-sec="running"><span>11</span> <span class="jump-name">Running Costs</span></a>
      <a href="#deliverables" class="jump-item" role="menuitem" data-jump-sec="deliverables"><span>14</span> <span class="jump-name">Deliverables</span></a>
      <a href="#action-deck-en" class="jump-item jump-action-link" role="menuitem" data-jump-sec="action-deck"><span>⚡</span> <span class="jump-name">Approval &amp; Kickoff</span></a>
    </div>
  </div>

  <!-- SHARE BUTTON -->
  <div class="share-pill-wrap" role="region" aria-label="Share controls">
    <button type="button" class="share-btn" id="btn-share" aria-label="Share proposal" title="Share proposal (S)">
      <svg class="share-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
      <span class="share-label" id="share-label">
        <span class="share-label-full">Share</span>
        <span class="share-label-short">Share</span>
      </span>
    </button>
  </div>

  <!-- PRINT / PDF BUTTON -->
  <div class="print-pill-wrap" role="region" aria-label="Print controls">
    <button type="button" class="print-btn" id="btn-print" aria-label="Print or save as PDF" title="Print / PDF (P)">
      <svg class="print-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      <span class="print-label" id="print-label">
        <span class="label-full">Print / PDF</span>
        <span class="label-short">PDF</span>
      </span>
    </button>
  </div>

  <!-- LANGUAGE SELECTOR -->
  <div class="lang-switch-wrap" role="region" aria-label="Language selector">
    <div class="lang-switch" role="group" aria-label="Choose language">
      <button type="button" class="lang-btn" data-set-lang="en" id="btn-en" aria-label="Switch to English (L)">EN</button>
      <button type="button" class="lang-btn" data-set-lang="fr" id="btn-fr" aria-label="Passer en Français (L)">FR</button>
    </div>
  </div>
</div>

<!-- TOAST FOR CLIPBOARD COPY -->
<div class="share-toast" id="share-toast" role="status" aria-live="polite">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
  <span id="toast-text">Link copied to clipboard!</span>
</div>

<!-- ENGLISH VERSION -->
<div class="sheet lang-en">
__EN_SHEET_INNER__
</div>

<!-- FRENCH VERSION -->
<div class="sheet lang-fr">
__FR_SHEET_INNER__
</div>

<script>
(function() {
  var headerControls = document.getElementById("header-controls");
  var progressBar = document.getElementById("reading-progress");
  var btnJump = document.getElementById("btn-jump");
  var jumpDropdown = document.getElementById("jump-dropdown");

  // Reading progress and scroll handler
  function handleScroll() {
    var isScrolled = window.scrollY > 30;
    if (headerControls) {
      if (isScrolled) headerControls.classList.add("scrolled");
      else headerControls.classList.remove("scrolled");
    }
    if (progressBar) {
      var scrollDist = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollDist / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Quick jump dropdown menu toggle
  function toggleJumpMenu() {
    if (!jumpDropdown) return;
    var isOpen = jumpDropdown.classList.contains("open");
    if (isOpen) {
      closeJumpMenu();
    } else {
      jumpDropdown.classList.add("open");
      jumpDropdown.setAttribute("aria-hidden", "false");
      if (btnJump) btnJump.setAttribute("aria-expanded", "true");
    }
  }

  function closeJumpMenu() {
    if (!jumpDropdown) return;
    jumpDropdown.classList.remove("open");
    jumpDropdown.setAttribute("aria-hidden", "true");
    if (btnJump) btnJump.setAttribute("aria-expanded", "false");
  }

  if (btnJump) {
    btnJump.addEventListener("click", function(e) {
      e.stopPropagation();
      toggleJumpMenu();
    });
  }

  document.addEventListener("click", function(e) {
    if (jumpDropdown && jumpDropdown.classList.contains("open")) {
      if (!jumpDropdown.contains(e.target) && e.target !== btnJump) {
        closeJumpMenu();
      }
    }
  });

  document.querySelectorAll(".jump-item").forEach(function(a) {
    a.addEventListener("click", function() {
      closeJumpMenu();
    });
  });

  var jumpNames = {
    en: {
      thread: "Demo Chat Flow",
      architecture: "Architecture",
      planning: "Planning (8 Weeks)",
      budget: "Budget & Milestones",
      roi: "ROI & Simulator",
      running: "Running Costs",
      deliverables: "Deliverables",
      "action-deck": "Approval & Kickoff"
    },
    fr: {
      thread: "Simulation WhatsApp",
      architecture: "Architecture",
      planning: "Planning (8 sem.)",
      budget: "Budget & Modalités",
      roi: "Amortissement & Simulateur",
      running: "Coûts d'exploitation",
      deliverables: "Livrables",
      "action-deck": "Validation & Kickoff"
    }
  };

  function updateSwitcherUI(lang) {
    var btnEn = document.getElementById("btn-en");
    var btnFr = document.getElementById("btn-fr");
    var printBtn = document.getElementById("btn-print");
    var labelFull = document.querySelector(".label-full");
    var shareBtn = document.getElementById("btn-share");
    var shareLabelFull = document.querySelector(".share-label-full");
    var shareLabelShort = document.querySelector(".share-label-short");
    var jumpLabelFull = document.getElementById("jump-label-full");
    var jumpTitle = document.getElementById("jump-title");

    if (btnEn && btnFr) {
      if (lang === "fr") {
        btnFr.classList.add("active");
        btnEn.classList.remove("active");
      } else {
        btnEn.classList.add("active");
        btnFr.classList.remove("active");
      }
    }
    if (labelFull) {
      labelFull.textContent = lang === "fr" ? "Imprimer / PDF" : "Print / PDF";
    }
    if (printBtn) {
      printBtn.setAttribute("aria-label", lang === "fr" ? "Imprimer ou enregistrer en PDF (P)" : "Print or save as PDF (P)");
      printBtn.setAttribute("title", lang === "fr" ? "Imprimer / PDF (P)" : "Print / PDF (P)");
    }
    if (shareLabelFull) {
      shareLabelFull.textContent = lang === "fr" ? "Partager" : "Share";
    }
    if (shareLabelShort) {
      shareLabelShort.textContent = lang === "fr" ? "Partager" : "Share";
    }
    if (shareBtn) {
      shareBtn.setAttribute("aria-label", lang === "fr" ? "Partager la proposition (S)" : "Share proposal (S)");
      shareBtn.setAttribute("title", lang === "fr" ? "Partager (S)" : "Share (S)");
    }
    if (jumpLabelFull) {
      jumpLabelFull.textContent = lang === "fr" ? "Sommaire" : "Jump";
    }
    if (jumpTitle) {
      jumpTitle.textContent = lang === "fr" ? "Accès rapide aux sections" : "Quick Navigation";
    }
    document.querySelectorAll(".jump-item").forEach(function(item) {
      var sec = item.getAttribute("data-jump-sec");
      var nameSpan = item.querySelector(".jump-name");
      if (nameSpan && jumpNames[lang] && jumpNames[lang][sec]) {
        nameSpan.textContent = jumpNames[lang][sec];
      }
      var targetId = lang === "fr" ? (sec === "action-deck" ? "action-deck-fr" : sec + "-fr") : (sec === "action-deck" ? "action-deck-en" : sec);
      item.setAttribute("href", "#" + targetId);
    });
  }

  function setLanguage(lang, updateUrl) {
    if (lang !== "fr" && lang !== "en") lang = "en";
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    updateSwitcherUI(lang);
    if (lang === "fr") {
      document.title = "Concierge IA sur WhatsApp — Proposition Technique & Financière · Pilote Marrakech";
    } else {
      document.title = "AI Concierge on WhatsApp — Technical & Financial Proposal · Marrakech Pilot";
    }
    try {
      localStorage.setItem("ballroom_proposal_lang", lang);
      if (updateUrl !== false) {
        var url = new URL(window.location.href);
        if (lang === "fr") {
          url.searchParams.set("lang", "fr");
        } else {
          url.searchParams.delete("lang");
        }
        window.history.replaceState({}, "", url.toString());
      }
    } catch(e) {}
  }

  var currentLang = document.documentElement.getAttribute("data-lang") || "en";
  setLanguage(currentLang, false);

  var btnPrint = document.getElementById("btn-print");
  if (btnPrint) {
    btnPrint.addEventListener("click", function() {
      window.print();
    });
  }

  var btnShare = document.getElementById("btn-share");
  var shareToast = document.getElementById("share-toast");
  var toastText = document.getElementById("toast-text");
  var toastTimeout = null;

  function showToast(msg) {
    if (!shareToast) return;
    if (toastText && msg) toastText.textContent = msg;
    shareToast.classList.add("show");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function() {
      shareToast.classList.remove("show");
    }, 2800);
  }

  function fallbackCopy(url, lang) {
    var ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      showToast(lang === "fr" ? "Lien copié dans le presse-papier !" : "Link copied to clipboard!");
    } catch(e) {
      showToast(lang === "fr" ? "Impossible de copier" : "Could not copy link");
    }
    document.body.removeChild(ta);
  }

  function copyToClipboard(url, lang) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        showToast(lang === "fr" ? "Lien copié dans le presse-papier !" : "Link copied to clipboard!");
      }).catch(function() {
        fallbackCopy(url, lang);
      });
    } else {
      fallbackCopy(url, lang);
    }
  }

  if (btnShare) {
    btnShare.addEventListener("click", function() {
      var lang = document.documentElement.getAttribute("data-lang") || "en";
      var title = lang === "fr"
        ? "Concierge IA sur WhatsApp — Proposition Technique & Financière"
        : "AI Concierge on WhatsApp — Technical & Financial Proposal";
      var text = lang === "fr"
        ? "Proposition Technique & Financière pour Pilote Marrakech · Faouzi El Bakri"
        : "Technical & Financial Proposal for Marrakech Pilot · Faouzi El Bakri";
      var url = window.location.href;

      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url
        }).catch(function(err) {
          if (err && err.name !== "AbortError") {
            copyToClipboard(url, lang);
          }
        });
      } else {
        copyToClipboard(url, lang);
      }
    });
  }

  document.querySelectorAll("[data-set-lang]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var targetLang = btn.getAttribute("data-set-lang");
      setLanguage(targetLang, true);
    });
  });

  // Desktop keyboard shortcuts
  document.addEventListener("keydown", function(e) {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var key = e.key ? e.key.toLowerCase() : "";
    if (key === "p") {
      e.preventDefault();
      window.print();
    } else if (key === "l") {
      e.preventDefault();
      var cur = document.documentElement.getAttribute("data-lang") || "en";
      setLanguage(cur === "fr" ? "en" : "fr", true);
    } else if (key === "s") {
      e.preventDefault();
      if (btnShare) btnShare.click();
    } else if (key === "t") {
      e.preventDefault();
      var curLang = document.documentElement.getAttribute("data-lang") || "en";
      var tocEl = document.querySelector(curLang === "fr" ? ".sheet.lang-fr .toc" : ".sheet.lang-en .toc");
      if (tocEl) tocEl.scrollIntoView({ behavior: "smooth" });
    } else if (key === "j") {
      e.preventDefault();
      toggleJumpMenu();
    } else if (e.key === "Escape") {
      closeJumpMenu();
      if (shareToast) shareToast.classList.remove("show");
    }
  });

  // Section 10: Reactive ROI Simulator calculations
  function setupRoiSimulator(lang) {
    var suffix = "-" + lang;
    var sliderRiads = document.getElementById("sim-riads" + suffix);
    var sliderScans = document.getElementById("sim-scans" + suffix);
    var sliderMargin = document.getElementById("sim-margin" + suffix);

    var valRiads = document.getElementById("val-riads" + suffix);
    var valScans = document.getElementById("val-scans" + suffix);
    var valMargin = document.getElementById("val-margin" + suffix);

    var kpiVol = document.getElementById("kpi-vol" + suffix);
    var kpiGross = document.getElementById("kpi-gross" + suffix);
    var kpiGrossMad = document.getElementById(lang === "fr" ? "kpi-gross-mad-fr" : "kpi-gross-mad-en");
    var kpiNet = document.getElementById("kpi-net" + suffix);
    var kpiPayoff = document.getElementById("kpi-payoff" + suffix);
    var kpiPayoffSub = document.getElementById(lang === "fr" ? "kpi-payoff-sub-fr" : "kpi-payoff-sub-en");

    if (!sliderRiads || !sliderScans || !sliderMargin) return;

    function recalculate() {
      var riads = parseInt(sliderRiads.value, 10);
      var scans = parseFloat(sliderScans.value);
      var margin = parseFloat(sliderMargin.value);

      if (valRiads) valRiads.textContent = riads + " riads";
      if (valScans) valScans.textContent = scans + (lang === "fr" ? " scans/jour" : " scans/day");
      if (valMargin) valMargin.textContent = "$" + margin.toFixed(margin % 1 === 0 ? 0 : 2) + " (~" + Math.round(margin * 10.5) + " MAD)";

      var monthlyScans = Math.round(riads * scans * 30);
      var monthlyBookings = Math.round(monthlyScans * 0.18);
      var gross = Math.round(monthlyBookings * margin);
      var net = gross - 515;
      var devCost = 5600;

      if (kpiVol) {
        kpiVol.textContent = monthlyScans.toLocaleString() + " scans · " + monthlyBookings.toLocaleString() + (lang === "fr" ? " résas" : " bookings");
      }
      if (kpiGross) {
        kpiGross.textContent = "$" + gross.toLocaleString() + (lang === "fr" ? " / mois" : " / mo");
      }
      if (kpiGrossMad) {
        kpiGrossMad.textContent = "~" + Math.round(gross * 10.5).toLocaleString() + " MAD" + (lang === "fr" ? " / mois" : " / mo");
      }
      if (kpiNet) {
        if (net >= 0) {
          kpiNet.textContent = "+$" + net.toLocaleString() + (lang === "fr" ? " / mois" : " / mo");
          kpiNet.className = "kpi-val positive";
          kpiNet.style.color = "";
        } else {
          kpiNet.textContent = "-$" + Math.abs(net).toLocaleString() + (lang === "fr" ? " / mois" : " / mo");
          kpiNet.className = "kpi-val";
          kpiNet.style.color = "#DC2626";
        }
      }
      if (kpiPayoff) {
        if (net > 0) {
          var months = devCost / net;
          if (months <= 1.5) {
            var weeks = Math.max(1, Math.round(months * 4.33));
            kpiPayoff.textContent = "~" + weeks + (lang === "fr" ? " semaines" : " weeks");
          } else {
            kpiPayoff.textContent = "~" + months.toFixed(1) + (lang === "fr" ? " mois" : " months");
          }
          if (kpiPayoffSub) {
            kpiPayoffSub.textContent = lang === "fr" ? "Remboursement intégral des 5 600 $ de dev." : "Recovers $5,600 initial dev investment";
          }
        } else {
          kpiPayoff.textContent = lang === "fr" ? "Seuil non atteint" : "Break-even not reached";
          if (kpiPayoffSub) {
            kpiPayoffSub.textContent = lang === "fr" ? "Volume insuffisant pour couvrir les 515 $/mois" : "Volume insufficient to cover $515/mo running costs";
          }
        }
      }
    }

    sliderRiads.addEventListener("input", recalculate);
    sliderScans.addEventListener("input", recalculate);
    sliderMargin.addEventListener("input", recalculate);
    recalculate();
  }
  setupRoiSimulator("en");
  setupRoiSimulator("fr");

  // Voice note mockup audio simulation
  document.querySelectorAll(".btn-voice-play").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var mockup = btn.closest(".voice-note-mockup");
      if (!mockup) return;
      var waveform = mockup.querySelector(".voice-waveform");
      var playIcon = btn.querySelector(".v-play");
      var pauseIcon = btn.querySelector(".v-pause");
      var timer = mockup.querySelector(".voice-timer");
      var isPlaying = mockup.getAttribute("data-playing") === "true";

      if (isPlaying) {
        mockup.setAttribute("data-playing", "false");
        if (waveform) waveform.classList.remove("playing");
        if (playIcon) playIcon.style.display = "";
        if (pauseIcon) pauseIcon.style.display = "none";
        if (mockup._interval) clearInterval(mockup._interval);
        if (timer) timer.textContent = "0:14";
      } else {
        mockup.setAttribute("data-playing", "true");
        if (waveform) waveform.classList.add("playing");
        if (playIcon) playIcon.style.display = "none";
        if (pauseIcon) pauseIcon.style.display = "";
        var sec = 14;
        if (mockup._interval) clearInterval(mockup._interval);
        mockup._interval = setInterval(function() {
          sec--;
          if (timer) timer.textContent = "0:" + (sec < 10 ? "0" + sec : sec);
          if (sec <= 0) {
            clearInterval(mockup._interval);
            mockup.setAttribute("data-playing", "false");
            if (waveform) waveform.classList.remove("playing");
            if (playIcon) playIcon.style.display = "";
            if (pauseIcon) pauseIcon.style.display = "none";
            if (timer) timer.textContent = "0:14";
          }
        }, 1000);
      }
    });
  });

  // Replay conversation simulation
  function setupChatReplay(lang) {
    var btn = document.getElementById("btn-replay-" + lang);
    if (!btn) return;
    var threadEl = document.querySelector(".sheet.lang-" + lang + " .thread");
    if (!threadEl) return;
    var turns = threadEl.querySelectorAll(".turn");

    btn.addEventListener("click", function() {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.style.opacity = "0.6";

      turns.forEach(function(t) {
        t.style.opacity = "0";
        t.style.transform = "translateY(12px)";
        t.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      });

      var i = 0;
      function showNextTurn() {
        if (i < turns.length) {
          turns[i].style.opacity = "1";
          turns[i].style.transform = "translateY(0)";
          turns[i].scrollIntoView({ behavior: "smooth", block: "nearest" });
          i++;
          setTimeout(showNextTurn, 900);
        } else {
          btn.disabled = false;
          btn.style.opacity = "1";
        }
      }
      setTimeout(showNextTurn, 300);
    });
  }
  setupChatReplay("en");
  setupChatReplay("fr");

  function handleHash() {
    var hash = window.location.hash;
    if (!hash) return;
    var lang = document.documentElement.getAttribute("data-lang") || "en";
    var cleanId = hash.replace(/^#/, "").replace(/-fr$/, "").replace(/-en$/, "");
    var targetId = lang === "fr" ? cleanId + "-fr" : cleanId;
    var targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  window.addEventListener("hashchange", handleHash);
})();
</script>
</body>
</html>
"""

final_html = template.replace("__COMBINED_CSS__", combined_css)
final_html = final_html.replace("__EN_SHEET_INNER__", en_sheet_inner)
final_html = final_html.replace("__FR_SHEET_INNER__", fr_sheet_inner)

dest_file = "public/proposals/ballroom-mvp.html"
with open(dest_file, "w", encoding="utf-8") as f:
    f.write(final_html)

dest_file2 = "public/proposals/concierge-whatsapp-mvp.html"
with open(dest_file2, "w", encoding="utf-8") as f:
    f.write(final_html)

print(f"Generated bilingual HTML saved to {dest_file} and {dest_file2}. Size: {len(final_html)} bytes.")
