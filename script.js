const CONFIG = {
    MIN_CLUB_NAME_LENGTH: 3,
    MIN_PRESIDENT_NAME_LENGTH: 3,
    API_URL: "https://script.google.com/macros/s/AKfycbz1Qb-a5i5Dg7cq3Hidlvegy4PcBEjd5gSFajUp9VCy_DH_TsTSAcPK5sOg1cWEsMXu/exec",
    REVEAL_DURATION: 3000,
    ADMIN_KEY: 'CAMIIN2025',
    DEBUG: true
};

// 2. Definición de Imperios
const EMPIRES = [
    { name: "Imperio Romano", description: "Viste como un legionario con armadura, un senador con su toga y laureles, o un poderoso César. ¡Ave, Interact!", icon: "security" },
    { name: "Imperio Egipcio", description: "Adopta la majestuosidad de los faraones, reinas como Cleopatra, o los misteriosos dioses con cabezas de animales. El oro y el lino son tus aliados.", icon: "pyramid" },
    { name: "Reino Vikingo", description: "Conviértete en un explorador nórdico. Usa pieles, cuero, cascos y trenzas imponentes para mostrar tu furia y valentía.", icon: "sailing" },
    { name: "Imperio Azteca", description: "Luce como un guerrero águila o jaguar. Los penachos de plumas coloridas, el oro y los diseños geométricos definirán tu poder.", icon: "stadium" },
    { name: "Shogunato Japonés", description: "Elige tu camino: el honorable samurái con su armadura y katana, o la elegancia de una geisha con su kimono de seda.", icon: "castle" },
    { name: "Imperio Persa", description: "Viste con la opulencia de la realeza de Persépolis. Túnicas lujosas, joyas y la icónica guardia de los 'Inmortales' son tu inspiración.", icon: "shield_person" },
    { name: "Imperio Otomano", description: "Adopta la grandeza de los sultanes con turbantes, caftanes de seda y cimitarras. La elegancia de Estambul te espera.", icon: "fort" },
    { name: "Imperio Inca", description: "Representa al imperio del sol. Usa ponchos coloridos, ornamentos de oro y la simbología andina para honrar a Inti.", icon: "landscape" },
    { name: "Imperio Mongol", description: "Domina la estepa como un guerrero de la Horda Dorada. Gorros de piel, botas de cuero y arcos serán tus símbolos de conquista.", icon: "groups" },
    { name: "Imperio Bizantino", description: "La continuación de Roma con un toque oriental. El púrpura y el oro son tus colores. Mosaicos y símbolos religiosos adornarán tus túnicas.", icon: "church" },
    { name: "Civilización Espartana", description: "¡Esto es Esparta! La disciplina y la fuerza son tu disfraz. Capas rojas, cascos de bronce y el escudo con la letra lambda.", icon: "shield" },
    { name: "Dinastía China (Tang)", description: "La edad de oro de China. Viste elegantes túnicas de seda (hanfu), peinados elaborados y la mística del dragn imperial.", icon: "temple_buddhist" },
    { name: "Imperio Británico (Victoriano)", description: "Encarna la era de la exploración y la industria. Levitas, sombreros de copa, vestidos con corsé y un toque de 'steampunk'.", icon: "explore" },
    { name: "Reino de Malí", description: "Muestra la riqueza del imperio más próspero de África. Túnicas 'boubou' doradas, joyas de oro masivo y la grandeza del desierto.", icon: "diamond" },
    { name: "Reino Zulú", description: "La fuerza y el espíritu de un guerrero africano. Pieles de leopardo, coloridos abalorios y las icónicas lanzas 'assegai' y escudos.", icon: "sports_martial_arts" },
    { name: "Imperio Español (Siglo de Oro)", description: "Conviértete en un conquistador con armadura y morrión, o en un miembro de la corte con gorgueras y ropajes de terciopelo.", icon: "public" }
];
const GREEK_EMPIRE = { name: "Imperio Griego", description: "Cuna de la democracia, la filosofía occidental, los Juegos Olímpicos y el drama teatral.", icon: "account_balance" };
const HOST_CLUB = { clubName: "Interact Club Encarnación Norte", presidentName: "Juan Velázquez", empire: GREEK_EMPIRE, assignedAt: "2025-08-19T10:00:00.000Z", isHost: true };

// 3. Variables Globales
let elements = {};
let assignedEmpires = [];
let availableEmpires = [];
let isAdmin = false;

// --- Nueva API en lugar de Storage ---
const API = {
    fetchAssignments: async () => {
        try {
            const response = await fetch(CONFIG.API_URL);
            const data = await response.json();
            // Convertir datos de la hoja de cálculo a nuestro formato
            return data.map(item => ({
                clubName: item.club,
                presidentName: item.presidente,
                empire: EMPIRES.find(e => e.name === item.imperio) || GREEK_EMPIRE,
                assignedAt: item.fecha,
                isHost: item.anfitrion === 'TRUE'
            }));
        } catch (error) {
            console.error("Error al cargar asignaciones:", error);
            showNotification("No se pudo conectar con la base de datos.", "error");
            return [];
        }
    },
    addAssignment: async (assignment) => {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'add', data: assignment })
        });
        return response.json();
    },
    deleteAssignment: async (clubName) => {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', clubName: clubName })
        });
        return response.json();
    }
};

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === CONFIG.ADMIN_KEY) {
        isAdmin = true;
        document.body.classList.add('admin-mode');
    }

    initializeElements();
    setupEventListeners();
    await loadData();
}

function initializeElements() {
    elements = {
        welcomeSection: document.getElementById('welcome-section'),
        registrationSection: document.getElementById('registration-section'),
        resultSection: document.getElementById('result-section'),
        assignmentsSection: document.getElementById('assignments-section'),
        clubForm: document.getElementById('club-form'),
        clubNameInput: document.getElementById('club-name'),
        presidentNameInput: document.getElementById('president-name'),
        searchInput: document.getElementById('search-input'),
        startBtn: document.getElementById('start-btn'),
        backBtn: document.getElementById('back-btn'),
        backToHome: document.getElementById('back-to-home'),
        viewAllBtn: document.getElementById('view-all-btn'),
        viewAssignmentsBtn: document.getElementById('view-assignments-btn'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        exportBtn: document.getElementById('export-csv-btn'),
        notificationContainer: document.getElementById('notification-container'),
        assignedEmpire: document.getElementById('assigned-empire'),
        empireIcon: document.getElementById('empire-icon'),
        empireDescription: document.getElementById('empire-description'),
        resultClubName: document.getElementById('result-club-name'),
        resultPresidentName: document.getElementById('result-president-name'),
        assignmentDate: document.getElementById('assignment-date'),
        assignmentsList: document.getElementById('assignments-list'),
        previewAssignments: document.getElementById('preview-assignments'),
        emptyState: document.getElementById('empty-state'),
        liveTotal: document.getElementById('live-total'),
        liveRemaining: document.getElementById('live-remaining'),
        empireSpinnerContainer: document.getElementById('empire-spinner-container'),
        empireSpinner: document.getElementById('empire-spinner'),
        // Añadimos un loader para la carga inicial
        loader: document.createElement('div')
    };
    elements.loader.className = 'loader';
    elements.loader.textContent = 'Cargando datos...';
    document.body.appendChild(elements.loader);
}

function setupEventListeners() {
    // ... (sin cambios aquí)
    elements.startBtn?.addEventListener('click', () => showSection('registration'));
    elements.backBtn?.addEventListener('click', () => { showSection('welcome'); elements.clubForm?.reset(); });
    elements.backToHome?.addEventListener('click', () => showSection('welcome'));
    const viewAssignmentsHandler = () => { showAllAssignments(); showSection('assignments'); };
    elements.viewAllBtn?.addEventListener('click', viewAssignmentsHandler);
    elements.viewAssignmentsBtn?.addEventListener('click', viewAssignmentsHandler);
    elements.clubForm?.addEventListener('submit', handleFormSubmit);
    elements.searchInput?.addEventListener('input', debounce(handleSearch, 300));
    elements.filterButtons?.forEach(button => button.addEventListener('click', handleFilter));
    elements.exportBtn?.addEventListener('click', handleExportCsv);
    elements.assignmentsList?.addEventListener('click', async function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const clubNameToDelete = e.target.dataset.club;
            if (confirm(`¿Estás seguro de que quieres eliminar la asignación de "${clubNameToDelete}"?`)) {
                await deleteAssignment(clubNameToDelete);
            }
        }
    });
}

function showLoader(show) {
    elements.loader.style.display = show ? 'flex' : 'none';
}

async function loadData() {
    showLoader(true);
    assignedEmpires = await API.fetchAssignments();
    // Si la hoja está vacía, añadimos al anfitrión
    if (assignedEmpires.length === 0) {
        await API.addAssignment(HOST_CLUB);
        assignedEmpires.push(HOST_CLUB);
    }
    updateAvailableEmpires();
    updateUI();
    showLoader(false);
}

function updateUI() {
    updateAssignmentsStats();
    showPreviewAssignments();
}

function updateAvailableEmpires() {
    const assignedNames = new Set(assignedEmpires.map(a => a.empire.name));
    availableEmpires = EMPIRES.filter(empire => !assignedNames.has(empire.name));
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const clubName = elements.clubNameInput.value.trim();
    const presidentName = elements.presidentNameInput.value.trim();
    if (clubName.length < CONFIG.MIN_CLUB_NAME_LENGTH || presidentName.length < CONFIG.MIN_PRESIDENT_NAME_LENGTH) {
        showNotification('El nombre del club y del presidente deben tener al menos 3 caracteres.', 'error');
        return;
    }

    // Verificar si el club ya existe localmente para una respuesta rápida
    const existingAssignment = assignedEmpires.find(a => a.clubName.toLowerCase() === clubName.toLowerCase());
    if (existingAssignment) {
        showNotification('Este club ya tiene un imperio asignado.', 'error');
        showResult(existingAssignment);
        return;
    }

    if (availableEmpires.length === 0) {
        showNotification('¡Todos los imperios han sido asignados!', 'error');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableEmpires.length);
    const selectedEmpire = availableEmpires[randomIndex];

    const newAssignment = {
        clubName,
        presidentName,
        empire: selectedEmpire,
        assignedAt: new Date().toISOString(),
        isHost: false
    };

    showLoader(true);
    const result = await API.addAssignment(newAssignment);
    showLoader(false);

    if (result.status === 'success') {
        assignedEmpires.push(newAssignment);
        updateAvailableEmpires();
        runRevelationAnimation(newAssignment);
        updateUI();
        elements.clubForm.reset();
    } else {
        showNotification(result.message || 'Error al guardar el registro.', 'error');
    }
}

async function deleteAssignment(clubName) {
    showLoader(true);
    const result = await API.deleteAssignment(clubName);
    showLoader(false);

    if (result.status === 'success') {
        assignedEmpires = assignedEmpires.filter(a => a.clubName !== clubName);
        updateAvailableEmpires();
        updateUI();
        showAllAssignments();
        showNotification(`Asignación para "${clubName}" eliminada.`, 'success');
    } else {
        showNotification(result.message || 'Error al eliminar el registro.', 'error');
    }
}

// ... El resto de funciones (showSection, showNotification, createAssignmentCard, etc.) permanecen casi idénticas ...
// Solo necesitamos añadir el estilo para el loader en el CSS.
function showSection(sectionId){document.querySelectorAll(".section.active").forEach(a=>a.classList.remove("active"));const e=document.getElementById(`${sectionId}-section`);e&&e.classList.add("active")}function showNotification(a,e="success"){if(!elements.notificationContainer)return;const t=e==="success"?"check_circle":"error",s=document.createElement("div");s.className=`notification ${e}`,s.innerHTML=`<span class="material-symbols-outlined">${t}</span><p>${a}</p>`,elements.notificationContainer.appendChild(s),setTimeout(()=>{s.classList.add("fade-out"),setTimeout(()=>s.remove(),500)},5e3)}function updateAssignmentsStats(){const a=EMPIRES.length+1,e=assignedEmpires.length,t=a-e;elements.liveTotal.textContent=e,elements.liveRemaining.textContent=t}function runRevelationAnimation(a){const e=elements.empireSpinner;e.innerHTML="",e.style.transform="translateY(0)";let t=[...EMPIRES].sort(()=>.5-Math.random());t=t.filter(s=>s.name!==a.empire.name),t.push(...t.slice(0,5)),t.push(a.empire),t.forEach(s=>{const n=document.createElement("div");n.className="empire-spinner-item",n.textContent=s.name,e.appendChild(n)}),elements.assignedEmpire.style.display="none",elements.empireIcon.style.display="none",elements.empireDescription.style.display="none",elements.empireSpinnerContainer.style.display="block",showSection("result");const s=-(t.length-1)*100;setTimeout(()=>{e.style.transform=`translateY(${s}px)`},100),setTimeout(()=>{elements.empireSpinnerContainer.style.display="none",showResult(a)},CONFIG.REVEAL_DURATION+500)}function showResult(a){if(!a||!a.empire)return;elements.assignedEmpire.textContent=a.empire.name,elements.empireIcon.innerHTML=`<span class="material-symbols-outlined">${a.empire.icon}</span>`,elements.empireDescription.textContent=a.empire.description,elements.assignedEmpire.classList.add("revealed"),elements.empireIcon.style.display="block",elements.empireDescription.style.display="block",elements.resultClubName.textContent=a.clubName,elements.resultPresidentName.textContent=a.presidentName,elements.assignmentDate.textContent=`Asignado el: ${formatDate(a.assignedAt)}`,showSection("result")}function createAssignmentCard(a,e){const t=document.createElement("div");t.className=`${e} ${a.isHost?"host-club":""}`;const s=isAdmin&&!a.isHost?`<button class="delete-btn" data-club="${a.clubName}">🗑️</button>`:"";return t.innerHTML=`\n <div class="empire-icon">\n <span class="material-symbols-outlined">${a.empire.icon}</span>\n </div>\n <div class="empire-info">\n <h3>${a.empire.name}</h3>\n <p class="club-name">${a.clubName}</p>\n ${a.presidentName?`<p class="president-name">Pdte. ${a.presidentName}</p>`:""}\n <p class="assignment-time">${formatDate(a.assignedAt)}</p>\n </div>\n ${s}\n `,t}function showPreviewAssignments(){if(!elements.previewAssignments)return;elements.previewAssignments.innerHTML="";const a=[...assignedEmpires].sort((e,t)=>new Date(t.assignedAt)-new Date(e.assignedAt));a.forEach(e=>{const t=createAssignmentCard(e,"preview-card");elements.previewAssignments.appendChild(t)})}function showAllAssignments(){if(!elements.assignmentsList)return;elements.assignmentsList.innerHTML="";const a=assignedEmpires.length>0;elements.emptyState?.style.setProperty("display",a?"none":"flex"),a&&[...assignedEmpires].sort((e,t)=>new Date(t.assignedAt)-new Date(e.assignedAt)).forEach(e=>{const t=createAssignmentCard(e,"assignment-card");elements.assignmentsList.appendChild(t)})}function handleSearch(){const a=this.value.toLowerCase();elements.assignmentsList?.querySelectorAll(".assignment-card").forEach(e=>{e.style.display=e.textContent.toLowerCase().includes(a)?"flex":"none"})}function handleFilter(){const a=this.dataset.filter;elements.filterButtons?.forEach(e=>e.classList.remove("active")),this.classList.add("active"),elements.assignmentsList?.querySelectorAll(".assignment-card").forEach((e,t)=>{let s="flex";"host"===a&&!e.classList.contains("host-club")&&(s="none"),"recent"===a&&t>=5&&(s="none"),e.style.display=s})}function formatDate(a){return new Date(a).toLocaleDateString("es-ES",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}function handleExportCsv(){const a="Club,Presidente,Imperio,Fecha,Anfitrion\n"+assignedEmpires.map(e=>`"${e.clubName}","${e.presidentName}","${e.empire.name}","${e.assignedAt}","${e.isHost}"`).join("\n"),e=new Blob([a],{type:"text/csv;charset=utf-8;"}),t=document.createElement("a"),s=(new Date).toISOString().split("T")[0];t.href=URL.createObjectURL(e),t.download=`CAMIIN2025_asignaciones_${s}.csv`,t.click(),URL.revokeObjectURL(t.href),showNotification("Registro exportado exitosamente.","success")}function debounce(a,e){let t;return function(...s){const n=this;clearTimeout(t),t=setTimeout(()=>a.apply(n,s),e)}}