/**
 * MAIMOLAB V3 - SCRIPT.JS (v1.3)
 * Portail Navigation with Protocol-specific UI
 */

// --- DATA: CHAPTERS ---
const formulas = [];
const chapters = [
    { id: "s-placeholder-1", title: "À remplir...", subject: "svt", level: "2nde" },
    { id: "s-placeholder-2", title: "À remplir...", subject: "svt", level: "1ere" },
    { id: "s-placeholder-3", title: "À remplir...", subject: "svt", level: "term" }
];

// --- APP LOGIC (Navigation, Search, Modals) ---

// --- APP LOGIC (Navigation, Search, Modals) ---

let currentLevel = '1ere';
let currentSubject = 'schemes';
let currentChapterId = null;
let currentSearch = '';
let currentDefSearch = ''; // Recherche spécifique aux définitions
let currentView = 'home';

function render() {
    const homeView = document.getElementById('home-view');
    const appView = document.getElementById('app-view');
    const subjTabs = document.getElementById('subject-tabs-container');
    const defSearchWrap = document.getElementById('def-search-container');
    const backBtn = document.getElementById('back-btn');
    const viewTitle = document.getElementById('view-title');
    const levelLabel = document.getElementById('level-label');

    // Reset visibility
    homeView.classList.add('hidden');
    appView.classList.add('hidden');
    subjTabs.classList.add('hidden');
    defSearchWrap.classList.add('hidden');
    backBtn.classList.add('hidden');

    if (currentSearch.length > 0) {
        appView.classList.remove('hidden');
        backBtn.classList.remove('hidden');
        viewTitle.textContent = "Résultats";
        renderSearch();
    } else if (currentView === 'home') {
        homeView.classList.remove('hidden');
    } else if (currentView === 'chapters' || currentView === 'formulas') {
        appView.classList.remove('hidden');
        subjTabs.classList.remove('hidden');
        backBtn.classList.remove('hidden');

        viewTitle.textContent = currentLevel === '1ere' ? 'Première' : (currentLevel === 'term' ? 'Terminale' : 'Seconde');
        levelLabel.textContent = "SVT";

        if (currentSubject === 'schemes') {
            renderSchemes();
        } else {
            defSearchWrap.classList.remove('hidden'); // SHOW SEARCH BAR ONLY HERE
            renderDefinitions();
        }
    }

    if (window.MathJax) window.MathJax.typesetPromise();
    lucide.createIcons();
}

function renderChapters() {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';
    let filtered = chapters.filter(c => c.level === currentLevel);
    if (currentSubject !== 'all') filtered = filtered.filter(c => c.subject === currentSubject);
    filtered.forEach(c => {
        const div = document.createElement('div');
        div.className = 'chapter-card';
        div.innerHTML = `<div class="subj-dot ${c.subject}"></div><div class="card-info">${c.subject.toUpperCase()}</div><h3>${c.title}</h3>`;
        div.onclick = () => {
            currentChapterId = c.id;
            currentView = 'formulas';
            currentNav = 'schemes'; // Reset to schemes when entering
            updateNavTabs();
            render();
        };
        grid.appendChild(div);
    });
}

function renderSchemes() {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';
    // Filtrage par niveau (Seconde, 1ère, Terminale)
    const levelChapters = chapters.filter(c => c.level === currentLevel).map(c => c.id);
    formulas.filter(f => levelChapters.includes(f.chapterId)).forEach(f => grid.appendChild(createCard(f)));
}

function renderDefinitions() {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';

    // Ici on pourra ajouter des conditions par chapitre si besoin,
    // mais pour l'instant on affiche tout ce qui correspond au niveau.
    const levelChapters = chapters.filter(c => c.level === currentLevel).map(c => c.id);
    // On peut aussi imaginer un tableau global de définitions plus tard.
    let defs = [];

    // Les définitions par niveau seront ajoutées ici

    // Filtre de recherche spécifique aux définitions
    if (currentDefSearch) {
        const query = currentDefSearch.toLowerCase();
        defs = defs.filter(d => d.t.toLowerCase().includes(query) || d.d.toLowerCase().includes(query));
    }

    defs.forEach(def => {
        const div = document.createElement('div');
        div.className = 'formula-card definitions-style';
        div.innerHTML = `
            <span class="card-tag biology">DÉFINITION</span>
            <h3>${def.t}</h3>
            <p style="margin-top:1rem; line-height:1.6; color:var(--text-muted);">${def.d}</p>
        `;
        grid.appendChild(div);
    });
}

function renderSearch() {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';
    const results = formulas.filter(f => f.title.toLowerCase().includes(currentSearch.toLowerCase()));
    if (results.length === 0) {
        document.getElementById('no-results').classList.remove('hidden');
        return;
    }
    results.forEach(f => grid.appendChild(createCard(f)));
}

function updateNavTabs() {
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.nav === currentNav);
    });
}

function createCard(f) {
    const chapter = chapters.find(c => c.id === f.chapterId);
    const isProto = chapter.subject === 'protocoles';
    const div = document.createElement('div');
    div.className = `formula-card ${chapter.subject}`;
    div.dataset.id = f.id;

    const pillsHtml = f.units && !isProto ? f.units.split(',').map(u => {
        const txt = u.trim();
        const sym = txt.includes('[') ? txt.split('[')[0].trim() : (txt.includes('(') ? txt.split('(')[0].trim() : txt);
        const unit = txt.includes('(') ? txt.split('(')[1].split(')')[0] : '';
        if (!sym && !unit) return '';
        return `<div class="unit-pill"><span class="pill-sym">${sym}</span><span class="pill-arrow">↑</span><span class="pill-unit">${unit}</span></div>`;
    }).join('') : "";

    // Icônes personnalisées pour les protocoles
    let protoIcon = "beaker";
    if (f.id === "pe-etalon-1") protoIcon = "bar-chart-3"; // Étalonnage
    else if (f.id === "proto-dissol") protoIcon = "droplets"; // Dissolution
    else if (f.id === "proto-dilut") protoIcon = "test-tubes"; // Dilution
    else if (f.id === "proto-titrage") protoIcon = "flask-conical"; // Titrage

    div.innerHTML = `
        <span class="card-tag ${chapter.subject}">${chapter.subject.toUpperCase()}</span>
        <h3>${f.title}</h3>
        <div class="card-eqn">
            ${isProto ? `
                <div class="proto-icon-wrapper">
                    <i data-lucide="${protoIcon}" class="proto-svg"></i>
                </div>
            ` : `\\[ ${f.formula} \\]`}
        </div>
        <div class="bottom-legend-area">${isProto ? "" : pillsHtml}</div>
        <div class="card-footer"><span>${isProto ? 'Voir le protocole' : 'Voir détails'}</span><i data-lucide="arrow-right"></i></div>
    `;
    div.onclick = () => openModal(f);
    return div;
}

function openModal(f) {
    const chapter = chapters.find(c => c.id === f.chapterId);
    const isProto = chapter.subject === 'protocoles';

    document.querySelector('.modal-tabs').style.display = isProto ? 'none' : 'flex';
    document.getElementById('tab-eqn').style.display = isProto ? 'none' : 'block';
    document.querySelector('.tab-trigger[data-tab="def"]').style.display = isProto ? 'none' : 'block';

    document.getElementById('modal-title').textContent = f.title;
    document.getElementById('modal-tag').textContent = `${chapter.subject.toUpperCase()} • ${chapter.level}`;
    document.getElementById('modal-tag').className = `modal-badge ${chapter.subject}`;

    // Parse units into nice grid layout
    let unitsHtml = "—";
    if (f.units && !isProto) {
        unitsHtml = '<div class="modal-units-grid">';
        f.units.split(',').forEach(u => {
            const txt = u.trim();
            if (!txt) return;

            let sym = txt;
            if (txt.includes('[')) sym = txt.split('[')[0].trim();
            else if (txt.includes('(')) sym = txt.split('(')[0].trim();

            let name = "";
            if (txt.includes('[')) name = txt.split('[')[1].split(']')[0].trim();

            let unit = "";
            if (txt.includes('(')) unit = txt.split('(')[1].split(')')[0].trim();

            if (sym || name || unit) {
                unitsHtml += `
                    <div class="modal-unit-item">
                        <span class="mu-sym">${sym}</span>
                        <span class="mu-details">
                            <span class="mu-name">${name ? ' = ' + name : ''}</span>
                            <span class="mu-unit">${unit ? '(' + unit + ')' : ''}</span>
                        </span>
                    </div>
                `;
            }
        });
        unitsHtml += '</div>';
    }

    document.getElementById('modal-units').innerHTML = unitsHtml;

    document.getElementById('modal-def').textContent = f.definition;
    document.getElementById('modal-prop').textContent = f.properties;
    document.getElementById('math-box').innerHTML = f.formula ? `\\[ ${f.formula} \\]` : "";

    if (isProto) {
        switchTab('def');
    } else {
        switchTab('eqn');
    }

    document.getElementById('modal-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (window.MathJax) window.MathJax.typesetPromise();
    lucide.createIcons();
}

function switchTab(id) {
    document.querySelectorAll('.tab-trigger').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    document.querySelectorAll('.tab-panel').forEach(p => {
        const isActive = p.id === `tab-${id}`;
        p.classList.toggle('active', isActive);
        p.style.display = isActive ? 'block' : 'none';
    });
}

function selectLevel(lvl) {
    currentLevel = lvl;
    currentView = 'chapters';
    currentSubject = 'schemes'; // Par défaut sur Schémas
    updateSubTabs();
    render();
}

function updateSubTabs() {
    document.querySelectorAll('.sub-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.subject === currentSubject);
    });
}
function goBack() {
    if (currentSearch) {
        currentSearch = '';
        document.getElementById('main-search').value = '';
    } else if (currentView === 'formulas') {
        const chapter = chapters.find(c => c.id === currentChapterId);
        if (chapter && chapter.subject === 'protocoles') {
            currentSubject = 'all'; // réinitialiser l'onglet sur "Tous" pour éviter la carte isolée
            document.querySelectorAll('.sub-tab').forEach(x => {
                x.classList.toggle('active', x.dataset.subject === 'all');
            });
        }
        currentView = 'chapters';
    } else {
        currentView = 'home';
    }
    render();
}

// Event Listeners
document.getElementById('back-btn').onclick = goBack;
document.querySelectorAll('.sub-tab').forEach(t => t.onclick = () => {
    currentSubject = t.dataset.subject;
    updateSubTabs();
    render();
});
document.querySelectorAll('.tab-trigger').forEach(t => t.onclick = () => switchTab(t.dataset.tab));
document.querySelectorAll('.nav-tab').forEach(t => t.onclick = () => {
    currentNav = t.dataset.nav;
    updateNavTabs();
    render();
});
// Start
render();
if (document.getElementById('main-search')) {
    document.getElementById('main-search').oninput = (e) => { currentSearch = e.target.value; render(); };
}
if (document.getElementById('def-search')) {
    document.getElementById('def-search').oninput = (e) => { currentDefSearch = e.target.value; render(); };
}
document.querySelector('.modal-close').onclick = () => {
    document.getElementById('modal-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
};
window.onclick = (e) => {
    if (e.target === document.getElementById('modal-overlay')) {
        document.getElementById('modal-overlay').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

document.getElementById('count-num').textContent = formulas.length;
render();
