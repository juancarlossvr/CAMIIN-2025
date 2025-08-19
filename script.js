// 1. Constantes y Configuración
const CONFIG = {
    MIN_CLUB_NAME_LENGTH: 3,
    MIN_PRESIDENT_NAME_LENGTH: 3,
    // --- ¡IMPORTANTE! Pega aquí la URL que copiaste de Google Apps Script ---
    API_URL: "https://script.google.com/macros/s/AKfycbz1Qb-a5i5Dg7cq3Hidlvegy4PcBEjd5gSFajUp9VCy_DH_TsTSAcPK5sOg1cWEsMXu/exec",
    REVEAL_DURATION: 3000,
    ADMIN_KEY: 'CAMIIN2025',
    DEBUG: true
};

const INTERACT_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGQ9Ik0wIDBoMTAwdjEwMEgwVjB6Ii8+PC9jbGlwUGF0aD48L2RlZnM+PGcgc3Ryb2tlPSJub25lIiBmaWxsPSIjMDA1NUExIj48cGF0aCBkPSJNNjAuMzkgNDAuNjFjMy4zNC01LjY3IDkuNjItOS4xNSAxNi40OC05LjE1IDUuNjEgMCAxMC43MyAyLjA0IDE0LjYyIDUuNzJsLTUuNjcgMy4zNGMtMi45Ni0yLjY3LTYuNzgtNC4yOS0xMS4wMy00LjI5LTUuNjEgMC0xMC43MyAyLjM0LTE0LjMyIDYuNDlsNS4zNyAzLjA2em0yNS4xOCA4LjY4Yy0yLjM0IDAtNC41My0uNTktNi40OS0xLjc5bDMuMDYtNS4zN2M1LjY3IDMuMzQgOS4xNSA5LjYyIDkuMTUgMTYuNDggMCA1LjYxLTIuMDQgMTAuNzMtNS43MiAxNC42MmwtMy4zNC01LjY3YzIuNjctMi45NiA0LjI5LTYuNzggNC4yOS0xMS4wMyAwLTUuNjEtMi4zNC0xMC43My02LjQ5LTE0LjMyek01My40MyA2MS4xOWMtNS42Ny0zLjM0LTkuMTUtOS42Mi05LjE1LTE2LjQ4IDAtNS42MSAyLjA0LTEwLjczIDUuNzItMTQuNjJsMy4zNCA1LjY3Yy0yLjY3IDIuOTYtNC4yOSA2Ljjc4LTQuMjkgMTEuMDMgMCA1LjYxIDIuMzQgMTAuNzMgNi40OSAxNC4zMmwtNS4zNyAzLjA2ek0zMS43MiA1Ny4wNGMtMy4zNCA1LjY3LTkuNjIgOS4xNS0xNi40OCA5LjE1LTUuNjEgMC0xMC43My0yLjA0LTE0LjYyLTUuNzJsNS42Ny0zLjM0YzIuOTYgMi42NyA2Ljc4IDQuMjkgMTEuMDMgNC4yOSA1LjYxIDAgMTAuNzMtMi4zNCAxNC4zMi02LjQ5bC01LjM3LTMuMDZ6bS0yMy40OS04LjY4YzIuMzQgMCA0LjUzLjU5IDYuNDkgMS43OWwtMy4wNiA5LjM3Yy01LjY3LTMuMzQtOS4xNS05LjYyLTkuMTUtMTYuNDggMC01LjYxIDIuMDQtMTAuNzMgNS43Mi0xNC42MmwxLjM0IDUuNjdjLTIuNjcgMi45Ni00LjI5IDYuNzgtNC4yOSAxMS4wMyAwIDUuNjEgMi4zNCAxMC43MyA2LjQ5IDE0LjMyek00Ni41NyAzOC44YzUuNjcgMy4zNCA5LjE1IDkuNjIgOS4xNSAxNi40OCAwIDUuNjEtMi4wNCAxMC43My01LjcyIDE0LjYybC0zLjM0LTUuNjdjMi42Ny0yLjk2IDQuMjktNi43OCA0LjI5LTExLjAzIDAtNS42MS0yLjM0LTEwLjczLTYuNDktMTQuMzJsNS4zNy0zLjA2eiIvPjwvZz48L3N2Zz4=";

// 2. Definición de Imperios
const EMPIRES = [
    { name: "Imperio Romano", description: "Viste como un legionario con armadura, un senador con su toga y laureles, o un poderoso César. ¡Ave, Interact!", icon: "security", theme: "romano" },
    { name: "Imperio Egipcio", description: "Adopta la majestuosidad de los faraones, reinas como Cleopatra, o los misteriosos dioses con cabezas de animales.", icon: "pyramid", theme: "egipcio" },
    { name: "Reino Vikingo", description: "Conviértete en un explorador nórdico. Usa pieles, cuero, cascos y trenzas imponentes para mostrar tu furia y valentía.", icon: "sailing", theme: "vikingo" },
    { name: "Imperio Azteca", description: "Luce como un guerrero águila o jaguar. Los penachos de plumas coloridas, el oro y los diseños geométricos definirán tu poder.", icon: "stadium", theme: "azteca" },
    { name: "Shogunato Japonés", description: "Elige tu camino: el honorable samurái con su armadura y katana, o la elegancia de una geisha con su kimono de seda.", icon: "castle", theme: "japones" },
    { name: "Imperio Persa", description: "Viste con la opulencia de la realeza de Persépolis. Túnicas lujosas, joyas y la icónica guardia de los 'Inmortales' son tu inspiración.", icon: "shield_person", theme: "persa" },
    { name: "Imperio Otomano", description: "Adopta la grandeza de los sultanes con turbantes, caftanes de seda y cimitarras. La elegancia de Estambul te espera.", icon: "fort", theme: "otomano" },
    { name: "Imperio Inca", description: "Representa al imperio del sol. Usa ponchos coloridos, ornamentos de oro y la simbología andina para honrar a Inti.", icon: "landscape", theme: "inca" },
    { name: "Imperio Mongol", description: "Domina la estepa como un guerrero de la Horda Dorada. Gorros de piel, botas de cuero y arcos serán tus símbolos de conquista.", icon: "groups", theme: "mongol" },
    { name: "Imperio Bizantino", description: "La continuación de Roma con un toque oriental. El púrpura y el oro son tus colores. Mosaicos y símbolos religiosos adornarán tus túnicas.", icon: "church", theme: "bizantino" },
    { name: "Civilización Espartana", description: "¡Esto es Esparta! La disciplina y la fuerza son tu disfraz. Capas rojas, cascos de bronce y el escudo con la letra lambda.", icon: "shield", theme: "espartano" },
    { name: "Dinastía China (Tang)", description: "La edad de oro de China. Viste elegantes túnicas de seda (hanfu), peinados elaborados y la mística del dragón imperial.", icon: "temple_buddhist", theme: "chino" },
    { name: "Imperio Británico (Victoriano)", description: "Encarna la era de la exploración y la industria. Levitas, sombreros de copa, vestidos con corsé y un toque de 'steampunk'.", icon: "explore", theme: "britanico" },
    { name: "Reino de Malí", description: "Muestra la riqueza del imperio más próspero de África. Túnicas 'boubou' doradas, joyas de oro masivo y la grandeza del desierto.", icon: "diamond", theme: "mali" },
    { name: "Reino Zulú", description: "La fuerza y el espíritu de un guerrero africano. Pieles de leopardo, coloridos abalorios y las icónicas lanzas 'assegai' y escudos.", icon: "sports_martial_arts", theme: "zulu" },
    { name: "Imperio Español (Siglo de Oro)", description: "Conviértete en un conquistador con armadura y morrión, o en un miembro de la corte con gorgueras y ropajes de terciopelo.", icon: "public", theme: "espanol" }
];
const GREEK_EMPIRE = { name: "Imperio Griego", description: "Cuna de la democracia, la filosofía occidental, los Juegos Olímpicos y el drama teatral.", icon: "account_balance", theme: "griego" };
const HOST_CLUB = { clubName: "Interact Club Encarnación Norte", presidentName: "Juan Velázquez", empire: GREEK_EMPIRE, assignedAt: "2025-08-19T10:00:00.000Z", isHost: true };

let elements = {};
let assignedEmpires = [];
let availableEmpires = [];
let isAdmin = false;
let lastAssignedClub = null;

const API = {
    fetchAssignments: async () => {
        try {
            const response = await fetch(CONFIG.API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.map(item => ({
                clubName: item.club,
                presidentName: item.presidente,
                empire: EMPIRES.find(e => e.name === item.imperio) || GREEK_EMPIRE,
                assignedAt: item.fecha,
                isHost: item.anfitrion.toString().toLowerCase() === 'true'
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
    injectSVGIcons();
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
        shareButtonsContainer: document.querySelector('.share-buttons'),
        shareWhatsapp: document.getElementById('share-whatsapp'),
        shareTwitter: document.getElementById('share-twitter'),
        shareFacebook: document.getElementById('share-facebook'),
        generateStoryBtn: document.getElementById('generate-story-btn'),
        loader: document.createElement('div')
    };
    elements.loader.className = 'loader';
    elements.loader.textContent = 'Cargando datos...';
    document.body.appendChild(elements.loader);
}

function setupEventListeners() {
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
        const deleteButton = e.target.closest('.delete-btn');
        if (isAdmin && deleteButton) {
            const clubNameToDelete = deleteButton.dataset.club;
            if (confirm(`¿Estás seguro de que quieres eliminar la asignación de "${clubNameToDelete}"?`)) {
                await deleteAssignment(clubNameToDelete);
            }
        }
    });
    elements.generateStoryBtn?.addEventListener('click', handleGenerateImageClick);
}

function showLoader(show) {
    elements.loader.style.display = show ? 'flex' : 'none';
}

async function loadData() {
    showLoader(true);
    assignedEmpires = await API.fetchAssignments();
    if (assignedEmpires.length === 0 && CONFIG.API_URL !== "PEGA_AQUÍ_LA_URL_DE_TU_APLICACIÓN_WEB") {
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
        lastAssignedClub = newAssignment;
        assignedEmpires.push(newAssignment);
        updateAvailableEmpires();
        runRevelationAnimation(newAssignment);
        updateUI();
        elements.clubForm.reset();
    } else {
        showNotification(result.message || 'Error al guardar el registro.', 'error');
        await loadData();
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

async function handleGenerateImageClick() {
    if (!lastAssignedClub) {
        showNotification("Primero debes asignar un imperio.", "error");
        return;
    }

    showLoader(true);

    const template = document.getElementById('ig-story-template');
    const empireIconEl = document.getElementById('ig-empire-icon');
    const empireNameEl = document.getElementById('ig-empire-name');
    const clubNameEl = document.getElementById('ig-club-name');
    const interactLogoEl = document.getElementById('ig-logo-interact');

    interactLogoEl.src = INTERACT_LOGO_BASE64;
    empireIconEl.innerHTML = `<span class="material-symbols-outlined">${lastAssignedClub.empire.icon}</span>`;
    empireNameEl.textContent = lastAssignedClub.empire.name;
    clubNameEl.textContent = lastAssignedClub.clubName;

    const themeClass = `theme-${lastAssignedClub.empire.theme}`;
    template.className = '';
    template.classList.add(themeClass);

    try {
        const canvas = await html2canvas(template, {
            useCORS: true,
            scale: 1,
        });
        
        const link = document.createElement('a');
        link.download = `mi-imperio-${lastAssignedClub.clubName.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        showNotification('¡Imagen guardada! Búscala en tus descargas y súbela a Instagram.', 'success');
    } catch (error) {
        console.error('Error al generar la imagen:', error);
        showNotification('Hubo un problema al crear la imagen.', 'error');
    } finally {
        showLoader(false);
    }
}

function showSection(sectionId){document.querySelectorAll(".section.active").forEach(a=>a.classList.remove("active"));const e=document.getElementById(`${sectionId}-section`);e&&e.classList.add("active")}
function showNotification(a,e="success"){if(!elements.notificationContainer)return;const t=e==="success"?"check_circle":"error",s=document.createElement("div");s.className=`notification ${e}`,s.innerHTML=`<span class="material-symbols-outlined">${t}</span><p>${a}</p>`,elements.notificationContainer.appendChild(s),setTimeout(()=>{s.classList.add("fade-out"),setTimeout(()=>s.remove(),500)},5e3)}
function updateAssignmentsStats(){const a=EMPIRES.length+1,e=assignedEmpires.length,t=a-e;elements.liveTotal.textContent=e,elements.liveRemaining.textContent=t}
function runRevelationAnimation(a){const e=elements.empireSpinner;e.innerHTML="",e.style.transform="translateY(0)";let t=[...EMPIRES].sort(()=>.5-Math.random());t=t.filter(s=>s.name!==a.empire.name),t.push(...t.slice(0,5)),t.push(a.empire),t.forEach(s=>{const n=document.createElement("div");n.className="empire-spinner-item",n.textContent=s.name,e.appendChild(n)}),elements.assignedEmpire.style.display="none",elements.empireIcon.style.display="none",elements.empireDescription.style.display="none",elements.empireSpinnerContainer.style.display="block",showSection("result");const s=-(t.length-1)*100;setTimeout(()=>{e.style.transform=`translateY(${s}px)`},100),setTimeout(()=>{elements.empireSpinnerContainer.style.display="none",showResult(a)},CONFIG.REVEAL_DURATION+500)}
function showResult(a){if(!a||!a.empire)return;elements.resultSection.className="section active",a.empire.theme&&elements.resultSection.classList.add(`theme-${a.empire.theme}`),elements.assignedEmpire.textContent=a.empire.name,elements.empireIcon.innerHTML=`<span class="material-symbols-outlined">${a.empire.icon}</span>`,elements.empireDescription.textContent=a.empire.description,elements.assignedEmpire.classList.add("revealed"),elements.empireIcon.style.display="block",elements.empireDescription.style.display="block",elements.resultClubName.textContent=a.clubName,elements.resultPresidentName.textContent=a.presidentName,elements.assignmentDate.textContent=`Asignado el: ${formatDate(a.assignedAt)}`,updateShareLinks(a.clubName,a.empire.name),showSection("result")}
function createAssignmentCard(a,e){const t=document.createElement("div");t.className=`${e} ${a.isHost?"host-club":""}`;const s=isAdmin&&!a.isHost?`<button class="delete-btn" data-club="${a.clubName}">🗑️</button>`:"";return t.innerHTML=`\n <div class="empire-icon">\n <span class="material-symbols-outlined">${a.empire.icon}</span>\n </div>\n <div class="empire-info">\n <h3>${a.empire.name}</h3>\n <p class="club-name">${a.clubName}</p>\n ${a.presidentName?`<p class="president-name">Pdte. ${a.presidentName}</p>`:""}\n <p class="assignment-time">${formatDate(a.assignedAt)}</p>\n </div>\n ${s}\n `,t}
function showPreviewAssignments(){if(!elements.previewAssignments)return;elements.previewAssignments.innerHTML="";const a=[...assignedEmpires].sort((e,t)=>new Date(t.assignedAt)-new Date(e.assignedAt));a.forEach(e=>{const t=createAssignmentCard(e,"preview-card");elements.previewAssignments.appendChild(t)})}
function showAllAssignments(){if(!elements.assignmentsList)return;elements.assignmentsList.innerHTML="";const a=assignedEmpires.length>0;elements.emptyState?.style.setProperty("display",a?"none":"flex"),a&&[...assignedEmpires].sort((e,t)=>new Date(t.assignedAt)-new Date(e.assignedAt)).forEach(e=>{const t=createAssignmentCard(e,"assignment-card");elements.assignmentsList.appendChild(t)})}
function handleSearch(){const a=this.value.toLowerCase();elements.assignmentsList?.querySelectorAll(".assignment-card").forEach(e=>{e.style.display=e.textContent.toLowerCase().includes(a)?"flex":"none"})}
function handleFilter(){const a=this.dataset.filter;elements.filterButtons?.forEach(e=>e.classList.remove("active")),this.classList.add("active"),elements.assignmentsList?.querySelectorAll(".assignment-card").forEach((e,t)=>{let s="flex";"host"===a&&!e.classList.contains("host-club")&&(s="none"),"recent"===a&&t>=5&&(s="none"),e.style.display=s})}
function formatDate(a){return new Date(a).toLocaleDateString("es-ES",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}
function handleExportCsv(){const a="Club,Presidente,Imperio,Fecha,Anfitrion\n"+assignedEmpires.map(e=>`"${e.clubName}","${e.presidentName}","${e.empire.name}","${e.assignedAt}","${e.isHost}"`).join("\n"),e=new Blob([a],{type:"text/csv;charset=utf-8;"}),t=document.createElement("a"),s=(new Date).toISOString().split("T")[0];t.href=URL.createObjectURL(e),t.download=`CAMIIN2025_asignaciones_${s}.csv`,t.click(),URL.revokeObjectURL(t.href),showNotification("Registro exportado exitosamente.","success")}
function debounce(a,e){let t;return function(...s){const n=this;clearTimeout(t),t=setTimeout(()=>a.apply(n,s),e)}}
function updateShareLinks(a,e){const t=`¡Nuestro Interact Club ${a} representará al glorioso ${e} en el #CAMIIN2025! 🔥 ¡Prepárense para la conquista!`,s=encodeURIComponent(t),n=encodeURIComponent(window.location.href);elements.shareWhatsapp&&(elements.shareWhatsapp.href=`https://api.whatsapp.com/send?text=${s}`),elements.shareTwitter&&(elements.shareTwitter.href=`https://twitter.com/intent/tweet?text=${s}`),elements.shareFacebook&&(elements.shareFacebook.href=`https://www.facebook.com/sharer/sharer.php?u=${n}&quote=${s}`)}
function injectSVGIcons(){const a={shareWhatsapp:'<svg viewBox="0 0 24 24"><path d="M16.75 13.96c.25.13.43.2.5.33.07.13.07.66 0 1.32-.07.66-.57 1.25-1.07 1.32-.5.07-1.07.33-3.14-.5-.2-.07-.4-.13-.57-.2-.23-.1-.43-.2-.6-.33-.63-.4-1.22-1-1.78-1.63-.56-.6-1.02-1.27-1.4-2-.3-.6-.5-1.2-.5-1.2s0-.07 0-.13c0-.07.07-.13.13-.2.07-.07.13-.07.2-.07h.43c.1 0 .23.07.37.33.13.27.43.93.43 1s0 .2-.07.33c-.07.13-.13.2-.23.33-.1.1-.2.17-.23.2-.03.03-.07.07-.07.13s0 .13.07.23c.07.1.17.23.27.33.13.13.27.27.43.4.17.17.33.3.53.43.2.13.37.23.57.33.23.1.43.17.67.27h.13c.07,0,.2-.07.33-.2.13-.13.13-.23.13-.43s0-.33.07-.43c.07-.1.07-.2.13-.23.07-.03.13-.07.2-.07.1 0 .23.07.37.13.13.07.27.13.37.2z M12 2 C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10 S17.5 2 12 2z M18.1 16.1c-.1.1-.3.2-.5.2h-.1c-.4 0-1.2-.2-2.3-.8-.9-.4-1.7-1-2.4-1.7-.8-.7-1.4-1.6-1.8-2.5-.4-.9-.6-1.8-.6-2.6 0-.3.1-.7.3-1 .2-.3.4-.4.6-.4h.1c.2 0 .4.1.5.1l.3.1c.2.1.4.3.5.5.1.2.2.4.2.6 0 .2 0 .3-.1.5-.1.2-.3.4-.4.5-.1.1-.2.2-.2.3s0 .2.1.4c.2.6.5 1.1.9 1.6.4.5.9.8 1.4 1.1.2.1.3.2.5.2h.1c.2 0 .4-.1.6-.2.2-.2.4-.3.6-.5s.4-.4.5-.4c.2 0 .4.1.6.2.2.1.4.2.6.4.2.2.4.4.5.6.2.2.3.5.3.7 0 .2-.1.5-.3.7z"/></svg>',shareTwitter:'<svg viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 2.9,4.79C2.53,5.42 2.33,6.16 2.33,6.96C2.33,8.43 3.07,9.75 4.18,10.53C3.47,10.51 2.82,10.31 2.26,10V10.05C2.26,12.24 3.79,14.04 5.9,14.46C5.55,14.55 5.18,14.6 4.8,14.6C4.54,14.6 4.28,14.56 4.03,14.5C4.59,16.34 6.34,17.68 8.44,17.72C6.92,18.89 4.96,19.56 2.86,19.56C2.5,19.56 2.15,19.54 1.82,19.49C3.93,20.88 6.38,21.72 9.04,21.72C16,21.72 20.24,15.82 20.24,10.65C20.24,10.46 20.24,10.27 20.23,10.08C20.94,9.58 21.76,8.89 22.46,8.08V8.08C22.46,8.08 22.46,6 22.46,6Z" /></svg>',shareFacebook:'<svg viewBox="0 0 24 24"><path d="M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H17V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z" /></svg>'},e=elements;e.shareWhatsapp&&(e.shareWhatsapp.innerHTML=a.shareWhatsapp),e.shareTwitter&&(e.shareTwitter.innerHTML=a.shareTwitter),e.shareFacebook&&(e.shareFacebook.innerHTML=a.shareFacebook)}