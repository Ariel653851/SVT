/**
 * MAIMOLAB V3 - SCRIPT.JS (v1.3)
 * Portail Navigation with Protocol-specific UI
 */

// --- DATA: CHAPTERS ---
const chapters = [];


// --- DATA: FORMULAS & PROTOCOLS ---
const formulas = [];

// --- APP LOGIC (Navigation, Search, Modals) ---

// --- APP LOGIC (Navigation, Search, Modals) ---

let currentLevel = '1ere'; // Default
let currentSubject = 'all';
let currentChapterId = null;
let currentSearch = '';
let currentView = 'home';
let currentNav = 'formulas'; // NEW: 'formulas' or 'definitions'

function render() {
    const homeView = document.getElementById('home-view');
    const appView = document.getElementById('app-view');
    const subjTabs = document.getElementById('subject-tabs-container');
    const chapTabs = document.getElementById('chapter-nav-tabs');
    const backBtn = document.getElementById('back-btn');
    const viewTitle = document.getElementById('view-title');
    const levelLabel = document.getElementById('level-label');

    // Reset visibility
    homeView.classList.add('hidden');
    appView.classList.add('hidden');
    subjTabs.classList.add('hidden');
    chapTabs.classList.add('hidden');
    backBtn.classList.add('hidden');

    if (currentSearch.length > 0) {
        appView.classList.remove('hidden');
        backBtn.classList.remove('hidden');
        viewTitle.textContent = "Résultats";
        renderSearch();
    } else if (currentView === 'home') {
        homeView.classList.remove('hidden');
    } else if (currentView === 'chapters') {
        appView.classList.remove('hidden');
        subjTabs.classList.remove('hidden');
        backBtn.classList.remove('hidden');
        viewTitle.textContent = "Chapitres";
        levelLabel.textContent = currentLevel === '1ere' ? 'Première' : (currentLevel === 'term' ? 'Terminale' : 'Seconde');
        renderChapters();
    } else if (currentView === 'formulas') {
        appView.classList.remove('hidden');
        const chapter = chapters.find(c => c.id === currentChapterId);
        
        // Show navigation tabs ONLY IF NOT A PROTOCOL
        const isProtoChapter = chapter && chapter.subject === 'protocoles';
        if (!isProtoChapter) {
            chapTabs.classList.remove('hidden');
        }

        backBtn.classList.remove('hidden');
        viewTitle.textContent = chapter ? chapter.title : "Détails";
        
        if (currentNav === 'formulas' || isProtoChapter) renderFormulas();
        else renderDefinitions();
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
            currentNav = 'formulas'; // Reset to formulas when entering
            updateNavTabs();
            render(); 
        };
        grid.appendChild(div);
    });
}

function renderFormulas() {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';
    formulas.filter(f => f.chapterId === currentChapterId).forEach(f => grid.appendChild(createCard(f)));
}

function renderDefinitions() {
    const grid = document.getElementById('grid-container');
    grid.innerHTML = '';
    
    // Custom definitions based on chapter
    let defs = [];
    if (currentChapterId === 'c-mol-1') {
        defs = [
            { t: "La Mole", d: "Unité de quantité de matière (symbole : mol) contenant exactement 6,022 x 10^23 entités élémentaires." },
            { t: "Masse Molaire (M)", d: "Masse d'une mole d'une substance donnée. Elle s'exprime en g/mol." },
            { t: "Concentration Molaire (C)", d: "Quantité de soluté (en mol) présente dans un litre de solution." },
            { t: "Dilution", d: "Opération consistant à ajouter du solvant à une solution pour en diminuer la concentration." }
        ];
    } else if (currentChapterId === 'c-redox-1') {
        defs = [
            { t: "Oxydant", d: "Espèce chimique capable de capter un ou plusieurs électrons." },
            { t: "Réducteur", d: "Espèce chimique capable de céder un ou plusieurs électrons." },
            { t: "Oxydation", d: "Réaction au cours de laquelle une espèce chimique perd des électrons (le réducteur est oxydé)." },
            { t: "Réduction", d: "Réaction au cours de laquelle une espèce chimique gagne des électrons (l'oxydant est réduit)." },
            { t: "Couple Oxydant / Réducteur", d: "Ensemble formé par l'oxydant et le réducteur qui passent de l'un à l'autre par gain ou perte d'électrons. On le note Ox / Red." }
        ];
    } else if (currentChapterId === 'p-optique-1') {
        defs = [
            { t: "Lentille Convergente", d: "Système optique qui dévie les rayons lumineux parallèles vers un point unique appelé foyer image." },
            { t: "Distance Focale (f')", d: "Distance entre le centre optique O de la lentille et le foyer image F'. Elle s'exprime en mètres." },
            { t: "Vergence", d: "Grandeur notée δ qui caractérise la capacité d'une lentille à faire converger la lumière. Elle est l'inverse de la distance focale." },
            { t: "Grandissement (γ)", d: "Rapport entre la taille de l'image et la taille de l'objet." }
        ];
    } else if (currentChapterId === 'p-ondes-1') {
        defs = [
            { t: "Onde Mécanique Progressive", d: "Une onde mécanique progressive est le phénomène de propagation d’une perturbation dans un milieu matériel sans transport de matière et avec transfert d’énergie." },
            { t: "Onde Sonore Périodique", d: "Une onde sonore périodique est le phénomène de propagation d’une succession de zones de compression-dilatation du milieu de propagation, créées par la vibration d’une source (haut-parleur, émetteur d’ultrasons) à la fréquence f." },
            { t: "Période (T)", d: "Plus petite durée au bout de laquelle le phénomène se répète à l'identique." },
            { t: "Fréquence (f)", d: "Nombre de motifs élémentaires (périodes) par seconde. f = 1/T." },
            { t: "Longueur d'onde (λ)", d: "Distance parcourue par l'onde pendant une période T." },
            { t: "Retard (τ)", d: "Durée mise par une onde pour aller d'un point M à un point M'." }
        ];
    } else if (currentChapterId === 'p-energie-1') {
        defs = [
            { t: "Énergie Cinétique (Ec)", d: "Énergie que possède un corps en raison de sa vitesse." },
            { t: "Énergie Potentielle (Ep)", d: "Énergie que possède un corps en fonction de sa position (ici son altitude)." },
            { t: "Énergie Mécanique (Em)", d: "Somme de l'énergie cinétique et de toutes les énergies potentielles du système." }
        ];
    } else if (currentChapterId === 'p-elec-1') {
        defs = [
            { t: "Intensité (I)", d: "Débit de charges électriques dans un circuit. Elle s'exprime en Ampères (A)." },
            { t: "Tension (U)", d: "Différence de potentiel entre deux points d'un circuit. Elle s'exprime en Volts (V)." },
            { t: "Effet Joule", d: "Dégagement de chaleur lors du passage d'un courant électrique dans un conducteur." }
        ];
    } else if (currentChapterId === 'c-dosage-1') {
        defs = [
            { t: "Dosage", d: "Action de déterminer la quantité de matière ou la concentration d'une espèce chimique dans une solution." },
            { t: "Titrage", d: "Dosage par une réaction chimique totale et rapide entre une espèce titrée et une espèce titrante." },
            { t: "Équivalence", d: "État du titrage où les réactifs ont été introduits dans les proportions stoechiométriques et sont totalement consommés." },
            { t: "Loi de Beer-Lambert", d: "L'absorbance A d'une solution est proportionnelle à sa concentration C. A = k x C." },
            { t: "Validité de Beer-Lambert", d: "La solution doit être diluée car la loi de Beer-Lambert n'est vérifiée que pour des concentrations inférieures à 1,0 x 10^-2 mol.L^-1." }
        ];
    } else {
        defs = [];
    }

    defs.forEach(def => {
        const div = document.createElement('div');
        div.className = 'formula-card definitions-style';
        div.innerHTML = `
            <span class="card-tag chemistry">DÉFINITION</span>
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
            if(!txt) return;
            
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

function selectLevel(lvl) { currentLevel = lvl; currentView = 'chapters'; render(); }
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
    document.querySelectorAll('.sub-tab').forEach(x => x.classList.remove('active')); 
    t.classList.add('active'); 
    currentSubject = t.dataset.subject; 
    
    // Si on clique sur l'onglet Protocoles, on affiche directement les protocoles !
    if (currentSubject === 'protocoles') {
        currentView = 'formulas';
        currentChapterId = 'proto-chimie-1';
        currentNav = 'formulas';
    }
    
    render(); 
});
document.querySelectorAll('.tab-trigger').forEach(t => t.onclick = () => switchTab(t.dataset.tab));
document.querySelectorAll('.nav-tab').forEach(t => t.onclick = () => {
    currentNav = t.dataset.nav;
    updateNavTabs();
    render();
});
document.getElementById('main-search').oninput = (e) => { currentSearch = e.target.value; render(); };
document.querySelector('.modal-close').onclick = () => {
    document.getElementById('modal-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
};

// Start
render();
document.getElementById('main-search').oninput = (e) => { currentSearch = e.target.value; render(); };
document.querySelector('.modal-close').onclick = () => { document.getElementById('modal-overlay').style.display = 'none'; document.body.style.overflow = 'auto'; };
window.onclick = (e) => { if (e.target === document.getElementById('modal-overlay')) { document.getElementById('modal-overlay').style.display = 'none'; document.body.style.overflow = 'auto'; } };

document.getElementById('count-num').textContent = formulas.length;
render();
