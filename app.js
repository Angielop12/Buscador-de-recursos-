let recursos = [];

const lineaTerapeuticaSelect = document.getElementById('linea_terapeutica');
const objetivoTerapeuticoSelect = document.getElementById('objetivo_terapeutico');
const etapaSelect = document.getElementById('etapa');
const tipoSelect = document.getElementById('tipo');
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const userEmail = document.getElementById('user-email');

// Función para cargar el archivo JSON
async function cargarDatos() {
    try {
        const response = await fetch('resources.json');
        const data = await response.json();
        recursos = data.recursos; // Asigna los datos del JSON a recursos
        cargarLineasTerapeuticas();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
    }
}

// Configurar Netlify Identity
netlifyIdentity.on("init", user => {
    if (user) {
        showApp(user);
    } else {
        showAuth();
    }
});

netlifyIdentity.on("login", user => {
    showApp(user);
    netlifyIdentity.close();
});

netlifyIdentity.on("logout", () => {
    showAuth();
});

function showApp(user) {
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    userEmail.textContent = user.email;
    cargarDatos(); // Llama a cargarDatos() para obtener los datos JSON
}

function showAuth() {
    authContainer.style.display = 'block';
    appContainer.style.display = 'none';
    userEmail.textContent = '';
}

function logout() {
    netlifyIdentity.logout();
}

function cargarLineasTerapeuticas() {
    const lineasTerapeuticas = [...new Set(recursos.map(item => item.linea_terapeutica))];
    lineasTerapeuticas.forEach(linea => {
        const option = document.createElement('option');
        option.value = linea;
        option.textContent = linea;
        lineaTerapeuticaSelect.appendChild(option);
    });
}

function actualizarObjetivos() {
    objetivoTerapeuticoSelect.innerHTML = '<option value="">Selecciona un objetivo terapéutico</option>';
    etapaSelect.innerHTML = '<option value="">Selecciona una etapa</option>';
    tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivos = [...new Set(recursos
        .filter(item => item.linea_terapeutica === lineaSeleccionada)
        .map(item => item.objetivo_terapeutico))];
    objetivos.forEach(objetivo => {
        const option = document.createElement('option');
        option.value = objetivo;
        option.textContent = objetivo;
        objetivoTerapeuticoSelect.appendChild(option);
    });
}

function actualizarEtapas() {
    etapaSelect.innerHTML = '<option value="">Selecciona una etapa</option>';
    tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivoSeleccionado = objetivoTerapeuticoSelect.value;
    const etapas = [...new Set(recursos
        .filter(item => item.linea_terapeutica === lineaSeleccionada && item.objetivo_terapeutico === objetivoSeleccionado)
        .map(item => item.etapa))];
    etapas.forEach(etapa => {
        const option = document.createElement('option');
        option.value = etapa;
        option.textContent = etapa;
        etapaSelect.appendChild(option);
    });
}

function actualizarTipos() {
    tipoSelect.innerHTML = '<option value="">Selecciona un tipo</option>';
    const lineaSeleccionada = lineaTerapeuticaSelect.value;
    const objetivoSeleccionado = objetivoTerapeuticoSelect.value;
    const etapaSeleccionada = etapaSelect.value;
    const tipos = [...new Set(recursos
        .filter(item => item.linea_terapeutica === lineaSeleccionada && item.objetivo_terapeutico === objetivoSeleccionado && item.etapa === etapaSeleccionada)
        .map(item => item.tipo))];
    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        tipoSelect.appendChild(option);
    });
}

// Inicializar Netlify Identity
netlifyIdentity.init();
