// ── NAV ──
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

// ── HAMBURGER ──
const ham = document.getElementById('ham');
const mob = document.getElementById('mobMenu');
ham.addEventListener('click', () => { ham.classList.toggle('open'); mob.classList.toggle('open'); });
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => { ham.classList.remove('open'); mob.classList.remove('open'); }));

// ── REVEAL ──
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ── COUNTER ──
function animCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  let start = null;
  const dur = 1800;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); cio.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// ── QCM ──
// ⚠️ Tes credentials Supabase configurés
const SUPABASE_URL = "https://ruaoahmoenjsudrrtprv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_F2QLHpzk0WLBh_lMXYjbvw_l3_2uS5k";

const answers = {};
let userEmail = '';
let userName = '';
const TOTAL = 9;

// Gestion sélection options
document.querySelectorAll('.qcm-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const q = opt.dataset.q;
    const v = opt.dataset.v;
    const isMulti = opt.closest('.qcm-options').classList.contains('multi');

    if (isMulti) {
      opt.classList.toggle('selected');
      const sel = [...document.querySelectorAll(`#opts-${q} .qcm-opt.selected`)].map(o => o.dataset.v);
      answers[`q${q}`] = sel;
      const btn = document.getElementById(`next-${q}`);
      if (btn) btn.disabled = sel.length === 0;
    } else {
      document.querySelectorAll(`#opts-${q} .qcm-opt`).forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      answers[`q${q}`] = v;
      const btn = document.getElementById(`next-${q}`);
      if (btn) btn.disabled = false;
    }
  });
});

function showStep(id) {
  document.querySelectorAll('.qcm-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`step-${id}`);
  if (el) { el.classList.add('active'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function startQCM() {
  userEmail = document.getElementById('qEmailInput').value.trim();
  userName  = document.getElementById('qNameInput').value.trim();
  if (!userEmail || !userEmail.includes('@')) {
    document.getElementById('qEmailInput').style.borderColor = '#f08070';
    document.getElementById('qEmailInput').focus();
    return;
  }
  document.getElementById('qEmailInput').style.borderColor = '';
  showStep(1);
}

function nextStep(n) { showStep(n); }
function prevStep(n) { showStep(n); }

async function submitQCM() {
  const openTxt = document.getElementById('openAnswer').value.trim();
  answers['q9_open'] = openTxt;

  const payload = {
    email: userEmail,
    name: userName || null,
    q1_domaine: answers.q1 || null,
    q2_difficulte: answers.q2 || null,
    q3_technologies: Array.isArray(answers.q3) ? answers.q3.join(' | ') : (answers.q3 || null),
    q4_priorite_ia: answers.q4 || null,
    q5_acces: answers.q5 || null,
    q6_surface: answers.q6 || null,
    q7_durabilite: answers.q7 || null,
    q8_modele_eco: answers.q8 || null,
    q9_suggestion: openTxt || null,
    source: 'technatura_site'
  };

  const btn = document.getElementById('submitQCM');
  btn.disabled = true;
  btn.textContent = 'Enregistrement…';

  try {
    // Vérification de sécurité pour éviter le plantage des animations si le CDN est manquant
    if (typeof supabase === 'undefined') {
      throw new Error("Le script CDN Supabase n'est pas chargé dans votre HTML.");
    }

    // Connexion via l'instance globale du CDN
    const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Insertion dans la table
    const { error } = await db.from('qcm_agriculture').insert([payload]);
    if (error) throw error;

    showStep('merci');
  } catch (err) {
    console.error('Supabase error:', err);
    btn.disabled = false;
    btn.textContent = 'Réessayer →';
    alert('Une erreur est survenue : ' + err.message);
  }
}