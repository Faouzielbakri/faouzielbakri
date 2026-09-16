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

# Terminology: Next.js backend architecture instead of generic Node.js
en_sheet_inner = en_sheet_inner.replace("<td>Node.js (TypeScript), REST API and webhooks</td>", "<td>Next.js (TypeScript), REST API and webhooks</td>")
fr_sheet_inner = fr_sheet_inner.replace("<td>Node.js (TypeScript), API REST et webhooks</td>", "<td>Next.js (TypeScript), API REST et webhooks</td>")

# --- FEATURE 1: Reading Time in Cover Meta ---
en_sheet_inner = en_sheet_inner.replace(
    "<div><span>Valid for</span><b>30 days</b></div>",
    "<div><span>Valid for</span><b>30 days</b></div>\n    <div><span>Reading time</span><b>⏱️ ~7 min · 17 sections</b></div>"
)
fr_sheet_inner = fr_sheet_inner.replace(
    "<div><span>Validité</span><b>30 jours</b></div>",
    "<div><span>Validité</span><b>30 jours</b></div>\n    <div><span>Temps de lecture</span><b>⏱️ ~7 min · 17 sections</b></div>"
)

# --- FEATURE 1B: Executive Audio Briefing Player ---
audio_card_en = """<div class="audio-brief-card" id="audio-card-en" role="region" aria-label="Executive Audio Walkthrough">
  <div class="audio-card-inner">
    <div class="audio-top-bar">
      <div class="audio-badge-group">
        <span class="audio-pill">
          <svg class="audio-badge-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
          Executive Audio Briefing
        </span>
        <span class="audio-duration-tag">⏱️ 19:50 · Complete Audio Walkthrough</span>
      </div>
      <div class="audio-chapters-pill">5 Chapters · Architecture, Financials &amp; Handover</div>
    </div>

    <div class="audio-caption">Listen on your commute · Full Proposal Walkthrough</div>

    <div class="audio-controls-row">
      <button type="button" class="audio-play-btn" id="audio-play-btn-en" aria-label="Play executive audio briefing" title="Play / Pause">
        <svg class="icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
        <svg class="icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
      </button>

      <div class="audio-waveform-wrap" id="audio-waveform-en" role="slider" aria-label="Audio progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
        <svg class="audio-waveform-svg" viewBox="0 0 300 32" preserveAspectRatio="none">
          <defs>
            <clipPath id="wave-clip-en">
              <rect id="wave-clip-rect-en" x="0" y="0" width="0" height="32"></rect>
            </clipPath>
          </defs>
          <path class="wave-unplayed" d="M3,12.5 L3,19.5 M9,10.5 L9,21.5 M15,8.0 L15,24.0 M21,6.0 L21,26.0 M27,9.5 L27,22.5 M33,12.0 L33,20.0 M39,13.0 L39,19.0 M45,10.0 L45,22.0 M51,6.5 L51,25.5 M57,4.0 L57,28.0 M63,6.0 L63,26.0 M69,9.0 L69,23.0 M75,11.0 L75,21.0 M81,13.0 L81,19.0 M87,13.5 L87,18.5 M93,11.0 L93,21.0 M99,7.0 L99,25.0 M105,4.5 L105,27.5 M111,6.5 L111,25.5 M117,9.5 L117,22.5 M123,11.5 L123,20.5 M129,13.0 L129,19.0 M135,10.5 L135,21.5 M141,6.0 L141,26.0 M147,4.5 L147,27.5 M153,7.5 L153,24.5 M159,10.5 L159,21.5 M165,12.5 L165,19.5 M171,13.5 L171,18.5 M177,11.0 L177,21.0 M183,8.0 L183,24.0 M189,6.0 L189,26.0 M195,8.0 L195,24.0 M201,10.5 L201,21.5 M207,12.5 L207,19.5 M213,9.5 L213,22.5 M219,5.0 L219,27.0 M225,4.0 L225,28.0 M231,7.0 L231,25.0 M237,10.0 L237,22.0 M243,12.5 L243,19.5 M249,13.5 L249,18.5 M255,12.0 L255,20.0 M261,7.5 L261,24.5 M267,4.5 L267,27.5 M273,6.0 L273,26.0 M279,9.0 L279,23.0 M285,11.0 L285,21.0 M291,13.0 L291,19.0 M297,12.0 L297,20.0" fill="none"></path>
          <path class="wave-played" d="M3,12.5 L3,19.5 M9,10.5 L9,21.5 M15,8.0 L15,24.0 M21,6.0 L21,26.0 M27,9.5 L27,22.5 M33,12.0 L33,20.0 M39,13.0 L39,19.0 M45,10.0 L45,22.0 M51,6.5 L51,25.5 M57,4.0 L57,28.0 M63,6.0 L63,26.0 M69,9.0 L69,23.0 M75,11.0 L75,21.0 M81,13.0 L81,19.0 M87,13.5 L87,18.5 M93,11.0 L93,21.0 M99,7.0 L99,25.0 M105,4.5 L105,27.5 M111,6.5 L111,25.5 M117,9.5 L117,22.5 M123,11.5 L123,20.5 M129,13.0 L129,19.0 M135,10.5 L135,21.5 M141,6.0 L141,26.0 M147,4.5 L147,27.5 M153,7.5 L153,24.5 M159,10.5 L159,21.5 M165,12.5 L165,19.5 M171,13.5 L171,18.5 M177,11.0 L177,21.0 M183,8.0 L183,24.0 M189,6.0 L189,26.0 M195,8.0 L195,24.0 M201,10.5 L201,21.5 M207,12.5 L207,19.5 M213,9.5 L213,22.5 M219,5.0 L219,27.0 M225,4.0 L225,28.0 M231,7.0 L231,25.0 M237,10.0 L237,22.0 M243,12.5 L243,19.5 M249,13.5 L249,18.5 M255,12.0 L255,20.0 M261,7.5 L261,24.5 M267,4.5 L267,27.5 M273,6.0 L273,26.0 M279,9.0 L279,23.0 M285,11.0 L285,21.0 M291,13.0 L291,19.0 M297,12.0 L297,20.0" fill="none" clip-path="url(#wave-clip-en)"></path>
        </svg>
        <div class="audio-waveform-dot" id="wave-dot-en" style="left: 0%;"></div>
      </div>

      <button type="button" class="audio-speed-btn" id="audio-speed-btn-en" aria-label="Playback speed" title="Cycle playback speed">1.0x</button>
    </div>

    <div class="audio-sub-row">
      <span class="audio-time" id="audio-time-en">0:00 / 19:50</span>
    </div>

    <details class="audio-chapters-dropdown" id="audio-chapters-en">
      <summary class="audio-chapters-toggle">
        <span class="chapters-summary-text">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          Jump to Chapter (5 Chapters)
        </span>
        <svg class="chevron-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </summary>
      <div class="audio-chapters-grid">
        <button type="button" class="chapter-jump-btn" data-seek="0">
          <span class="chap-badge">0:00</span>
          <span class="chap-label">Ch. 1: Live Guest Experience &amp; WhatsApp Flow</span>
        </button>
        <button type="button" class="chapter-jump-btn" data-seek="250">
          <span class="chap-badge">4:10</span>
          <span class="chap-label">Ch. 2: Technical Architecture &amp; The n8n Trap</span>
        </button>
        <button type="button" class="chapter-jump-btn" data-seek="580">
          <span class="chap-badge">9:40</span>
          <span class="chap-label">Ch. 3: 8-Week Roadmap &amp; Deliverables</span>
        </button>
        <button type="button" class="chapter-jump-btn" data-seek="855">
          <span class="chap-badge">14:15</span>
          <span class="chap-label">Ch. 4: Financial Model, Unit Economics &amp; Break-Even</span>
        </button>
        <button type="button" class="chapter-jump-btn" data-seek="1055">
          <span class="chap-badge">17:35</span>
          <span class="chap-label">Ch. 5: Risk Matrix, IP Transfer &amp; Handover</span>
        </button>
      </div>
    </details>

    <audio id="audio-player-en" preload="metadata" src="../audio/Marrakech_WhatsApp_AI_Concierge_Technical_Blueprint.m4a">
      <source src="../audio/Marrakech_WhatsApp_AI_Concierge_Technical_Blueprint.m4a" type="audio/mp4">
      <source src="/audio/Marrakech_WhatsApp_AI_Concierge_Technical_Blueprint.m4a" type="audio/mp4">
      <source src="../audio/Marrakech_WhatsApp_AI_Concierge_Technical_Blueprint.m4a" type="audio/x-m4a">
      <source src="/audio/Marrakech_WhatsApp_AI_Concierge_Technical_Blueprint.m4a" type="audio/x-m4a">
    </audio>
  </div>
</div>"""

audio_card_fr = """<div class="audio-brief-card" id="audio-card-fr" role="region" aria-label="Briefing Audio Exécutif">
  <div class="audio-card-inner">
    <div class="audio-top-bar">
      <div class="audio-badge-group">
        <span class="audio-pill">
          <svg class="audio-badge-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
          Briefing Audio Exécutif
        </span>
        <span class="audio-duration-tag">⏱️ 11:32 · Synthèse audio complète</span>
      </div>
      <div class="audio-chapters-pill">5 Chapitres · Architecture, Chiffres &amp; Garanties</div>
    </div>

    <div class="audio-caption">À écouter sur votre trajet · Synthèse complète de la proposition</div>

    <div class="audio-controls-row">
      <button type="button" class="audio-play-btn" id="audio-play-btn-fr" aria-label="Écouter le briefing audio exécutif" title="Lecture / Pause">
        <svg class="icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
        <svg class="icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
      </button>

      <div class="audio-waveform-wrap" id="audio-waveform-fr" role="slider" aria-label="Progression audio" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
        <svg class="audio-waveform-svg" viewBox="0 0 300 32" preserveAspectRatio="none">
          <defs>
            <clipPath id="wave-clip-fr">
              <rect id="wave-clip-rect-fr" x="0" y="0" width="0" height="32"></rect>
            </clipPath>
          </defs>
          <path class="wave-unplayed" d="M3,12.5 L3,19.5 M9,10.5 L9,21.5 M15,8.0 L15,24.0 M21,6.0 L21,26.0 M27,9.5 L27,22.5 M33,12.0 L33,20.0 M39,13.0 L39,19.0 M45,10.0 L45,22.0 M51,6.5 L51,25.5 M57,4.0 L57,28.0 M63,6.0 L63,26.0 M69,9.0 L69,23.0 M75,11.0 L75,21.0 M81,13.0 L81,19.0 M87,13.5 L87,18.5 M93,11.0 L93,21.0 M99,7.0 L99,25.0 M105,4.5 L105,27.5 M111,6.5 L111,25.5 M117,9.5 L117,22.5 M123,11.5 L123,20.5 M129,13.0 L129,19.0 M135,10.5 L135,21.5 M141,6.0 L141,26.0 M147,4.5 L147,27.5 M153,7.5 L153,24.5 M159,10.5 L159,21.5 M165,12.5 L165,19.5 M171,13.5 L171,18.5 M177,11.0 L177,21.0 M183,8.0 L183,24.0 M189,6.0 L189,26.0 M195,8.0 L195,24.0 M201,10.5 L201,21.5 M207,12.5 L207,19.5 M213,9.5 L213,22.5 M219,5.0 L219,27.0 M225,4.0 L225,28.0 M231,7.0 L231,25.0 M237,10.0 L237,22.0 M243,12.5 L243,19.5 M249,13.5 L249,18.5 M255,12.0 L255,20.0 M261,7.5 L261,24.5 M267,4.5 L267,27.5 M273,6.0 L273,26.0 M279,9.0 L279,23.0 M285,11.0 L285,21.0 M291,13.0 L291,19.0 M297,12.0 L297,20.0" fill="none"></path>
          <path class="wave-played" d="M3,12.5 L3,19.5 M9,10.5 L9,21.5 M15,8.0 L15,24.0 M21,6.0 L21,26.0 M27,9.5 L27,22.5 M33,12.0 L33,20.0 M39,13.0 L39,19.0 M45,10.0 L45,22.0 M51,6.5 L51,25.5 M57,4.0 L57,28.0 M63,6.0 L63,26.0 M69,9.0 L69,23.0 M75,11.0 L75,21.0 M81,13.0 L81,19.0 M87,13.5 L87,18.5 M93,11.0 L93,21.0 M99,7.0 L99,25.0 M105,4.5 L105,27.5 M111,6.5 L111,25.5 M117,9.5 L117,22.5 M123,11.5 L123,20.5 M129,13.0 L129,19.0 M135,10.5 L135,21.5 M141,6.0 L141,26.0 M147,4.5 L147,27.5 M153,7.5 L153,24.5 M159,10.5 L159,21.5 M165,12.5 L165,19.5 M171,13.5 L171,18.5 M177,11.0 L177,21.0 M183,8.0 L183,24.0 M189,6.0 L189,26.0 M195,8.0 L195,24.0 M201,10.5 L201,21.5 M207,12.5 L207,19.5 M213,9.5 L213,22.5 M219,5.0 L219,27.0 M225,4.0 L225,28.0 M231,7.0 L231,25.0 M237,10.0 L237,22.0 M243,12.5 L243,19.5 M249,13.5 L249,18.5 M255,12.0 L255,20.0 M261,7.5 L261,24.5 M267,4.5 L267,27.5 M273,6.0 L273,26.0 M279,9.0 L279,23.0 M285,11.0 L285,21.0 M291,13.0 L291,19.0 M297,12.0 L297,20.0" fill="none" clip-path="url(#wave-clip-fr)"></path>
        </svg>
        <div class="audio-waveform-dot" id="wave-dot-fr" style="left: 0%;"></div>
      </div>

      <button type="button" class="audio-speed-btn" id="audio-speed-btn-fr" aria-label="Vitesse de lecture" title="Changer la vitesse">1.0x</button>
    </div>

    <div class="audio-sub-row">
      <span class="audio-time" id="audio-time-fr">0:00 / 11:32</span>
    </div>

    <details class="audio-chapters-dropdown" id="audio-chapters-fr">
      <summary class="audio-chapters-toggle">
        <span class="chapters-summary-text">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          Accéder aux chapitres (5 Chapitres)
        </span>
        <svg class="chevron-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </summary>
      <div class="audio-chapters-grid">
        <button type="button" class="chapter-jump-btn" data-seek="0">
          <span class="chap-badge">0:00</span>
          <span class="chap-label">Ch. 1 : Parcours voyageur &amp; Pilote WhatsApp</span>
        </button>
        <button type="button" class="chapter-jump-btn" data-seek="140">
          <span class="chap-badge">2:20</span>
          <span class="chap-label">Ch. 2 : Architecture technique &amp; Le piège n8n</span>
        </button>
        <button type="button" class="chapter-jump-btn" data-seek="340">
          <span class="chap-badge">5:40</span>
          <span class="chap-label">Ch. 3 : Planning 8 semaines &amp; Livrables</span>
        </button>
        <button type="button" class="chapter-jump-btn" data-seek="500">
          <span class="chap-badge">8:20</span>
          <span class="chap-label">Ch. 4 : Modèle financier, Rentabilité &amp; Seuil</span>
        </button>
        <button type="button" class="chapter-jump-btn" data-seek="615">
          <span class="chap-badge">10:15</span>
          <span class="chap-label">Ch. 5 : Risques, Transfert IP &amp; Transmission</span>
        </button>
      </div>
    </details>

    <audio id="audio-player-fr" preload="metadata" src="../audio/Concierge_IA_WhatsApp_pour_riads_de_Marrakech.m4a">
      <source src="../audio/Concierge_IA_WhatsApp_pour_riads_de_Marrakech.m4a" type="audio/mp4">
      <source src="/audio/Concierge_IA_WhatsApp_pour_riads_de_Marrakech.m4a" type="audio/mp4">
      <source src="../audio/Concierge_IA_WhatsApp_pour_riads_de_Marrakech.m4a" type="audio/x-m4a">
      <source src="/audio/Concierge_IA_WhatsApp_pour_riads_de_Marrakech.m4a" type="audio/x-m4a">
    </audio>
  </div>
</div>"""

en_sheet_inner = en_sheet_inner.replace(
    '  </div>\n  <p class="confidential">',
    '  </div>\n\n' + audio_card_en + '\n\n  <p class="confidential">',
    1
)
fr_sheet_inner = fr_sheet_inner.replace(
    '  </div>\n  <p class="confidential">',
    '  </div>\n\n' + audio_card_fr + '\n\n  <p class="confidential">',
    1
)

# --- FEATURE 2: Section 0 Chat Replay Toolbar ---
replay_bar_en = """<div class="chat-replay-bar" role="toolbar" aria-label="Conversation simulation">
  <div class="replay-info">
    <span class="replay-badge">Interactive Demo</span>
    <span class="replay-desc">Simulate the 5-step pilot flow: guest WhatsApp request → AI structured extraction → real-time supplier query → confirmed booking.</span>
  </div>
  <button type="button" class="btn-replay" id="btn-replay-en" aria-label="Simulate Live Exchange">
    <svg class="play-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    <span>Simulate Live Exchange</span>
  </button>
</div>
<div class="thread">"""

replay_bar_fr = """<div class="chat-replay-bar" role="toolbar" aria-label="Simulation de l'échange">
  <div class="replay-info">
    <span class="replay-badge">Démonstration interactive</span>
    <span class="replay-desc">Simulez le flux pilote en 5 étapes : demande voyageur → extraction IA → consultation prestataires → confirmation.</span>
  </div>
  <button type="button" class="btn-replay" id="btn-replay-fr" aria-label="Simuler l'échange en direct">
    <svg class="play-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    <span>Simuler l'échange en direct</span>
  </button>
</div>
<div class="thread">"""

en_sheet_inner = en_sheet_inner.replace('<div class="thread">', replay_bar_en, 1)
fr_sheet_inner = fr_sheet_inner.replace('<div class="thread">', replay_bar_fr, 1)

# --- FEATURE 3: Section 10 Interactive Payback & ROI Simulator ---
sim_html_en = """<div class="roi-simulator" id="roi-sim-en" role="region" aria-label="Interactive Revenue & Payback Simulator">
  <div class="sim-head">
    <div class="sim-badge-wrap">
      <span class="sim-badge">Live ROI Model</span>
    </div>
    <div class="sim-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      <span>Interactive Revenue &amp; Payback Simulator</span>
    </div>
    <p class="sim-sub">Model your pilot unit economics: partner riads, daily scan volume, commission per booking, and months to recover the $5,600 development investment.</p>
  </div>
  <div class="sim-grid">
    <div class="sim-inputs">
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-riads-en">Partner Riads</label>
          <span class="sim-num" id="val-riads-en">10 riads</span>
        </div>
        <input type="range" class="sim-slider" id="sim-riads-en" min="3" max="30" value="10" step="1">
        <div class="sim-ticks"><span>3</span><span>10 (Target)</span><span>20</span><span>30</span></div>
      </div>
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-scans-en">Daily Scans / Riad</label>
          <span class="sim-num" id="val-scans-en">3 scans/day</span>
        </div>
        <input type="range" class="sim-slider" id="sim-scans-en" min="1" max="10" value="3" step="0.5">
        <div class="sim-ticks"><span>1</span><span>3 (Realistic)</span><span>6</span><span>10</span></div>
      </div>
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-margin-en">Commission / Booking</label>
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
        <span class="kpi-label">Net Monthly Profit</span>
        <b class="kpi-val positive" id="kpi-net-en">+$1,024 / mo</b>
        <span class="kpi-sub">After -$515/mo running costs</span>
      </div>
      <div class="sim-kpi payoff-kpi">
        <span class="kpi-label">Development Amortization</span>
        <b class="kpi-val payoff" id="kpi-payoff-en">~5.5 months</b>
        <span class="kpi-sub" id="kpi-payoff-sub-en">Recovers $5,600 initial dev investment</span>
      </div>
    </div>
  </div>
</div>"""

sim_html_fr = """<div class="roi-simulator" id="roi-sim-fr" role="region" aria-label="Simulateur d'Amortissement & Rentabilité du Pilote">
  <div class="sim-head">
    <div class="sim-badge-wrap">
      <span class="sim-badge">Modèle Financier Direct</span>
    </div>
    <div class="sim-title">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      <span>Simulateur d'Amortissement &amp; Rentabilité du Pilote</span>
    </div>
    <p class="sim-sub">Modélisez la rentabilité du pilote : riads partenaires, scans quotidiens, commission par réservation et délai de retour sur investissement des 5 600 $.</p>
  </div>
  <div class="sim-grid">
    <div class="sim-inputs">
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-riads-fr">Riads partenaires</label>
          <span class="sim-num" id="val-riads-fr">10 riads</span>
        </div>
        <input type="range" class="sim-slider" id="sim-riads-fr" min="3" max="30" value="10" step="1">
        <div class="sim-ticks"><span>3</span><span>10 (Cible)</span><span>20</span><span>30</span></div>
      </div>
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-scans-fr">Scans / jour / riad</label>
          <span class="sim-num" id="val-scans-fr">3 scans/jour</span>
        </div>
        <input type="range" class="sim-slider" id="sim-scans-fr" min="1" max="10" value="3" step="0.5">
        <div class="sim-ticks"><span>1</span><span>3 (Réaliste)</span><span>6</span><span>10</span></div>
      </div>
      <div class="sim-row">
        <div class="sim-row-head">
          <label for="sim-margin-fr">Commission / réservation</label>
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
        <span class="kpi-sub">Conversion scan-résa ~18%</span>
      </div>
      <div class="sim-kpi">
        <span class="kpi-label">Marge Brute Mensuelle</span>
        <b class="kpi-val highlight" id="kpi-gross-fr">1 539 $/mois</b>
        <span class="kpi-sub" id="kpi-gross-mad-fr">~16 200 MAD / mois</span>
      </div>
      <div class="sim-kpi">
        <span class="kpi-label">Bénéfice Net Mensuel</span>
        <b class="kpi-val positive" id="kpi-net-fr">+1 024 $/mois</b>
        <span class="kpi-sub">Après déduction des 515 $/mois d'exploitation</span>
      </div>
      <div class="sim-kpi payoff-kpi">
        <span class="kpi-label">Amortissement du Développement</span>
        <b class="kpi-val payoff" id="kpi-payoff-fr">~5,5 mois</b>
        <span class="kpi-sub" id="kpi-payoff-sub-fr">Remboursement des 5 600 $ de dev.</span>
      </div>
    </div>
  </div>
</div>"""

roi_table_target = '<div class="table-wrap">\n<table style="margin-top:30px">'
en_sheet_inner = en_sheet_inner.replace(roi_table_target, f"{sim_html_en}\n{roi_table_target}", 1)
fr_sheet_inner = fr_sheet_inner.replace(roi_table_target, f"{sim_html_fr}\n{roi_table_target}", 1)

# --- FEATURE 4: Floating Kickoff Action Dock ---
action_dock_en = """<div class="action-dock action-deck lang-en" id="action-deck-en" role="region" aria-label="Kickoff">
  <div class="dock-inner">
    <div class="dock-info">
      <div class="dock-title-row">
        <span class="dock-badge">Marrakech Pilot</span>
        <h3 class="dock-title">Ready to launch?</h3>
      </div>
      <p class="dock-sub">8-week delivery upon kickoff · Immediate availability</p>
    </div>
    <div class="dock-actions">
      <a href="https://wa.me/212632323856?text=Hi%20Faouzi%2C%20we%20approve%20the%20Ballroom%20MVP%20proposal.%20Let%27s%20schedule%20the%20kickoff%20call." target="_blank" rel="noopener" class="btn-deck-primary">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"></path></svg>
        <span>Approve on WhatsApp</span>
      </a>
      <a href="mailto:faouzielbakri@gmail.com?subject=Approval%20-%20Ballroom%20MVP%20Proposal&amp;body=Hi%20Faouzi%2C%0A%0AWe%20would%20like%20to%20approve%20the%20Ballroom%20MVP%20proposal%20and%20schedule%20the%20kickoff." class="btn-deck-secondary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <span>Questions? Email</span>
      </a>
    </div>
  </div>
</div>"""

action_dock_fr = """<div class="action-dock action-deck lang-fr" id="action-deck-fr" role="region" aria-label="Lancement">
  <div class="dock-inner">
    <div class="dock-info">
      <div class="dock-title-row">
        <span class="dock-badge">Pilote Marrakech</span>
        <h3 class="dock-title">Prêt à démarrer ?</h3>
      </div>
      <p class="dock-sub">Livraison en 8 semaines · Disponibilité immédiate</p>
    </div>
    <div class="dock-actions">
      <a href="https://wa.me/212632323856?text=Bonjour%20Faouzi%2C%20nous%20validons%20la%20proposition%20technique%20%26%20financi%C3%A8re%20Ballroom%20MVP.%20Planifions%20le%20kickoff." target="_blank" rel="noopener" class="btn-deck-primary">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"></path></svg>
        <span>Valider sur WhatsApp</span>
      </a>
      <a href="mailto:faouzielbakri@gmail.com?subject=Validation%20Proposition%20Ballroom%20MVP&amp;body=Bonjour%20Faouzi%2C%0A%0ANous%20souhaitons%20valider%20la%20proposition%20Ballroom%20MVP%20et%20planifier%20le%20kickoff." class="btn-deck-secondary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <span>Une question ? Email</span>
      </a>
    </div>
  </div>
</div>"""

action_docks_html = f"{action_dock_en}\n{action_dock_fr}"

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

/* Executive Audio Briefing Player Card */
.audio-brief-card {
  margin: 24px 0 28px;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);
  border: 1px solid rgba(43, 71, 200, 0.16);
  border-radius: 14px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(16, 30, 46, 0.05), 0 1px 3px rgba(16, 30, 46, 0.03);
  font-family: var(--sans);
  position: relative;
  box-sizing: border-box;
}
.audio-brief-card:hover {
  border-color: rgba(43, 71, 200, 0.28);
}
.audio-card-inner {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.audio-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.audio-badge-group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.audio-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(43, 71, 200, 0.08);
  color: var(--indigo);
  border: 1px solid rgba(43, 71, 200, 0.16);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.audio-duration-tag {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}
.audio-chapters-pill {
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  background: #F1F5F9;
  border-radius: 6px;
  padding: 3px 9px;
}
.audio-caption {
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
  line-height: 1.4;
}
.audio-controls-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.audio-play-btn {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  background: var(--ink);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
  box-shadow: 0 4px 12px rgba(16, 30, 46, 0.18);
  flex-shrink: 0;
}
.audio-play-btn:hover {
  background: var(--indigo);
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(43, 71, 200, 0.32);
}
.audio-play-btn:active {
  transform: scale(0.95);
}
.audio-play-btn svg {
  display: block;
}
.audio-play-btn .icon-play {
  margin-left: 2px;
}
/* WhatsApp Voice Note Waveform Scrubber (Clean uncolored monochrome) */
.audio-waveform-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 32px;
  cursor: pointer;
  user-select: none;
  outline: none;
  display: flex;
  align-items: center;
}
.audio-waveform-svg {
  width: 100%;
  height: 100%;
  display: block;
}
.wave-unplayed {
  stroke: #CBD5E1;
  stroke-width: 3;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  transition: stroke 0.15s ease;
}
.audio-waveform-wrap:hover .wave-unplayed {
  stroke: #94A3B8;
}
.wave-played {
  stroke: var(--ink);
  stroke-width: 3;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
.audio-waveform-dot {
  position: absolute;
  top: 50%;
  width: 11px;
  height: 11px;
  background: var(--ink);
  border: 2px solid #FFFFFF;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 4px rgba(16, 30, 46, 0.35);
  pointer-events: none;
  transition: transform 0.12s ease, background 0.15s ease;
}
.audio-waveform-wrap:hover .audio-waveform-dot,
.audio-waveform-wrap:focus-visible .audio-waveform-dot {
  transform: translate(-50%, -50%) scale(1.25);
  background: var(--indigo);
}
.audio-speed-btn {
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 600;
  background: #F1F5F9;
  border: 1px solid var(--rule);
  color: var(--ink);
  border-radius: 6px;
  padding: 0 10px;
  height: 32px;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 44px;
  text-align: center;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.audio-speed-btn:hover {
  background: #E2E8F0;
  border-color: #CBD5E1;
  color: var(--indigo);
}
.audio-sub-row {
  display: flex;
  align-items: center;
  padding-left: 56px;
  margin-top: 2px;
  margin-bottom: 6px;
}
.audio-time {
  font-size: 11.5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 600;
  color: #64748B;
  white-space: nowrap;
}
.audio-chapters-dropdown {
  border-top: 1px solid rgba(229, 233, 238, 0.85);
  padding-top: 10px;
  margin-top: 2px;
}
.audio-chapters-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  user-select: none;
  list-style: none;
}
.audio-chapters-toggle::-webkit-details-marker {
  display: none;
}
.audio-chapters-toggle:hover {
  color: var(--indigo);
}
.chapters-summary-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.chevron-arrow {
  transition: transform 0.2s ease;
}
details[open] .chevron-arrow {
  transform: rotate(180deg);
}
.audio-chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 6px;
  margin-top: 10px;
}
.chapter-jump-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F8FAFC;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 6px;
  padding: 7px 10px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: var(--sans);
}
.chapter-jump-btn:hover {
  background: #EFF6FF;
  border-color: rgba(43, 71, 200, 0.35);
  transform: translateY(-1px);
}
.chapter-jump-btn.active {
  background: rgba(43, 71, 200, 0.08);
  border-color: var(--indigo);
}
.chap-badge {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  font-weight: 700;
  color: var(--indigo);
  background: #FFFFFF;
  border: 1px solid rgba(43, 71, 200, 0.2);
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
}
.chap-label {
  font-size: 11.5px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.35;
  white-space: normal;
}

/* Section 0: Chat Replay Toolbar */
.chat-replay-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(135deg, rgba(43, 71, 200, 0.04) 0%, rgba(99, 102, 241, 0.07) 100%);
  border: 1px solid rgba(43, 71, 200, 0.18);
  border-radius: 10px;
  padding: 12px 18px;
  margin: 20px 0 18px;
  font-family: var(--sans);
}
.replay-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.replay-badge {
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--indigo);
}
.replay-desc {
  font-family: var(--sans);
  font-size: 13px;
  color: var(--ink);
  line-height: 1.4;
}
.btn-replay {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--ink);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(16, 30, 46, 0.15);
  transition: all 0.18s ease;
}
.btn-replay:hover {
  background: var(--indigo);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(43, 71, 200, 0.28);
}
.btn-replay:active {
  transform: scale(0.98);
}

/* Section 10: Interactive ROI Simulator */
.roi-simulator {
  background: rgba(253, 253, 252, 0.94);
  border: 1px solid var(--rule);
  border-radius: 12px;
  padding: 24px 26px;
  margin: 28px 0 28px;
  box-shadow: 0 8px 32px rgba(16, 30, 46, 0.06);
}
.sim-head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 24px;
}
.sim-badge-wrap {
  display: flex;
  align-items: center;
}
.sim-badge {
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  background: rgba(43, 71, 200, 0.08);
  color: var(--indigo);
  border: 1px solid rgba(43, 71, 200, 0.16);
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.sim-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--sans);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  letter-spacing: -0.015em;
  line-height: 1.3;
  margin: 0;
  width: 100%;
}
.sim-title svg {
  color: var(--indigo);
  flex-shrink: 0;
}
.sim-sub {
  font-family: var(--sans);
  font-size: 13.5px;
  color: var(--muted);
  margin: 0;
  line-height: 1.55;
  width: 100%;
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

/* Floating Bottom Kickoff Action Pill Dock */
.action-dock {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(120px);
  width: calc(100% - 48px);
  max-width: 980px;
  background: rgba(253, 253, 252, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--rule);
  border-radius: 999px;
  box-shadow: 0 16px 40px rgba(16, 30, 46, 0.12), 0 2px 8px rgba(16, 30, 46, 0.04);
  padding: 10px 22px;
  box-sizing: border-box;
  z-index: 9998;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, box-shadow 0.3s ease;
}

.action-dock.visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  pointer-events: auto;
}

@keyframes dockPulse {
  0% { box-shadow: 0 16px 40px rgba(16, 30, 46, 0.12); }
  50% { box-shadow: 0 18px 48px rgba(43, 71, 200, 0.30), 0 0 0 2px var(--indigo); transform: translateX(-50%) scale(1.012); }
  100% { box-shadow: 0 16px 40px rgba(16, 30, 46, 0.12); transform: translateX(-50%) scale(1); }
}
.action-dock.pulse-highlight {
  animation: dockPulse 0.8s ease;
}

.dock-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}

.dock-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.dock-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dock-badge {
  font-family: var(--sans);
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--indigo);
  background: rgba(43, 71, 200, 0.08);
  border: 1px solid rgba(43, 71, 200, 0.16);
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.dock-title {
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15.5px;
  font-weight: 600;
  margin: 0;
  line-height: 1.25;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.dock-sub {
  color: var(--muted);
  font-family: var(--sans);
  font-size: 12.5px;
  margin: 0;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dock-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.btn-deck-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--ink);
  color: #FFFFFF;
  border: 1px solid transparent;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 2px 10px rgba(16, 30, 46, 0.16);
  white-space: nowrap;
  transition: all 0.18s ease;
}

.btn-deck-primary svg {
  color: #25D366;
  flex-shrink: 0;
}

.btn-deck-primary:hover {
  background: var(--indigo);
  color: #FFFFFF;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(43, 71, 200, 0.32);
}

.btn-deck-secondary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(253, 253, 252, 0.7);
  color: var(--ink);
  border: 1px solid var(--rule);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
  padding: 9px 16px;
  border-radius: 999px;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.18s ease;
}

.btn-deck-secondary:hover {
  background: #FFFFFF;
  border-color: rgba(16, 30, 46, 0.38);
  color: var(--ink);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 30, 46, 0.08);
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
  left: 0;
  right: auto;
  width: 260px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  box-sizing: border-box;
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
  transform-origin: top left;
  animation: jumpDropIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  scrollbar-width: thin;
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
  gap: 2px;
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
  padding: 6px 16px;
  min-width: 44px;
  text-align: center;
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
html[data-lang="en"] .sheet.lang-fr,
html[data-lang="en"] .action-dock.lang-fr {
  display: none !important;
}
html[data-lang="fr"] .sheet.lang-en,
html[data-lang="fr"] .action-dock.lang-en {
  display: none !important;
}

/* Extra sheet padding at bottom for hovering action dock */
.sheet {
  padding-bottom: 140px;
}

/* Mobile Responsiveness (< 640px) */
@media (max-width: 640px) {
  body {
    font-size: 16px;
    line-height: 1.6;
  }
  .sheet {
    padding: 0 18px 140px;
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
    padding: 3px;
    gap: 3px;
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
    padding: 6px 15px;
    font-size: 12.5px;
    font-weight: 700;
    min-width: 42px;
    text-align: center;
  }
  .brandline {
    padding-right: 0;
  }
  .bubble {
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  .audio-brief-card {
    padding: 14px 14px;
    margin: 20px 0 24px;
  }
  .audio-top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .audio-caption {
    font-size: 12.5px;
    margin-bottom: 8px;
  }
  .audio-controls-row {
    gap: 10px;
  }
  .audio-play-btn {
    width: 38px;
    height: 38px;
    min-width: 38px;
  }
  .audio-speed-btn {
    font-size: 11px;
    height: 28px;
    min-width: 38px;
    padding: 0 8px;
  }
  .audio-sub-row {
    padding-left: 48px;
    margin-top: 2px;
    margin-bottom: 4px;
  }
  .audio-time {
    font-size: 11px;
  }
  .audio-chapters-grid {
    grid-template-columns: 1fr;
  }
  .chat-replay-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 14px;
  }
  .btn-replay {
    width: 100%;
    justify-content: center;
  }
  .roi-simulator {
    padding: 18px 16px;
  }
  .sim-head {
    gap: 7px;
    padding-bottom: 16px;
    margin-bottom: 18px;
  }
  .sim-title {
    font-size: 16px;
    line-height: 1.35;
  }
  .sim-sub {
    font-size: 12.5px;
    line-height: 1.5;
  }
  .sim-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .sim-outputs {
    grid-template-columns: 1fr;
  }
  .action-dock {
    bottom: 12px;
    width: calc(100% - 20px);
    border-radius: 18px;
    padding: 12px 14px;
    background: rgba(253, 253, 252, 0.98);
  }
  .dock-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .dock-info {
    text-align: left;
  }
  .dock-title {
    font-size: 14.5px;
  }
  .dock-sub {
    font-size: 12px;
  }
  .dock-actions {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 8px;
    width: 100%;
  }
  .btn-deck-primary,
  .btn-deck-secondary {
    padding: 8px 10px;
    font-size: 12px;
    justify-content: center;
    border-radius: 999px;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
  .jump-dropdown {
    position: fixed;
    top: 48px;
    right: 12px;
    left: auto;
    width: 270px;
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 65px);
    transform-origin: top right;
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
  .roi-simulator,
  .action-dock,
  .action-deck,
  #action-deck-en,
  #action-deck-fr,
  .audio-brief-card {
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

<!-- FLOATING KICKOFF ACTION DOCK -->
__ACTION_DOCKS__

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
    var isPastIntro = window.scrollY > 400;
    document.querySelectorAll(".action-dock").forEach(function(dock) {
      if (isPastIntro) dock.classList.add("visible");
      else dock.classList.remove("visible");
    });
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
    a.addEventListener("click", function(e) {
      closeJumpMenu();
      var sec = a.getAttribute("data-jump-sec");
      if (sec === "action-deck") {
        e.preventDefault();
        var curLang = document.documentElement.getAttribute("data-lang") || "en";
        var dock = document.getElementById("action-deck-" + curLang);
        if (dock) {
          dock.classList.add("visible");
          dock.classList.remove("pulse-highlight");
          void dock.offsetWidth;
          dock.classList.add("pulse-highlight");
        }
        var signoff = document.querySelector(".sheet.lang-" + curLang + " .signoff");
        if (signoff) {
          signoff.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
      }
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
      var audioEn = document.getElementById("audio-player-en");
      if (audioEn && !audioEn.paused) audioEn.pause();
    } else {
      document.title = "AI Concierge on WhatsApp — Technical & Financial Proposal · Marrakech Pilot";
      var audioFr = document.getElementById("audio-player-fr");
      if (audioFr && !audioFr.paused) audioFr.pause();
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

  // Executive Audio Briefing Players
  function setupAudioPlayer(lang, defaultDuration) {
    var audio = document.getElementById("audio-player-" + lang);
    var playBtn = document.getElementById("audio-play-btn-" + lang);
    var timeDisplay = document.getElementById("audio-time-" + lang);
    var waveformWrap = document.getElementById("audio-waveform-" + lang);
    var clipRect = document.getElementById("wave-clip-rect-" + lang);
    var dot = document.getElementById("wave-dot-" + lang);
    var speedBtn = document.getElementById("audio-speed-btn-" + lang);
    var chapterBtns = document.querySelectorAll("#audio-card-" + lang + " .chapter-jump-btn");

    if (!audio || !playBtn) return;

    var speeds = [1.0, 1.25, 1.5, 1.75, 2.0];
    var speedLabels = { 1.0: "1.0x", 1.25: "1.25x", 1.5: "1.5x", 1.75: "1.75x", 2.0: "2.0x" };
    var currentSpeedIndex = 0;
    var isDragging = false;

    function formatTime(sec) {
      if (isNaN(sec) || !isFinite(sec)) return "0:00";
      var m = Math.floor(sec / 60);
      var s = Math.floor(sec % 60);
      return m + ":" + (s < 10 ? "0" : "") + s;
    }

    function getDuration() {
      return (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) ? audio.duration : defaultDuration;
    }

    function updatePlayButtonUI(isPlaying) {
      var iconPlay = playBtn.querySelector(".icon-play");
      var iconPause = playBtn.querySelector(".icon-pause");
      if (iconPlay && iconPause) {
        iconPlay.style.display = isPlaying ? "none" : "block";
        iconPause.style.display = isPlaying ? "block" : "none";
      }
      playBtn.setAttribute("aria-label", isPlaying ? (lang === "fr" ? "Pause du briefing audio" : "Pause audio briefing") : (lang === "fr" ? "Lecture du briefing audio" : "Play audio briefing"));
    }

    function updateProgressUI() {
      var dur = getDuration();
      var cur = audio.currentTime || 0;
      var pct = dur > 0 ? (cur / dur) * 100 : 0;
      if (pct > 100) pct = 100;
      if (clipRect) clipRect.setAttribute("width", (pct / 100) * 300);
      if (dot) dot.style.left = pct + "%";
      if (waveformWrap) waveformWrap.setAttribute("aria-valuenow", Math.round(pct));
      if (timeDisplay) timeDisplay.textContent = formatTime(cur) + " / " + formatTime(dur);

      if (chapterBtns.length > 0) {
        var activeBtn = null;
        for (var i = 0; i < chapterBtns.length; i++) {
          var seekVal = parseFloat(chapterBtns[i].getAttribute("data-seek")) || 0;
          if (cur >= seekVal) {
            activeBtn = chapterBtns[i];
          }
        }
        chapterBtns.forEach(function(b) { b.classList.remove("active"); });
        if (activeBtn) activeBtn.classList.add("active");
      }
    }

    function togglePlay() {
      var otherLang = lang === "fr" ? "en" : "fr";
      var otherAudio = document.getElementById("audio-player-" + otherLang);
      if (otherAudio && !otherAudio.paused) {
        otherAudio.pause();
      }

      if (audio.paused) {
        audio.play().then(function() {
          updatePlayButtonUI(true);
        }).catch(function() {
          updatePlayButtonUI(false);
        });
      } else {
        audio.pause();
        updatePlayButtonUI(false);
      }
    }

    playBtn.addEventListener("click", togglePlay);

    audio.addEventListener("play", function() { updatePlayButtonUI(true); });
    audio.addEventListener("pause", function() { updatePlayButtonUI(false); });
    audio.addEventListener("ended", function() {
      updatePlayButtonUI(false);
      audio.currentTime = 0;
      updateProgressUI();
    });
    audio.addEventListener("timeupdate", updateProgressUI);
    audio.addEventListener("loadedmetadata", updateProgressUI);

    audio.addEventListener("error", function() {
      var curSrc = audio.currentSrc || audio.src;
      if (curSrc && curSrc.indexOf("../audio/") !== -1) {
        audio.src = curSrc.replace("../audio/", "/audio/");
        audio.load();
      }
    });

    function seekFromEvent(e) {
      if (!waveformWrap) return;
      var rect = waveformWrap.getBoundingClientRect();
      var clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      var pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      var dur = getDuration();
      audio.currentTime = pos * dur;
      updateProgressUI();
    }

    if (waveformWrap) {
      waveformWrap.addEventListener("click", seekFromEvent);

      waveformWrap.addEventListener("mousedown", function(e) {
        isDragging = true;
        seekFromEvent(e);
      });
      document.addEventListener("mousemove", function(e) {
        if (isDragging) seekFromEvent(e);
      });
      document.addEventListener("mouseup", function() {
        isDragging = false;
      });

      waveformWrap.addEventListener("touchstart", function(e) {
        isDragging = true;
        seekFromEvent(e);
      }, { passive: true });
      document.addEventListener("touchmove", function(e) {
        if (isDragging) seekFromEvent(e);
      }, { passive: true });
      document.addEventListener("touchend", function() {
        isDragging = false;
      });

      waveformWrap.addEventListener("keydown", function(e) {
        var dur = getDuration();
        if (e.key === "ArrowRight") {
          e.preventDefault();
          audio.currentTime = Math.min(dur, audio.currentTime + 5);
          updateProgressUI();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          audio.currentTime = Math.max(0, audio.currentTime - 5);
          updateProgressUI();
        } else if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          togglePlay();
        }
      });
    }

    if (speedBtn) {
      speedBtn.addEventListener("click", function() {
        currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
        var newSpeed = speeds[currentSpeedIndex];
        audio.playbackRate = newSpeed;
        speedBtn.textContent = speedLabels[newSpeed] || (newSpeed + "x");
      });
    }

    chapterBtns.forEach(function(btn) {
      btn.addEventListener("click", function() {
        var seekTime = parseFloat(btn.getAttribute("data-seek")) || 0;
        audio.currentTime = seekTime;
        updateProgressUI();
        if (audio.paused) {
          audio.play().then(function() {
            updatePlayButtonUI(true);
          }).catch(function() {});
        }
      });
    });

    updateProgressUI();
  }
  setupAudioPlayer("en", 1190.8);
  setupAudioPlayer("fr", 691.8);

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
final_html = final_html.replace("__ACTION_DOCKS__", action_docks_html)

dest_file = "public/proposals/ballroom-mvp.html"
with open(dest_file, "w", encoding="utf-8") as f:
    f.write(final_html)

dest_file2 = "public/proposals/concierge-whatsapp-mvp.html"
with open(dest_file2, "w", encoding="utf-8") as f:
    f.write(final_html)

print(f"Generated bilingual HTML saved to {dest_file} and {dest_file2}. Size: {len(final_html)} bytes.")
